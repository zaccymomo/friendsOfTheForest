import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuestion, answerQuestion, visitZone } from '../api';

export default function Question({ refreshFriends }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [question, setQuestion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [answer, setAnswer] = useState('');
    const [result, setResult] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [showZoneModal, setShowZoneModal] = useState(false);

    useEffect(() => {
        setLoading(true);
        getQuestion(id)
            .then(q => {
                setQuestion(q);
                if (q.zone && !q.zoneVisited) setShowZoneModal(true);
            })
            .catch(() => setError('Failed to load question'))
            .finally(() => setLoading(false));
    }, [id]);

    const handleZoneDismiss = async () => {
        setShowZoneModal(false);
        try { await visitZone(question.zone.id); } catch { /* best-effort */ }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setResult(null);
        try {
            const res = await answerQuestion(id, question.type === 'MCQ' ? Number(answer) : answer);
            setResult(res);

            // If a body part was awarded, refresh the friends data
            if (res.awarded && refreshFriends) {
                refreshFriends();
            }
        } catch {
            setResult({ correct: false, awarded: false });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    if (error) return <div className="flex items-center justify-center min-h-screen text-red-500">{error}</div>;
    if (!question) return null;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background">
            {showZoneModal && question?.zone && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                <div className="bg-white rounded-xl shadow-lg w-full max-w-sm mx-4 p-6 flex flex-col items-center relative animate-zone-pop">
                    <button
                        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl font-bold leading-none"
                        onClick={handleZoneDismiss}
                        aria-label="Close"
                    >
                        ×
                    </button>
                    <h2 className="text-lg font-bold text-brand mb-3">You've just found a new zone!</h2>
                    <p className="text-center text-gray-800 mb-6">{question.zone.narrative}</p>
                    <button
                        className="bg-warning text-brand font-bold py-2 px-8 rounded-lg"
                        onClick={handleZoneDismiss}
                    >
                        Let's do it!
                    </button>
                </div>
            </div>
        )}
        <div className="bg-white p-6 rounded shadow w-full max-w-md flex flex-col items-center">
                <h1 className="text-xl font-bold mb-4 text-brand">Question</h1>
                <div className="mb-4 text-center font-semibold">{question.question}</div>
                <form onSubmit={handleSubmit} className="w-full flex flex-col items-center gap-4">
                    {question.type === 'MCQ' ? (
                        <div className="flex flex-col w-full gap-2">
                            {question.options.map(opt => (
                                <label key={opt.id} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="option"
                                        value={opt.id}
                                        checked={String(answer) === String(opt.id)}
                                        onChange={() => { setAnswer(opt.id); setResult(null); }}
                                        disabled={result?.correct}
                                    />
                                    <span>{opt.description}</span>
                                </label>
                            ))}
                        </div>
                    ) : (
                        <input
                            className="border p-2 rounded w-full"
                            placeholder="Your answer"
                            value={answer}
                            onChange={e => { setAnswer(e.target.value); setResult(null); }}
                            disabled={result?.correct}
                        />
                    )}
                    {!result?.correct && (
                        <button
                            className="bg-warning text-brand font-bold py-2 rounded w-full"
                            type="submit"
                            disabled={submitting || !answer}
                        >
                            Submit
                        </button>
                    )}
                    {result && !result.correct && (
                        <p className="text-red-500 font-semibold text-sm">That's not quite right! Try again!</p>
                    )}
                </form>
                {result?.correct && (
                    <div className="mt-4 w-full text-center">
                        <div className="text-green-600 font-bold mb-4">
                            Correct!
                            {result.awardedParts && result.awardedParts.length > 0 ? (
                                <div className="mt-2 text-sm font-normal">
                                    You earned {result.awardedParts.length} body part{result.awardedParts.length > 1 ? 's' : ''}:
                                    <ul className="mt-1 list-disc list-inside">
                                        {result.awardedParts.map(bp => (
                                            <li key={bp.id}>{bp.name} ({bp.rarity})</li>
                                        ))}
                                    </ul>
                                </div>
                            ) : (
                                <span> You already have all the rewards for this question.</span>
                            )}
                        </div>
                        <button
                            className="px-6 py-3 font-bold bg-warning rounded-lg hover:bg-warning-dark transition-colors duration-200"
                            onClick={() => navigate(`/trails/${question.trailId}`)}
                        >
                            ← Return to Trail
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
} 