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

    const { friends, summary } = friendsData || { friends: [], summary: { completedFriends: 0, totalFriends: 0 } };
    const username = localStorage.getItem('username') || 'User';

    return (
        <div className="max-w-xl mx-auto p-4">
            {/* Header Section */}
            <div className="mb-6">
                <p className="text-xl font-normal text-black mb-4">Ready to Explore Sentosa?</p>

                <div className="space-y-3">
                    <h1 className="text-base font-bold text-black">{username}'s Forest Friends Badges</h1>
                    <p className="text-xs font-normal text-black">
                        Embark on trails, help Forest Friends and collect their badges!
                    </p>
                    <p className="text-L font-bold text-black">
                        {summary.completedFriends}/{summary.totalFriends} Friends Found
                    </p>
                </div>
            </div>

            {/* Friends Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
                {friends.map(friend => (
                    <div key={friend.id} className="flex flex-col items-center gap-1">
                        {/* Friend Image */}
                        <div className="w-[160px] h-[130px] mb-2">
                            {friend.isCompleted && friend.imageUrl ? (
                                // Show complete friend image when all parts are found
                                <img
                                    src={friend.imageUrl}
                                    alt={friend.name}
                                    className="w-full h-full object-cover bg-no-repeat"
                                    style={{
                                        backgroundSize: friend.name.includes('Hermit Crab') ? '124.89% 214.81%' :
                                            friend.name.includes('Snail') ? '155.5% 166.3%' :
                                                '220.76% 261.54%',
                                        backgroundPosition: friend.name.includes('Hermit Crab') ? '40.82% 52.15%' :
                                            friend.name.includes('Snail') ? '59.14% 51.71%' :
                                                '51.69% 44.97%'
                                    }}
                                />
                            ) : (
                                // Show ??? for incomplete friends
                                <div className="w-full h-full bg-gray-100 rounded flex items-center justify-center">
                                    <span className="text-2xl font-bold text-gray-400">???</span>
                                </div>
                            )}
                        </div>

                        {/* Friend Name */}
                        <p className="text-xs font-bold text-black text-center leading-tight whitespace-pre">
                            {friend.isCompleted ? friend.name : '???'}
                        </p>

                        {/* Parts Found Status */}
                        <p className="text-xs font-normal text-black text-center leading-tight">
                            {friend.foundParts}/{friend.totalParts} Parts Found{friend.isCompleted ? '!' : '!'}
                        </p>
                    </div>
                ))}
            </div>


        </div>
    );
} 