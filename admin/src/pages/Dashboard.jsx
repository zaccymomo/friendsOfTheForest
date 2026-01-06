import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getFriends, getTrails, getQuestions, getUsers, getBodyParts } from '../api';

export default function Dashboard() {
  const [stats, setStats] = useState({
    friends: 0,
    bodyParts: 0,
    trails: 0,
    questions: 0,
    users: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [friends, bodyParts, trails, questions, users] = await Promise.all([
        getFriends(),
        getBodyParts(),
        getTrails(),
        getQuestions(),
        getUsers()
      ]);

      setStats({
        friends: friends.length,
        bodyParts: bodyParts.length,
        trails: trails.length,
        questions: questions.length,
        users: users.length
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, count, link, color }) => (
    <Link
      to={link}
      className={`bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow border-l-4 ${color}`}
    >
      <h3 className="text-gray-500 text-sm font-medium uppercase">{title}</h3>
      <p className="text-3xl font-bold text-gray-900 mt-2">{count}</p>
    </Link>
  );

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Forest Friends"
          count={stats.friends}
          link="/friends"
          color="border-green-500"
        />
        <StatCard
          title="Body Parts"
          count={stats.bodyParts}
          link="/friends"
          color="border-blue-500"
        />
        <StatCard
          title="Trails"
          count={stats.trails}
          link="/trails"
          color="border-purple-500"
        />
        <StatCard
          title="Questions"
          count={stats.questions}
          link="/questions"
          color="border-yellow-500"
        />
        <StatCard
          title="Users"
          count={stats.users}
          link="/users"
          color="border-red-500"
        />
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/trails/new"
            className="block p-4 border border-gray-200 rounded hover:bg-gray-50 transition-colors"
          >
            <h3 className="font-medium text-gray-900">Create New Trail</h3>
            <p className="text-sm text-gray-500 mt-1">Add a new nature trail with questions</p>
          </Link>
          <Link
            to="/friends/new"
            className="block p-4 border border-gray-200 rounded hover:bg-gray-50 transition-colors"
          >
            <h3 className="font-medium text-gray-900">Create Forest Friend</h3>
            <p className="text-sm text-gray-500 mt-1">Add a new collectible forest friend</p>
          </Link>
          <Link
            to="/questions/new"
            className="block p-4 border border-gray-200 rounded hover:bg-gray-50 transition-colors"
          >
            <h3 className="font-medium text-gray-900">Create Question</h3>
            <p className="text-sm text-gray-500 mt-1">Add a new question to a trail</p>
          </Link>
          <Link
            to="/users"
            className="block p-4 border border-gray-200 rounded hover:bg-gray-50 transition-colors"
          >
            <h3 className="font-medium text-gray-900">Manage Users</h3>
            <p className="text-sm text-gray-500 mt-1">View and manage user accounts</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
