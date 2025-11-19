import React, { useEffect, useState } from 'react';
import { getProfile, updateProfile } from '../api';

export default function Profile() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        setLoading(true);
        getProfile()
            .then(data => {
                setUsername(data.username);
                setLoading(false);
            })
            .catch(() => {
                setError('Failed to load profile');
                setLoading(false);
            });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            const res = await updateProfile({ username, password: password || undefined });
            setSuccess('Profile updated!');
            setPassword('');
            localStorage.setItem('username', res.username);
        } catch (err) {
            setError(err.response?.data?.error || 'Update failed');
        }
    };

    if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow w-80 flex flex-col gap-4 items-center">
                <h1 className="text-2xl font-bold mb-2 text-brand">Edit Profile</h1>
                <label className="w-full">
                    <span className="text-sm text-gray-600">Username</span>
                    <input
                        className="border p-2 rounded w-full mt-1"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        required
                    />
                </label>
                <label className="w-full">
                    <span className="text-sm text-gray-600">New Password</span>
                    <input
                        className="border p-2 rounded w-full mt-1"
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Leave blank to keep current"
                    />
                </label>
                {error && <div className="text-red-500 text-sm">{error}</div>}
                {success && <div className="text-green-600 text-sm">{success}</div>}
                <button className="bg-warning text-brand font-bold py-2 rounded w-full mt-2" type="submit">Save Changes</button>
            </form>
        </div>
    );
} 