import axios from 'axios';

// Use localhost for desktop, or your computer's IP for phone access
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';
let token = null;

export function setToken(t) {
    token = t;
}

function authHeaders() {
    const t = token || localStorage.getItem('token');
    return t ? { Authorization: `Bearer ${t}` } : {};
}

export async function login(username, password) {
    const res = await axios.post(`${API_BASE}/auth/login`, { username, password });
    return res.data;
}

export async function register(username, password) {
    const res = await axios.post(`${API_BASE}/auth/register`, { username, password });
    return res.data;
}

export async function getFriends() {
    const res = await axios.get(`${API_BASE}/friends`, { headers: authHeaders() });
    return res.data;
}

export async function getTrails() {
    const res = await axios.get(`${API_BASE}/trails`, { headers: authHeaders() });
    return res.data;
}

export async function getTrailDetail(id) {
    const res = await axios.get(`${API_BASE}/trails/${id}`, { headers: authHeaders() });
    return res.data;
}

export async function getQuestion(id) {
    const res = await axios.get(`${API_BASE}/questions/${id}`, { headers: authHeaders() });
    return res.data;
}

export async function answerQuestion(id, answer) {
    const res = await axios.post(`${API_BASE}/questions/${id}/answer`, { answer }, { headers: authHeaders() });
    return res.data;
}

export async function getProfile() {
    const res = await axios.get(`${API_BASE}/profile`, { headers: authHeaders() });
    return res.data;
}

export async function updateProfile({ username, password }) {
    const res = await axios.post(`${API_BASE}/profile`, { username, password }, { headers: authHeaders() });
    return res.data;
}

// Add more API helpers as needed 