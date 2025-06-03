
import { useState, useEffect } from 'react';

interface TimeRecord {
  id: string;
  timestamp: string;
  type: 'entrada' | 'saida';
}

interface WorkdayConfig {
  workHours: number;
  reminderEnabled: boolean;
  reminderOffsetMinutes: number;
}

export const useWorkdayTimer = (timeRecords: TimeRecord[]) => {
  const [timeRemaining, setTimeRemaining] = useState<string>('--:--');
  const [workdayStarted, setWorkdayStarted] = useState(false);

  useEffect(() => {
    const updateTimer = () => {
      const savedConfig = localStorage.getItem('mypoint-workday-config');
      const config: WorkdayConfig = savedConfig ? JSON.parse(savedConfig) : {
        workHours: 8,
        reminderEnabled: true,
        reminderOffsetMinutes: 15
      };

      const today = new Date();
      const todayStr = today.toDateString();
      
      const todayRecords = timeRecords.filter(record => {
        const recordDate = new Date(record.timestamp);
        return recordDate.toDateString() === todayStr;
      });

      const firstEntry = todayRecords
        .filter(record => record.type === 'entrada')
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())[0];

      if (!firstEntry) {
        setTimeRemaining('--:--');
        setWorkdayStarted(false);
        return;
      }

      const entryTime = new Date(firstEntry.timestamp);
      const hasExitToday = todayRecords.some(record => 
        record.type === 'saida' && 
        new Date(record.timestamp) > entryTime
      );

      if (hasExitToday) {
        setTimeRemaining('--:--');
        setWorkdayStarted(false);
        return;
      }

      const workdayEndTime = new Date(entryTime.getTime() + (config.workHours * 60 * 60 * 1000));
      const now = new Date();
      
      const remainingTime = workdayEndTime.getTime() - now.getTime();
      
      if (remainingTime <= 0) {
        setTimeRemaining('Vencido');
        setWorkdayStarted(true);
        return;
      }

      const hours = Math.floor(remainingTime / (1000 * 60 * 60));
      const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
      
      setTimeRemaining(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`);
      setWorkdayStarted(true);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000);
    
    return () => clearInterval(interval);
  }, [timeRecords]);

  return { timeRemaining, workdayStarted };
};
