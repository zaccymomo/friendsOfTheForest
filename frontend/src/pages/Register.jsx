import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register, setToken } from '../api';

export default function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const { token } = await register(username, password);
            localStorage.setItem('token', token);
            setToken(token);
            navigate('/friends');
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow w-80 flex flex-col gap-4">
                <h1 className="text-2xl font-bold mb-2 text-brand">Register</h1>
                <input
                    className="border p-2 rounded"
                    placeholder="Username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                />
                <input
                    className="border p-2 rounded"
                    placeholder="Password"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
                {error && <div className="text-red-500 text-sm">{error}</div>}
                <button className="bg-warning text-brand font-bold py-2 rounded" type="submit">Register</button>
                <div className="text-sm text-center">
                    Already have an account? <Link to="/login" className="text-blue-600">Login</Link>
                </div>
            </form>
        </div>
    );
} 