import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/AdminLayout';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

// Trail pages
import TrailList from './pages/trails/TrailList';
import TrailForm from './pages/trails/TrailForm';

// Question pages
import QuestionList from './pages/questions/QuestionList';
import QuestionForm from './pages/questions/QuestionForm';

// Friend pages
import FriendList from './pages/friends/FriendList';
import FriendForm from './pages/friends/FriendForm';

// Zone pages
import ZoneList from './pages/zones/ZoneList';
import ZoneForm from './pages/zones/ZoneForm';

// User pages
import UserList from './pages/users/UserList';
import UserDetail from './pages/users/UserDetail';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />

          {/* Trail routes */}
          <Route path="trails" element={<TrailList />} />
          <Route path="trails/new" element={<TrailForm />} />
          <Route path="trails/:id/edit" element={<TrailForm />} />

          {/* Question routes */}
          <Route path="questions" element={<QuestionList />} />
          <Route path="questions/new" element={<QuestionForm />} />
          <Route path="questions/:id/edit" element={<QuestionForm />} />

          {/* Friend routes */}
          <Route path="friends" element={<FriendList />} />
          <Route path="friends/new" element={<FriendForm />} />
          <Route path="friends/:id/edit" element={<FriendForm />} />

          {/* Zone routes */}
          <Route path="zones" element={<ZoneList />} />
          <Route path="zones/new" element={<ZoneForm />} />
          <Route path="zones/:id/edit" element={<ZoneForm />} />

          {/* User routes */}
          <Route path="users" element={<UserList />} />
          <Route path="users/:id" element={<UserDetail />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
