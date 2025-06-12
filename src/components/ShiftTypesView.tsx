
import React, { useState } from 'react';
import { Clock, Plus, Calendar, ArrowLeft, ChevronLeft, ChevronRight, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShiftType } from '@/types';

interface ShiftTypesViewProps {
  onBack: () => void;
  shiftTypes: ShiftType[];
  onManageShiftTypes: () => void;
  onManageAlarms: () => void;
}

const ShiftTypesView: React.FC<ShiftTypesViewProps> = ({ 
  onBack, 
  shiftTypes,
  onManageShiftTypes,
  onManageAlarms 
}) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [selectedDates, setSelectedDates] = useState<{ [key: string]: string }>({});

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days = [];
    
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedMonth);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setSelectedMonth(newDate);
  };

  const toggleDayShift = (day: number, shiftTypeId: string) => {
    const key = `${selectedMonth.getFullYear()}-${selectedMonth.getMonth()}-${day}`;
    setSelectedDates(prev => ({
      ...prev,
      [key]: prev[key] === shiftTypeId ? '' : shiftTypeId
    }));
  };

  const getShiftTypeForDay = (day: number) => {
    const key = `${selectedMonth.getFullYear()}-${selectedMonth.getMonth()}-${day}`;
    const shiftTypeId = selectedDates[key];
    return shiftTypes.find(st => st.id === shiftTypeId);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">MyPoint</h1>
              <p className="text-xs text-muted-foreground">Olá, Perseu</p>
            </div>
          </div>
        </div>
      </header>

      <div className="p-4 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-white">Minha Escala</h2>
          <p className="text-muted-foreground">
            Crie tipos de turno e aplique-os no calendário para montar sua escala de trabalho.
          </p>
        </div>

        {/* Management Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={onManageShiftTypes}
            className="h-12 bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Gerenciar Turnos
          </Button>
          <Button
            onClick={onManageAlarms}
            className="h-12 bg-orange-600 hover:bg-orange-700"
          >
            <Bell className="w-4 h-4 mr-2" />
            Alarmes
          </Button>
        </div>

        {/* Shift Types */}
        <Card className="bg-secondary/30 border-secondary">
          <CardHeader>
            <CardTitle className="text-white">Tipos de Turno</CardTitle>
          </CardHeader>
          <CardContent>
            {shiftTypes.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-muted-foreground mb-3">
                  Nenhum tipo de turno criado ainda.
                </p>
                <Button 
                  onClick={onManageShiftTypes}
                  size="sm" 
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Primeiro Turno
                </Button>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {shiftTypes.map((shift) => (
                  <Button
                    key={shift.id}
                    className="h-auto p-3 flex flex-col items-center"
                    style={{ backgroundColor: shift.color }}
                  >
                    <span className="font-medium">{shift.name}</span>
                    <span className="text-xs opacity-80">
                      {shift.startTime} - {shift.endTime}
                    </span>
                  </Button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Calendar */}
        <Card className="bg-secondary/30 border-secondary">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateMonth('prev')}
                className="text-white"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <CardTitle className="text-white">
                {monthNames[selectedMonth.getMonth()]} {selectedMonth.getFullYear()}
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateMonth('next')}
                className="text-white"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Week days header */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {weekDays.map((day, index) => (
                <div key={index} className="text-center text-xs text-muted-foreground p-2 font-medium">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar days */}
            <div className="grid grid-cols-7 gap-1">
              {getDaysInMonth(selectedMonth).map((day, index) => {
                if (!day) {
                  return <div key={index} className="aspect-square" />;
                }

                const shiftType = getShiftTypeForDay(day);
                const today = new Date();
                const isToday = today.getDate() === day && 
                                today.getMonth() === selectedMonth.getMonth() && 
                                today.getFullYear() === selectedMonth.getFullYear();

                return (
                  <div key={index} className="aspect-square">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`w-full h-full text-sm p-1 relative ${
                        isToday ? 'ring-2 ring-blue-400' : ''
                      } ${shiftType ? 'text-white' : 'text-muted-foreground hover:text-white'}`}
                      style={shiftType ? { backgroundColor: shiftType.color } : {}}
                      onClick={() => {
                        if (shiftTypes.length > 0) {
                          // Cycle through shift types or clear
                          const currentShiftIndex = shiftTypes.findIndex(st => st.id === shiftType?.id);
                          const nextIndex = currentShiftIndex + 1;
                          const nextShiftType = nextIndex < shiftTypes.length ? shiftTypes[nextIndex] : null;
                          toggleDayShift(day, nextShiftType?.id || '');
                        }
                      }}
                    >
                      <div className="text-center">
                        <div className={isToday ? 'font-bold' : ''}>{day}</div>
                        {shiftType && (
                          <div className="text-xs opacity-90 truncate">
                            {shiftType.name}
                          </div>
                        )}
                      </div>
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="bg-blue-600/20 border-blue-600/30">
          <CardContent className="p-4">
            <p className="text-blue-200 text-sm">
              💡 Toque nos dias do calendário para aplicar tipos de turno. Toque novamente para alternar entre os tipos ou remover.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ShiftTypesView;
