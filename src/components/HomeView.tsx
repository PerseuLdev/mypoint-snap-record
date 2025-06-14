
import React from 'react';
import { Clock, Camera, FileText, AlertTriangle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ViewType } from '../pages/Index';
import { TimeRecord, ShiftType } from '@/types';

interface HomeViewProps {
  onNavigate: (view: ViewType) => void;
  timeRecords: TimeRecord[];
  currentTime: Date;
  locationStatus: 'loading' | 'success' | 'error';
  shiftTypes: ShiftType[];
  activeShiftType?: ShiftType;
}

const HomeView: React.FC<HomeViewProps> = ({ 
  onNavigate, 
  timeRecords,
  currentTime,
  locationStatus,
  shiftTypes,
  activeShiftType
}) => {
  // Get today's records count
  const today = new Date().toDateString();
  const todayRecords = timeRecords.filter(record => 
    new Date(record.timestamp).toDateString() === today && !record.deleted
  );

  return (
    <div className="p-4 space-y-6 pb-24">
      {/* Welcome Section */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-white">Bem-vindo(a), Perseu!</h1>
        <p className="text-muted-foreground">Pronto para registrar seu dia?</p>
      </div>

      {/* Main Action Button */}
      <Card className="bg-gradient-to-r from-blue-600 to-blue-700 border-0">
        <CardContent className="p-6">
          <Button
            onClick={() => onNavigate('registration')}
            className="w-full h-16 bg-white/20 hover:bg-white/30 text-white border-0 text-lg font-semibold"
          >
            <Camera className="w-6 h-6 mr-3" />
            Registrar Ponto
            <ArrowRight className="w-5 h-5 ml-3" />
          </Button>
          <p className="text-blue-100 text-sm mt-3 text-center">
            Entrada, pausa ou saída
          </p>
        </CardContent>
      </Card>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-secondary/50 border-secondary">
          <CardContent className="p-4">
            <Button
              onClick={() => onNavigate('attestado')}
              className="w-full h-full bg-transparent hover:bg-white/10 border-0 text-white"
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <FileText className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="font-medium text-white mb-1">Atestado Médico</h3>
                <p className="text-xs text-muted-foreground">Enviar um comprovante</p>
              </div>
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-secondary/50 border-secondary">
          <CardContent className="p-4">
            <Button
              onClick={() => onNavigate('ocorrencia')}
              className="w-full h-full bg-transparent hover:bg-white/10 border-0 text-white"
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-600/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <AlertTriangle className="w-6 h-6 text-orange-400" />
                </div>
                <h3 className="font-medium text-white mb-1">Ocorrência</h3>
                <p className="text-xs text-muted-foreground">Reportar um incidente</p>
              </div>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Stats Cards */}
      <div className="space-y-4">
        <Card className="bg-secondary/30 border-secondary">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Registros hoje</p>
                <p className="text-2xl font-bold text-white">{todayRecords.length}</p>
              </div>
              <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HomeView;
