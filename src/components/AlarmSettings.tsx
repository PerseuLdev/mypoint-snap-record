
import React, { useState, useEffect } from 'react';
import { Clock, Plus, Trash2, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface Alarm {
  id: string;
  time: string;
  type: 'saida_almoco' | 'volta_almoco';
  enabled: boolean;
  label: string;
}

const AlarmSettings: React.FC = () => {
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [newAlarmTime, setNewAlarmTime] = useState('');
  const [newAlarmType, setNewAlarmType] = useState<'saida_almoco' | 'volta_almoco'>('saida_almoco');
  const { toast } = useToast();

  // Load alarms from localStorage
  useEffect(() => {
    const savedAlarms = localStorage.getItem('mypoint-alarms');
    if (savedAlarms) {
      setAlarms(JSON.parse(savedAlarms));
    }
  }, []);

  // Save alarms to localStorage
  const saveAlarms = (updatedAlarms: Alarm[]) => {
    localStorage.setItem('mypoint-alarms', JSON.stringify(updatedAlarms));
    setAlarms(updatedAlarms);
  };

  const addAlarm = () => {
    if (!newAlarmTime) {
      toast({
        title: "Erro",
        description: "Por favor, selecione um horário para o alarme.",
        variant: "destructive"
      });
      return;
    }

    const newAlarm: Alarm = {
      id: Date.now().toString(),
      time: newAlarmTime,
      type: newAlarmType,
      enabled: true,
      label: newAlarmType === 'saida_almoco' ? 'Saída para Almoço' : 'Volta do Almoço'
    };

    const updatedAlarms = [...alarms, newAlarm];
    saveAlarms(updatedAlarms);
    setNewAlarmTime('');
    
    toast({
      title: "Alarme criado!",
      description: `Alarme para ${newAlarm.label} às ${newAlarm.time} foi configurado.`,
    });
  };

  const removeAlarm = (alarmId: string) => {
    const updatedAlarms = alarms.filter(alarm => alarm.id !== alarmId);
    saveAlarms(updatedAlarms);
    
    toast({
      title: "Alarme removido",
      description: "O alarme foi removido com sucesso.",
    });
  };

  const toggleAlarm = (alarmId: string) => {
    const updatedAlarms = alarms.map(alarm =>
      alarm.id === alarmId ? { ...alarm, enabled: !alarm.enabled } : alarm
    );
    saveAlarms(updatedAlarms);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="w-5 h-5" />
            <span>Alarmes de Descanso</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add new alarm */}
          <div className="space-y-3">
            <div className="flex space-x-2">
              <input
                type="time"
                value={newAlarmTime}
                onChange={(e) => setNewAlarmTime(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
              />
              <select
                value={newAlarmType}
                onChange={(e) => setNewAlarmType(e.target.value as 'saida_almoco' | 'volta_almoco')}
                className="px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="saida_almoco">Saída Almoço</option>
                <option value="volta_almoco">Volta Almoço</option>
              </select>
            </div>
            <Button onClick={addAlarm} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Alarme
            </Button>
          </div>

          {/* Alarm list */}
          <div className="space-y-2">
            {alarms.length === 0 ? (
              <p className="text-center text-gray-500 py-4">
                Nenhum alarme configurado
              </p>
            ) : (
              alarms.map((alarm) => (
                <Card key={alarm.id} className={`${alarm.enabled ? 'bg-blue-50' : 'bg-gray-50'}`}>
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Clock className="w-4 h-4 text-blue-600" />
                        <div>
                          <p className="font-medium">{alarm.time}</p>
                          <p className="text-sm text-gray-600">{alarm.label}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={alarm.enabled ? "default" : "secondary"}>
                          {alarm.enabled ? 'Ativo' : 'Inativo'}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleAlarm(alarm.id)}
                        >
                          {alarm.enabled ? 'Desativar' : 'Ativar'}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeAlarm(alarm.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AlarmSettings;
