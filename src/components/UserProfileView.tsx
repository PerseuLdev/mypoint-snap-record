
import React from 'react';
import { User, Settings, Sun, Moon, Smartphone, Globe, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface UserProfileViewProps {
  onBack: () => void;
}

const UserProfileView: React.FC<UserProfileViewProps> = ({ onBack }) => {
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
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="p-4 space-y-6">
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

        {/* App Preferences */}
        <Card className="bg-secondary/30 border-secondary">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <Settings className="w-5 h-5 text-blue-400" />
              <span>Preferências do App</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium text-white mb-3">Tema</h4>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="border-muted">
                  Claro
                </Button>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  Escuro
                </Button>
                <Button variant="outline" size="sm" className="border-muted">
                  Sistema
                </Button>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-white mb-3">Idioma</h4>
              <select className="w-full p-2 bg-secondary border border-border rounded-md text-white">
                <option>Português (Brasil)</option>
              </select>
            </div>

            <div>
              <h4 className="font-medium text-white mb-3">Câmera Padrão</h4>
              <div className="flex space-x-2">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  Traseira
                </Button>
                <Button variant="outline" size="sm" className="border-muted">
                  Frontal
                </Button>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-white mb-2">Notificações da Jornada</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Receber alertas de descanso e fim de jornada.
              </p>
              <Button variant="outline" size="sm" className="border-muted">
                Configurar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* App Permissions */}
        <Card className="bg-secondary/30 border-secondary">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <Smartphone className="w-5 h-5 text-blue-400" />
              <span>Permissões do App</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-white">Câmera</p>
              </div>
              <Button variant="outline" size="sm" className="border-muted">
                Verificar
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-white">Localização</p>
              </div>
              <Button variant="outline" size="sm" className="border-muted">
                Verificar
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-white">Notificações</p>
              </div>
              <Button variant="outline" size="sm" className="border-muted">
                Verificar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserProfileView;
