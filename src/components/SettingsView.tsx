
import React, { useState } from 'react';
import { Settings, Trash2, Shield, Info, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AlarmSettings from './AlarmSettings';
import WorkdaySettings from './WorkdaySettings';

interface SettingsViewProps {
  onBack: () => void;
  onAdvancedPreferences: () => void;
  onUserProfile: () => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({
  onBack,
  onAdvancedPreferences,
  onUserProfile
}) => {
  const requestPermissions = async () => {
    // Simulate permission request
    alert('Verificando permissões...\n\n✅ Câmera: Concedida\n✅ Localização: Concedida\n✅ Armazenamento: Concedido');
  };

  return (
    <div className="p-4 space-y-4 pb-24">
      <div className="flex items-center space-x-3 mb-6">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <Settings className="w-6 h-6 text-indigo-600" />
        <h2 className="text-xl font-bold text-slate-800">Configurações</h2>
      </div>

      {/* Navigation Cards */}
      <div className="space-y-3">
        <Card className="cursor-pointer hover:bg-secondary/40 transition-colors" onClick={onAdvancedPreferences}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-white">Preferências Avançadas</h3>
                <p className="text-sm text-muted-foreground">Tema, idioma e configurações do app</p>
              </div>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 rotate-180" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:bg-secondary/40 transition-colors" onClick={onUserProfile}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-white">Perfil do Usuário</h3>
                <p className="text-sm text-muted-foreground">Informações pessoais e conta</p>
              </div>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 rotate-180" />
              </Button>
            </div>
          </CardContent>
        </Card>
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
              <p className="text-sm text-slate-600">Verificar e solicitar permissões necessárias</p>
            </div>
            <Button variant="outline" onClick={requestPermissions}>
              Verificar
            </Button>
          </div>
          
          <div className="space-y-2 pt-2 border-t">
            <div className="flex items-center justify-between">
              <span className="text-sm">Câmera</span>
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">Ativa</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Localização</span>
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">Ativa</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Armazenamento</span>
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">Ativo</Badge>
            </div>
          </div>
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
            <p className="text-sm text-slate-600">
              Registre seu ponto de forma segura com foto, timestamp e geolocalização.
            </p>
          </div>
          
          <div className="pt-2 border-t space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Armazenamento</span>
              <span className="text-sm text-slate-600">Local</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Câmera</span>
              <span className="text-sm text-slate-600">Traseira</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Backup</span>
              <span className="text-sm text-slate-600">Manual</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Notice */}
      <Card className="bg-indigo-50 border-indigo-200">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-indigo-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-indigo-800">
                Privacidade e Segurança
              </p>
              <p className="text-xs text-indigo-600 mt-1">
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
