import React, { useState, useEffect } from 'react';
import { Camera, Clock, MapPin, History, Settings, CheckCircle, AlertCircle, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import WelcomeScreen from '@/components/WelcomeScreen';
import CameraView from '@/components/CameraView';
import HistoryView from '@/components/HistoryView';
import SettingsView from '@/components/SettingsView';
import { useToast } from '@/hooks/use-toast';
import { useWorkdayReminder } from '@/hooks/useWorkdayReminder';

export interface TimeRecord {
  id: string;
  timestamp: string;
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  photo: string; // base64 encoded image
  type: 'entrada' | 'saida';
}

interface Alarm {
  id: string;
  time: string;
  type: 'saida_almoco' | 'volta_almoco';
  enabled: boolean;
  label: string;
}

const MyPointApp = () => {
  const [currentScreen, setCurrentScreen] = useState<'welcome' | 'main' | 'history' | 'settings'>('welcome');
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [timeRecords, setTimeRecords] = useState<TimeRecord[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [locationStatus, setLocationStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const { toast } = useToast();

  // Use workday reminder hook
  useWorkdayReminder(timeRecords);

  // Update time and check alarms
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      checkAlarms(now);
    }, 1000);

    return () => clearInterval(timer);
  }, [alarms]);

  // Load saved data from localStorage
  useEffect(() => {
    const savedRecords = localStorage.getItem('mypoint-records');
    if (savedRecords) {
      setTimeRecords(JSON.parse(savedRecords));
    }

    const savedAlarms = localStorage.getItem('mypoint-alarms');
    if (savedAlarms) {
      setAlarms(JSON.parse(savedAlarms));
    }
  }, []);

  // Check if any alarm should trigger
  const checkAlarms = (now: Date) => {
    const currentTimeString = now.toTimeString().slice(0, 5); // HH:MM format
    
    alarms.forEach(alarm => {
      if (alarm.enabled && alarm.time === currentTimeString) {
        // Check if we already notified for this minute
        const lastNotification = localStorage.getItem(`alarm-${alarm.id}-last`);
        const currentMinute = now.getTime();
        
        if (!lastNotification || currentMinute - parseInt(lastNotification) > 60000) {
          localStorage.setItem(`alarm-${alarm.id}-last`, currentMinute.toString());
          
          toast({
            title: "⏰ Alarme de Ponto!",
            description: `Hora do ${alarm.label.toLowerCase()}! Não se esqueça de registrar seu ponto.`,
          });

          // Show browser notification if permission granted
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('MyPoint - Alarme', {
              body: `Hora do ${alarm.label.toLowerCase()}! Registre seu ponto.`,
              icon: '/favicon.ico'
            });
          }
        }
      }
    });
  };

  // Request notification permission on app start
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Save records to localStorage
  const saveRecords = (records: TimeRecord[]) => {
    localStorage.setItem('mypoint-records', JSON.stringify(records));
    setTimeRecords(records);
  };

  const handlePermissionsGranted = () => {
    setPermissionsGranted(true);
    setCurrentScreen('main');
    setLocationStatus('success');
    toast({
      title: "Permissões concedidas!",
      description: "Agora você pode registrar seu ponto com segurança.",
    });
  };

  const handlePhotoCapture = (photoData: string) => {
    const newRecord: TimeRecord = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      location: {
        latitude: -23.5505 + (Math.random() - 0.5) * 0.01, // Simulate São Paulo area
        longitude: -46.6333 + (Math.random() - 0.5) * 0.01,
        address: "Rua Exemplo, 123 - São Paulo, SP"
      },
      photo: photoData,
      type: timeRecords.length % 2 === 0 ? 'entrada' : 'saida'
    };

    const updatedRecords = [newRecord, ...timeRecords];
    saveRecords(updatedRecords);

    toast({
      title: "Ponto registrado!",
      description: `${newRecord.type === 'entrada' ? 'Entrada' : 'Saída'} registrada com sucesso às ${new Date(newRecord.timestamp).toLocaleTimeString()}.`,
    });
  };

  const clearHistory = () => {
    localStorage.removeItem('mypoint-records');
    setTimeRecords([]);
    toast({
      title: "Histórico limpo",
      description: "Todos os registros foram removidos.",
    });
  };

  if (currentScreen === 'welcome') {
    return <WelcomeScreen onPermissionsGranted={handlePermissionsGranted} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-700 text-white p-4 shadow-lg">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="w-6 h-6" />
            <h1 className="text-xl font-bold">MyPoint</h1>
          </div>
          <div className="flex items-center space-x-2">
            {alarms.some(alarm => alarm.enabled) && (
              <Bell className="w-4 h-4 text-yellow-300" />
            )}
            <div className="text-sm">
              {currentTime.toLocaleTimeString()}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto">
        {currentScreen === 'main' && (
          <CameraView 
            onPhotoCapture={handlePhotoCapture}
            currentTime={currentTime}
            locationStatus={locationStatus}
            recordsCount={timeRecords.length}
            timeRecords={timeRecords}
          />
        )}

        {currentScreen === 'history' && (
          <HistoryView 
            records={timeRecords}
            onClearHistory={clearHistory}
          />
        )}

        {currentScreen === 'settings' && (
          <SettingsView 
            onClearHistory={clearHistory}
            recordsCount={timeRecords.length}
          />
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
        <div className="max-w-md mx-auto flex">
          <button
            onClick={() => setCurrentScreen('main')}
            className={`flex-1 py-3 px-4 flex flex-col items-center space-y-1 transition-colors ${
              currentScreen === 'main' 
                ? 'text-blue-700 bg-blue-50' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Camera className="w-6 h-6" />
            <span className="text-xs font-medium">Registrar</span>
          </button>
          
          <button
            onClick={() => setCurrentScreen('history')}
            className={`flex-1 py-3 px-4 flex flex-col items-center space-y-1 transition-colors ${
              currentScreen === 'history' 
                ? 'text-blue-700 bg-blue-50' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <History className="w-6 h-6" />
            <span className="text-xs font-medium">Histórico</span>
            {timeRecords.length > 0 && (
              <Badge variant="secondary" className="text-xs px-1 py-0">
                {timeRecords.length}
              </Badge>
            )}
          </button>
          
          <button
            onClick={() => setCurrentScreen('settings')}
            className={`flex-1 py-3 px-4 flex flex-col items-center space-y-1 transition-colors ${
              currentScreen === 'settings' 
                ? 'text-blue-700 bg-blue-50' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Settings className="w-6 h-6" />
            <span className="text-xs font-medium">Config</span>
            {alarms.some(alarm => alarm.enabled) && (
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
            )}
          </button>
        </div>
      </nav>
    </div>
  );
};

export default MyPointApp;
