import { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import HomeView from '../components/HomeView';
import HistoryView from '../components/HistoryView';
import AdvancedHistoryView from '../components/AdvancedHistoryView';
import CalendarFilterView from '../components/CalendarFilterView';
import TrashView from '../components/TrashView';
import StepRegistrationView from '../components/StepRegistrationView';
import SettingsView from '../components/SettingsView';
import AdvancedPreferencesView from '../components/AdvancedPreferencesView';
import UserProfileView from '../components/UserProfileView';
import ProfileView from '../components/ProfileView';
import ShiftTypesView from '../components/ShiftTypesView';
import ShiftTypeManagementView from '../components/ShiftTypeManagementView';
import AlarmsView from '../components/AlarmsView';
import AttestadoView from '../components/AttestadoView';
import OcorrenciaView from '../components/OcorrenciaView';
import WelcomeScreen from '../components/WelcomeScreen';
import { TimeRecord, ShiftType, AttestadoRecord, OcorrenciaRecord, Alarm } from '@/types';
import { useWorkdayReminder } from '@/hooks/useWorkdayReminder';
import { useToast } from '@/hooks/use-toast';

const queryClient = new QueryClient();

export type ViewType = 
  | 'home' 
  | 'history' 
  | 'advanced-history'
  | 'calendar-filter'
  | 'trash'
  | 'registration'
  | 'settings'
  | 'advanced-preferences'
  | 'user-profile'
  | 'profile'
  | 'shift-types'
  | 'shift-management'
  | 'alarms'
  | 'attestado'
  | 'ocorrencia'
  | 'welcome';

const Index = () => {
  const [currentView, setCurrentView] = useState<ViewType>('welcome');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [locationStatus, setLocationStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [timeRecords, setTimeRecords] = useState<TimeRecord[]>([]);
  const [shiftTypes, setShiftTypes] = useState<ShiftType[]>([]);
  const [attestadoRecords, setAttestadoRecords] = useState<AttestadoRecord[]>([]);
  const [ocorrenciaRecords, setOcorrenciaRecords] = useState<OcorrenciaRecord[]>([]);
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const checkOnboarding = () => {
      const savedPrefs = localStorage.getItem('mypoint-preferences');
      if (savedPrefs) {
        const preferences = JSON.parse(savedPrefs);
        if (!preferences.hasCompletedOnboarding) {
          setCurrentView('welcome');
        } else {
          setCurrentView('home');
        }
      } else {
        setCurrentView('welcome');
      }
    };

    checkOnboarding();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const updateLocation = () => {
      setLocationStatus('loading');
      
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          () => {
            setLocationStatus('success');
          },
          () => {
            setLocationStatus('error');
          },
          { timeout: 10000 }
        );
      } else {
        setLocationStatus('error');
      }
    };

    updateLocation();
    const locationInterval = setInterval(updateLocation, 30000);

    return () => clearInterval(locationInterval);
  }, []);

  useEffect(() => {
    const loadData = () => {
      const savedRecords = localStorage.getItem('mypoint-time-records');
      if (savedRecords) {
        setTimeRecords(JSON.parse(savedRecords));
      }

      const savedShiftTypes = localStorage.getItem('mypoint-shift-types');
      if (savedShiftTypes) {
        setShiftTypes(JSON.parse(savedShiftTypes));
      }

      const savedAttestados = localStorage.getItem('mypoint-attestado-records');
      if (savedAttestados) {
        setAttestadoRecords(JSON.parse(savedAttestados));
      }

      const savedOcorrencias = localStorage.getItem('mypoint-ocorrencia-records');
      if (savedOcorrencias) {
        setOcorrenciaRecords(JSON.parse(savedOcorrencias));
      }

      const savedAlarms = localStorage.getItem('mypoint-alarms');
      if (savedAlarms) {
        setAlarms(JSON.parse(savedAlarms));
      }
    };

    loadData();
  }, []);

  useWorkdayReminder(timeRecords);

  const getActiveShiftType = (): ShiftType | undefined => {
    const today = new Date().toDateString();
    const todayRecords = timeRecords.filter(record => 
      new Date(record.timestamp).toDateString() === today && !record.deleted
    ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    if (todayRecords.length === 0) return undefined;

    const lastRecord = todayRecords[todayRecords.length - 1];
    return shiftTypes.find(st => st.id === lastRecord.shiftType);
  };

  const handlePhotoCapture = async (photoData: string, type: TimeRecord['type']) => {
    try {
      let location = { latitude: 0, longitude: 0, address: 'Localização não disponível' };
      
      if (navigator.geolocation) {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
        });
        
        location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          address: `${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`
        };
      }

      const newRecord: TimeRecord = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        location,
        photo: photoData,
        type,
        shiftType: getActiveShiftType()?.id
      };

      const updatedRecords = [...timeRecords, newRecord];
      setTimeRecords(updatedRecords);
      localStorage.setItem('mypoint-time-records', JSON.stringify(updatedRecords));

      toast({
        title: "Ponto registrado!",
        description: `${type === 'entrada' ? 'Entrada' : type === 'pausa_inicio' ? 'Início da pausa' : type === 'pausa_fim' ? 'Fim da pausa' : 'Saída'} registrada com sucesso.`,
      });

      setCurrentView('home');
    } catch (error) {
      toast({
        title: "Erro ao registrar ponto",
        description: "Não foi possível obter a localização. Tente novamente.",
      });
    }
  };

  const handleDeleteRecord = (id: string) => {
    const updatedRecords = timeRecords.map(record => 
      record.id === id 
        ? { ...record, deleted: true, deletedAt: new Date().toISOString() }
        : record
    );
    setTimeRecords(updatedRecords);
    localStorage.setItem('mypoint-time-records', JSON.stringify(updatedRecords));
    
    toast({
      title: "Registro excluído",
      description: "O registro foi movido para a lixeira.",
    });
  };

  const handleRestoreRecord = (id: string) => {
    const updatedRecords = timeRecords.map(record => 
      record.id === id 
        ? { ...record, deleted: false, deletedAt: undefined }
        : record
    );
    setTimeRecords(updatedRecords);
    localStorage.setItem('mypoint-time-records', JSON.stringify(updatedRecords));
    
    toast({
      title: "Registro restaurado",
      description: "O registro foi restaurado com sucesso.",
    });
  };

  const handlePermanentDelete = (id: string) => {
    const updatedRecords = timeRecords.filter(record => record.id !== id);
    setTimeRecords(updatedRecords);
    localStorage.setItem('mypoint-time-records', JSON.stringify(updatedRecords));
    
    toast({
      title: "Registro excluído permanentemente",
      description: "O registro foi removido definitivamente.",
    });
  };

  const handleCreateShiftType = (shiftType: Omit<ShiftType, 'id'>) => {
    const newShiftType: ShiftType = {
      ...shiftType,
      id: Date.now().toString()
    };
    
    const updatedShiftTypes = [...shiftTypes, newShiftType];
    setShiftTypes(updatedShiftTypes);
    localStorage.setItem('mypoint-shift-types', JSON.stringify(updatedShiftTypes));
    
    toast({
      title: "Tipo de turno criado!",
      description: `O turno "${shiftType.name}" foi criado com sucesso.`,
    });
  };

  const handleUpdateShiftType = (id: string, updates: Partial<ShiftType>) => {
    const updatedShiftTypes = shiftTypes.map(st => 
      st.id === id ? { ...st, ...updates } : st
    );
    setShiftTypes(updatedShiftTypes);
    localStorage.setItem('mypoint-shift-types', JSON.stringify(updatedShiftTypes));
    
    toast({
      title: "Tipo de turno atualizado!",
      description: "As alterações foram salvas com sucesso.",
    });
  };

  const handleDeleteShiftType = (id: string) => {
    const updatedShiftTypes = shiftTypes.filter(st => st.id !== id);
    setShiftTypes(updatedShiftTypes);
    localStorage.setItem('mypoint-shift-types', JSON.stringify(updatedShiftTypes));
    
    toast({
      title: "Tipo de turno excluído",
      description: "O tipo de turno foi removido com sucesso.",
    });
  };

  const handleCreateAttestado = (attestado: Omit<AttestadoRecord, 'id' | 'timestamp'>) => {
    const newAttestado: AttestadoRecord = {
      ...attestado,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    };
    
    const updatedAttestados = [...attestadoRecords, newAttestado];
    setAttestadoRecords(updatedAttestados);
    localStorage.setItem('mypoint-attestado-records', JSON.stringify(updatedAttestados));
    
    toast({
      title: "Atestado registrado!",
      description: "O atestado foi salvo com sucesso.",
    });
  };

  const handleCreateOcorrencia = (ocorrencia: Omit<OcorrenciaRecord, 'id' | 'timestamp'>) => {
    const newOcorrencia: OcorrenciaRecord = {
      ...ocorrencia,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    };
    
    const updatedOcorrencias = [...ocorrenciaRecords, newOcorrencia];
    setOcorrenciaRecords(updatedOcorrencias);
    localStorage.setItem('mypoint-ocorrencia-records', JSON.stringify(updatedOcorrencias));
    
    toast({
      title: "Ocorrência registrada!",
      description: "A ocorrência foi salva com sucesso.",
    });
  };

  const handleCreateAlarm = (alarm: Omit<Alarm, 'id'>) => {
    const newAlarm: Alarm = {
      ...alarm,
      id: Date.now().toString()
    };
    
    const updatedAlarms = [...alarms, newAlarm];
    setAlarms(updatedAlarms);
    localStorage.setItem('mypoint-alarms', JSON.stringify(updatedAlarms));
    
    toast({
      title: "Alarme criado!",
      description: `Alarme "${alarm.name}" foi criado com sucesso.`,
    });
  };

  const handleUpdateAlarm = (id: string, updates: Partial<Alarm>) => {
    const updatedAlarms = alarms.map(alarm => 
      alarm.id === id ? { ...alarm, ...updates } : alarm
    );
    setAlarms(updatedAlarms);
    localStorage.setItem('mypoint-alarms', JSON.stringify(updatedAlarms));
    
    toast({
      title: "Alarme atualizado!",
      description: "As alterações foram salvas com sucesso.",
    });
  };

  const handleDeleteAlarm = (id: string) => {
    const updatedAlarms = alarms.filter(alarm => alarm.id !== id);
    setAlarms(updatedAlarms);
    localStorage.setItem('mypoint-alarms', JSON.stringify(updatedAlarms));
    
    toast({
      title: "Alarme excluído",
      description: "O alarme foi removido com sucesso.",
    });
  };

  const handleExportData = () => {
    const data = {
      timeRecords,
      shiftTypes,
      attestadoRecords,
      ocorrenciaRecords,
      alarms,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mypoint-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Dados exportados!",
      description: "O backup foi salvo com sucesso.",
    });
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'welcome':
        return (
          <WelcomeScreen 
            onComplete={() => setCurrentView('home')}
          />
        );
        
      case 'home':
        return (
          <HomeView
            onNavigate={setCurrentView}
            timeRecords={timeRecords}
            currentTime={currentTime}
            locationStatus={locationStatus}
            shiftTypes={shiftTypes}
            activeShiftType={getActiveShiftType()}
          />
        );
        
      case 'registration':
        return (
          <StepRegistrationView
            onPhotoCapture={handlePhotoCapture}
            currentTime={currentTime}
            locationStatus={locationStatus}
            timeRecords={timeRecords}
            shiftTypes={shiftTypes}
            activeShiftType={getActiveShiftType()}
          />
        );
        
      case 'history':
        return (
          <HistoryView
            onBack={() => setCurrentView('home')}
            onAdvancedView={() => setCurrentView('advanced-history')}
            onDeleteRecord={handleDeleteRecord}
            timeRecords={timeRecords.filter(record => !record.deleted)}
          />
        );
        
      case 'advanced-history':
        return (
          <AdvancedHistoryView
            onBack={() => setCurrentView('history')}
            onCalendarFilter={() => setCurrentView('calendar-filter')}
            timeRecords={timeRecords.filter(record => !record.deleted)}
          />
        );
        
      case 'calendar-filter':
        return (
          <CalendarFilterView
            onBack={() => setCurrentView('advanced-history')}
            timeRecords={timeRecords.filter(record => !record.deleted)}
          />
        );
        
      case 'trash':
        return (
          <TrashView
            onBack={() => setCurrentView('home')}
            onRestoreRecord={handleRestoreRecord}
            onPermanentDelete={handlePermanentDelete}
            deletedRecords={timeRecords.filter(record => record.deleted)}
          />
        );
        
      case 'settings':
        return (
          <SettingsView
            onBack={() => setCurrentView('home')}
            onAdvancedPreferences={() => setCurrentView('advanced-preferences')}
            onUserProfile={() => setCurrentView('user-profile')}
          />
        );
        
      case 'advanced-preferences':
        return (
          <AdvancedPreferencesView
            onBack={() => setCurrentView('settings')}
            onExportData={handleExportData}
          />
        );
        
      case 'user-profile':
        return (
          <UserProfileView
            onBack={() => setCurrentView('settings')}
            onProfile={() => setCurrentView('profile')}
          />
        );
        
      case 'profile':
        return (
          <ProfileView
            onBack={() => setCurrentView('user-profile')}
          />
        );
        
      case 'shift-types':
        return (
          <ShiftTypesView
            onBack={() => setCurrentView('home')}
            shiftTypes={shiftTypes}
            onManageShiftTypes={() => setCurrentView('shift-management')}
            onManageAlarms={() => setCurrentView('alarms')}
          />
        );
        
      case 'shift-management':
        return (
          <ShiftTypeManagementView
            onBack={() => setCurrentView('shift-types')}
            shiftTypes={shiftTypes}
            onCreateShiftType={handleCreateShiftType}
            onUpdateShiftType={handleUpdateShiftType}
            onDeleteShiftType={handleDeleteShiftType}
          />
        );
        
      case 'alarms':
        return (
          <AlarmsView
            onBack={() => setCurrentView('shift-types')}
            alarms={alarms}
            onCreateAlarm={handleCreateAlarm}
            onUpdateAlarm={handleUpdateAlarm}
            onDeleteAlarm={handleDeleteAlarm}
          />
        );
        
      case 'attestado':
        return (
          <AttestadoView
            onBack={() => setCurrentView('home')}
            onCreateAttestado={handleCreateAttestado}
            attestadoRecords={attestadoRecords}
          />
        );
        
      case 'ocorrencia':
        return (
          <OcorrenciaView
            onBack={() => setCurrentView('home')}
            onCreateOcorrencia={handleCreateOcorrencia}
            ocorrenciaRecords={ocorrenciaRecords}
          />
        );
        
      default:
        return (
          <HomeView
            onNavigate={setCurrentView}
            timeRecords={timeRecords}
            currentTime={currentTime}
            locationStatus={locationStatus}
            shiftTypes={shiftTypes}
            activeShiftType={getActiveShiftType()}
          />
        );
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <div className="min-h-screen bg-background">
          {renderCurrentView()}
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default Index;
