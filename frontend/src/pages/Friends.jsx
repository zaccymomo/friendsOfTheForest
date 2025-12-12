import React, { useEffect, useState } from 'react';
import { getFriends } from '../api';

export default function Friends({ refreshFriends }) {
    const [friendsData, setFriendsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const loadFriends = () => {
        setLoading(true);
        getFriends()
            .then(setFriendsData)
            .catch(() => setError('Failed to load friends'))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadFriends();
    }, []);

    // Refresh when navigating to this page (in case data was updated elsewhere)
    useEffect(() => {
        loadFriends();
    }, [refreshFriends]);

    if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    if (error) return <div className="flex items-center justify-center min-h-screen text-red-500">{error}</div>;

    const { friends, summary, stickerBookBackground } = friendsData || {
        friends: [],
        summary: { completedFriends: 0, totalFriends: 0 },
        stickerBookBackground: null
    };
    const username = localStorage.getItem('username') || 'User';

    // Debug: Log the API response
    console.log('Friends API Response:', friendsData);
    console.log('Sticker Book Background URL:', stickerBookBackground);

    return (
        <div className="max-w-xl mx-auto p-4" style={{backgroundColor: '#F4EDD2'}}>
            {/* Header Section */}
            <div className="mb-3">
                <p className="text-4xl font-baloo font-extrabold mb-4">Ready to Explore Sentosa, {username}?</p>

                <div className="space-y-3">
                    <p className="text-xs font-normal text-black">
                        Embark on trails, help Forest Friends and collect their badges!
                    </p>
                    {/* <h1 className="text-base font-bold text-black">{username}'s Sticker Book</h1> */}
                    <p className="text-L font-bold text-black">
                        {summary.completedFriends}/{summary.totalFriends} Friends Found
                    </p>
                </div>
            </div>

            {/* Sticker Book */}
            <div className="relative w-full">
                {/* Layer 1: Background - 100% opacity */}
                {stickerBookBackground && (
                    <img
                        src={stickerBookBackground}
                        alt="Sticker Book Background"
                        className="w-full h-auto"
                        style={{ opacity: 1, position: 'relative', zIndex: 0 }}
                    />
                )}

                {/* Layer 2: All outlines - 100% opacity */}
                {friends.map(friend => (
                    friend.outlineUrl && (
                        <img
                            key={`outline-${friend.id}`}
                            src={friend.outlineUrl}
                            alt={`${friend.name} Outline`}
                            className="absolute top-0 left-0 w-full h-auto"
                            style={{ opacity: 1, zIndex: 1 }}
                        />
                    )
                ))}

                {/* Layer 3+: All body parts - conditional opacity */}
                {friends.flatMap(friend =>
                    friend.bodyParts.map(part => (
                        part.imageUrl && (
                            <img
                                key={`part-${part.id}`}
                                src={part.imageUrl}
                                alt={part.name}
                                className="absolute top-0 left-0 w-full h-auto"
                                style={{
                                    opacity: part.found ? 1 : 0.2,
                                    zIndex: 2
                                }}
                            />
                        )
                    ))
                )}
            </div>
        </div>
    );
} 