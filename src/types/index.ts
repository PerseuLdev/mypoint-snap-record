
export interface TimeRecord {
  id: string;
  timestamp: string;
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  photo: string;
  type: 'entrada' | 'pausa_inicio' | 'pausa_fim' | 'saida';
  deleted?: boolean;
  deletedAt?: string;
  shiftType?: string;
}

export interface ShiftType {
  id: string;
  name: string;
  color: string;
  isBreak?: boolean;
  startTime: string;
  endTime: string;
  breakDuration?: number; // em minutos
  reminderOffsets: number[]; // minutos antes para lembrar
}

export interface AttestadoRecord {
  id: string;
  timestamp: string;
  photo: string;
  startDate: string;
  endDate?: string;
  description: string;
}

export interface OcorrenciaRecord {
  id: string;
  timestamp: string;
  photo: string;
  description: string;
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
}

export interface Alarm {
  id: string;
  name: string;
  time: string;
  days: string[];
  enabled: boolean;
}

export interface AppPreferences {
  theme: 'light' | 'dark' | 'system';
  defaultCamera: 'front' | 'back';
  permissions: {
    camera: boolean;
    location: boolean;
    notifications: boolean;
  };
  workdayNotifications: boolean;
  hasCompletedOnboarding: boolean;
  language: string;
}
