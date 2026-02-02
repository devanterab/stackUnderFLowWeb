// types.ts
export interface User {
  id: string;
  username: string;
  email?: string;
}

export interface Comment {
  id: string;
  content: string;
  author: User;
  createdAt: Date;
  updatedAt: Date;
}

export interface Question {
  id: string;
  title: string;
  description: string;
  author: User;
  status: 'open' | 'answered' | 'closed';
  createdAt: Date;
  updatedAt: Date;
  comments: Comment[];
}