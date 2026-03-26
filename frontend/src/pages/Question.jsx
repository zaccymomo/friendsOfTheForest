import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuestion, answerQuestion, visitZone } from '../api';
import PopModal from '../components/PopModal';

const rarityColors = {
    COMMON: 'border-black',
    RARE: 'border-purple-500',
    LEGENDARY: 'border-yellow-400',
};

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
            {/* Zone narrative modal */}
            {showZoneModal && question.zone && (
                <PopModal onClose={handleZoneDismiss}>
                    <h2 className="text-lg font-bold text-brand mb-3">You've just found a new zone!</h2>
                    <p className="text-center text-gray-800 mb-6">{question.zone.narrative}</p>
                    <button
                        className="bg-warning text-brand font-bold py-2 px-8 rounded-lg"
                        onClick={handleZoneDismiss}
                    >
                        Let's do it!
                    </button>
                </PopModal>
            )}

            {/* Correct answer modal */}
            {result?.correct && (
                <PopModal>
                    <h2 className="text-xl font-bold text-brand mb-2">Woohoo!</h2>
                    {result.awardedParts && result.awardedParts.length > 0 ? (
                        <>
                            <p className="text-center text-gray-700 mb-4">That's spot on! You just obtained:</p>
                            <div className="flex flex-wrap justify-evenly gap-y-2 w-full mb-6">
                                {result.awardedParts.map(bp => (
                                    <div
                                        key={bp.id}
                                        className={`flex flex-col items-center justify-center border-2 ${rarityColors[bp.rarity]} rounded p-2 bg-green-100 w-[30%]`}
                                    >
                                        <span className="text-[10px] font-bold mb-1 uppercase tracking-wide text-gray-700">{bp.rarity}</span>
                                        {bp.imageUrlZoomed ? (
                                            <img
                                                src={bp.imageUrlZoomed}
                                                alt={bp.name}
                                                className="w-full h-12 object-contain mb-1"
                                            />
                                        ) : (
                                            <div className="w-full h-12 flex items-center justify-center bg-gray-200 rounded mb-1">
                                                <span className="text-[8px] text-gray-500 text-center px-1">{bp.name}</span>
                                            </div>
                                        )}
                                        <span className="text-xs font-semibold mb-1">{bp.name}</span>
                                        <span className="text-[10px] text-gray-500">{bp.forestFriend?.name}</span>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <p className="text-center text-gray-700 mb-6">You already have all the rewards for this question.</p>
                    )}
                    <button
                        className="px-6 py-3 font-bold bg-warning rounded-lg hover:bg-warning-dark transition-colors duration-200"
                        onClick={() => navigate(`/trails/${question.trailId}`)}
                    >
                        ← Back to Trail
                    </button>
                </PopModal>
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
                        />
                    )}
                    <button
                        className="bg-warning text-brand font-bold py-2 rounded w-full"
                        type="submit"
                        disabled={submitting || !answer}
                    >
                        Submit
                    </button>
                    {result && !result.correct && (
                        <p className="text-red-500 font-semibold text-sm">That's not quite right! Try again!</p>
                    )}
                </form>
            </div>
        </div>
    );
}
