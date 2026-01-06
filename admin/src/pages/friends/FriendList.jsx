import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getFriends, deleteFriend, getBodyParts, createBodyPart } from '../../api';
import Table from '../../components/Table';
import Button from '../../components/Button';
import ConfirmDialog from '../../components/ConfirmDialog';
import Modal from '../../components/Modal';
import Input from '../../components/Input';
import Select from '../../components/Select';
import ImageUpload from '../../components/ImageUpload';

export default function FriendList() {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [showBodyPartModal, setShowBodyPartModal] = useState(false);
  const [bodyPartForm, setBodyPartForm] = useState({
    friendId: '',
    name: '',
    rarity: 'COMMON',
    image: null,
    imageZoomed: null
  });
  const navigate = useNavigate();

  useEffect(() => {
    loadFriends();
  }, []);

  const loadFriends = async () => {
    try {
      const data = await getFriends();
      setFriends(data);
    } catch (error) {
      console.error('Failed to load friends:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteFriend(deleteConfirm.id);
      setFriends(friends.filter(f => f.id !== deleteConfirm.id));
      setDeleteConfirm(null);
    } catch (error) {
      alert('Failed to delete friend: ' + error.message);
    }
  };

  const handleCreateBodyPart = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('name', bodyPartForm.name);
      formData.append('rarity', bodyPartForm.rarity);
      formData.append('forestFriendId', bodyPartForm.friendId);
      if (bodyPartForm.image) {
        formData.append('image', bodyPartForm.image);
      }
      if (bodyPartForm.imageZoomed) {
        formData.append('imageZoomed', bodyPartForm.imageZoomed);
      }

      await createBodyPart(formData);
      setShowBodyPartModal(false);
      setBodyPartForm({ friendId: '', name: '', rarity: 'COMMON', image: null, imageZoomed: null });
      loadFriends();
    } catch (error) {
      alert('Failed to create body part: ' + error.message);
    }
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    {
      key: 'imageUrl',
      label: 'Image',
      render: (row) => row.imageUrl ? (
        <img src={row.imageUrl} alt={row.name} className="w-16 h-16 object-cover rounded" />
      ) : 'No image'
    },
    { key: 'bodyParts', label: 'Body Parts', render: (row) => row._count.bodyParts }
  ];

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Forest Friends</h1>
        <div className="space-x-2">
          <Button onClick={() => setShowBodyPartModal(true)}>
            Add Body Part
          </Button>
          <Link to="/friends/new">
            <Button>Create Friend</Button>
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table
          columns={columns}
          data={friends}
          onEdit={(friend) => navigate(`/friends/${friend.id}/edit`)}
          onDelete={(friend) => setDeleteConfirm(friend)}
        />
      </div>

      <ConfirmDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleDelete}
        title="Delete Forest Friend"
        message={`Are you sure you want to delete "${deleteConfirm?.name}"? This will also delete all associated body parts.`}
      />

      <Modal
        isOpen={showBodyPartModal}
        onClose={() => setShowBodyPartModal(false)}
        title="Add Body Part"
        size="md"
      >
        <form onSubmit={handleCreateBodyPart}>
          <Select
            label="Forest Friend"
            value={bodyPartForm.friendId}
            onChange={(e) => setBodyPartForm({ ...bodyPartForm, friendId: e.target.value })}
            options={friends.map(f => ({ value: f.id.toString(), label: f.name }))}
            required
          />

          <Input
            label="Body Part Name"
            value={bodyPartForm.name}
            onChange={(e) => setBodyPartForm({ ...bodyPartForm, name: e.target.value })}
            placeholder="e.g., Spider Legs"
            required
          />

          <Select
            label="Rarity"
            value={bodyPartForm.rarity}
            onChange={(e) => setBodyPartForm({ ...bodyPartForm, rarity: e.target.value })}
            options={[
              { value: 'COMMON', label: 'Common' },
              { value: 'RARE', label: 'Rare' },
              { value: 'LEGENDARY', label: 'Legendary' }
            ]}
            required
          />

          <ImageUpload
            label="Regular Image"
            onFileSelect={(file) => setBodyPartForm({ ...bodyPartForm, image: file })}
          />

          <ImageUpload
            label="Zoomed Image"
            onFileSelect={(file) => setBodyPartForm({ ...bodyPartForm, imageZoomed: file })}
          />

          <div className="flex space-x-3 mt-4">
            <Button type="submit">Create Body Part</Button>
            <Button type="button" variant="outline" onClick={() => setShowBodyPartModal(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
