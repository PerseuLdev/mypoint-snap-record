
import React, { useState } from 'react';
import { Calendar, MapPin, Clock, Eye, Trash2, Image, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { TimeRecord } from '@/types';

interface HistoryViewProps {
  records: TimeRecord[];
  onClearHistory: () => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ records, onClearHistory }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<TimeRecord | null>(null);

  // Filter records by selected date
  const filteredRecords = selectedDate 
    ? records.filter(record => {
        const recordDate = new Date(record.timestamp).toDateString();
        const filterDate = new Date(selectedDate).toDateString();
        return recordDate === filterDate;
      })
    : records;

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
        <div>
          <h2 className="text-xl font-bold text-gray-800">Histórico</h2>
          <p className="text-sm text-gray-600">
            {records.length} {records.length === 1 ? 'registro' : 'registros'} total
          </p>
        </div>
        
        {records.length > 0 && (
          <Button
            onClick={onClearHistory}
            variant="outline"
            size="sm"
            className="text-red-600 border-red-200 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Limpar
          </Button>
        )}
      </div>

      {/* Date Filter */}
      {records.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Filter className="w-5 h-5 text-gray-600" />
              <div className="flex-1">
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full"
                  placeholder="Filtrar por data"
                />
              </div>
              {selectedDate && (
                <Button
                  onClick={() => setSelectedDate('')}
                  variant="ghost"
                  size="sm"
                  className="text-gray-600"
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
        <Card className="text-center py-12">
          <CardContent>
            <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              {records.length === 0 ? 'Nenhum registro ainda' : 'Nenhum registro para esta data'}
            </h3>
            <p className="text-gray-500">
              {records.length === 0 
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
                  <Calendar className="w-4 h-4 text-gray-600" />
                  <h3 className="font-medium text-gray-800 capitalize">
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
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>Detalhes do Registro</span>
            </DialogTitle>
          </DialogHeader>
          
          {selectedRecord && (
            <div className="space-y-4">
              {/* Photo */}
              <div className="aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden">
                <img 
                  src={selectedRecord.photo} 
                  alt="Registro de ponto"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Details */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Tipo:</span>
                  <Badge className={getRecordTypeColor(selectedRecord.type)}>
                    {getRecordTypeLabel(selectedRecord.type)}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Data e Hora:</span>
                  <span className="font-medium">
                    {new Date(selectedRecord.timestamp).toLocaleString('pt-BR')}
                  </span>
                </div>

                <div className="flex items-start justify-between">
                  <span className="text-sm text-gray-600">Localização:</span>
                  <div className="text-right">
                    <p className="font-medium text-sm">
                      {selectedRecord.location.address || 'Endereço não disponível'}
                    </p>
                    <p className="text-xs text-gray-500">
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
}

const RecordCard: React.FC<RecordCardProps> = ({ record, onViewDetails }) => {
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
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => onViewDetails(record)}>
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          {/* Photo thumbnail */}
          <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
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
              <span className="text-lg font-bold text-gray-800">
                {new Date(record.timestamp).toLocaleTimeString('pt-BR', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>

            <div className="flex items-center space-x-1 text-gray-600">
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
