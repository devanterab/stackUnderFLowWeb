'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { dataService } from '../../services/DataService';
import { Question } from '../../types';
import Link from 'next/link';
import TimeAgo from '../../components/TimeAgo';

const QuestionDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        if (typeof id === 'string') {
          const foundQuestion = dataService.getQuestionById(id);
          if (foundQuestion) {
            setQuestion(foundQuestion);
          } else {
            router.push('/');
          }
        }
      } catch (error) {
        console.error('Error fetching question:', error);
        router.push('/');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchQuestion();
    }
  }, [id, router]);

  const handleAddComment = () => {
    if (!user) {
      alert('Please log in to add a comment');
      return;
    }

    if (!newComment.trim()) {
      alert('Comment cannot be empty');
      return;
    }

    if (question) {
      const comment = dataService.addCommentToQuestion(question.id, {
        content: newComment,
        author: user,
      });

      if (comment) {
        // Update the local state by fetching the updated question from the service
        // This prevents duplicate comments due to double state updates
        const updatedQuestion = dataService.getQuestionById(question.id);
        if (updatedQuestion) {
          setQuestion(updatedQuestion);
        }
        setNewComment('');
      }
    }
  };

  const handleUpdateStatus = (newStatus: 'open' | 'answered' | 'closed') => {
    if (!user || !question || question.author.id !== user.id) {
      alert('You can only update the status of your own questions');
      return;
    }

    const updatedQuestion = dataService.updateQuestion(question.id, { status: newStatus });
    if (updatedQuestion) {
      setQuestion(updatedQuestion);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Question not found</h2>
        <Link href="/" className="text-blue-600 hover:underline">
          Back to Questions
        </Link>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-800';
      case 'answered': return 'bg-blue-100 text-blue-800';
      case 'closed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="mb-6">
        <Link href="/" className="text-blue-600 hover:underline flex items-center">
          ← Back to Questions
        </Link>
      </div>

      <article className="card border rounded-lg p-6">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-2xl font-bold text-gray-800">{question.title}</h1>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(question.status)}`}>
            {question.status.charAt(0).toUpperCase() + question.status.slice(1)}
          </span>
        </div>

        <div className="prose max-w-none mb-6">
          <p className="text-gray-700 whitespace-pre-line">{question.description}</p>
        </div>

        <div className="flex items-center text-sm text-gray-500 mb-6">
          <span>Asked by {question.author.username}</span>
          <span className="mx-2">•</span>
          <TimeAgo date={question.createdAt} />
          {question.updatedAt.getTime() !== question.createdAt.getTime() && (
            <>
              <span className="mx-2">•</span>
              Updated <TimeAgo date={question.updatedAt} />
            </>
          )}
        </div>

        {/* Status update buttons for the author */}
        {user && user.id === question.author.id && (
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-700 mb-2">Update question status:</p>
            <div className="flex space-x-2">
              <button
                onClick={() => handleUpdateStatus('open')}
                className={`px-3 py-1 text-sm rounded-md ${
                  question.status === 'open'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Open
              </button>
              <button
                onClick={() => handleUpdateStatus('answered')}
                className={`px-3 py-1 text-sm rounded-md ${
                  question.status === 'answered'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Answered
              </button>
              <button
                onClick={() => handleUpdateStatus('closed')}
                className={`px-3 py-1 text-sm rounded-md ${
                  question.status === 'closed'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Closed
              </button>
            </div>
          </div>
        )}

        {/* Comments section */}
        <section className="border-t pt-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Comments ({question.comments.length})
          </h2>

          {question.comments.length > 0 ? (
            <div className="space-y-4 mb-6">
              {question.comments.map((comment) => (
                <div key={comment.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                  <div className="flex justify-between items-start">
                    <p className="text-gray-800">{comment.content}</p>
                    {user && user.id === comment.author.id && (
                      <span className="text-xs text-gray-500 ml-2">• Your comment</span>
                    )}
                  </div>
                  <div className="flex items-center text-xs text-gray-500 mt-1">
                    <span>By {comment.author.username}</span>
                    <span className="mx-2">•</span>
                    <TimeAgo date={comment.createdAt} />
                    {comment.updatedAt.getTime() !== comment.createdAt.getTime() && (
                      <>
                        <span className="mx-2">•</span>
                        <span>Edited</span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic mb-6">No comments yet. Be the first to comment!</p>
          )}

          {/* Add comment form */}
          {user ? (
            <div className="mt-6">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 bg-white"
                rows={3}
              />
              <div className="mt-2 flex justify-end">
                <button
                  onClick={handleAddComment}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Add Comment
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-6 text-center">
              <p className="text-gray-600 mb-2">Log in to add a comment</p>
              <Link 
                href="/login" 
                className="text-blue-600 hover:underline inline-block px-4 py-2 bg-gray-100 rounded-md"
              >
                Login
              </Link>
            </div>
          )}
        </section>
      </article>
    </div>
  );
};

export default QuestionDetailPage;