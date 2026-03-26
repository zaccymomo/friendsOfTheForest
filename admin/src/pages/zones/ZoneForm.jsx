import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getZone, createZone, updateZone, changeZoneId, updateQuestion } from '../../api';
import Input from '../../components/Input';
import Button from '../../components/Button';

export default function ZoneForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [narrative, setNarrative] = useState('');
  const [zoneId, setZoneId] = useState('');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [newIdValue, setNewIdValue] = useState('');
  const [changeIdError, setChangeIdError] = useState('');
  const [changeIdLoading, setChangeIdLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      getZone(id)
        .then(data => {
          setNarrative(data.narrative);
          setZoneId(data.id.toString());
          setQuestions(data.questions || []);
        })
        .catch(() => setError('Failed to load zone'));
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isEdit) {
        await updateZone(id, { narrative });
      } else {
        await createZone({ id: parseInt(zoneId), narrative });
      }
      navigate('/zones');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save zone');
      setLoading(false);
    }
  };

  const handleChangeId = async () => {
    setChangeIdError('');
    const parsed = parseInt(newIdValue);
    if (!parsed || parsed <= 0) {
      setChangeIdError('Please enter a valid positive integer');
      return;
    }
    setChangeIdLoading(true);
    try {
      await changeZoneId(parseInt(id), parsed);
      alert(`Zone ID changed from ${id} to ${parsed}`);
      navigate(`/zones/${parsed}/edit`);
    } catch (err) {
      setChangeIdError(err.response?.data?.error || 'Failed to change zone ID');
      setChangeIdLoading(false);
    }
  };

  const handleUnlinkQuestion = async (question) => {
    if (!confirm(`Remove Question ${question.id} from this zone?`)) return;
    try {
      await updateQuestion(question.id, {
        trailId: question.trailId,
        zoneId: null,
        question: question.question,
        type: question.type,
        options: question.options || [],
        bodyPartIds: question.bodyParts?.map(qbp => qbp.bodyPartId) || [],
      });
      setQuestions(questions.filter(q => q.id !== question.id));
    } catch {
      alert('Failed to unlink question');
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        {isEdit ? `Edit Zone ${id}` : 'Create Zone'}
      </h1>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">{error}</div>
      )}

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isEdit && (
            <Input
              label="Zone ID"
              type="number"
              value={zoneId}
              onChange={e => setZoneId(e.target.value)}
              placeholder="Enter a unique zone number"
              min="1"
              required
            />
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Narrative <span className="text-red-500">*</span>
            </label>
            <textarea
              value={narrative}
              onChange={e => setNarrative(e.target.value)}
              rows={5}
              required
              placeholder="Describe this zone to the user when they first arrive..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex space-x-3">
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : isEdit ? 'Update Zone' : 'Create Zone'}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate('/zones')}>
              Cancel
            </Button>
          </div>
        </form>
      </div>

      {isEdit && (
        <>
          {/* Questions in this zone */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Questions in this zone ({questions.length})
            </h2>
            {questions.length === 0 ? (
              <p className="text-gray-500 text-sm">No questions assigned to this zone yet.</p>
            ) : (
              <div className="divide-y divide-gray-100">
                {questions.map(q => (
                  <div key={q.id} className="py-3 flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        #{q.id} — {q.question}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        Trail: {q.trail?.name ?? '—'} · {q.type}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Button variant="outline" onClick={() => navigate(`/questions/${q.id}/edit`)}>
                        Edit
                      </Button>
                      <Button variant="danger" onClick={() => handleUnlinkQuestion(q)}>
                        Unlink
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Change Zone ID */}
          <div className="bg-white rounded-lg shadow p-6 border border-amber-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Change Zone ID</h2>
            <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded p-3 mb-4">
              Warning: This updates all linked questions and user visit records to use the new ID.
            </p>
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <Input
                  label="New Zone ID"
                  type="number"
                  value={newIdValue}
                  onChange={e => setNewIdValue(e.target.value)}
                  placeholder="Enter new ID number"
                  min="1"
                />
              </div>
              <Button type="button" variant="outline" onClick={handleChangeId} disabled={changeIdLoading}>
                {changeIdLoading ? 'Changing...' : 'Change ID'}
              </Button>
            </div>
            {changeIdError && <p className="text-red-600 text-sm mt-2">{changeIdError}</p>}
          </div>
        </>
      )}
    </div>
  );
}
