
import React, { useState, useRef } from 'react';
import { Camera, MapPin, Clock, User, CheckCircle, AlertTriangle, Circle, FileText, Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useWorkdayTimer } from '@/hooks/useWorkdayTimer';

interface TimeRecord {
  id: string;
  timestamp: string;
  type: 'entrada' | 'saida';
}

interface CameraViewProps {
  onPhotoCapture: (photoData: string) => void;
  currentTime: Date;
  locationStatus: 'loading' | 'success' | 'error';
  recordsCount: number;
  timeRecords: TimeRecord[];
}

const CameraView: React.FC<CameraViewProps> = ({
  onPhotoCapture,
  currentTime,
  locationStatus,
  recordsCount,
  timeRecords
}) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [lastCaptureTime, setLastCaptureTime] = useState<Date | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { timeRemaining, workdayStarted } = useWorkdayTimer(timeRecords);

  // Simulate camera functionality with rear camera
  const handleCapture = async () => {
    setIsCapturing(true);
    
    // Simulate photo capture delay
    setTimeout(() => {
      // Generate a placeholder image simulating a receipt/document photo
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      canvas.width = 640;
      canvas.height = 480;
      
      if (ctx) {
        // Create a more realistic document background
        ctx.fillStyle = '#f8f9fa';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Simulate a document/receipt
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(50, 100, 540, 280);
        ctx.strokeStyle = '#dee2e6';
        ctx.strokeRect(50, 100, 540, 280);
        
        // Add document content simulation
        ctx.fillStyle = '#212529';
        ctx.font = '16px Arial';
        ctx.fillText('COMPROVANTE DE PONTO', 70, 130);
        ctx.font = '14px Arial';
        ctx.fillText(`Data: ${currentTime.toLocaleDateString()}`, 70, 160);
        ctx.fillText(`Horário: ${currentTime.toLocaleTimeString()}`, 70, 180);
        ctx.fillText('Localização: Confirmada', 70, 200);
        
        // Add timestamp overlay (as if taken by rear camera)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, 30);
        ctx.fillStyle = 'white';
        ctx.font = '14px Arial';
        ctx.fillText(`📸 ${currentTime.toLocaleString()} - Câmera Traseira`, 10, 20);
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

  const getTimerColor = () => {
    if (timeRemaining === 'Vencido') return 'text-red-800 bg-red-50 border-red-200';
    if (timeRemaining === 'Concluído') return 'text-green-800 bg-green-50 border-green-200';
    return 'text-blue-800 bg-blue-50 border-blue-200';
  };

  return (
    <div className="p-4 space-y-4 pb-24">
      {/* Status Cards */}
      <div className="grid grid-cols-2 gap-3">
        <Card className={workdayStarted ? getTimerColor() : 'bg-gray-50 border-gray-200'}>
          <CardContent className="p-3">
            <div className="flex items-center space-x-2">
              <Timer className={`w-4 h-4 ${workdayStarted ? '' : 'text-gray-600'}`} />
              <div>
                <p className={`text-xs font-medium ${workdayStarted ? '' : 'text-gray-600'}`}>
                  {workdayStarted ? 'Tempo Restante' : 'Jornada'}
                </p>
                <p className={`text-sm font-bold ${workdayStarted ? '' : 'text-gray-600'}`}>
                  {workdayStarted ? timeRemaining : 'Não iniciada'}
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

      {/* Current Time Card */}
      <Card className="bg-slate-50 border-slate-200">
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-slate-600" />
              <span className="text-sm font-medium text-slate-600">Agora</span>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-slate-800">
                {currentTime.toLocaleTimeString()}
              </p>
              <p className="text-xs text-slate-600">
                {currentTime.toLocaleDateString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Instruction Card */}
      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="p-3">
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4 text-yellow-600" />
            <div>
              <p className="text-sm font-medium text-yellow-800">
                Fotografe o comprovante de ponto
              </p>
              <p className="text-xs text-yellow-600">
                Use a câmera traseira para melhor qualidade
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Camera Preview - Rear Camera */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="relative bg-gradient-to-br from-gray-200 to-gray-400 aspect-[4/3] flex items-center justify-center">
            {/* Simulated rear camera preview */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-300 opacity-50"></div>
            
            {/* Camera overlay */}
            <div className="relative z-10 text-center">
              <Camera className="w-16 h-16 text-gray-600 mx-auto mb-2" />
              <p className="text-gray-700 font-medium">Câmera Traseira Ativa</p>
              <p className="text-sm text-gray-600">Posicione o comprovante no centro</p>
              <p className="text-xs text-gray-500 mt-1">📱 Segure firme para melhor foco</p>
            </div>

            {/* Timestamp overlay - moved to bottom */}
            <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded text-sm">
              {currentTime.toLocaleString()}
            </div>

            {/* Camera type indicator - moved to bottom right */}
            <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded text-sm flex items-center space-x-1">
              <Camera className="w-3 h-3" />
              <span>Traseira</span>
            </div>

            {/* Document frame guide - adjusted position */}
            <div className="absolute inset-12 border-2 border-white border-dashed rounded-lg opacity-70">
              <div className="absolute -top-6 left-2 text-white text-xs bg-black bg-opacity-50 px-2 py-1 rounded">
                📄 Comprovante aqui
              </div>
            </div>
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
              {isCapturing ? 'Fotografando...' : 'FOTOGRAFAR'}
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
                  Comprovante fotografado com sucesso!
                </p>
                <p className="text-xs text-green-600">
                  {lastCaptureTime.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default CameraView;
