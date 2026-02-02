'use client';

import { useEffect, useState } from 'react';

interface TimeAgoProps {
  date: Date | string;
}

const TimeAgoComponent: React.FC<TimeAgoProps> = ({ date }) => {
  const [timeAgo, setTimeAgo] = useState<string>('');

  useEffect(() => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    setTimeAgo(dateObj.toLocaleString());
  }, [date]);

  if (!timeAgo) {
    return <span>...</span>;
  }

  return <span>{timeAgo}</span>;
};

export default TimeAgoComponent;