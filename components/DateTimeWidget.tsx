
import React, { useState, useEffect } from 'react';

export const DateTimeWidget: React.FC = () => {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => setDate(new Date()), 1000);
    return () => clearInterval(timerId);
  }, []);

  const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  const day = date.toLocaleDateString([], { weekday: 'long' });
  const fullDate = date.toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div className="bg-white dark:bg-gray-900 p-3 md:p-4 text-center rounded-lg shadow-sm">
      <p className="text-3xl md:text-5xl font-extrabold text-gray-800 dark:text-white tracking-tighter">
        {time}
      </p>
      <p className="text-lg font-semibold text-red-600 dark:text-red-500">{day}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400">{fullDate}</p>
    </div>
  );
};
