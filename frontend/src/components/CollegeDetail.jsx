import React, { useEffect, useState } from "react";
import { request } from "../utils/api";

const CollegeDetail = ({ id }) => {
    const [college, setCollege] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loadingReviews, setLoadingReviews] = useState(false);
    const [expanded, setExpanded] = useState(null);

    useEffect(() => {
        let mounted = true;
        // loading flags are initialized in state

        // load college and reviews in parallel
        const pCollege = request(`/api/colleges/${id}`);
        const pReviews = request(`/api/reviews/college/${id}`);

        Promise.all([pCollege, pReviews])
            .then(([collegeData, reviewsData]) => {
                if (!mounted) return;
                setCollege(collegeData);
                setReviews(reviewsData || []);
            })
            .catch((err) => {
                console.error(err);
                if (mounted)
                    setError(
                        err.message || "Failed to load college or reviews"
                    );
            })
            .finally(() => {
                if (mounted) {
                    setLoading(false);
                    setLoadingReviews(false);
                }
            });

        return () => {
            mounted = false;
        };
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-600">{error}</div>;
    if (!college) return <div>College not found.</div>;

    return (
        <div className="bg-white rounded shadow p-6">
            <h2 className="text-2xl font-bold mb-2">{college.name}</h2>
            {college.location && (
                <p className="text-gray-600 mb-2">{college.location}</p>
            )}
            {college.rating !== undefined && (
                <p className="mb-4">Rating: {college.rating} ⭐</p>
            )}
            {college.description && (
                <div className="prose">
                    <p>{college.description}</p>
                </div>
            )}
            <div className="mt-6">
                <h3 className="text-xl font-semibold mb-3">Reviews</h3>
                {loadingReviews ? (
                    <div>Loading reviews...</div>
                ) : reviews.length === 0 ? (
                    <div className="text-gray-600">No reviews yet.</div>
                ) : (
                    <div className="space-y-4">
                        {reviews.map((r) => {
                            const upCount = (r.upvotes && r.upvotes.length) || 0
                            const downCount = (r.downvotes && r.downvotes.length) || 0
                            const isExpanded = expanded === r._id
                            return (
                                <div key={r._id} className="border p-4 rounded">
                                    <div className="flex items-center justify-between mb-2">
                                        <button
                                            className="font-semibold text-left"
                                            onClick={() => setExpanded(isExpanded ? null : r._id)}
                                        >
                                            {r.title}
                                        </button>
                                        <div className="text-yellow-500">{r.rating} ⭐</div>
                                    </div>
                                    <div className="text-sm text-gray-600 mb-2">
                                        By {r.studentName || (r.user ? r.user.name : 'Anonymous')} · {new Date(r.createdAt).toLocaleString()}
                                    </div>

                                    <div className="text-gray-800">{r.review}</div>

                                    {isExpanded && (
                                        <div className="mt-3 text-sm text-gray-700">
                                            {r.course && <div><strong>Course:</strong> {r.course}</div>}
                                            {r.year && <div><strong>Year:</strong> {r.year}</div>}
                                            {/* any other fields */}
                                        </div>
                                    )}

                                    <div className="mt-3 flex items-center gap-3">
                                        <button
                                            className="px-3 py-1 bg-green-100 rounded hover:bg-green-200"
                                            onClick={async () => {
                                                try {
                                                    const updated = await request(`/api/reviews/${r._id}/vote`, { method: 'POST', body: { type: 'up' } })
                                                    setReviews((prev) => prev.map(x => x._id === updated._id ? updated : x))
                                                } catch (err) {
                                                    console.error('Vote failed', err)
                                                    alert((err && err.message) || 'Vote failed')
                                                }
                                            }}
                                        >
                                            👍 {upCount}
                                        </button>

                                        <button
                                            className="px-3 py-1 bg-red-100 rounded hover:bg-red-200"
                                            onClick={async () => {
                                                try {
                                                    const updated = await request(`/api/reviews/${r._id}/vote`, { method: 'POST', body: { type: 'down' } })
                                                    setReviews((prev) => prev.map(x => x._id === updated._id ? updated : x))
                                                } catch (err) {
                                                    console.error('Vote failed', err)
                                                    alert((err && err.message) || 'Vote failed')
                                                }
                                            }}
                                        >
                                            👎 {downCount}
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CollegeDetail;
