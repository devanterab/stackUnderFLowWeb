import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the client-only time ago component
const ClientTimeAgo = dynamic(
  () => import('./ClientOnlyTimeAgo'),
  { ssr: false }
);

interface TimeAgoProps {
  date: Date | string;
}

const TimeAgo: React.FC<TimeAgoProps> = ({ date }) => {
  // Render a placeholder during SSR and initial client render
  return <ClientTimeAgo date={date} />;
};

export default TimeAgo;