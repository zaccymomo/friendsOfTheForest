import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUser, updateUserRole } from '../../api';
import Button from '../../components/Button';

export default function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, [id]);

  const loadUser = async () => {
    try {
      const data = await getUser(id);
      setUser(data);
    } catch (error) {
      console.error('Failed to load user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (newRole) => {
    if (!confirm(`Change user role to ${newRole}?`)) return;

    try {
      await updateUserRole(id, newRole);
      loadUser();
    } catch (error) {
      alert('Failed to update role: ' + error.message);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!user) {
    return <div className="text-center py-8">User not found</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">User Details</h1>
        <Button variant="outline" onClick={() => navigate('/users')}>
          Back to Users
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">User Information</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Username</p>
            <p className="font-medium">{user.username}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Role</p>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded text-xs font-semibold ${
                user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {user.role}
              </span>
              {user.role === 'USER' ? (
                <Button size="sm" onClick={() => handleRoleChange('ADMIN')}>
                  Promote to Admin
                </Button>
              ) : (
                <Button size="sm" variant="secondary" onClick={() => handleRoleChange('USER')}>
                  Demote to User
                </Button>
              )}
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-500">Created</p>
            <p className="font-medium">{new Date(user.createdAt).toLocaleString()}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Last Updated</p>
            <p className="font-medium">{new Date(user.updatedAt).toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Collection Progress</h2>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-green-50 p-4 rounded">
            <p className="text-sm text-gray-600">Body Parts Collected</p>
            <p className="text-2xl font-bold text-green-600">{user.bodyParts.length}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded">
            <p className="text-sm text-gray-600">Trails Started</p>
            <p className="text-2xl font-bold text-blue-600">{user.trails.length}</p>
          </div>
        </div>

        {user.bodyParts.length > 0 && (
          <div>
            <h3 className="font-semibold mb-3">Collected Body Parts</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {user.bodyParts.map((userPart) => (
                <div key={userPart.bodyPart.id} className="border border-gray-200 rounded p-3 flex items-center space-x-3">
                  {userPart.bodyPart.imageUrl && (
                    <img
                      src={userPart.bodyPart.imageUrl}
                      alt={userPart.bodyPart.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <p className="font-medium">{userPart.bodyPart.forestFriend.name}</p>
                    <p className="text-sm text-gray-600">{userPart.bodyPart.name}</p>
                    <p className="text-xs text-gray-500">
                      {userPart.bodyPart.rarity} • Found {new Date(userPart.foundAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {user.trails.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Trails Started</h2>
          <div className="space-y-2">
            {user.trails.map((userTrail) => (
              <div key={userTrail.trail.id} className="border border-gray-200 rounded p-3">
                <p className="font-medium">{userTrail.trail.name}</p>
                <p className="text-sm text-gray-500">
                  Started {new Date(userTrail.startedAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
