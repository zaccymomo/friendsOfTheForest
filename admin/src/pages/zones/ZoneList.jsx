import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getZones, deleteZone } from '../../api';
import Button from '../../components/Button';

export default function ZoneList() {
  const navigate = useNavigate();
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadZones();
  }, []);

  const loadZones = async () => {
    try {
      const data = await getZones();
      setZones(data);
    } catch {
      setError('Failed to load zones');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (zone) => {
    const questionCount = zone._count?.questions ?? 0;
    const warning = questionCount > 0
      ? `This will unlink ${questionCount} question(s) from Zone ${zone.id}. Continue?`
      : `Delete Zone ${zone.id}?`;
    if (!confirm(warning)) return;
    try {
      await deleteZone(zone.id);
      setZones(zones.filter(z => z.id !== zone.id));
    } catch {
      alert('Failed to delete zone');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Zones</h1>
        <Button onClick={() => navigate('/zones/new')}>Create Zone</Button>
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">{error}</div>}

      {zones.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
          No zones yet. Create one to get started.
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Narrative</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Questions</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {zones.map(zone => (
                <tr key={zone.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {zone.id}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-md">
                    <span className="line-clamp-2">{zone.narrative}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {zone._count?.questions ?? 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <Button variant="outline" onClick={() => navigate(`/zones/${zone.id}/edit`)}>
                      Edit
                    </Button>
                    <Button variant="danger" onClick={() => handleDelete(zone)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
