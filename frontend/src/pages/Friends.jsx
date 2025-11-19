import React, { useEffect, useState } from 'react';
import { getFriends } from '../api';
import { getBodyPartStyle } from '../config/bodyPartPositions';

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

    const { friends, summary } = friendsData || { friends: [], summary: { completedFriends: 0, totalFriends: 0 } };
    const username = localStorage.getItem('username') || 'User';

    return (
        <div className="max-w-xl mx-auto p-4">
            {/* Header Section */}
            <div className="mb-6">
                <p className="text-base font-normal text-black mb-4">Ready to Explore?</p>

                <div className="space-y-3">
                    <h1 className="text-base font-bold text-black">{username}'s Forest Friends Badges</h1>
                    <p className="text-xs font-normal text-black">
                        Embark on trails, help Forest Friends and collect their badges!
                    </p>
                    <p className="text-xs font-bold text-black">
                        {summary.completedFriends}/{summary.totalFriends} Friends Found
                    </p>
                </div>
            </div>

            {/* Friends Grid */}
            <div className="flex flex-row gap-3 items-center justify-start mb-4">
                {friends.map(friend => {
                    const foundBodyParts = friend.bodyParts.filter(bp => bp.found);
                    const hasAnyParts = foundBodyParts.length > 0;

                    return (
                        <div key={friend.id} className="flex flex-col items-center gap-0.5 w-[126px]">
                            {/* Friend Image - Progressive Reveal */}
                            <div className="w-[110px] h-[90px] mb-1 relative bg-gray-100 rounded">
                                {hasAnyParts ? (
                                    // Show collected body parts as layered images
                                    foundBodyParts.map(bodyPart => {
                                        if (bodyPart.imageUrl) {
                                            return (
                                                <img
                                                    key={bodyPart.id}
                                                    src={bodyPart.imageUrl}
                                                    alt={bodyPart.name}
                                                    style={getBodyPartStyle(bodyPart.name)}
                                                />
                                            );
                                        } else {
                                            // Show alt text for body parts without images
                                            return (
                                                <div
                                                    key={bodyPart.id}
                                                    style={{
                                                        ...getBodyPartStyle(bodyPart.name),
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontSize: '8px',
                                                        color: '#666',
                                                        backgroundColor: '#e5e7eb',
                                                        border: '1px dashed #9ca3af',
                                                        borderRadius: '4px',
                                                        padding: '2px',
                                                    }}
                                                >
                                                    {bodyPart.name}
                                                </div>
                                            );
                                        }
                                    })
                                ) : (
                                    // No parts found - show placeholder
                                    <div className="w-full h-full flex items-center justify-center">
                                        <span className="text-2xl font-bold text-gray-400">???</span>
                                    </div>
                                )}
                            </div>

                            {/* Friend Name - Hidden if no parts found */}
                            <p className="text-[8px] font-bold text-black text-center leading-none whitespace-pre">
                                {hasAnyParts ? friend.name : '???'}
                            </p>

                            {/* Parts Found Status */}
                            <p className="text-[8px] font-normal text-black text-center leading-none">
                                {hasAnyParts ? `${friend.foundParts}/${friend.totalParts} Parts Found!` : '???'}
                            </p>
                        </div>
                    );
                })}
            </div>


        </div>
    );
} 