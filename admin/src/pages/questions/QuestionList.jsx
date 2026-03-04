import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getQuestions, deleteQuestion } from '../../api';
import Table from '../../components/Table';
import Button from '../../components/Button';
import ConfirmDialog from '../../components/ConfirmDialog';

export default function QuestionList() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      const data = await getQuestions();
      setQuestions(data);
    } catch (error) {
      console.error('Failed to load questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteQuestion(deleteConfirm.id);
      setQuestions(questions.filter(q => q.id !== deleteConfirm.id));
      setDeleteConfirm(null);
    } catch (error) {
      alert('Failed to delete question: ' + error.message);
    }
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'question', label: 'Question', render: (row) => row.question.substring(0, 60) + '...' },
    { key: 'trail', label: 'Trail', render: (row) => row.trail.name },
    { key: 'type', label: 'Type' },
    { key: 'bodyParts', label: 'Rewards', render: (row) => row.bodyParts && row.bodyParts.length > 0 ? row.bodyParts.map(qbp => `${qbp.bodyPart.forestFriend.name} - ${qbp.bodyPart.name}`).join(', ') : 'None' }
  ];

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Questions</h1>
        <Link to="/questions/new">
          <Button>Create Question</Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table
          columns={columns}
          data={questions}
          onEdit={(question) => navigate(`/questions/${question.id}/edit`)}
          onDelete={(question) => setDeleteConfirm(question)}
        />
      </div>

      <ConfirmDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleDelete}
        title="Delete Question"
        message={`Are you sure you want to delete this question?`}
      />
    </div>
  );
}
