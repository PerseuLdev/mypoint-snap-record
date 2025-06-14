import React, { useState } from 'react';
import { Clock, Plus, Edit, Trash2, ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Alarm } from '@/types';

interface AlarmsViewProps {
  onBack: () => void;
  alarms: Alarm[];
  onCreateAlarm: (alarm: Omit<Alarm, 'id'>) => void;
  onUpdateAlarm: (id: string, alarm: Partial<Alarm>) => void;
  onDeleteAlarm: (id: string) => void;
}

const AlarmsView: React.FC<AlarmsViewProps> = ({
  onBack,
  alarms,
  onCreateAlarm,
  onUpdateAlarm,
  onDeleteAlarm
}) => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingAlarm, setEditingAlarm] = useState<Alarm | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    time: '',
    days: [] as string[],
    enabled: true
  });
  const { toast } = useToast();

  const weekDays = [
    { key: 'dom', label: 'Dom' },
    { key: 'seg', label: 'Seg' },
    { key: 'ter', label: 'Ter' },
    { key: 'qua', label: 'Qua' },
    { key: 'qui', label: 'Qui' },
    { key: 'sex', label: 'Sex' },
    { key: 'sab', label: 'Sáb' }
  ];

  const resetForm = () => {
    setFormData({
      name: '',
      time: '',
      days: [],
      enabled: true
    });
    setEditingAlarm(null);
  };

  const handleEdit = (alarm: Alarm) => {
    setFormData({
      name: alarm.name,
      time: alarm.time,
      days: alarm.days || [],
      enabled: alarm.enabled
    });
    setEditingAlarm(alarm);
    setShowCreateDialog(true);
  };

  const handleSave = () => {
    if (!formData.time) {
      toast({
        title: "Campo obrigatório",
        description: "Preencha o horário do alarme.",
      });
      return;
    }

    if (editingAlarm) {
      onUpdateAlarm(editingAlarm.id, formData);
      toast({
        title: "Alarme atualizado!",
        description: "As alterações foram salvas com sucesso.",
      });
    } else {
      onCreateAlarm(formData);
      toast({
        title: "Alarme criado!",
        description: "Novo alarme foi criado com sucesso.",
      });
    }

    setShowCreateDialog(false);
    resetForm();
  };

  const toggleDay = (day: string) => {
    setFormData(prev => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day]
    }));
  };

  const formatDays = (days: string[] | undefined | null) => {
    if (!days || days.length === 0) return 'Nenhum dia';
    if (days.length === 7) return 'Todos os dias';
    return days.map(day => weekDays.find(wd => wd.key === day)?.label).filter(Boolean).join(', ');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <Clock className="w-6 h-6 text-blue-400" />
            <h1 className="text-xl font-bold text-white">Alarmes</h1>
          </div>

          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button 
                onClick={resetForm}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Novo Alarme
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-secondary border-secondary max-w-md">
              <DialogHeader>
                <DialogTitle className="text-white">
                  {editingAlarm ? 'Editar Alarme' : 'Criar Novo Alarme'}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <Label className="text-white">Nome do Alarme</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ex: Entrada no trabalho"
                    className="mt-1 bg-background border-border text-white"
                  />
                </div>

                <div>
                  <Label className="text-white">Horário</Label>
                  <Input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                    className="mt-1 bg-background border-border text-white"
                  />
                </div>

                <div>
                  <Label className="text-white">Dias da Semana</Label>
                  <div className="grid grid-cols-7 gap-1 mt-2">
                    {weekDays.map((day) => (
                      <Button
                        key={day.key}
                        onClick={() => toggleDay(day.key)}
                        variant={formData.days.includes(day.key) ? "default" : "outline"}
                        size="sm"
                        className={`text-xs ${formData.days.includes(day.key) ? 
                          "bg-blue-600 hover:bg-blue-700" : 
                          "border-secondary text-white"
                        }`}
                      >
                        {day.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.enabled}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, enabled: checked }))}
                  />
                  <Label className="text-white">Alarme ativo</Label>
                </div>

                <div className="flex space-x-2 pt-4">
                  <Button
                    onClick={() => setShowCreateDialog(false)}
                    variant="outline"
                    className="flex-1 border-secondary text-white"
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleSave}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Salvar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {alarms.length === 0 ? (
          <Card className="bg-secondary/30 border-secondary">
            <CardContent className="p-8 text-center">
              <Clock className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">
                Nenhum alarme configurado
              </h3>
              <p className="text-muted-foreground mb-4">
                Configure alarmes para lembretes importantes.
              </p>
              <Button 
                onClick={() => setShowCreateDialog(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Criar Primeiro Alarme
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {alarms.map((alarm) => (
              <Card key={alarm.id} className="bg-secondary/30 border-secondary">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-medium text-white">{alarm.name}</h3>
                        <span className="text-2xl font-bold text-white">{alarm.time}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {formatDays(alarm.days)}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <Switch
                        checked={alarm.enabled}
                        onCheckedChange={(checked) => onUpdateAlarm(alarm.id, { enabled: checked })}
                      />
                      <Button
                        onClick={() => handleEdit(alarm)}
                        size="sm"
                        variant="outline"
                        className="border-secondary text-white"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => onDeleteAlarm(alarm.id)}
                        size="sm"
                        variant="outline"
                        className="border-red-600 text-red-400 hover:bg-red-600/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AlarmsView;
