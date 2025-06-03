
import React from 'react';
import { Clock, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AlarmSettings from './AlarmSettings';
import WorkdaySettings from './WorkdaySettings';

interface ScheduleViewProps {
  onBack: () => void;
}

const ScheduleView: React.FC<ScheduleViewProps> = ({ onBack }) => {
  return (
    <div className="p-4 space-y-4 pb-24">
      <div className="flex items-center space-x-3 mb-6">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <Clock className="w-6 h-6 text-indigo-600" />
        <h2 className="text-xl font-bold text-slate-800">Horários</h2>
      </div>

      <Tabs defaultValue="workday" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="workday">Jornada</TabsTrigger>
          <TabsTrigger value="alarms">Alarmes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="workday" className="mt-4">
          <WorkdaySettings />
        </TabsContent>
        
        <TabsContent value="alarms" className="mt-4">
          <AlarmSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ScheduleView;
