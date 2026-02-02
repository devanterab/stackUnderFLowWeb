// services\DataService.ts
import { Question, User, Comment } from '../types';

class DataService {
  private questions: Question[] = [];
  private users: User[] = [];

  constructor() {
    // Initialize with sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Sample users
    const user1: User = {
      id: '1',
      username: 'john_doe',
      email: 'john@example.com'
    };

    const user2: User = {
      id: '2',
      username: 'jane_smith',
      email: 'jane@example.com'
    };

    this.users = [user1, user2];

    // Sample questions
    const sampleQuestions: Question[] = [
      {
        id: '1',
        title: 'How to center a div in CSS?',
        description: 'I am trying to center a div element horizontally and vertically in its parent container. What is the best way to achieve this using CSS?',
        author: user1,
        status: 'open',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        comments: [
          {
            id: '1',
            content: 'You can use flexbox to center the div easily.',
            author: user2,
            createdAt: new Date(Date.now() - 20 * 60 * 60 * 1000),
            updatedAt: new Date(Date.now() - 20 * 60 * 60 * 1000)
          },
          {
            id: '2',
            content: 'Another option is to use CSS Grid for more complex layouts.',
            author: user1,
            createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000),
            updatedAt: new Date(Date.now() - 18 * 60 * 60 * 1000)
          }
        ]
      },
      {
        id: '2',
        title: 'What is the difference between let and var in JavaScript?',
        description: 'I am learning JavaScript and I keep hearing about let and var. What are the differences between them and when should I use each?',
        author: user2,
        status: 'answered',
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
        updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
        comments: [
          {
            id: '3',
            content: 'The main difference is block scoping. let is block-scoped while var is function-scoped.',
            author: user1,
            createdAt: new Date(Date.now() - 10 * 60 * 60 * 1000),
            updatedAt: new Date(Date.now() - 10 * 60 * 60 * 1000)
          }
        ]
      },
      {
        id: '3',
        title: 'How to handle async/await in React hooks?',
        description: 'I am trying to use async/await inside a useEffect hook but I am getting an error. How can I properly handle asynchronous operations in React hooks?',
        author: user1,
        status: 'closed',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
        comments: []
      }
    ];

    this.questions = sampleQuestions;
  }

  // Question methods
  getAllQuestions(): Question[] {
    // Sort by most recent first
    return [...this.questions].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  getQuestionById(id: string): Question | undefined {
    return this.questions.find(q => q.id === id);
  }

  createQuestion(question: Omit<Question, 'id' | 'createdAt' | 'updatedAt' | 'comments'>): Question {
    const newQuestion: Question = {
      ...question,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
      comments: []
    };
    
    this.questions.push(newQuestion);
    return newQuestion;
  }

  updateQuestion(id: string, updates: Partial<Omit<Question, 'id' | 'author' | 'createdAt' | 'comments'>>): Question | undefined {
    const index = this.questions.findIndex(q => q.id === id);
    if (index !== -1) {
      this.questions[index] = {
        ...this.questions[index],
        ...updates,
        updatedAt: new Date()
      };
      return this.questions[index];
    }
    return undefined;
  }

  deleteQuestion(id: string): boolean {
    const initialLength = this.questions.length;
    this.questions = this.questions.filter(q => q.id !== id);
    return this.questions.length !== initialLength;
  }

  // Comment methods
  addCommentToQuestion(questionId: string, comment: Omit<Comment, 'id' | 'createdAt' | 'updatedAt'>): Comment | undefined {
    const question = this.getQuestionById(questionId);
    if (!question) return undefined;

    const newComment: Comment = {
      ...comment,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    question.comments.push(newComment);
    question.updatedAt = new Date();
    return newComment;
  }

  updateComment(questionId: string, commentId: string, content: string): Comment | undefined {
    const question = this.getQuestionById(questionId);
    if (!question) return undefined;

    const commentIndex = question.comments.findIndex(c => c.id === commentId);
    if (commentIndex !== -1) {
      question.comments[commentIndex] = {
        ...question.comments[commentIndex],
        content,
        updatedAt: new Date()
      };
      question.updatedAt = new Date();
      return question.comments[commentIndex];
    }
    return undefined;
  }

  deleteComment(questionId: string, commentId: string): boolean {
    const question = this.getQuestionById(questionId);
    if (!question) return false;

    const initialLength = question.comments.length;
    question.comments = question.comments.filter(c => c.id !== commentId);
    question.updatedAt = new Date();
    return question.comments.length !== initialLength;
  }

  // User methods
  getUserById(id: string): User | undefined {
    return this.users.find(u => u.id === id);
  }

  createUser(userData: Omit<User, 'id'>): User {
    const newUser: User = {
      ...userData,
      id: Date.now().toString()
    };
    
    this.users.push(newUser);
    return newUser;
  }
}

export const dataService = new DataService();