import express from "express";
import { check, validationResult } from "express-validator";
import Review from "../models/Review.mjs";
import College from "../models/College.mjs";
import auth from "../middleware/auth.mjs";

const router = express.Router();

router.post(
    "/",
    auth,
    [
        check("rating", "Rating 1-5 is required").isInt({ min: 1, max: 5 }),
        check("title", "Title is required").notEmpty(),
        check("review", "Review text is required").notEmpty(),
    ],
    async (req, res) => {
        console.log(req);
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.array() });

        try {
            const {
                collegeId,
                collegeName,
                course,
                year,
                rating,
                title,
                review,
            } = req.body;

            // Helper to escape regex special chars for exact, case-insensitive name match
            const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

            let college = null;

            if (collegeId) {
                college = await College.findById(collegeId);
                if (!college) {
                    // If id provided but not found, allow fallback to collegeName if present
                    if (!collegeName)
                        return res
                            .status(404)
                            .json({ message: "College not found" });
                }
            }

            if (!college && collegeName) {
                // try find by name (case-insensitive exact match)
                const nameRegex = new RegExp(
                    "^" + escapeRegex(collegeName.trim()) + "$",
                    "i"
                );
                college = await College.findOne({ name: nameRegex });
                if (!college) {
                    // create minimal college entry
                    const created = new College({ name: collegeName.trim() });
                    college = await created.save();
                }
            }

            if (!college)
                return res
                    .status(400)
                    .json({ message: "collegeId or collegeName is required" });

            const newReview = new Review({
                college: college._id,
                collegeName: collegeName || college.name,
                user: req.user && req.user.id ? req.user.id : undefined,
                studentName: req.body.studentName || undefined,
                course,
                year,
                rating,
                title,
                review,
            });

            const saved = await newReview.save();

            // update college average rating
            try {
                const stats = await Review.aggregate([
                    { $match: { college: college._id } },
                    {
                        $group: {
                            _id: "$college",
                            avgRating: { $avg: "$rating" },
                        },
                    },
                ]);
                const avg = stats && stats[0] ? stats[0].avgRating : rating;
                college.rating = avg;
                await college.save();
            } catch (err) {
                console.warn("Failed to update college rating", err.message);
            }

            res.status(201).json(saved);
        } catch (err) {
            console.error(err);
            res.status(500).send("Server error");
        }
    }
);

// GET /api/reviews/college/:id - list reviews for a college
router.get("/college/:id", async (req, res) => {
    try {
        // populate user for display and include vote arrays
        const reviews = await Review.find({ college: req.params.id })
            .sort({ createdAt: -1 })
            .limit(200)
            .populate({ path: 'user', select: 'name' });
        res.json(reviews);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

// POST /api/reviews/:id/vote - upvote or downvote a review (authenticated)
router.post('/:id/vote', auth, async (req, res) => {
    try {
        const { type } = req.body // expected 'up' or 'down'
        if (!type || (type !== 'up' && type !== 'down')) return res.status(400).json({ message: 'Invalid vote type' })

        const review = await Review.findById(req.params.id)
        if (!review) return res.status(404).json({ message: 'Review not found' })

        const userId = req.user && req.user.id
        if (!userId) return res.status(401).json({ message: 'Unauthorized' })

        const strId = String(userId)

        // helper to check presence
        const inArray = (arr, id) => arr.map(String).includes(String(id))

        if (type === 'up') {
            // toggle upvote
            if (inArray(review.upvotes || [], strId)) {
                // remove existing upvote
                review.upvotes = (review.upvotes || []).filter(u => String(u) !== strId)
            } else {
                // add upvote, and remove downvote if present
                review.upvotes = Array.from(new Set([...(review.upvotes || []), userId]))
                review.downvotes = (review.downvotes || []).filter(u => String(u) !== strId)
            }
        } else if (type === 'down') {
            // toggle downvote
            if (inArray(review.downvotes || [], strId)) {
                review.downvotes = (review.downvotes || []).filter(u => String(u) !== strId)
            } else {
                review.downvotes = Array.from(new Set([...(review.downvotes || []), userId]))
                review.upvotes = (review.upvotes || []).filter(u => String(u) !== strId)
            }
        }

        const saved = await review.save()
        // return populated user and counts
        const populated = await Review.findById(saved._id).populate({ path: 'user', select: 'name' })
        res.json(populated)
    } catch (err) {
        console.error(err)
        res.status(500).send('Server error')
    }
})

export default router;
