import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTrailDetail } from '../api';

const rarityColors = {
    COMMON: 'border-black',
    RARE: 'border-purple-500',
    LEGENDARY: 'border-yellow-400',
};

export default function TrailDetail({ refreshFriends }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [trail, setTrail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const loadTrail = () => {
        setLoading(true);
        getTrailDetail(id)
            .then(setTrail)
            .catch(() => setError('Failed to load trail'))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadTrail();
    }, [id]);

    // Refresh trail data when navigating back (in case body parts were collected)
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (!document.hidden) {
                loadTrail();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [id]);

    if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    if (error) return <div className="flex items-center justify-center min-h-screen text-red-500">{error}</div>;
    if (!trail) return null;

    return (
        <div className="max-w-xl mx-auto p-4">
            <button
                onClick={() => navigate('/trails')}
                className="mb-4 px-4 py-2 font-bold bg-warning rounded-lg hover:bg-warning-dark transition-colors duration-200"
            >
                ← Back to Trails
            </button>
            <h1 className="text-2xl font-bold mb-2 text-brand">{trail.name}</h1>
            {trail.mapUrl && (
                <img src={trail.mapUrl} alt="Trail Map" className="object-cover rounded mb-2 border" />
            )}
            <div className="text-gray-700 mb-2">{trail.description}</div>
            <div className="overflow-x-auto flex gap-2 pb-2 mb-4">
                {trail.photos.map(photo => (
                    <img
                        key={photo.id}
                        src={photo.photoUrl}
                        alt="Trail"
                        className="h-32 w-48 object-cover rounded border"
                    />
                ))}
            </div>
            <h2 className="text-lg font-bold mt-6 mb-2">Parts to Find</h2>
            <div className="grid grid-cols-3 gap-2">
                {trail.bodyParts.map(bp => (
                    <div
                        key={bp.id}
                        className={`flex flex-col items-center justify-center border-2 ${rarityColors[bp.rarity]} rounded p-2 ${bp.found ? 'bg-green-100' : 'bg-gray-100'}`}
                    >
                        <span className="text-[10px] font-bold mb-1 uppercase tracking-wide text-gray-700">{bp.rarity}</span>
                        {bp.found ? (
                            <>
                                {bp.imageUrl ? (
                                    <img
                                        src={bp.imageUrl}
                                        alt={bp.name}
                                        className="w-full h-12 object-contain mb-1"
                                    />
                                ) : (
                                    <div className="w-full h-12 flex items-center justify-center bg-gray-200 rounded mb-1">
                                        <span className="text-[8px] text-gray-500 text-center px-1">{bp.name}</span>
                                    </div>
                                )}
                                <span className="text-xs font-semibold mb-1">{bp.name}</span>
                                <span className="text-[10px] text-gray-500">{bp.forestFriend}</span>
                                <span className="text-green-600 text-xs mt-1">Found</span>
                            </>
                        ) : (
                            <span className="text-2xl font-bold text-gray-400">??</span>
                        )}
                    </div>
                ))}
            </div>

            {/* Scan QR Button - Centered at bottom */}
            <div className="flex justify-center mt-8">
                <button
                    onClick={() => navigate('/scan')}
                    className="px-6 py-3 font-bold bg-warning rounded-lg hover:bg-warning-dark transition-colors duration-200"
                >
                    📱 Scan QR Code
                </button>
            </div>
        </div>
    );
} 