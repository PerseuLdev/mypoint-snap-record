
import React, { useState } from 'react';
import { Camera, MapPin, Shield, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface WelcomeScreenProps {
  onPermissionsGranted: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onPermissionsGranted }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [permissions, setPermissions] = useState({
    camera: false,
    location: false,
    storage: false,
  });

  const steps = [
    {
      title: "Bem-vindo ao MyPoint!",
      content: (
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
            <Clock className="w-10 h-10 text-blue-700" />
          </div>
          <p className="text-gray-600 leading-relaxed">
            Registre seu ponto de forma segura com foto, data/hora e localização. 
            Todos os dados ficam armazenados apenas no seu dispositivo.
          </p>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800 font-medium">
              🔒 Seus dados nunca saem do seu celular
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Permissões Necessárias",
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 text-center mb-6">
            Para funcionar corretamente, o MyPoint precisa das seguintes permissões:
          </p>
          
          <div className="space-y-3">
            <PermissionCard
              icon={<Camera className="w-5 h-5" />}
              title="Câmera"
              description="Para capturar a foto do registro de ponto"
              granted={permissions.camera}
              onGrant={() => setPermissions(prev => ({ ...prev, camera: true }))}
            />
            
            <PermissionCard
              icon={<MapPin className="w-5 h-5" />}
              title="Localização"
              description="Para registrar onde você bateu o ponto"
              granted={permissions.location}
              onGrant={() => setPermissions(prev => ({ ...prev, location: true }))}
            />
            
            <PermissionCard
              icon={<Shield className="w-5 h-5" />}
              title="Armazenamento"
              description="Para salvar os registros no seu dispositivo"
              granted={permissions.storage}
              onGrant={() => setPermissions(prev => ({ ...prev, storage: true }))}
            />
          </div>
        </div>
      )
    }
  ];

  const allPermissionsGranted = Object.values(permissions).every(p => p);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else if (allPermissionsGranted) {
      onPermissionsGranted();
    }
  };

  const handleSkip = () => {
    // Simulate granting all permissions for demo
    setPermissions({ camera: true, location: true, storage: true });
    setTimeout(() => {
      onPermissionsGranted();
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-800">
              {steps[currentStep].title}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {steps[currentStep].content}
            
            {/* Progress indicator */}
            <div className="flex justify-center space-x-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index <= currentStep ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
            
            {/* Action buttons */}
            <div className="space-y-3">
              {currentStep === steps.length - 1 ? (
                <Button
                  onClick={handleNext}
                  disabled={!allPermissionsGranted}
                  className="w-full bg-blue-700 hover:bg-blue-800 text-white py-3"
                  size="lg"
                >
                  {allPermissionsGranted ? 'Começar a usar!' : 'Aguardando permissões...'}
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  className="w-full bg-blue-700 hover:bg-blue-800 text-white py-3"
                  size="lg"
                >
                  Próximo
                </Button>
              )}
              
              <Button
                onClick={handleSkip}
                variant="ghost"
                className="w-full text-gray-600 hover:text-gray-800"
              >
                Pular (Demo)
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

interface PermissionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  granted: boolean;
  onGrant: () => void;
}

const PermissionCard: React.FC<PermissionCardProps> = ({
  icon,
  title,
  description,
  granted,
  onGrant
}) => {
  return (
    <div className={`border rounded-lg p-4 transition-colors ${
      granted ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-white'
    }`}>
      <div className="flex items-start space-x-3">
        <div className={`p-2 rounded-lg ${
          granted ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
        }`}>
          {icon}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-800">{title}</h3>
            {granted ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <Button
                onClick={onGrant}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Permitir
              </Button>
            )}
          </div>
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
