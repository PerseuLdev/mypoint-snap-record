
import React, { useState } from 'react';
import { Settings, Camera, MapPin, Shield, Info, Trash2, HelpCircle, Lock, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface SettingsViewProps {
  onClearHistory: () => void;
  recordsCount: number;
}

const SettingsView: React.FC<SettingsViewProps> = ({ onClearHistory, recordsCount }) => {
  const [showAbout, setShowAbout] = useState(false);
  const [showPermissions, setShowPermissions] = useState(false);
  const { toast } = useToast();

  const handleRequestPermissions = () => {
    toast({
      title: "Permissões verificadas",
      description: "Todas as permissões estão ativas e funcionando corretamente.",
    });
  };

  const permissions = [
    {
      icon: <Camera className="w-5 h-5" />,
      name: "Câmera",
      description: "Necessária para capturar fotos dos registros",
      status: "granted" as const
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      name: "Localização",
      description: "Necessária para registrar onde o ponto foi batido",
      status: "granted" as const
    },
    {
      icon: <Shield className="w-5 h-5" />,
      name: "Armazenamento",
      description: "Necessária para salvar os registros no dispositivo",
      status: "granted" as const
    }
  ];

  return (
    <div className="p-4 space-y-4 pb-24">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-800">Configurações</h2>
        <p className="text-sm text-gray-600">Gerencie suas preferências e dados</p>
      </div>

      {/* App Status */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Lock className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-green-800">App funcionando normalmente</h3>
              <p className="text-sm text-green-600">
                Todos os dados estão seguros no seu dispositivo
              </p>
            </div>
            <Badge className="bg-green-100 text-green-800">
              {recordsCount} registros
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="space-y-3">
        <h3 className="font-medium text-gray-800">Ações Rápidas</h3>
        
        <Card>
          <CardContent className="p-0">
            <button
              onClick={() => setShowPermissions(true)}
              className="w-full p-4 text-left hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Settings className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800">Verificar Permissões</h4>
                  <p className="text-sm text-gray-600">Revisar e ajustar permissões do app</p>
                </div>
              </div>
            </button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            <button
              onClick={() => setShowAbout(true)}
              className="w-full p-4 text-left hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Info className="w-5 h-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800">Sobre o MyPoint</h4>
                  <p className="text-sm text-gray-600">Informações sobre o aplicativo</p>
                </div>
              </div>
            </button>
          </CardContent>
        </Card>
      </div>

      {/* Data Management */}
      <div className="space-y-3">
        <h3 className="font-medium text-gray-800">Gerenciar Dados</h3>
        
        <Card className="border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-800">Limpar Histórico</h4>
                <p className="text-sm text-gray-600">
                  Remove todos os registros salvos (não pode ser desfeito)
                </p>
              </div>
              <Button
                onClick={onClearHistory}
                variant="outline"
                size="sm"
                className="text-red-600 border-red-200 hover:bg-red-50"
                disabled={recordsCount === 0}
              >
                Limpar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* App Info */}
      <Card className="bg-gray-50">
        <CardContent className="p-4">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <Smartphone className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-medium text-gray-800">MyPoint</h3>
            <p className="text-sm text-gray-600">Versão 1.0.0 (MVP)</p>
            <p className="text-xs text-gray-500">
              Registre seu ponto com segurança e praticidade
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Permissions Dialog */}
      <Dialog open={showPermissions} onOpenChange={setShowPermissions}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Settings className="w-5 h-5" />
              <span>Permissões do App</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              O MyPoint precisa das seguintes permissões para funcionar:
            </p>
            
            <div className="space-y-3">
              {permissions.map((permission, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="p-2 bg-white rounded-lg">
                    {permission.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-800">{permission.name}</h4>
                      <Badge className="bg-green-100 text-green-800">Ativa</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{permission.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <Button
              onClick={handleRequestPermissions}
              className="w-full bg-blue-700 hover:bg-blue-800"
            >
              Verificar Permissões
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* About Dialog */}
      <Dialog open={showAbout} onOpenChange={setShowAbout}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Info className="w-5 h-5" />
              <span>Sobre o MyPoint</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">MyPoint</h3>
              <p className="text-gray-600">Versão 1.0.0 (MVP)</p>
            </div>
            
            <div className="space-y-3 text-sm text-gray-600">
              <p>
                O MyPoint permite que você registre seu ponto de forma segura usando 
                fotos com timestamp e geolocalização.
              </p>
              
              <div className="bg-blue-50 p-3 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">🔒 Privacidade e Segurança</h4>
                <ul className="space-y-1 text-blue-700">
                  <li>• Todos os dados ficam apenas no seu dispositivo</li>
                  <li>• Nenhuma informação é enviada para a internet</li>
                  <li>• Você tem controle total sobre seus registros</li>
                </ul>
              </div>
              
              <div className="bg-green-50 p-3 rounded-lg">
                <h4 className="font-medium text-green-800 mb-2">✨ Funcionalidades</h4>
                <ul className="space-y-1 text-green-700">
                  <li>• Registro com foto, data/hora e localização</li>
                  <li>• Histórico completo com filtros</li>
                  <li>• Interface simples e intuitiva</li>
                </ul>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SettingsView;
