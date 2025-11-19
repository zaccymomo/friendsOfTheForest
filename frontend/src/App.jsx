import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './ProtectedRoute';
import TopBar from './components/TopBar';
import { getFriends, setToken } from './api';
import Profile from './pages/Profile';
import Friends from './pages/Friends';
import Trails from './pages/Trails';
import TrailDetail from './pages/TrailDetail';
import QRScanner from './pages/QRScanner';
import Question from './pages/Question';

function ProtectedLayout({ children }) {
  const [friendsData, setFriendsData] = useState(null);
  const navigate = useNavigate();

  const refreshFriends = () => {
    getFriends().then(setFriendsData).catch(() => setFriendsData({ friends: [], summary: { completedFriends: 0, totalFriends: 0 } }));
  };

  useEffect(() => {
    refreshFriends();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setToken(null);
    navigate('/login');
  };

  const friends = friendsData?.friends || [];

  return (
    <>
      <TopBar friends={friends} onLogout={handleLogout} />
      <div className="pt-4">
        {React.cloneElement(children, { refreshFriends })}
      </div>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/friends"
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <Friends />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/trails"
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <Trails />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/trails/:id"
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <TrailDetail />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/scan"
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <QRScanner />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/question/:id"
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <Question />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <Profile />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}
