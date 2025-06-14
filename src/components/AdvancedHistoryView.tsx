
import React, { useState } from 'react';
import { Calendar, Filter, Trash2, Download, ArrowLeft, MoreHorizontal, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { TimeRecord } from '@/types';

interface AdvancedHistoryViewProps {
  records: TimeRecord[];
  onBack: () => void;
  onDeleteRecord: (id: string) => void;
  onOpenTrash: () => void;
  onOpenCalendar: () => void;
  selectedDate?: Date;
}

const AdvancedHistoryView: React.FC<AdvancedHistoryViewProps> = ({ 
  records, 
  onBack, 
  onDeleteRecord,
  onOpenTrash,
  onOpenCalendar,
  selectedDate
}) => {
  const [selectedRecords, setSelectedRecords] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const today = new Date().toLocaleDateString('pt-BR');

  const filteredRecords = records.filter(record => {
    const matchesSearch = !searchTerm || 
      record.location.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      new Date(record.timestamp).toLocaleDateString('pt-BR').includes(searchTerm);
    
    const matchesDate = !selectedDate || 
      new Date(record.timestamp).toDateString() === selectedDate.toDateString();
    
    return matchesSearch && matchesDate;
  });

  const toggleSelection = (id: string) => {
    setSelectedRecords(prev => 
      prev.includes(id) 
        ? prev.filter(rid => rid !== id)
        : [...prev, id]
    );
  };

  const handleBulkDelete = () => {
    selectedRecords.forEach(id => onDeleteRecord(id));
    setSelectedRecords([]);
  };

  const getRecordTypeColor = (type: TimeRecord['type']) => {
    switch (type) {
      case 'entrada':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pausa_inicio':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'pausa_fim':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'saida':
        return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  const getRecordTypeLabel = (type: TimeRecord['type']) => {
    switch (type) {
      case 'entrada':
        return 'Entrada';
      case 'pausa_inicio':
        return 'Início Pausa';
      case 'pausa_fim':
        return 'Fim Pausa';
      case 'saida':
        return 'Saída';
    }
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
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">MyPoint</h1>
              <p className="text-xs text-muted-foreground">Olá, Perseu</p>
            </div>
          </div>
          <div className="ml-auto flex space-x-2">
            <Button variant="ghost" size="sm" onClick={onOpenTrash}>
              <Trash2 className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="p-4 space-y-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Histórico de Registros</h2>
        </div>

        {/* Search */}
        <Card className="bg-secondary/30 border-secondary">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por data ou local..."
                className="pl-10 bg-background border-border text-white"
              />
            </div>
          </CardContent>
        </Card>

        {/* Filter Actions */}
        <div className="flex space-x-2">
          <Button 
            onClick={onOpenCalendar}
            variant="outline" 
            className="flex-1 bg-background border-border text-white hover:bg-secondary"
          >
            <Calendar className="w-4 h-4 mr-2" />
            {selectedDate ? selectedDate.toLocaleDateString('pt-BR') : 'Filtrar por Data'}
          </Button>
          <Button 
            variant="outline" 
            className="bg-background border-border text-white hover:bg-secondary"
          >
            <Filter className="w-4 h-4" />
          </Button>
        </div>

        {/* Bulk Actions */}
        {selectedRecords.length > 0 && (
          <Card className="bg-red-600/20 border-red-600/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-red-200">
                  {selectedRecords.length} {selectedRecords.length === 1 ? 'registro selecionado' : 'registros selecionados'}
                </p>
                <Button
                  onClick={handleBulkDelete}
                  size="sm"
                  variant="destructive"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Excluir
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Records Summary */}
        <Card className="bg-blue-600/20 border-blue-600/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-blue-400" />
                <span className="font-medium text-white">{filteredRecords.length} registros encontrados</span>
              </div>
              <span className="text-blue-400">{today}</span>
            </div>
          </CardContent>
        </Card>

        {/* Records List */}
        {filteredRecords.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-secondary/50 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">
              Nenhum registro encontrado
            </h3>
            <p className="text-muted-foreground">
              {searchTerm ? 'Tente ajustar sua busca' : 'Não há registros para esta data'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredRecords.map((record) => (
              <Card key={record.id} className="bg-secondary/30 border-secondary">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <input
                      type="checkbox"
                      checked={selectedRecords.includes(record.id)}
                      onChange={() => toggleSelection(record.id)}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    
                    <div className="w-16 h-16 bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                      <img 
                        src={record.photo} 
                        alt="Registro"
                        className="w-full h-full object-cover"
                      />
                    </div>

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

                      <p className="text-sm text-muted-foreground">
                        {new Date(record.timestamp).toLocaleDateString('pt-BR')}
                      </p>
                      
                      <p className="text-xs text-muted-foreground truncate">
                        📍 {record.location.address || 'Localização registrada'}
                      </p>
                    </div>

                    <Button
                      onClick={() => onDeleteRecord(record.id)}
                      size="sm"
                      variant="outline"
                      className="border-red-600 text-red-400 hover:bg-red-600/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
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

export default AdvancedHistoryView;
