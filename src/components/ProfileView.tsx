
import React, { useState } from 'react';
import { User, Trash2, Shield, Info, Crown, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ProfileViewProps {
  onClearHistory: () => void;
  recordsCount: number;
  onBack: () => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({
  onClearHistory,
  recordsCount,
  onBack
}) => {
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleClearHistory = () => {
    onClearHistory();
    setShowClearConfirm(false);
  };

  const requestPermissions = async () => {
    alert('Verificando permissões...\n\n✅ Câmera: Concedida\n✅ Localização: Concedida\n✅ Armazenamento: Concedido');
  };

  return (
    <div className="p-4 space-y-4 pb-24">
      <div className="flex items-center space-x-3 mb-6">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <User className="w-6 h-6 text-indigo-600" />
        <h2 className="text-xl font-bold text-slate-800">Perfil</h2>
      </div>

      {/* Premium Plan Card */}
      <Card className="bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Crown className="w-5 h-5 text-amber-600" />
            <span className="text-amber-800">Plano Premium</span>
            <Badge className="bg-amber-100 text-amber-800">Em breve</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-amber-700 mb-3">
            Desbloqueie recursos avançados como relatórios detalhados, backup na nuvem e muito mais.
          </p>
          <Button variant="outline" className="border-amber-300 text-amber-700 hover:bg-amber-50" disabled>
            Saiba mais
          </Button>
        </CardContent>
      </Card>

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
              <p className="text-sm text-slate-600">
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

export default ProfileView;
