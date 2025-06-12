
import React, { useState, useEffect } from 'react';
import { Calendar, History, User, Home, FileText, AlertTriangle, Trash2 } from 'lucide-react';
import HomeView from '@/components/HomeView';
import StepRegistrationView from '@/components/StepRegistrationView';
import AdvancedHistoryView from '@/components/AdvancedHistoryView';
import ShiftTypesView from '@/components/ShiftTypesView';
import UserProfileView from '@/components/UserProfileView';
import AttestadoView from '@/components/AttestadoView';
import OcorrenciaView from '@/components/OcorrenciaView';
import TrashView from '@/components/TrashView';
import CalendarFilterView from '@/components/CalendarFilterView';
import ShiftTypeManagementView from '@/components/ShiftTypeManagementView';
import AlarmsView from '@/components/AlarmsView';
import AdvancedPreferencesView from '@/components/AdvancedPreferencesView';
import WelcomeScreen from '@/components/WelcomeScreen';
import { useToast } from '@/hooks/use-toast';
import { useWorkdayReminder } from '@/hooks/useWorkdayReminder';
import { TimeRecord, ShiftType, AttestadoRecord, OcorrenciaRecord, Alarm, AppPreferences } from '@/types';

type ScreenType = 'welcome' | 'home' | 'registrar' | 'historico' | 'jornada' | 'perfil' | 
                  'atestado' | 'ocorrencia' | 'lixeira' | 'calendario' | 'tipos-turno' | 
                  'alarmes' | 'configuracoes';

const MyPointApp = () => {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('welcome');
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [timeRecords, setTimeRecords] = useState<TimeRecord[]>([]);
  const [deletedRecords, setDeletedRecords] = useState<TimeRecord[]>([]);
  const [atestados, setAtestados] = useState<AttestadoRecord[]>([]);
  const [ocorrencias, setOcorrencias] = useState<OcorrenciaRecord[]>([]);
  const [shiftTypes, setShiftTypes] = useState<ShiftType[]>([]);
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [locationStatus, setLocationStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [selectedFilterDate, setSelectedFilterDate] = useState<Date | undefined>();
  const { toast } = useToast();

  useWorkdayReminder(timeRecords);

  // Check if onboarding was completed
  useEffect(() => {
    const savedPrefs = localStorage.getItem('mypoint-preferences');
    const preferences: AppPreferences = savedPrefs ? JSON.parse(savedPrefs) : {};
    
    if (preferences.hasCompletedOnboarding) {
      setCurrentScreen('home');
      setPermissionsGranted(true);
      setLocationStatus('success');
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Load data from localStorage
  useEffect(() => {
    const savedRecords = localStorage.getItem('mypoint-records');
    if (savedRecords) {
      const records = JSON.parse(savedRecords);
      setTimeRecords(records.filter((r: TimeRecord) => !r.deleted));
      setDeletedRecords(records.filter((r: TimeRecord) => r.deleted));
    }

    const savedAtestados = localStorage.getItem('mypoint-atestados');
    if (savedAtestados) {
      setAtestados(JSON.parse(savedAtestados));
    }

    const savedOcorrencias = localStorage.getItem('mypoint-ocorrencias');
    if (savedOcorrencias) {
      setOcorrencias(JSON.parse(savedOcorrencias));
    }

    const savedShiftTypes = localStorage.getItem('mypoint-shift-types');
    if (savedShiftTypes) {
      setShiftTypes(JSON.parse(savedShiftTypes));
    } else {
      // Create default shift types
      const defaultShifts: ShiftType[] = [
        {
          id: '1',
          name: 'Noturno',
          color: '#3B82F6',
          startTime: '19:00',
          endTime: '07:00',
          reminderOffsets: [15, 30]
        },
        {
          id: '2',
          name: 'Diurno',
          color: '#22C55E',
          startTime: '08:00',
          endTime: '17:00',
          reminderOffsets: [15]
        }
      ];
      setShiftTypes(defaultShifts);
      localStorage.setItem('mypoint-shift-types', JSON.stringify(defaultShifts));
    }

    const savedAlarms = localStorage.getItem('mypoint-alarms');
    if (savedAlarms) {
      setAlarms(JSON.parse(savedAlarms));
    }
  }, []);

  const saveRecords = (records: TimeRecord[]) => {
    const allRecords = [...records, ...deletedRecords];
    localStorage.setItem('mypoint-records', JSON.stringify(allRecords));
    setTimeRecords(records);
  };

  const saveDeletedRecords = (deleted: TimeRecord[]) => {
    const allRecords = [...timeRecords, ...deleted];
    localStorage.setItem('mypoint-records', JSON.stringify(allRecords));
    setDeletedRecords(deleted);
  };

  const handlePermissionsGranted = () => {
    setPermissionsGranted(true);
    setCurrentScreen('home');
    setLocationStatus('success');
    
    // Save onboarding completion
    const savedPrefs = localStorage.getItem('mypoint-preferences');
    const preferences: AppPreferences = savedPrefs ? JSON.parse(savedPrefs) : {};
    preferences.hasCompletedOnboarding = true;
    localStorage.setItem('mypoint-preferences', JSON.stringify(preferences));
    
    toast({
      title: "Bem-vindo ao MyPoint!",
      description: "Agora você pode usar todas as funcionalidades do app.",
    });
  };

  const handlePhotoCapture = (photoData: string, type: TimeRecord['type']) => {
    const newRecord: TimeRecord = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      location: {
        latitude: -23.5505 + (Math.random() - 0.5) * 0.01,
        longitude: -46.6333 + (Math.random() - 0.5) * 0.01,
        address: "Rua Exemplo, 123 - São Paulo, SP"
      },
      photo: photoData,
      type
    };

    const updatedRecords = [newRecord, ...timeRecords];
    saveRecords(updatedRecords);

    toast({
      title: "Ponto registrado!",
      description: `${type === 'entrada' ? 'Entrada' : 
                    type === 'pausa_inicio' ? 'Início da pausa' : 
                    type === 'pausa_fim' ? 'Fim da pausa' : 'Saída'} registrada com sucesso.`,
    });

    setCurrentScreen('home');
  };

  const handleDeleteRecord = (id: string) => {
    const recordToDelete = timeRecords.find(r => r.id === id);
    if (recordToDelete) {
      const deletedRecord = { 
        ...recordToDelete, 
        deleted: true, 
        deletedAt: new Date().toISOString() 
      };
      const updatedRecords = timeRecords.filter(r => r.id !== id);
      const updatedDeleted = [deletedRecord, ...deletedRecords];
      
      setTimeRecords(updatedRecords);
      setDeletedRecords(updatedDeleted);
      
      const allRecords = [...updatedRecords, ...updatedDeleted];
      localStorage.setItem('mypoint-records', JSON.stringify(allRecords));
    }
  };

  const handleRestoreRecord = (id: string) => {
    const recordToRestore = deletedRecords.find(r => r.id === id);
    if (recordToRestore) {
      const { deleted, deletedAt, ...restoredRecord } = recordToRestore;
      const updatedDeleted = deletedRecords.filter(r => r.id !== id);
      const updatedRecords = [restoredRecord, ...timeRecords];
      
      setDeletedRecords(updatedDeleted);
      setTimeRecords(updatedRecords);
      
      const allRecords = [...updatedRecords, ...updatedDeleted];
      localStorage.setItem('mypoint-records', JSON.stringify(allRecords));
    }
  };

  const handlePermanentDelete = (id: string) => {
    const updatedDeleted = deletedRecords.filter(r => r.id !== id);
    setDeletedRecords(updatedDeleted);
    
    const allRecords = [...timeRecords, ...updatedDeleted];
    localStorage.setItem('mypoint-records', JSON.stringify(allRecords));
  };

  const handleEmptyTrash = () => {
    setDeletedRecords([]);
    localStorage.setItem('mypoint-records', JSON.stringify(timeRecords));
  };

  const handleSaveAtestado = (atestado: Omit<AttestadoRecord, 'id'>) => {
    const newAtestado = { ...atestado, id: Date.now().toString() };
    const updatedAtestados = [newAtestado, ...atestados];
    setAtestados(updatedAtestados);
    localStorage.setItem('mypoint-atestados', JSON.stringify(updatedAtestados));
  };

  const handleSaveOcorrencia = (ocorrencia: Omit<OcorrenciaRecord, 'id'>) => {
    const newOcorrencia = { ...ocorrencia, id: Date.now().toString() };
    const updatedOcorrencias = [newOcorrencia, ...ocorrencias];
    setOcorrencias(updatedOcorrencias);
    localStorage.setItem('mypoint-ocorrencias', JSON.stringify(updatedOcorrencias));
  };

  const handleSaveShiftType = (shiftType: Omit<ShiftType, 'id'>) => {
    const newShiftType = { ...shiftType, id: Date.now().toString() };
    const updatedShiftTypes = [...shiftTypes, newShiftType];
    setShiftTypes(updatedShiftTypes);
    localStorage.setItem('mypoint-shift-types', JSON.stringify(updatedShiftTypes));
  };

  const handleUpdateShiftType = (id: string, updates: Partial<ShiftType>) => {
    const updatedShiftTypes = shiftTypes.map(st => 
      st.id === id ? { ...st, ...updates } : st
    );
    setShiftTypes(updatedShiftTypes);
    localStorage.setItem('mypoint-shift-types', JSON.stringify(updatedShiftTypes));
  };

  const handleDeleteShiftType = (id: string) => {
    const updatedShiftTypes = shiftTypes.filter(st => st.id !== id);
    setShiftTypes(updatedShiftTypes);
    localStorage.setItem('mypoint-shift-types', JSON.stringify(updatedShiftTypes));
  };

  const handleSaveAlarm = (alarm: Omit<Alarm, 'id'>) => {
    const newAlarm = { ...alarm, id: Date.now().toString() };
    const updatedAlarms = [...alarms, newAlarm];
    setAlarms(updatedAlarms);
    localStorage.setItem('mypoint-alarms', JSON.stringify(updatedAlarms));
  };

  const handleUpdateAlarm = (id: string, updates: Partial<Alarm>) => {
    const updatedAlarms = alarms.map(a => 
      a.id === id ? { ...a, ...updates } : a
    );
    setAlarms(updatedAlarms);
    localStorage.setItem('mypoint-alarms', JSON.stringify(updatedAlarms));
  };

  const handleDeleteAlarm = (id: string) => {
    const updatedAlarms = alarms.filter(a => a.id !== id);
    setAlarms(updatedAlarms);
    localStorage.setItem('mypoint-alarms', JSON.stringify(updatedAlarms));
  };

  const handleExportData = () => {
    const data = {
      records: timeRecords,
      deletedRecords,
      atestados,
      ocorrencias,
      shiftTypes,
      alarms,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mypoint-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Dados exportados!",
      description: "Backup dos seus dados foi baixado com sucesso.",
    });
  };

  if (currentScreen === 'welcome') {
    return <WelcomeScreen onPermissionsGranted={handlePermissionsGranted} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-md mx-auto">
        {currentScreen === 'home' && (
          <HomeView 
            onNavigateToRegistrar={() => setCurrentScreen('registrar')}
            onNavigateToAtestado={() => setCurrentScreen('atestado')}
            onNavigateToOcorrencia={() => setCurrentScreen('ocorrencia')}
            recordsCount={timeRecords.length}
          />
        )}

        {currentScreen === 'registrar' && (
          <StepRegistrationView 
            onPhotoCapture={handlePhotoCapture}
            currentTime={currentTime}
            locationStatus={locationStatus}
            timeRecords={timeRecords}
            shiftTypes={shiftTypes}
            activeShiftType={shiftTypes.find(st => st.name === 'Noturno')}
          />
        )}

        {currentScreen === 'historico' && (
          <AdvancedHistoryView 
            records={timeRecords}
            onBack={() => setCurrentScreen('home')}
            onDeleteRecord={handleDeleteRecord}
            onOpenTrash={() => setCurrentScreen('lixeira')}
            onOpenCalendar={() => setCurrentScreen('calendario')}
            selectedDate={selectedFilterDate}
          />
        )}

        {currentScreen === 'jornada' && (
          <ShiftTypesView 
            onBack={() => setCurrentScreen('home')}
            shiftTypes={shiftTypes}
            onManageShiftTypes={() => setCurrentScreen('tipos-turno')}
            onManageAlarms={() => setCurrentScreen('alarmes')}
          />
        )}

        {currentScreen === 'perfil' && (
          <UserProfileView 
            onBack={() => setCurrentScreen('home')}
            onOpenPreferences={() => setCurrentScreen('configuracoes')}
          />
        )}

        {currentScreen === 'atestado' && (
          <AttestadoView 
            onBack={() => setCurrentScreen('home')}
            onSave={handleSaveAtestado}
          />
        )}

        {currentScreen === 'ocorrencia' && (
          <OcorrenciaView 
            onBack={() => setCurrentScreen('home')}
            onSave={handleSaveOcorrencia}
          />
        )}

        {currentScreen === 'lixeira' && (
          <TrashView 
            onBack={() => setCurrentScreen('historico')}
            deletedRecords={deletedRecords}
            onRestore={handleRestoreRecord}
            onPermanentDelete={handlePermanentDelete}
            onEmptyTrash={handleEmptyTrash}
          />
        )}

        {currentScreen === 'calendario' && (
          <CalendarFilterView 
            onBack={() => setCurrentScreen('historico')}
            selectedDate={selectedFilterDate}
            onDateSelect={setSelectedFilterDate}
          />
        )}

        {currentScreen === 'tipos-turno' && (
          <ShiftTypeManagementView 
            onBack={() => setCurrentScreen('jornada')}
            shiftTypes={shiftTypes}
            onSaveShiftType={handleSaveShiftType}
            onUpdateShiftType={handleUpdateShiftType}
            onDeleteShiftType={handleDeleteShiftType}
          />
        )}

        {currentScreen === 'alarmes' && (
          <AlarmsView 
            onBack={() => setCurrentScreen('jornada')}
            alarms={alarms}
            onSaveAlarm={handleSaveAlarm}
            onUpdateAlarm={handleUpdateAlarm}
            onDeleteAlarm={handleDeleteAlarm}
          />
        )}

        {currentScreen === 'configuracoes' && (
          <AdvancedPreferencesView 
            onBack={() => setCurrentScreen('perfil')}
            onExportData={handleExportData}
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
