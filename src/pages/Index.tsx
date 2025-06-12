
import React, { useState, useEffect } from 'react';
import { Calendar, History, User, Home } from 'lucide-react';
import HomeView from '@/components/HomeView';
import CameraView from '@/components/CameraView';
import AdvancedHistoryView from '@/components/AdvancedHistoryView';
import ShiftTypesView from '@/components/ShiftTypesView';
import UserProfileView from '@/components/UserProfileView';
import WelcomeScreen from '@/components/WelcomeScreen';
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
  photo: string;
  type: 'entrada' | 'saida';
}

const MyPointApp = () => {
  const [currentScreen, setCurrentScreen] = useState<'welcome' | 'home' | 'registrar' | 'historico' | 'jornada' | 'perfil'>('welcome');
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [timeRecords, setTimeRecords] = useState<TimeRecord[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [locationStatus, setLocationStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const { toast } = useToast();

  useWorkdayReminder(timeRecords);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const savedRecords = localStorage.getItem('mypoint-records');
    if (savedRecords) {
      setTimeRecords(JSON.parse(savedRecords));
    }
  }, []);

  const saveRecords = (records: TimeRecord[]) => {
    localStorage.setItem('mypoint-records', JSON.stringify(records));
    setTimeRecords(records);
  };

  const handlePermissionsGranted = () => {
    setPermissionsGranted(true);
    setCurrentScreen('home');
    setLocationStatus('success');
    toast({
      title: "Permissões concedidas!",
      description: "Agora você pode usar todas as funcionalidades do app.",
    });
  };

  const handlePhotoCapture = (photoData: string) => {
    const newRecord: TimeRecord = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      location: {
        latitude: -23.5505 + (Math.random() - 0.5) * 0.01,
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
      description: `${newRecord.type === 'entrada' ? 'Entrada' : 'Saída'} registrada com sucesso.`,
    });

    // Navigate back to home after successful registration
    setCurrentScreen('home');
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
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <main className="max-w-md mx-auto">
        {currentScreen === 'home' && (
          <HomeView 
            onNavigateToRegistrar={() => setCurrentScreen('registrar')}
            recordsCount={timeRecords.length}
          />
        )}

        {currentScreen === 'registrar' && (
          <CameraView 
            onPhotoCapture={handlePhotoCapture}
            currentTime={currentTime}
            locationStatus={locationStatus}
            recordsCount={timeRecords.length}
            timeRecords={timeRecords}
          />
        )}

        {currentScreen === 'historico' && (
          <AdvancedHistoryView 
            records={timeRecords}
            onBack={() => setCurrentScreen('home')}
          />
        )}

        {currentScreen === 'jornada' && (
          <ShiftTypesView 
            onBack={() => setCurrentScreen('home')}
          />
        )}

        {currentScreen === 'perfil' && (
          <UserProfileView 
            onBack={() => setCurrentScreen('home')}
          />
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
        <div className="max-w-md mx-auto flex">
          <button
            onClick={() => setCurrentScreen('home')}
            className={`flex-1 py-3 px-4 flex flex-col items-center space-y-1 transition-colors ${
              currentScreen === 'home' 
                ? 'text-primary bg-primary/10' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-xs font-medium">Início</span>
          </button>
          
          <button
            onClick={() => setCurrentScreen('historico')}
            className={`flex-1 py-3 px-4 flex flex-col items-center space-y-1 transition-colors ${
              currentScreen === 'historico' 
                ? 'text-primary bg-primary/10' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <History className="w-5 h-5" />
            <span className="text-xs font-medium">Registros</span>
          </button>
          
          <button
            onClick={() => setCurrentScreen('jornada')}
            className={`flex-1 py-3 px-4 flex flex-col items-center space-y-1 transition-colors ${
              currentScreen === 'jornada' 
                ? 'text-primary bg-primary/10' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Calendar className="w-5 h-5" />
            <span className="text-xs font-medium">Jornada</span>
          </button>

          <button
            onClick={() => setCurrentScreen('perfil')}
            className={`flex-1 py-3 px-4 flex flex-col items-center space-y-1 transition-colors ${
              currentScreen === 'perfil' 
                ? 'text-primary bg-primary/10' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-xs font-medium">Perfil</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default MyPointApp;
