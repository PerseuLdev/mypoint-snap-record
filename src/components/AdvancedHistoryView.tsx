
import React, { useState } from 'react';
import { Calendar, Filter, Archive, Download, ArrowLeft, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { TimeRecord } from '@/pages/Index';

interface AdvancedHistoryViewProps {
  records: TimeRecord[];
  onBack: () => void;
}

const AdvancedHistoryView: React.FC<AdvancedHistoryViewProps> = ({ records, onBack }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [showPremiumBanner, setShowPremiumBanner] = useState(true);

  const today = new Date().toLocaleDateString('pt-BR');

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
          <div className="ml-auto">
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="w-4 h-4" />
              Selecionar
            </Button>
          </div>
        </div>
      </header>

      <div className="p-4 space-y-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Histórico de Registros</h2>
        </div>

        {/* Date Filter */}
        <Card className="bg-secondary/30 border-secondary">
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-white">Filtrar por Data</span>
              </div>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-background border-border text-white"
              />
            </div>
          </CardContent>
        </Card>

        {/* Clean Duplicates Button */}
        <Button 
          variant="outline" 
          className="w-full bg-background border-border text-white hover:bg-secondary"
        >
          <Archive className="w-4 h-4 mr-2" />
          Limpar Duplicatas
        </Button>

        {/* Records Summary */}
        <Card className="bg-blue-600/20 border-blue-600/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-blue-400" />
                <span className="font-medium text-white">{records.length} registros</span>
              </div>
              <span className="text-blue-400">{today}</span>
            </div>
          </CardContent>
        </Card>

        {/* Premium Banner */}
        {showPremiumBanner && (
          <Card className="bg-gradient-to-r from-amber-600/20 to-orange-600/20 border-amber-600/30">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-amber-600/30 rounded-lg flex items-center justify-center">
                  <Download className="w-4 h-4 text-amber-400" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-amber-200">Seja Premium!</p>
                  <p className="text-xs text-amber-300">
                    Backup automático + Relatórios avançados.
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPremiumBanner(false)}
                  className="text-amber-300 hover:bg-amber-600/20"
                >
                  ×
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-secondary/50 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Archive className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">
            Nenhum registro encontrado
          </h3>
          <p className="text-muted-foreground">
            Não há registros para esta data
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdvancedHistoryView;
