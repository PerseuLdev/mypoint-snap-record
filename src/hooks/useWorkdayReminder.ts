
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface WorkdayConfig {
  workHours: number;
  reminderEnabled: boolean;
  reminderOffsetMinutes: number;
}

interface TimeRecord {
  id: string;
  timestamp: string;
  type: 'entrada' | 'saida';
}

export const useWorkdayReminder = (timeRecords: TimeRecord[]) => {
  const [config, setConfig] = useState<WorkdayConfig>({
    workHours: 8,
    reminderEnabled: true,
    reminderOffsetMinutes: 15
  });
  const { toast } = useToast();

  // Load config from localStorage
  useEffect(() => {
    const savedConfig = localStorage.getItem('mypoint-workday-config');
    if (savedConfig) {
      setConfig(JSON.parse(savedConfig));
    }
  }, []);

  // Check if we should show workday reminder
  useEffect(() => {
    if (!config.reminderEnabled || timeRecords.length === 0) return;

    const checkWorkdayReminder = () => {
      const today = new Date();
      const todayStr = today.toDateString();
      
      // Get today's records
      const todayRecords = timeRecords.filter(record => {
        const recordDate = new Date(record.timestamp);
        return recordDate.toDateString() === todayStr;
      });

      // Find the first entry of the day
      const firstEntry = todayRecords
        .filter(record => record.type === 'entrada')
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())[0];

      if (!firstEntry) return;

      const entryTime = new Date(firstEntry.timestamp);
      const workdayEndTime = new Date(entryTime.getTime() + (config.workHours * 60 * 60 * 1000));
      const reminderTime = new Date(workdayEndTime.getTime() - (config.reminderOffsetMinutes * 60 * 1000));
      
      const now = new Date();
      
      // Check if it's time to remind and we haven't reminded recently
      if (now >= reminderTime && now <= workdayEndTime) {
        const lastReminder = localStorage.getItem('last-workday-reminder');
        const todayKey = today.toDateString();
        
        if (lastReminder !== todayKey) {
          // Check if user has already clocked out
          const hasExitToday = todayRecords.some(record => 
            record.type === 'saida' && 
            new Date(record.timestamp) > entryTime
          );
          
          if (!hasExitToday) {
            localStorage.setItem('last-workday-reminder', todayKey);
            
            const hoursWorked = Math.floor((now.getTime() - entryTime.getTime()) / (1000 * 60 * 60));
            const minutesLeft = Math.floor((workdayEndTime.getTime() - now.getTime()) / (1000 * 60));
            
            toast({
              title: "⏰ Lembrete de Jornada!",
              description: `Você já trabalhou ${hoursWorked}h. Restam ${minutesLeft} minutos para o fim da jornada. Não esqueça de bater o ponto de saída!`,
            });

            // Show browser notification if permission granted
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification('MyPoint - Fim da Jornada', {
                body: `Restam ${minutesLeft} minutos para o fim da jornada. Prepare-se para bater o ponto!`,
                icon: '/favicon.ico'
              });
            }
          }
        }
      }
    };

    // Check every minute
    const interval = setInterval(checkWorkdayReminder, 60000);
    
    // Check immediately
    checkWorkdayReminder();

    return () => clearInterval(interval);
  }, [config, timeRecords, toast]);

  return { config };
};
