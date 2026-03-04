import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getQuestion, createQuestion, updateQuestion, getTrails, getBodyParts } from '../../api';
import Input from '../../components/Input';
import Select from '../../components/Select';
import Button from '../../components/Button';

export default function QuestionForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    trailId: '',
    bodyPartIds: [],
    question: '',
    type: 'MCQ',
    options: [
      { description: '', correct: false },
      { description: '', correct: false },
      { description: '', correct: false },
      { description: '', correct: false }
    ]
  });
  const [trails, setTrails] = useState([]);
  const [bodyParts, setBodyParts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const [trailsData, bodyPartsData] = await Promise.all([
        getTrails(),
        getBodyParts()
      ]);

      setTrails(trailsData);
      setBodyParts(bodyPartsData);

      if (isEdit) {
        const questionData = await getQuestion(id);
        setFormData({
          trailId: questionData.trailId.toString(),
          bodyPartIds: questionData.bodyParts?.map(qbp => qbp.bodyPartId.toString()) || [],
          question: questionData.question,
          type: questionData.type,
          options: questionData.options
        });
      }
    } catch (error) {
      setError('Failed to load data');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    const hasCorrectAnswer = formData.options.some(opt => opt.correct);
    if (!hasCorrectAnswer) {
      setError('At least one option must be marked as correct');
      return;
    }

    setLoading(true);

    try {
      const data = {
        trailId: parseInt(formData.trailId),
        bodyPartIds: formData.bodyPartIds.map(id => parseInt(id)),
        question: formData.question,
        type: formData.type,
        options: formData.options.filter(opt => opt.description.trim() !== '')
      };

      if (isEdit) {
        await updateQuestion(id, data);
      } else {
        await createQuestion(data);
      }

      navigate('/questions');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save question');
      setLoading(false);
    }
  };

  const handleOptionChange = (index, field, value) => {
    const newOptions = [...formData.options];
    if (field === 'correct') {
      // For MCQ, only one option can be correct
      if (formData.type === 'MCQ') {
        newOptions.forEach((opt, i) => opt.correct = i === index);
      } else {
        newOptions[index].correct = value;
      }
    } else {
      newOptions[index][field] = value;
    }
    setFormData({ ...formData, options: newOptions });
  };

  const addOption = () => {
    setFormData({
      ...formData,
      options: [...formData.options, { description: '', correct: false }]
    });
  };

  const removeOption = (index) => {
    const newOptions = formData.options.filter((_, i) => i !== index);
    setFormData({ ...formData, options: newOptions });
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        {isEdit ? 'Edit Question' : 'Create Question'}
      </h1>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-danger rounded">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit}>
          <Select
            label="Trail"
            value={formData.trailId}
            onChange={(e) => setFormData({ ...formData, trailId: e.target.value })}
            options={trails.map(t => ({ value: t.id.toString(), label: t.name }))}
            required
          />

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Body Part Rewards (Optional)
            </label>
            <div className="max-h-48 overflow-y-auto border border-gray-300 rounded-md p-2">
              {bodyParts.map(bp => (
                <label key={bp.id} className="flex items-center gap-2 cursor-pointer py-1">
                  <input
                    type="checkbox"
                    checked={formData.bodyPartIds.includes(bp.id.toString())}
                    onChange={(e) => {
                      const bpId = bp.id.toString();
                      if (e.target.checked) {
                        setFormData({ ...formData, bodyPartIds: [...formData.bodyPartIds, bpId] });
                      } else {
                        setFormData({ ...formData, bodyPartIds: formData.bodyPartIds.filter(id => id !== bpId) });
                      }
                    }}
                    className="w-4 h-4 text-primary"
                  />
                  <span>{bp.forestFriend.name} - {bp.name} ({bp.rarity})</span>
                </label>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Question <span className="text-danger">*</span>
            </label>
            <textarea
              value={formData.question}
              onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              rows={3}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <Select
            label="Question Type"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            options={[
              { value: 'MCQ', label: 'Multiple Choice' },
              { value: 'OPEN', label: 'Open Answer' }
            ]}
            required
          />

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Options <span className="text-danger">*</span>
            </label>

            {formData.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  type={formData.type === 'MCQ' ? 'radio' : 'checkbox'}
                  checked={option.correct}
                  onChange={(e) => handleOptionChange(index, 'correct', e.target.checked)}
                  name="correctOption"
                  className="w-4 h-4 text-primary"
                />
                <input
                  type="text"
                  value={option.description}
                  onChange={(e) => handleOptionChange(index, 'description', e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                />
                {formData.options.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeOption(index)}
                    className="text-danger hover:text-red-700"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}

            <Button type="button" variant="outline" onClick={addOption} className="mt-2">
              Add Option
            </Button>
          </div>

          <div className="flex space-x-3">
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : isEdit ? 'Update Question' : 'Create Question'}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate('/questions')}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
