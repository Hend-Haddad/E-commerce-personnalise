// src/components/ui/CountdownTimer.jsx
import React, { useState, useEffect } from 'react';

const CountdownTimer = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(targetDate) - new Date();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="flex space-x-4">
      <div className="text-center">
        <span className="text-2xl font-bold text-gray-800">{timeLeft.days}</span>
        <span className="block text-xs text-gray-500">Days</span>
      </div>
      <div className="text-center">
        <span className="text-2xl font-bold text-gray-800">{timeLeft.hours}</span>
        <span className="block text-xs text-gray-500">Hours</span>
      </div>
      <div className="text-center">
        <span className="text-2xl font-bold text-gray-800">{timeLeft.minutes}</span>
        <span className="block text-xs text-gray-500">Minutes</span>
      </div>
      <div className="text-center">
        <span className="text-2xl font-bold text-gray-800">{timeLeft.seconds}</span>
        <span className="block text-xs text-gray-500">Seconds</span>
      </div>
    </div>
  );
};

export default CountdownTimer;