import React, { useState } from 'react';
import { Trash2, ArrowLeft, RotateCcw, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { TimeRecord } from '@/types';

interface TrashViewProps {
  onBack: () => void;
  deletedRecords: TimeRecord[];
  onRestore: (id: string) => void;
  onPermanentDelete: (id: string) => void;
  onEmptyTrash: () => void;
}

const TrashView: React.FC<TrashViewProps> = ({
  onBack,
  deletedRecords,
  onRestore,
  onPermanentDelete,
  onEmptyTrash
}) => {
  const [selectedRecords, setSelectedRecords] = useState<string[]>([]);
  const { toast } = useToast();

  const toggleSelection = (id: string) => {
    setSelectedRecords(prev => 
      prev.includes(id) 
        ? prev.filter(rid => rid !== id)
        : [...prev, id]
    );
  };

  const handleBulkRestore = () => {
    selectedRecords.forEach(id => onRestore(id));
    setSelectedRecords([]);
    toast({
      title: "Registros restaurados",
      description: `${selectedRecords.length} registros foram restaurados.`,
    });
  };

  const handleBulkDelete = () => {
    selectedRecords.forEach(id => onPermanentDelete(id));
    setSelectedRecords([]);
    toast({
      title: "Registros excluídos permanentemente",
      description: `${selectedRecords.length} registros foram excluídos permanentemente.`,
    });
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
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <Trash2 className="w-6 h-6 text-red-400" />
            <h1 className="text-xl font-bold text-white">Lixeira</h1>
          </div>
          
          {deletedRecords.length > 0 && (
            <Button
              onClick={onEmptyTrash}
              variant="outline"
              size="sm"
              className="text-red-400 border-red-400 hover:bg-red-400/10"
            >
              Esvaziar Lixeira
            </Button>
          )}
        </div>

        {/* Bulk Actions */}
        {selectedRecords.length > 0 && (
          <Card className="bg-blue-600/20 border-blue-600/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-blue-200">
                  {selectedRecords.length} {selectedRecords.length === 1 ? 'registro selecionado' : 'registros selecionados'}
                </p>
                <div className="flex space-x-2">
                  <Button
                    onClick={handleBulkRestore}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <RotateCcw className="w-4 h-4 mr-1" />
                    Restaurar
                  </Button>
                  <Button
                    onClick={handleBulkDelete}
                    size="sm"
                    variant="destructive"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Excluir
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {deletedRecords.length === 0 ? (
          <Card className="bg-secondary/30 border-secondary">
            <CardContent className="p-8 text-center">
              <Trash2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">
                Lixeira vazia
              </h3>
              <p className="text-muted-foreground">
                Nenhum registro foi excluído recentemente.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {deletedRecords.map((record) => (
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
                        Excluído em: {record.deletedAt ? new Date(record.deletedAt).toLocaleString('pt-BR') : '-'}
                      </p>
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        onClick={() => onRestore(record.id)}
                        size="sm"
                        variant="outline"
                        className="border-green-600 text-green-400 hover:bg-green-600/10"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => onPermanentDelete(record.id)}
                        size="sm"
                        variant="outline"
                        className="border-red-600 text-red-400 hover:bg-red-600/10"
                      >
                        <X className="w-4 h-4" />
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

export default TrashView;
