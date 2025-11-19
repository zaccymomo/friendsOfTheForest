import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTrails } from '../api';

export default function Trails() {
    const navigate = useNavigate();
    const [trails, setTrails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        setLoading(true);
        getTrails()
            .then(setTrails)
            .catch(() => setError('Failed to load trails'))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    if (error) return <div className="flex items-center justify-center min-h-screen text-red-500">{error}</div>;

    return (
        <div className="max-w-xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4 text-brand">Trails</h1>
            {trails.map(trail => (
                <div
                    key={trail.id}
                    className="mb-8 bg-white rounded shadow p-4 cursor-pointer hover:shadow-lg transition-shadow duration-200"
                    onClick={() => navigate(`/trails/${trail.id}`)}
                >
                    <div className="font-bold text-lg mb-1">{trail.name}</div>
                    <div className="text-gray-600 text-sm mb-2">{trail.description}</div>
                    <div className="overflow-x-auto flex gap-2 pb-2">
                        {trail.photos.map(photo => (
                            <img
                                key={photo.id}
                                src={photo.photoUrl}
                                alt="Trail"
                                className="h-32 w-48 object-cover rounded border"
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
} 