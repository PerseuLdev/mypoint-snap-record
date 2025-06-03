
import React, { useState, useRef } from 'react';
import { Camera, MapPin, Clock, User, CheckCircle, AlertTriangle, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface CameraViewProps {
  onPhotoCapture: (photoData: string) => void;
  currentTime: Date;
  locationStatus: 'loading' | 'success' | 'error';
  recordsCount: number;
}

const CameraView: React.FC<CameraViewProps> = ({
  onPhotoCapture,
  currentTime,
  locationStatus,
  recordsCount
}) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [lastCaptureTime, setLastCaptureTime] = useState<Date | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Simulate camera functionality
  const handleCapture = async () => {
    setIsCapturing(true);
    
    // Simulate photo capture delay
    setTimeout(() => {
      // Generate a placeholder image (in real app, this would be the actual photo)
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      canvas.width = 640;
      canvas.height = 480;
      
      if (ctx) {
        // Create a gradient background
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#e0f2fe');
        gradient.addColorStop(1, '#0369a1');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Add timestamp overlay
        ctx.fillStyle = 'white';
        ctx.font = '24px Arial';
        ctx.fillText(`Registro: ${currentTime.toLocaleString()}`, 20, 50);
        ctx.fillText(`Localização: Confirmada`, 20, 80);
        
        // Add a simulated person silhouette
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.beginPath();
        ctx.arc(320, 200, 80, 0, 2 * Math.PI);
        ctx.fill();
      }
      
      const photoData = canvas.toDataURL('image/jpeg', 0.8);
      
      onPhotoCapture(photoData);
      setLastCaptureTime(new Date());
      setIsCapturing(false);
    }, 1500);
  };

  const getNextRecordType = () => {
    return recordsCount % 2 === 0 ? 'Entrada' : 'Saída';
  };

  const getLocationStatusIcon = () => {
    switch (locationStatus) {
      case 'loading':
        return <div className="animate-spin rounded-full h-4 w-4 border-2 border-orange-500 border-t-transparent" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
    }
  };

  const getLocationStatusText = () => {
    switch (locationStatus) {
      case 'loading':
        return 'Obtendo localização...';
      case 'success':
        return 'Localização confirmada';
      case 'error':
        return 'Erro na localização';
    }
  };

  return (
    <div className="p-4 space-y-4 pb-24">
      {/* Status Cards */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-3">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <div>
                <p className="text-xs text-blue-600 font-medium">Agora</p>
                <p className="text-sm font-bold text-blue-800">
                  {currentTime.toLocaleTimeString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={`${
          locationStatus === 'success' ? 'bg-green-50 border-green-200' :
          locationStatus === 'error' ? 'bg-red-50 border-red-200' :
          'bg-orange-50 border-orange-200'
        }`}>
          <CardContent className="p-3">
            <div className="flex items-center space-x-2">
              {getLocationStatusIcon()}
              <div>
                <p className={`text-xs font-medium ${
                  locationStatus === 'success' ? 'text-green-600' :
                  locationStatus === 'error' ? 'text-red-600' :
                  'text-orange-600'
                }`}>
                  GPS
                </p>
                <p className={`text-sm font-bold ${
                  locationStatus === 'success' ? 'text-green-800' :
                  locationStatus === 'error' ? 'text-red-800' :
                  'text-orange-800'
                }`}>
                  {getLocationStatusText()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Camera Preview */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="relative bg-gradient-to-br from-gray-200 to-gray-400 aspect-[4/3] flex items-center justify-center">
            {/* Simulated camera preview */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-300 opacity-50"></div>
            
            {/* Camera overlay */}
            <div className="relative z-10 text-center">
              <Camera className="w-16 h-16 text-gray-600 mx-auto mb-2" />
              <p className="text-gray-700 font-medium">Visualização da Câmera</p>
              <p className="text-sm text-gray-600">Posicione-se no centro da tela</p>
            </div>

            {/* Timestamp overlay */}
            <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded text-sm">
              {currentTime.toLocaleString()}
            </div>

            {/* Location overlay */}
            <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded text-sm flex items-center space-x-1">
              <MapPin className="w-3 h-3" />
              <span>SP</span>
            </div>

            {/* Frame guide */}
            <div className="absolute inset-8 border-2 border-white border-dashed rounded-lg opacity-50"></div>
          </div>
        </CardContent>
      </Card>

      {/* Next Record Type */}
      <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                <User className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm opacity-90">Próximo registro</p>
                <p className="font-bold text-lg">{getNextRecordType()}</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-white bg-opacity-20 text-white">
              #{recordsCount + 1}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Capture Button */}
      <div className="flex justify-center pt-4">
        <Button
          onClick={handleCapture}
          disabled={isCapturing || locationStatus === 'loading'}
          className={`w-32 h-32 rounded-full bg-blue-700 hover:bg-blue-800 disabled:bg-gray-400 transition-all duration-200 ${
            isCapturing ? 'scale-95' : 'hover:scale-105'
          }`}
        >
          <div className="text-center">
            {isCapturing ? (
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-white border-t-transparent mx-auto mb-2" />
            ) : (
              <Camera className="w-8 h-8 mx-auto mb-2" />
            )}
            <span className="text-sm font-bold">
              {isCapturing ? 'Registrando...' : 'REGISTRAR'}
            </span>
          </div>
        </Button>
      </div>

      {/* Last capture feedback */}
      {lastCaptureTime && !isCapturing && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-3">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-800">
                  Último registro realizado com sucesso!
                </p>
                <p className="text-xs text-green-600">
                  {lastCaptureTime.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CameraView;
