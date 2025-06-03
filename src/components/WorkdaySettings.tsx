
import React, { useState, useEffect } from 'react';
import { Clock, User, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface WorkdayConfig {
  workHours: number;
  reminderEnabled: boolean;
  reminderOffsetMinutes: number; // minutos antes do fim da jornada para lembrar
}

const WorkdaySettings: React.FC = () => {
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

  const saveConfig = () => {
    localStorage.setItem('mypoint-workday-config', JSON.stringify(config));
    toast({
      title: "Configurações salvas!",
      description: `Jornada de ${config.workHours}h configurada com sucesso.`,
    });
  };

  const workHourOptions = [4, 6, 8, 12];
  const reminderOptions = [
    { value: 15, label: '15 minutos antes' },
    { value: 30, label: '30 minutos antes' },
    { value: 60, label: '1 hora antes' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <User className="w-5 h-5" />
          <span>Configuração de Jornada</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Work Hours Selection */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Carga horária diária
          </label>
          <div className="grid grid-cols-4 gap-2">
            {workHourOptions.map((hours) => (
              <button
                key={hours}
                onClick={() => setConfig({ ...config, workHours: hours })}
                className={`p-3 rounded-lg border-2 transition-colors ${
                  config.workHours === hours
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-center">
                  <Clock className="w-4 h-4 mx-auto mb-1" />
                  <span className="text-sm font-medium">{hours}h</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Reminder Settings */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">
              Lembrete de fim de jornada
            </label>
            <button
              onClick={() => setConfig({ ...config, reminderEnabled: !config.reminderEnabled })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                config.reminderEnabled ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  config.reminderEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {config.reminderEnabled && (
            <div className="space-y-2">
              <label className="block text-sm text-gray-600">
                Quando lembrar:
              </label>
              <div className="space-y-2">
                {reminderOptions.map((option) => (
                  <label key={option.value} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="reminderOffset"
                      value={option.value}
                      checked={config.reminderOffsetMinutes === option.value}
                      onChange={(e) => setConfig({ 
                        ...config, 
                        reminderOffsetMinutes: parseInt(e.target.value) 
                      })}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Current Status */}
        <div className="pt-3 border-t space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Jornada configurada:</span>
            <Badge variant="secondary">{config.workHours} horas</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Lembrete:</span>
            <Badge variant={config.reminderEnabled ? "default" : "secondary"}>
              {config.reminderEnabled ? 'Ativo' : 'Inativo'}
            </Badge>
          </div>
        </div>

        <Button onClick={saveConfig} className="w-full">
          <Save className="w-4 h-4 mr-2" />
          Salvar Configurações
        </Button>
      </CardContent>
    </Card>
  );
};

export default WorkdaySettings;
