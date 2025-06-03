
import React, { useState } from 'react';
import { Settings, Trash2, Shield, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AlarmSettings from './AlarmSettings';
import WorkdaySettings from './WorkdaySettings';

interface SettingsViewProps {
  onClearHistory: () => void;
  recordsCount: number;
}

const SettingsView: React.FC<SettingsViewProps> = ({
  onClearHistory,
  recordsCount
}) => {
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleClearHistory = () => {
    onClearHistory();
    setShowClearConfirm(false);
  };

  const requestPermissions = async () => {
    // Simulate permission request
    alert('Verificando permissões...\n\n✅ Câmera: Concedida\n✅ Localização: Concedida\n✅ Armazenamento: Concedido');
  };

  return (
    <div className="p-4 space-y-4 pb-24">
      <div className="flex items-center space-x-2 mb-6">
        <Settings className="w-6 h-6 text-blue-700" />
        <h2 className="text-xl font-bold text-gray-800">Configurações</h2>
      </div>

      {/* Workday and Alarm Settings Tabs */}
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

      {/* Permissions Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>Permissões</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Status das Permissões</p>
              <p className="text-sm text-gray-600">Verificar e solicitar permissões necessárias</p>
            </div>
            <Button variant="outline" onClick={requestPermissions}>
              Verificar
            </Button>
          </div>
          
          <div className="space-y-2 pt-2 border-t">
            <div className="flex items-center justify-between">
              <span className="text-sm">Câmera</span>
              <Badge variant="secondary" className="bg-green-100 text-green-800">Ativa</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Localização</span>
              <Badge variant="secondary" className="bg-green-100 text-green-800">Ativa</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Armazenamento</span>
              <Badge variant="secondary" className="bg-green-100 text-green-800">Ativo</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trash2 className="w-5 h-5" />
            <span>Gerenciar Dados</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Histórico de Registros</p>
              <p className="text-sm text-gray-600">
                {recordsCount > 0 
                  ? `${recordsCount} registro${recordsCount !== 1 ? 's' : ''} armazenado${recordsCount !== 1 ? 's' : ''} localmente`
                  : 'Nenhum registro encontrado'
                }
              </p>
            </div>
            {recordsCount > 0 && (
              <Button 
                variant="destructive" 
                onClick={() => setShowClearConfirm(true)}
              >
                Limpar
              </Button>
            )}
          </div>

          {showClearConfirm && (
            <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
              <p className="text-sm text-red-800 mb-3">
                Tem certeza que deseja limpar todo o histórico? Esta ação não pode ser desfeita.
              </p>
              <div className="flex space-x-2">
                <Button 
                  size="sm" 
                  variant="destructive" 
                  onClick={handleClearHistory}
                >
                  Confirmar
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => setShowClearConfirm(false)}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* App Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Info className="w-5 h-5" />
            <span>Sobre o App</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="font-medium">MyPoint v1.0.0</p>
            <p className="text-sm text-gray-600">
              Registre seu ponto de forma segura com foto, timestamp e geolocalização.
            </p>
          </div>
          
          <div className="pt-2 border-t space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Armazenamento</span>
              <span className="text-sm text-gray-600">Local</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Câmera</span>
              <span className="text-sm text-gray-600">Traseira</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Backup</span>
              <span className="text-sm text-gray-600">Manual</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Notice */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-800">
                Privacidade e Segurança
              </p>
              <p className="text-xs text-blue-600 mt-1">
                Todos os seus dados são armazenados localmente no seu dispositivo. 
                Nenhuma informação é enviada para servidores externos.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsView;
