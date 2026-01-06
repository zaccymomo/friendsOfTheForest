import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getFriend, createFriend, updateFriend } from '../../api';
import Input from '../../components/Input';
import Button from '../../components/Button';
import ImageUpload from '../../components/ImageUpload';

export default function FriendForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    name: '',
    image: null
  });
  const [friend, setFriend] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit) {
      loadFriend();
    }
  }, [id]);

  const loadFriend = async () => {
    try {
      const data = await getFriend(id);
      setFriend(data);
      setFormData({
        name: data.name,
        image: null
      });
    } catch (error) {
      setError('Failed to load friend');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = new FormData();
      data.append('name', formData.name);
      if (formData.image) {
        data.append('image', formData.image);
      }

      if (isEdit) {
        await updateFriend(id, data);
      } else {
        await createFriend(data);
      }

      navigate('/friends');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save friend');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        {isEdit ? 'Edit Forest Friend' : 'Create Forest Friend'}
      </h1>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-danger rounded">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit}>
          <Input
            label="Friend Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Spider"
            required
          />

          <ImageUpload
            label="Outline Image"
            currentImageUrl={friend?.imageUrl}
            onFileSelect={(file) => setFormData({ ...formData, image: file })}
          />

          <div className="flex space-x-3">
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : isEdit ? 'Update Friend' : 'Create Friend'}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate('/friends')}>
              Cancel
            </Button>
          </div>
        </form>

        {isEdit && friend && friend.bodyParts.length > 0 && (
          <div className="mt-8 pt-8 border-t">
            <h3 className="text-lg font-semibold mb-4">Body Parts ({friend.bodyParts.length})</h3>
            <div className="grid grid-cols-2 gap-4">
              {friend.bodyParts.map((part) => (
                <div key={part.id} className="border border-gray-200 rounded p-3">
                  <div className="flex items-center space-x-3">
                    {part.imageUrl && (
                      <img src={part.imageUrl} alt={part.name} className="w-12 h-12 object-cover rounded" />
                    )}
                    <div>
                      <p className="font-medium">{part.name}</p>
                      <p className="text-sm text-gray-500">{part.rarity}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
