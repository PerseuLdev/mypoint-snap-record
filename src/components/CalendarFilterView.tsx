
import React, { useState } from 'react';
import { Calendar as CalendarIcon, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';

interface CalendarFilterViewProps {
  onBack: () => void;
  selectedDate: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
}

const CalendarFilterView: React.FC<CalendarFilterViewProps> = ({
  onBack,
  selectedDate,
  onDateSelect
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const handleDateSelect = (date: Date | undefined) => {
    onDateSelect(date);
    onBack();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="p-4 space-y-4">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <CalendarIcon className="w-6 h-6 text-blue-400" />
          <h1 className="text-xl font-bold text-white">Selecionar Data</h1>
        </div>

        <Card className="bg-secondary/30 border-secondary">
          <CardHeader>
            <CardTitle className="text-white text-center">
              {currentMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              month={currentMonth}
              onMonthChange={setCurrentMonth}
              className="w-full"
              classNames={{
                months: "flex w-full flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                month: "space-y-4 w-full flex flex-col",
                caption: "flex justify-center pt-1 relative items-center",
                caption_label: "text-sm font-medium text-white",
                nav: "space-x-1 flex items-center",
                nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 text-white",
                nav_button_previous: "absolute left-1",
                nav_button_next: "absolute right-1",
                table: "w-full border-collapse space-y-1",
                head_row: "flex w-full",
                head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem] flex-1 text-center",
                row: "flex w-full mt-2",
                cell: "text-center text-sm relative p-0 flex-1 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 text-white hover:bg-secondary/50 rounded-md",
                day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                day_today: "bg-accent text-accent-foreground font-bold",
                day_outside: "text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
                day_disabled: "text-muted-foreground opacity-50",
                day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                day_hidden: "invisible",
              }}
            />
          </CardContent>
        </Card>

        <div className="flex space-x-2">
          <Button
            onClick={() => handleDateSelect(new Date())}
            variant="outline"
            className="flex-1 border-secondary text-white"
          >
            Hoje
          </Button>
          <Button
            onClick={() => handleDateSelect(undefined)}
            variant="outline"
            className="flex-1 border-secondary text-white"
          >
            Limpar Filtro
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CalendarFilterView;
