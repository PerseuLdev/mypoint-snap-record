
import React, { useState, useEffect } from 'react';
import { Settings, Sun, Moon, Monitor, Camera, MapPin, Bell, ArrowLeft, Download, Save, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { AppPreferences } from '@/types';

interface AdvancedPreferencesViewProps {
  onBack: () => void;
  onExportData: () => void;
}

const defaultPreferences: AppPreferences = {
  theme: 'dark',
  defaultCamera: 'back',
  permissions: {
    camera: false,
    location: false,
    notifications: false
  },
  workdayNotifications: true,
  hasCompletedOnboarding: true,
  language: 'pt-BR'
};

const AdvancedPreferencesView: React.FC<AdvancedPreferencesViewProps> = ({
  onBack,
  onExportData
}) => {
  const [preferences, setPreferences] = useState<AppPreferences>(defaultPreferences);
  const { toast } = useToast();

  useEffect(() => {
    const savedPrefs = localStorage.getItem('mypoint-preferences');
    if (savedPrefs) {
      try {
        const parsed = JSON.parse(savedPrefs);
        // Ensure permissions object exists
        const mergedPrefs = {
          ...defaultPreferences,
          ...parsed,
          permissions: {
            ...defaultPreferences.permissions,
            ...(parsed.permissions || {})
          }
        };
        setPreferences(mergedPrefs);
      } catch (error) {
        console.error('Error parsing preferences:', error);
        setPreferences(defaultPreferences);
      }
    }
  }, []);

  const savePreferences = () => {
    localStorage.setItem('mypoint-preferences', JSON.stringify(preferences));
    toast({
      title: "Preferências salvas!",
      description: "Suas configurações foram atualizadas.",
    });
  };

  const checkPermission = async (type: 'camera' | 'location' | 'notifications') => {
    try {
      let hasPermission = false;
      
      switch (type) {
        case 'camera':
          try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            stream.getTracks().forEach(track => track.stop());
            hasPermission = true;
          } catch {
            hasPermission = false;
          }
          break;
          
        case 'location':
          if (navigator.geolocation) {
            const permission = await navigator.permissions.query({ name: 'geolocation' });
            hasPermission = permission.state === 'granted';
          }
          break;
          
        case 'notifications':
          if ('Notification' in window) {
            hasPermission = Notification.permission === 'granted';
          }
          break;
      }
      
      setPreferences(prev => ({
        ...prev,
        permissions: {
          ...prev.permissions,
          [type]: hasPermission
        }
      }));
      
      toast({
        title: hasPermission ? "Permissão ativa" : "Permissão negada",
        description: `${type === 'camera' ? 'Câmera' : type === 'location' ? 'Localização' : 'Notificações'} ${hasPermission ? 'está funcionando' : 'precisa ser ativada nas configurações do navegador'}`,
      });
      
    } catch (error) {
      console.error(`Erro ao verificar permissão de ${type}:`, error);
    }
  };

  const requestPermission = async (type: 'camera' | 'location' | 'notifications') => {
    try {
      switch (type) {
        case 'camera':
          await navigator.mediaDevices.getUserMedia({ video: true });
          break;
          
        case 'location':
          navigator.geolocation.getCurrentPosition(() => {}, () => {});
          break;
          
        case 'notifications':
          if ('Notification' in window) {
            await Notification.requestPermission();
          }
          break;
      }
      
      // Recheck permission after request
      setTimeout(() => checkPermission(type), 500);
      
    } catch (error) {
      console.error(`Erro ao solicitar permissão de ${type}:`, error);
    }
  };

  const getThemeIcon = (theme: string) => {
    switch (theme) {
      case 'light': return <Sun className="w-4 h-4" />;
      case 'dark': return <Moon className="w-4 h-4" />;
      case 'system': return <Monitor className="w-4 h-4" />;
      default: return <Moon className="w-4 h-4" />;
    }
  };

  const resetOnboarding = () => {
    setPreferences(prev => ({
      ...prev,
      hasCompletedOnboarding: false
    }));
    toast({
      title: "Onboarding resetado",
      description: "A tela de boas-vindas aparecerá na próxima abertura do app.",
    });
  };

  // Ensure permissions object exists before rendering
  if (!preferences.permissions) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="p-4 space-y-6">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <Settings className="w-6 h-6 text-blue-400" />
          <h1 className="text-xl font-bold text-white">Configurações Avançadas</h1>
        </div>

        {/* Theme Settings */}
        <Card className="bg-secondary/30 border-secondary">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              {getThemeIcon(preferences.theme)}
              <span>Aparência</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium text-white mb-3">Tema</h4>
              <div className="flex space-x-2">
                <Button
                  onClick={() => setPreferences(prev => ({ ...prev, theme: 'light' }))}
                  variant={preferences.theme === 'light' ? "default" : "outline"}
                  size="sm"
                  className={preferences.theme === 'light' ? 
                    "bg-blue-600 hover:bg-blue-700" : 
                    "border-secondary text-white"
                  }
                >
                  <Sun className="w-4 h-4 mr-1" />
                  Claro
                </Button>
                <Button
                  onClick={() => setPreferences(prev => ({ ...prev, theme: 'dark' }))}
                  variant={preferences.theme === 'dark' ? "default" : "outline"}
                  size="sm"
                  className={preferences.theme === 'dark' ? 
                    "bg-blue-600 hover:bg-blue-700" : 
                    "border-secondary text-white"
                  }
                >
                  <Moon className="w-4 h-4 mr-1" />
                  Escuro
                </Button>
                <Button
                  onClick={() => setPreferences(prev => ({ ...prev, theme: 'system' }))}
                  variant={preferences.theme === 'system' ? "default" : "outline"}
                  size="sm"
                  className={preferences.theme === 'system' ? 
                    "bg-blue-600 hover:bg-blue-700" : 
                    "border-secondary text-white"
                  }
                >
                  <Monitor className="w-4 h-4 mr-1" />
                  Sistema
                </Button>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-white mb-3">Idioma</h4>
              <Select 
                value={preferences.language} 
                onValueChange={(value) => setPreferences(prev => ({ ...prev, language: value }))}
              >
                <SelectTrigger className="bg-background border-border text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-secondary border-secondary">
                  <SelectItem value="pt-BR" className="text-white">Português (Brasil)</SelectItem>
                  <SelectItem value="en-US" className="text-white">English (US)</SelectItem>
                  <SelectItem value="es-ES" className="text-white">Español</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Camera Settings */}
        <Card className="bg-secondary/30 border-secondary">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <Camera className="w-5 h-5 text-blue-400" />
              <span>Configurações da Câmera</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium text-white mb-3">Câmera Padrão</h4>
              <div className="flex space-x-2">
                <Button
                  onClick={() => setPreferences(prev => ({ ...prev, defaultCamera: 'back' }))}
                  variant={preferences.defaultCamera === 'back' ? "default" : "outline"}
                  size="sm"
                  className={preferences.defaultCamera === 'back' ? 
                    "bg-blue-600 hover:bg-blue-700" : 
                    "border-secondary text-white"
                  }
                >
                  Traseira
                </Button>
                <Button
                  onClick={() => setPreferences(prev => ({ ...prev, defaultCamera: 'front' }))}
                  variant={preferences.defaultCamera === 'front' ? "default" : "outline"}
                  size="sm"
                  className={preferences.defaultCamera === 'front' ? 
                    "bg-blue-600 hover:bg-blue-700" : 
                    "border-secondary text-white"
                  }
                >
                  Frontal
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Permissions */}
        <Card className="bg-secondary/30 border-secondary">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <Settings className="w-5 h-5 text-blue-400" />
              <span>Permissões do App</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Camera className="w-4 h-4 text-muted-foreground" />
                <span className="text-white">Câmera</span>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={preferences.permissions.camera}
                  onCheckedChange={() => requestPermission('camera')}
                />
                <Button
                  onClick={() => checkPermission('camera')}
                  size="sm"
                  variant="outline"
                  className="border-secondary text-white"
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="text-white">Localização</span>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={preferences.permissions.location}
                  onCheckedChange={() => requestPermission('location')}
                />
                <Button
                  onClick={() => checkPermission('location')}
                  size="sm"
                  variant="outline"
                  className="border-secondary text-white"
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bell className="w-4 h-4 text-muted-foreground" />
                <span className="text-white">Notificações</span>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={preferences.permissions.notifications}
                  onCheckedChange={() => requestPermission('notifications')}
                />
                <Button
                  onClick={() => checkPermission('notifications')}
                  size="sm"
                  variant="outline"
                  className="border-secondary text-white"
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications Settings */}
        <Card className="bg-secondary/30 border-secondary">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <Bell className="w-5 h-5 text-blue-400" />
              <span>Notificações</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-white">Notificações da Jornada</p>
                <p className="text-sm text-muted-foreground">
                  Receber alertas de descanso e fim de jornada.
                </p>
              </div>
              <Switch
                checked={preferences.workdayNotifications}
                onCheckedChange={(checked) => setPreferences(prev => ({ 
                  ...prev, 
                  workdayNotifications: checked 
                }))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card className="bg-secondary/30 border-secondary">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <Download className="w-5 h-5 text-blue-400" />
              <span>Gerenciamento de Dados</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              onClick={onExportData}
              variant="outline"
              className="w-full border-secondary text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar Dados
            </Button>

            <Button
              onClick={resetOnboarding}
              variant="outline"
              className="w-full border-secondary text-white"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Resetar Tutorial
            </Button>
          </CardContent>
        </Card>

        {/* Save Button */}
        <Button
          onClick={savePreferences}
          className="w-full bg-blue-600 hover:bg-blue-700 h-12"
        >
          <Save className="w-4 h-4 mr-2" />
          Salvar Configurações
        </Button>
      </div>
    </div>
  );
};

export default AdvancedPreferencesView;
