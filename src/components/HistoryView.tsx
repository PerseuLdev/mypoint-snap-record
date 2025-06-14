
import React, { useState } from 'react';
import { Calendar, MapPin, Clock, Eye, Trash2, Image, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { TimeRecord } from '@/types';

interface HistoryViewProps {
  onBack: () => void;
  onAdvancedView: () => void;
  onDeleteRecord: (id: string) => void;
  timeRecords: TimeRecord[];
}

const HistoryView: React.FC<HistoryViewProps> = ({ 
  onBack,
  onAdvancedView,
  onDeleteRecord,
  timeRecords
}) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<TimeRecord | null>(null);

  // Filter records by selected date
  const filteredRecords = selectedDate 
    ? timeRecords.filter(record => {
        const recordDate = new Date(record.timestamp).toDateString();
        const filterDate = new Date(selectedDate).toDateString();
        return recordDate === filterDate;
      })
    : timeRecords;

  // Group records by date
  const groupedRecords = filteredRecords.reduce((groups, record) => {
    const date = new Date(record.timestamp).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(record);
    return groups;
  }, {} as Record<string, TimeRecord[]>);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Hoje';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Ontem';
    } else {
      return date.toLocaleDateString('pt-BR', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRecordTypeColor = (type: TimeRecord['type']) => {
    switch (type) {
      case 'entrada':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pausa_inicio':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'pausa_fim':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'saida':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRecordTypeLabel = (type: TimeRecord['type']) => {
    switch (type) {
      case 'entrada':
        return 'Entrada';
      case 'pausa_inicio':
        return 'Início da Pausa';
      case 'pausa_fim':
        return 'Fim da Pausa';
      case 'saida':
        return 'Saída';
      default:
        return 'Registro';
    }
  };

  return (
    <div className="p-4 space-y-4 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <Clock className="w-4 h-4" />
          </Button>
          <div>
            <h2 className="text-xl font-bold text-white">Histórico</h2>
            <p className="text-sm text-muted-foreground">
              {timeRecords.length} {timeRecords.length === 1 ? 'registro' : 'registros'} total
            </p>
          </div>
        </div>
        
        <Button
          onClick={onAdvancedView}
          variant="outline"
          size="sm"
          className="border-secondary text-white"
        >
          Avançado
        </Button>
      </div>

      {/* Date Filter */}
      {timeRecords.length > 0 && (
        <Card className="bg-secondary/30 border-secondary">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Filter className="w-5 h-5 text-muted-foreground" />
              <div className="flex-1">
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full bg-background border-border text-white"
                  placeholder="Filtrar por data"
                />
              </div>
              {selectedDate && (
                <Button
                  onClick={() => setSelectedDate('')}
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground"
                >
                  Limpar
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Records List */}
      {Object.keys(groupedRecords).length === 0 ? (
        <Card className="bg-secondary/30 border-secondary">
          <CardContent className="text-center py-12">
            <Clock className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">
              {timeRecords.length === 0 ? 'Nenhum registro ainda' : 'Nenhum registro para esta data'}
            </h3>
            <p className="text-muted-foreground">
              {timeRecords.length === 0 
                ? 'Registre seu primeiro ponto para começar!'
                : 'Tente selecionar uma data diferente.'
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedRecords)
            .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
            .map(([date, dayRecords]) => (
              <div key={date} className="space-y-3">
                {/* Date Header */}
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <h3 className="font-medium text-white capitalize">
                    {formatDate(date)}
                  </h3>
                  <Badge variant="secondary">
                    {dayRecords.length} {dayRecords.length === 1 ? 'registro' : 'registros'}
                  </Badge>
                </div>

                {/* Records for this date */}
                <div className="space-y-2">
                  {dayRecords
                    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                    .map((record) => (
                      <RecordCard
                        key={record.id}
                        record={record}
                        onViewDetails={(record) => setSelectedRecord(record)}
                        onDelete={onDeleteRecord}
                      />
                    ))
                  }
                </div>
              </div>
            ))
          }
        </div>
      )}

      {/* Record Details Modal */}
      <Dialog open={!!selectedRecord} onOpenChange={() => setSelectedRecord(null)}>
        <DialogContent className="max-w-md bg-secondary border-secondary">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2 text-white">
              <Clock className="w-5 h-5" />
              <span>Detalhes do Registro</span>
            </DialogTitle>
          </DialogHeader>
          
          {selectedRecord && (
            <div className="space-y-4">
              {/* Photo */}
              <div className="aspect-[4/3] bg-gray-700 rounded-lg overflow-hidden">
                <img 
                  src={selectedRecord.photo} 
                  alt="Registro de ponto"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Details */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Tipo:</span>
                  <Badge className={getRecordTypeColor(selectedRecord.type)}>
                    {getRecordTypeLabel(selectedRecord.type)}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Data e Hora:</span>
                  <span className="font-medium text-white">
                    {new Date(selectedRecord.timestamp).toLocaleString('pt-BR')}
                  </span>
                </div>

                <div className="flex items-start justify-between">
                  <span className="text-sm text-muted-foreground">Localização:</span>
                  <div className="text-right">
                    <p className="font-medium text-sm text-white">
                      {selectedRecord.location.address || 'Endereço não disponível'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {selectedRecord.location.latitude.toFixed(6)}, {selectedRecord.location.longitude.toFixed(6)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface RecordCardProps {
  record: TimeRecord;
  onViewDetails: (record: TimeRecord) => void;
  onDelete: (id: string) => void;
}

const RecordCard: React.FC<RecordCardProps> = ({ record, onViewDetails, onDelete }) => {
  const getRecordTypeColor = (type: TimeRecord['type']) => {
    switch (type) {
      case 'entrada':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pausa_inicio':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'pausa_fim':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'saida':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRecordTypeLabel = (type: TimeRecord['type']) => {
    switch (type) {
      case 'entrada':
        return 'Entrada';
      case 'pausa_inicio':
        return 'Início da Pausa';
      case 'pausa_fim':
        return 'Fim da Pausa';
      case 'saida':
        return 'Saída';
      default:
        return 'Registro';
    }
  };

  return (
    <Card className="bg-secondary/30 border-secondary hover:bg-secondary/40 transition-colors cursor-pointer" onClick={() => onViewDetails(record)}>
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          {/* Photo thumbnail */}
          <div className="w-16 h-16 bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
            <img 
              src={record.photo} 
              alt="Registro"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Details */}
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <Badge className={getRecordTypeColor(record.type)}>
                {getRecordTypeLabel(record.type)}
              </Badge>
              <span className="text-lg font-bold text-white">
                {new Date(record.timestamp).toLocaleTimeString('pt-BR', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>

            <div className="flex items-center space-x-1 text-muted-foreground">
              <MapPin className="w-3 h-3" />
              <span className="text-xs truncate">
                {record.location.address || 'Localização registrada'}
              </span>
            </div>
          </div>

          {/* View button */}
          <Button variant="ghost" size="sm" className="flex-shrink-0">
            <Eye className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default HistoryView;
