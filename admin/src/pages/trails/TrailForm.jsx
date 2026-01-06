import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getTrail, createTrail, updateTrail, addTrailPhoto, deleteTrailPhoto } from '../../api';
import Input from '../../components/Input';
import Button from '../../components/Button';
import ImageUpload from '../../components/ImageUpload';

export default function TrailForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    mapImage: null
  });
  const [trail, setTrail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit) {
      loadTrail();
    }
  }, [id]);

  const loadTrail = async () => {
    try {
      const data = await getTrail(id);
      setTrail(data);
      setFormData({
        name: data.name,
        description: data.description,
        mapImage: null
      });
    } catch (error) {
      setError('Failed to load trail');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      if (formData.mapImage) {
        data.append('mapImage', formData.mapImage);
      }

      if (isEdit) {
        await updateTrail(id, data);
      } else {
        await createTrail(data);
      }

      navigate('/trails');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save trail');
      setLoading(false);
    }
  };

  const handlePhotoUpload = async (file) => {
    if (!isEdit) return;

    try {
      const data = new FormData();
      data.append('photo', file);
      await addTrailPhoto(id, data);
      loadTrail(); // Reload to show new photo
    } catch (error) {
      alert('Failed to upload photo');
    }
  };

  const handleDeletePhoto = async (photoId) => {
    if (!confirm('Delete this photo?')) return;

    try {
      await deleteTrailPhoto(id, photoId);
      loadTrail();
    } catch (error) {
      alert('Failed to delete photo');
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        {isEdit ? 'Edit Trail' : 'Create Trail'}
      </h1>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-danger rounded">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit}>
          <Input
            label="Trail Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-danger">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <ImageUpload
            label="Map Image"
            currentImageUrl={trail?.mapUrl}
            onFileSelect={(file) => setFormData({ ...formData, mapImage: file })}
          />

          <div className="flex space-x-3">
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : isEdit ? 'Update Trail' : 'Create Trail'}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate('/trails')}>
              Cancel
            </Button>
          </div>
        </form>

        {isEdit && trail && (
          <div className="mt-8 pt-8 border-t">
            <h3 className="text-lg font-semibold mb-4">Trail Photos</h3>

            <div className="mb-4">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files[0] && handlePhotoUpload(e.target.files[0])}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-green-700 file:text-white hover:file:bg-green-600 hover:file:shadow-md file:transition-all cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              {trail.photos.map((photo) => (
                <div key={photo.id} className="relative">
                  <img src={photo.photoUrl} alt="Trail" className="w-full h-32 object-cover rounded" />
                  <button
                    onClick={() => handleDeletePhoto(photo.id)}
                    className="absolute top-1 right-1 bg-danger text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
