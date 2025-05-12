
import { useState, useEffect } from 'react';

const RealTimeClock = () => {
  const [dateTime, setDateTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => {
      setDateTime(new Date());
    }, 1000);
    
    return () => {
      clearInterval(timer);
    };
  }, []);
  
  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'short',
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    };
    return date.toLocaleDateString('en-US', options);
  };
  
  const formatTime = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    };
    return date.toLocaleTimeString('en-US', options);
  };
  
  return (
    <div className="text-sm text-muted-foreground">
      <span>{formatDate(dateTime)} | {formatTime(dateTime)}</span>
    </div>
  );
};

export default RealTimeClock;
