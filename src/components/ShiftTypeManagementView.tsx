
import React, { useState } from 'react';
import { Clock, Plus, Edit, Trash2, ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ShiftType } from '@/types';

interface ShiftTypeManagementViewProps {
  onBack: () => void;
  shiftTypes: ShiftType[];
  onSaveShiftType: (shiftType: Omit<ShiftType, 'id'>) => void;
  onUpdateShiftType: (id: string, shiftType: Partial<ShiftType>) => void;
  onDeleteShiftType: (id: string) => void;
}

const ShiftTypeManagementView: React.FC<ShiftTypeManagementViewProps> = ({
  onBack,
  shiftTypes,
  onSaveShiftType,
  onUpdateShiftType,
  onDeleteShiftType
}) => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingShift, setEditingShift] = useState<ShiftType | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    color: '#3B82F6',
    isBreak: false,
    startTime: '',
    endTime: '',
    breakDuration: 60,
    reminderOffsets: [15]
  });
  const { toast } = useToast();

  const colorOptions = [
    { value: '#3B82F6', label: 'Azul' },
    { value: '#EF4444', label: 'Vermelho' },
    { value: '#F97316', label: 'Laranja' },
    { value: '#22C55E', label: 'Verde' },
    { value: '#8B5CF6', label: 'Roxo' },
    { value: '#EC4899', label: 'Rosa' },
    { value: '#14B8A6', label: 'Teal' },
    { value: '#6B7280', label: 'Cinza' }
  ];

  const reminderOptions = [5, 10, 15, 30, 60];

  const resetForm = () => {
    setFormData({
      name: '',
      color: '#3B82F6',
      isBreak: false,
      startTime: '',
      endTime: '',
      breakDuration: 60,
      reminderOffsets: [15]
    });
    setEditingShift(null);
  };

  const handleEdit = (shift: ShiftType) => {
    setFormData({
      name: shift.name,
      color: shift.color,
      isBreak: shift.isBreak || false,
      startTime: shift.startTime,
      endTime: shift.endTime,
      breakDuration: shift.breakDuration || 60,
      reminderOffsets: shift.reminderOffsets || [15]
    });
    setEditingShift(shift);
    setShowCreateDialog(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.startTime || !formData.endTime) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios.",
      });
      return;
    }

    if (editingShift) {
      onUpdateShiftType(editingShift.id, formData);
      toast({
        title: "Turno atualizado!",
        description: "As alterações foram salvas com sucesso.",
      });
    } else {
      onSaveShiftType(formData);
      toast({
        title: "Turno criado!",
        description: "Novo tipo de turno foi criado com sucesso.",
      });
    }

    setShowCreateDialog(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    onDeleteShiftType(id);
    toast({
      title: "Turno excluído",
      description: "O tipo de turno foi removido.",
    });
  };

  const toggleReminder = (minutes: number) => {
    setFormData(prev => ({
      ...prev,
      reminderOffsets: prev.reminderOffsets.includes(minutes)
        ? prev.reminderOffsets.filter(m => m !== minutes)
        : [...prev.reminderOffsets, minutes]
    }));
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
            <h1 className="text-xl font-bold text-white">Tipos de Turno</h1>
          </div>

          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button 
                onClick={resetForm}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Novo Turno
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-secondary border-secondary max-w-md">
              <DialogHeader>
                <DialogTitle className="text-white">
                  {editingShift ? 'Editar Turno' : 'Criar Novo Turno'}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <Label className="text-white">Nome do Turno</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ex: Noturno, Diurno..."
                    className="mt-1 bg-background border-border text-white"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.isBreak}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isBreak: checked }))}
                  />
                  <Label className="text-white">Este turno é uma folga?</Label>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white">Início</Label>
                    <Input
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                      className="mt-1 bg-background border-border text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-white">Fim</Label>
                    <Input
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                      className="mt-1 bg-background border-border text-white"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-white">Cor</Label>
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {colorOptions.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => setFormData(prev => ({ ...prev, color: color.value }))}
                        className={`w-full h-10 rounded-lg border-2 ${
                          formData.color === color.value ? 'border-white' : 'border-gray-600'
                        }`}
                        style={{ backgroundColor: color.value }}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-white">Lembretes (minutos antes)</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {reminderOptions.map((minutes) => (
                      <Button
                        key={minutes}
                        onClick={() => toggleReminder(minutes)}
                        variant={formData.reminderOffsets.includes(minutes) ? "default" : "outline"}
                        size="sm"
                        className={formData.reminderOffsets.includes(minutes) ? 
                          "bg-blue-600 hover:bg-blue-700" : 
                          "border-secondary text-white"
                        }
                      >
                        {minutes}min
                      </Button>
                    ))}
                  </div>
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

        {shiftTypes.length === 0 ? (
          <Card className="bg-secondary/30 border-secondary">
            <CardContent className="p-8 text-center">
              <Clock className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">
                Nenhum tipo de turno criado
              </h3>
              <p className="text-muted-foreground mb-4">
                Crie seu primeiro tipo de turno para organizar sua escala.
              </p>
              <Button 
                onClick={() => setShowCreateDialog(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Criar Primeiro Turno
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {shiftTypes.map((shift) => (
              <Card key={shift.id} className="bg-secondary/30 border-secondary">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: shift.color }}
                      />
                      <div>
                        <h3 className="font-medium text-white">{shift.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {shift.startTime} - {shift.endTime}
                          {shift.isBreak && ' • Folga'}
                        </p>
                        {shift.reminderOffsets && shift.reminderOffsets.length > 0 && (
                          <div className="flex space-x-1 mt-1">
                            {shift.reminderOffsets.map((minutes) => (
                              <Badge key={minutes} variant="secondary" className="text-xs">
                                {minutes}min
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => handleEdit(shift)}
                        size="sm"
                        variant="outline"
                        className="border-secondary text-white"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => handleDelete(shift.id)}
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

export default ShiftTypeManagementView;
