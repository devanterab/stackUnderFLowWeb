# StackUnderFlow

StackUnderFlow is a StackOverflow-like application built with Next.js. It allows users to ask questions, answer them, and participate in discussions through comments - all within a single-page application with in-memory data storage.

## Features

- User authentication (login/register)
- Browse questions with filtering by status
- Post new questions
- Update your own questions and change their status
- Participate in discussions through comments
- Responsive design for all device sizes

## Functional Requirements Implemented

### 1. Login System
- Simple login flow with any username/password
- Persistent login state until page refresh
- No real authentication backend required

### 2. Questions (Posts)
- Display a list of questions with title, description, status, and creation date
- Create new questions
- Edit questions you created
- Change the status of your own questions (open, answered, closed)
- Pre-populated sample questions on initial load

### 3. Comments
- Each question supports multiple comments
- Add new comments
- Edit your own comments
- Real-time UI updates without page reload

### 4. Navigation & UI
- Single page application
- Question list view and question detail view
- Basic styling with Tailwind CSS
- Responsive navigation

## Technologies Used

- Next.js 14 with App Router
- React 18
- TypeScript
- Tailwind CSS
- In-memory data storage

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
stackunderflow/
├── app/
│   ├── components/     # Reusable UI components
│   ├── contexts/       # React context providers
│   ├── login/          # Login page
│   ├── register/       # Registration page
│   ├── question/       # Question detail page
│   ├── ask/            # Ask question page
│   ├── services/       # Data management services
│   ├── types.ts        # Type definitions
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page (question list)
├── public/             # Static assets
└── package.json
```

## How to Use

1. Register or login to access all features
2. Browse questions on the home page
3. Click on any question to view details and comments
4. Use the "Ask Question" button to create a new question
5. Add comments to participate in discussions
6. Update your questions' status as needed
