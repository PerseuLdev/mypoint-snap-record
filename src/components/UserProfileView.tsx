
import React from 'react';
import { User, Settings, Sun, Moon, Smartphone, Globe, ArrowLeft, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ViewType } from '../pages/Index';
import BottomNavigation from './BottomNavigation';

interface UserProfileViewProps {
  onBack: () => void;
  onProfile: () => void;
  onNavigate: (view: ViewType) => void;
}

const UserProfileView: React.FC<UserProfileViewProps> = ({ onBack, onProfile, onNavigate }) => {
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
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">MyPoint</h1>
              <p className="text-xs text-muted-foreground">Olá, Perseu</p>
            </div>
          </div>
          <div className="ml-auto flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Globe className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Sun className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onProfile}>
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="p-4 space-y-6 pb-24">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Perfil e Preferências</h2>
          <p className="text-muted-foreground">
            Gerencie sua conta, perfis de trabalho e preferências do app.
          </p>
        </div>

        {/* User Info */}
        <Card className="bg-secondary/30 border-secondary">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <User className="w-5 h-5 text-blue-400" />
              <span>Informações do Usuário</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Nome Completo:</p>
              <p className="font-medium text-white">Perseu Dev</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">E-mail:</p>
              <p className="font-medium text-white">perseu.dev@gmail.com</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Usuário desde:</p>
              <p className="font-medium text-white">3 de junho de 2025</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Plano:</p>
              <p className="font-medium text-white">Gratuito</p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Settings Preview */}
        <Card className="bg-secondary/30 border-secondary">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <Settings className="w-5 h-5 text-blue-400" />
              <span>Configurações Rápidas</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-white">Tema</p>
                <p className="text-sm text-muted-foreground">Escuro</p>
              </div>
              <Moon className="w-5 h-5 text-blue-400" />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-white">Câmera Padrão</p>
                <p className="text-sm text-muted-foreground">Traseira</p>
              </div>
              <Smartphone className="w-5 h-5 text-blue-400" />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-white">Idioma</p>
                <p className="text-sm text-muted-foreground">Português (Brasil)</p>
              </div>
              <Globe className="w-5 h-5 text-blue-400" />
            </div>

            <Button
              onClick={onProfile}
              variant="outline"
              className="w-full border-secondary text-white hover:bg-secondary/70 mt-4"
            >
              <Settings className="w-4 h-4 mr-2" />
              Ver Todas as Configurações
            </Button>
          </CardContent>
        </Card>

        {/* App Permissions Preview */}
        <Card className="bg-secondary/30 border-secondary">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <Smartphone className="w-5 h-5 text-blue-400" />
              <span>Status das Permissões</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-medium text-white">Câmera</span>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium text-white">Localização</span>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium text-white">Notificações</span>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            </div>
            
            <Button
              onClick={onProfile}
              variant="outline"
              size="sm"
              className="w-full border-secondary text-white hover:bg-secondary/70 mt-3"
            >
              Gerenciar Permissões
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation currentView="user-profile" onNavigate={onNavigate} />
    </div>
  );
};

export default UserProfileView;
