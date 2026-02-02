'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { dataService } from '../services/DataService';
import Link from 'next/link';

const AskQuestionPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto mt-10 p-6 card rounded-lg text-center">
        <h1 className="text-2xl font-bold mb-4">Please Log In</h1>
        <p className="text-gray-600 mb-6">You need to be logged in to ask a question.</p>
        <Link 
          href="/login" 
          className="text-blue-600 hover:underline inline-block px-4 py-2 bg-blue-100 rounded-md"
        >
          Login
        </Link>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      setError('Please fill in both title and description');
      return;
    }

    const newQuestion = dataService.createQuestion({
      title,
      description,
      author: user,
      status: 'open'
    });

    if (newQuestion) {
      router.push(`/question/${newQuestion.id}`);
      router.refresh(); // Refresh to update the UI
    } else {
      setError('Failed to create question. Please try again.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Link href="/" className="text-blue-600 hover:underline flex items-center">
          ← Back to Questions
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-gray-800 mb-6">Ask a Question</h1>

      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 bg-white"
            placeholder="Summarize your question in one sentence"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={8}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 bg-white"
            placeholder="Explain your problem in detail..."
          ></textarea>
        </div>

        <div className="flex justify-end space-x-4">
          <Link
            href="/"
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Submit Question
          </button>
        </div>
      </form>
    </div>
  );
};

export default AskQuestionPage;