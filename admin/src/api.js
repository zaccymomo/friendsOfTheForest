import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';
let token = null;

export function setToken(t) {
    token = t;
}

function authHeaders() {
    const t = token || localStorage.getItem('adminToken');
    return t ? { Authorization: `Bearer ${t}` } : {};
}

// Auth
export async function login(username, password) {
    const res = await axios.post(`${API_BASE}/auth/login`, { username, password });
    return res.data;
}

// Forest Friends
export async function getFriends() {
    const res = await axios.get(`${API_BASE}/admin/friends`, { headers: authHeaders() });
    return res.data;
}

export async function getFriend(id) {
    const res = await axios.get(`${API_BASE}/admin/friends/${id}`, { headers: authHeaders() });
    return res.data;
}

export async function createFriend(formData) {
    const res = await axios.post(`${API_BASE}/admin/friends`, formData, {
        headers: { ...authHeaders(), 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
}

export async function updateFriend(id, formData) {
    const res = await axios.put(`${API_BASE}/admin/friends/${id}`, formData, {
        headers: { ...authHeaders(), 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
}

export async function deleteFriend(id) {
    const res = await axios.delete(`${API_BASE}/admin/friends/${id}`, { headers: authHeaders() });
    return res.data;
}

// Body Parts
export async function getBodyParts() {
    const res = await axios.get(`${API_BASE}/admin/bodyparts`, { headers: authHeaders() });
    return res.data;
}

export async function createBodyPart(formData) {
    const res = await axios.post(`${API_BASE}/admin/bodyparts`, formData, {
        headers: { ...authHeaders(), 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
}

export async function updateBodyPart(id, formData) {
    const res = await axios.put(`${API_BASE}/admin/bodyparts/${id}`, formData, {
        headers: { ...authHeaders(), 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
}

export async function deleteBodyPart(id) {
    const res = await axios.delete(`${API_BASE}/admin/bodyparts/${id}`, { headers: authHeaders() });
    return res.data;
}

// Trails
export async function getTrails() {
    const res = await axios.get(`${API_BASE}/admin/trails`, { headers: authHeaders() });
    return res.data;
}

export async function getTrail(id) {
    const res = await axios.get(`${API_BASE}/admin/trails/${id}`, { headers: authHeaders() });
    return res.data;
}

export async function createTrail(formData) {
    const res = await axios.post(`${API_BASE}/admin/trails`, formData, {
        headers: { ...authHeaders(), 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
}

export async function updateTrail(id, formData) {
    const res = await axios.put(`${API_BASE}/admin/trails/${id}`, formData, {
        headers: { ...authHeaders(), 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
}

export async function deleteTrail(id) {
    const res = await axios.delete(`${API_BASE}/admin/trails/${id}`, { headers: authHeaders() });
    return res.data;
}

export async function addTrailPhoto(trailId, formData) {
    const res = await axios.post(`${API_BASE}/admin/trails/${trailId}/photos`, formData, {
        headers: { ...authHeaders(), 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
}

export async function deleteTrailPhoto(trailId, photoId) {
    const res = await axios.delete(`${API_BASE}/admin/trails/${trailId}/photos/${photoId}`, { headers: authHeaders() });
    return res.data;
}

export async function linkBodyPartToTrail(trailId, bodyPartId) {
    const res = await axios.post(`${API_BASE}/admin/trails/${trailId}/bodyparts`, { bodyPartId }, { headers: authHeaders() });
    return res.data;
}

export async function unlinkBodyPartFromTrail(trailId, bodyPartId) {
    const res = await axios.delete(`${API_BASE}/admin/trails/${trailId}/bodyparts/${bodyPartId}`, { headers: authHeaders() });
    return res.data;
}

// Questions
export async function getQuestions() {
    const res = await axios.get(`${API_BASE}/admin/questions`, { headers: authHeaders() });
    return res.data;
}

export async function getQuestion(id) {
    const res = await axios.get(`${API_BASE}/admin/questions/${id}`, { headers: authHeaders() });
    return res.data;
}

export async function createQuestion(data) {
    const res = await axios.post(`${API_BASE}/admin/questions`, data, { headers: authHeaders() });
    return res.data;
}

export async function updateQuestion(id, data) {
    const res = await axios.put(`${API_BASE}/admin/questions/${id}`, data, { headers: authHeaders() });
    return res.data;
}

export async function deleteQuestion(id) {
    const res = await axios.delete(`${API_BASE}/admin/questions/${id}`, { headers: authHeaders() });
    return res.data;
}

// Users
export async function getUsers() {
    const res = await axios.get(`${API_BASE}/admin/users`, { headers: authHeaders() });
    return res.data;
}

export async function getUser(id) {
    const res = await axios.get(`${API_BASE}/admin/users/${id}`, { headers: authHeaders() });
    return res.data;
}

export async function updateUserRole(id, role) {
    const res = await axios.put(`${API_BASE}/admin/users/${id}/role`, { role }, { headers: authHeaders() });
    return res.data;
}

export async function deleteUser(id) {
    const res = await axios.delete(`${API_BASE}/admin/users/${id}`, { headers: authHeaders() });
    return res.data;
}
