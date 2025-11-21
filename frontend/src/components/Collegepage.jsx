import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { request } from "../utils/api";

const Collegepage = () => {
    const navigate = useNavigate();
    const { collegeId } = useParams();
    const { user } = useAuth();

    const [formData, setFormData] = useState({
        collegeName: "",
        course: "",
        year: "",
        rating: 0,
        title: "",
        review: "",
    });
    const [loadingCollege, setLoadingCollege] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = {
            collegeId: collegeId || undefined,
            collegeName: formData.collegeName,
            studentName: user && user.name ? user.name : "Anonymous",
            course: formData.course,
            year: formData.year,
            rating: formData.rating,
            title: formData.title,
            review: formData.review,
        };
        (async () => {
            try {
                // send to backend
                console.log(payload);
                const saved = await request("/api/reviews", {
                    method: "POST",
                    body: payload,
                });
                console.log("Saved review", saved);

                // mark submitted, show message, then redirect after a short delay
                const savedCollegeId = saved && saved.college ? saved.college : collegeId || "";
                setSubmitted(true);
                setTimeout(() => {
                    navigate(`/college/${savedCollegeId}`);
                }, 2200);
            } catch (err) {
                console.error("Failed to submit review", err);
                const msg = (err && err.message) || "Failed to submit review";
                alert(msg);
            }
        })();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    useEffect(() => {
        let mounted = true;
        const loadCollege = async () => {
            if (!collegeId) return;
            setLoadingCollege(true);
            try {
                const data = await request(`/api/college/${collegeId}`);
                if (mounted)
                    setFormData((p) => ({
                        ...p,
                        collegeName: data.name || "",
                    }));
            } catch (err) {
                console.error("Failed to load college for review form", err);
            } finally {
                if (mounted) setLoadingCollege(false);
            }
        };
        loadCollege();
        return () => {
            mounted = false;
        };
    }, [collegeId]);

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">
                    Write a Review
                </h2>

                {submitted ? (
                    <div className="space-y-6 text-center py-12">
                        <div className="text-2xl font-semibold text-green-600">Review submitted</div>
                        <div className="text-gray-600">Redirecting to the college page...</div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                    {/* COLLEGE NAME */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select College *
                        </label>
                        <input
                            type="text"
                            name="collegeName"
                            value={formData.collegeName}
                            onChange={handleChange}
                            required
                            readOnly={!!collegeId || loadingCollege}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder={
                                collegeId
                                    ? "Loading college..."
                                    : "Enter college name"
                            }
                        />
                    </div>

                    {/* COURSE + YEAR */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Course *
                            </label>
                            <input
                                type="text"
                                name="course"
                                value={formData.course}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g., B.Tech CSE"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Graduation Year *
                            </label>
                            <input
                                type="number"
                                name="year"
                                value={formData.year}
                                onChange={handleChange}
                                required
                                min="2000"
                                max="2030"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* RATING */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Rating *
                        </label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((rating) => (
                                <button
                                    key={rating}
                                    type="button"
                                    onClick={() =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            rating,
                                        }))
                                    }
                                >
                                    <span
                                        className={`text-3xl ${
                                            rating <= formData.rating
                                                ? "text-yellow-400"
                                                : "text-gray-300"
                                        }`}
                                    >
                                        ★
                                    </span>
                                </button>
                            ))}
                            <span className="ml-2 text-gray-600 self-center">
                                {formData.rating} / 5
                            </span>
                        </div>
                    </div>

                    {/* TITLE */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Review Title *
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Summarize your experience"
                        />
                    </div>

                    {/* REVIEW */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Your Review *
                        </label>
                        <textarea
                            name="review"
                            value={formData.review}
                            onChange={handleChange}
                            required
                            rows="6"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Share your detailed experience..."
                        />
                    </div>

                    {/* BUTTONS */}
                    <div className="flex gap-4">
                        <button
                            type="submit"
                            className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
                        >
                            Submit Review
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate("/")}
                            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                        >
                            Cancel
                        </button>
                    </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Collegepage;
