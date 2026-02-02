'use client';

import { useState, useEffect } from 'react';
import { useAuth } from './contexts/AuthContext';
import { dataService } from './services/DataService';
import { Question } from './types';
import Link from 'next/link';
import TimeAgo from './components/TimeAgo';

const QuestionsPage = () => {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'open' | 'answered' | 'closed'>('all');

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const allQuestions = dataService.getAllQuestions();
        setQuestions(allQuestions);
      } catch (error) {
        console.error('Error fetching questions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const filteredQuestions = questions.filter(q => 
    filter === 'all' || q.status === filter
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-800';
      case 'answered': return 'bg-blue-100 text-blue-800';
      case 'closed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Questions</h1>
        {user && (
          <Link
            href="/ask"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Ask Question
          </Link>
        )}
      </div>

      <div className="mb-6 flex space-x-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1 rounded-md ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('open')}
          className={`px-3 py-1 rounded-md ${filter === 'open' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          Open
        </button>
        <button
          onClick={() => setFilter('answered')}
          className={`px-3 py-1 rounded-md ${filter === 'answered' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          Answered
        </button>
        <button
          onClick={() => setFilter('closed')}
          className={`px-3 py-1 rounded-md ${filter === 'closed' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          Closed
        </button>
      </div>

      {filteredQuestions.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 text-lg">No questions found</p>
          {user && (
            <p className="mt-2">
              <Link href="/ask" className="text-blue-600 hover:underline">
                Be the first to ask a question!
              </Link>
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredQuestions.map((question) => (
            <div
              key={question.id}
              className="card border rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <Link href={`/question/${question.id}`} className="text-xl font-semibold text-blue-600 hover:underline">
                    {question.title}
                  </Link>
                  <p className="mt-2 text-gray-600 line-clamp-2">
                    {question.description}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(question.status)}`}>
                  {question.status.charAt(0).toUpperCase() + question.status.slice(1)}
                </span>
              </div>
              
              <div className="mt-4 flex items-center text-sm text-gray-500">
                <span>Asked by {question.author.username}</span>
                <span className="mx-2">•</span>
                <TimeAgo date={question.createdAt} />
                <span className="mx-2">•</span>
                <span>{question.comments.length} {question.comments.length === 1 ? 'comment' : 'comments'}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuestionsPage;