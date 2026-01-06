import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getTrails, deleteTrail } from '../../api';
import Table from '../../components/Table';
import Button from '../../components/Button';
import ConfirmDialog from '../../components/ConfirmDialog';

export default function TrailList() {
  const [trails, setTrails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadTrails();
  }, []);

  const loadTrails = async () => {
    try {
      const data = await getTrails();
      setTrails(data);
    } catch (error) {
      console.error('Failed to load trails:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTrail(deleteConfirm.id);
      setTrails(trails.filter(t => t.id !== deleteConfirm.id));
      setDeleteConfirm(null);
    } catch (error) {
      alert('Failed to delete trail: ' + error.message);
    }
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'description', label: 'Description', render: (row) => row.description.substring(0, 50) + '...' },
    { key: 'photos', label: 'Photos', render: (row) => row.photos.length },
    { key: 'questions', label: 'Questions', render: (row) => row._count.questions }
  ];

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Trails</h1>
        <Link to="/trails/new">
          <Button>Create Trail</Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table
          columns={columns}
          data={trails}
          onEdit={(trail) => navigate(`/trails/${trail.id}/edit`)}
          onDelete={(trail) => setDeleteConfirm(trail)}
        />
      </div>

      <ConfirmDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleDelete}
        title="Delete Trail"
        message={`Are you sure you want to delete "${deleteConfirm?.name}"? This will also delete all associated questions and photos.`}
      />
    </div>
  );
}
