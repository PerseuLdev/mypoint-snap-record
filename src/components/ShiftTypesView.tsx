
import React, { useState } from 'react';
import { Clock, Plus, Calendar, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ShiftTypesViewProps {
  onBack: () => void;
}

const ShiftTypesView: React.FC<ShiftTypesViewProps> = ({ onBack }) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [selectedShiftType, setSelectedShiftType] = useState('Noturno');

  const shiftTypes = [
    { name: 'Noturno', color: 'bg-blue-600', active: true },
    { name: 'Diurno Unimed', color: 'bg-green-600', active: false }
  ];

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const weekDays = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    
    // Add all days of the month
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

  const getShiftDays = () => {
    // Simulated shift days for the current month
    return [1, 3, 5, 10, 12, 16, 18, 21, 25, 27, 28, 30];
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

        {/* Shift Types */}
        <Card className="bg-secondary/30 border-secondary">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-white">
              <span>Tipos de Turno</span>
              <Button size="sm" className="bg-secondary hover:bg-secondary/80">
                <Plus className="w-4 h-4 mr-1" />
                Novo Turno
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-2">
              {shiftTypes.map((shift) => (
                <Button
                  key={shift.name}
                  onClick={() => setSelectedShiftType(shift.name)}
                  className={`${shift.color} hover:opacity-80 ${
                    selectedShiftType === shift.name ? 'ring-2 ring-white' : ''
                  }`}
                >
                  {shift.name}
                </Button>
              ))}
            </div>
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
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Week days header */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {weekDays.map((day) => (
                <div key={day} className="text-center text-xs text-muted-foreground p-2">
                  {day.slice(0, 3)}
                </div>
              ))}
            </div>

            {/* Calendar days */}
            <div className="grid grid-cols-7 gap-1">
              {getDaysInMonth(selectedMonth).map((day, index) => {
                const isShiftDay = day && getShiftDays().includes(day);
                return (
                  <div key={index} className="aspect-square">
                    {day && (
                      <Button
                        variant={isShiftDay ? "default" : "ghost"}
                        size="sm"
                        className={`w-full h-full text-sm ${
                          isShiftDay 
                            ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                            : 'text-muted-foreground hover:text-white'
                        }`}
                      >
                        <div className="text-center">
                          <div>{day}</div>
                          {isShiftDay && (
                            <div className="text-xs">Noturno</div>
                          )}
                        </div>
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ShiftTypesView;
