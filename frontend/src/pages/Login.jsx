import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login, setToken } from '../api';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const { token } = await login(username, password);
            localStorage.setItem('token', token);
            localStorage.setItem('username', username);
            setToken(token);
            navigate('/friends');
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow w-80 flex flex-col gap-4">
                <h1 className="text-2xl font-bold mb-2 text-brand">Login</h1>
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
                <button className="bg-warning text-brand font-bold py-2 rounded" type="submit">Login</button>
                <div className="text-sm text-center">
                    Don't have an account? <Link to="/register" className="text-blue-600">Register</Link>
                </div>
            </form>
        </div>
    );
} 