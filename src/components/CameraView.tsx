
import React, { useState, useRef, useEffect } from 'react';
import { Camera, MapPin, Clock, User, CheckCircle, AlertTriangle, Circle, FileText, Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useWorkdayTimer } from '@/hooks/useWorkdayTimer';
import { useToast } from '@/hooks/use-toast';

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
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { timeRemaining, workdayStarted } = useWorkdayTimer(timeRecords);
  const { toast } = useToast();

  // Initialize camera
  useEffect(() => {
    const initCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: 'environment' }, // Prefer rear camera
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: false
        });
        
        setStream(mediaStream);
        setCameraError(null);
        
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (error) {
        console.error('Erro ao acessar câmera:', error);
        setCameraError('Não foi possível acessar a câmera. Verifique as permissões.');
        toast({
          title: "Erro na câmera",
          description: "Não foi possível acessar a câmera. Verifique as permissões.",
        });
      }
    };

    initCamera();

    // Cleanup function
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Real camera capture
  const handleCapture = async () => {
    if (!videoRef.current || !canvasRef.current || cameraError) {
      toast({
        title: "Erro",
        description: "Câmera não disponível",
      });
      return;
    }

    setIsCapturing(true);
    
    try {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Não foi possível obter contexto do canvas');
      }

      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw video frame to canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Add overlay with timestamp and type
      const recordType = recordsCount % 2 === 0 ? 'ENTRADA' : 'SAÍDA';
      const timestamp = currentTime.toLocaleString();
      
      // Add semi-transparent overlay
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, canvas.width, 40);
      
      // Add text overlay
      ctx.fillStyle = 'white';
      ctx.font = 'bold 16px Arial';
      ctx.fillText(`MyPoint - ${recordType}`, 10, 25);
      
      ctx.font = '14px Arial';
      ctx.fillText(timestamp, 10, canvas.height - 10);
      
      // Add location if available
      if (locationStatus === 'success') {
        ctx.fillText('📍 Localização confirmada', canvas.width - 200, canvas.height - 10);
      }
      
      // Convert to data URL
      const photoData = canvas.toDataURL('image/jpeg', 0.8);
      
      onPhotoCapture(photoData);
      setLastCaptureTime(new Date());
      setIsCapturing(false);
      
      toast({
        title: "Foto capturada!",
        description: `${recordType.toLowerCase()} registrada com sucesso.`,
      });
      
    } catch (error) {
      console.error('Erro ao capturar foto:', error);
      setIsCapturing(false);
      toast({
        title: "Erro na captura",
        description: "Não foi possível capturar a foto. Tente novamente.",
      });
    }
  };

  const getNextRecordType = () => {
    return recordsCount % 2 === 0 ? 'Entrada' : 'Saída';
  };

  const getLocationStatusIcon = () => {
    switch (locationStatus) {
      case 'loading':
        return <div className="animate-spin rounded-full h-4 w-4 border-2 border-amber-500 border-t-transparent" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-emerald-600" />;
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
    return 'text-indigo-800 bg-indigo-50 border-indigo-200';
  };

  return (
    <div className="p-4 space-y-4 pb-24">
      {/* Status Cards */}
      <div className="grid grid-cols-2 gap-3">
        <Card className={workdayStarted ? getTimerColor() : 'bg-slate-50 border-slate-200'}>
          <CardContent className="p-3">
            <div className="flex items-center space-x-2">
              <Timer className={`w-4 h-4 ${workdayStarted ? '' : 'text-slate-600'}`} />
              <div>
                <p className={`text-xs font-medium ${workdayStarted ? '' : 'text-slate-600'}`}>
                  {workdayStarted ? 'Tempo Restante' : 'Jornada'}
                </p>
                <p className={`text-sm font-bold ${workdayStarted ? '' : 'text-slate-600'}`}>
                  {workdayStarted ? timeRemaining : 'Aguardando entrada'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={`${
          locationStatus === 'success' ? 'bg-emerald-50 border-emerald-200' :
          locationStatus === 'error' ? 'bg-red-50 border-red-200' :
          'bg-amber-50 border-amber-200'
        }`}>
          <CardContent className="p-3">
            <div className="flex items-center space-x-2">
              {getLocationStatusIcon()}
              <div>
                <p className={`text-xs font-medium ${
                  locationStatus === 'success' ? 'text-emerald-600' :
                  locationStatus === 'error' ? 'text-red-600' :
                  'text-amber-600'
                }`}>
                  GPS
                </p>
                <p className={`text-sm font-bold ${
                  locationStatus === 'success' ? 'text-emerald-800' :
                  locationStatus === 'error' ? 'text-red-800' :
                  'text-amber-800'
                }`}>
                  {getLocationStatusText()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Instruction Card */}
      <Card className="bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-200">
        <CardContent className="p-3">
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4 text-indigo-600" />
            <div>
              <p className="text-sm font-medium text-indigo-800">
                Fotografe o comprovante de ponto
              </p>
              <p className="text-xs text-indigo-600">
                Posicione o documento no centro da tela
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Camera Preview */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="relative aspect-[4/3] bg-black">
            {cameraError ? (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-200">
                <div className="text-center">
                  <Camera className="w-16 h-16 text-slate-400 mx-auto mb-2" />
                  <p className="text-slate-600 font-medium">Câmera indisponível</p>
                  <p className="text-sm text-slate-500">{cameraError}</p>
                </div>
              </div>
            ) : (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                
                {/* Document frame guide */}
                <div className="absolute top-8 left-8 right-8 bottom-8 border-2 border-white border-dashed rounded-lg opacity-70">
                  <div className="absolute -top-6 left-2 text-white text-xs bg-black bg-opacity-50 px-2 py-1 rounded">
                    📄 Comprovante aqui
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Hidden canvas for photo capture */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* Next Record Type */}
      <Card className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
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
          disabled={isCapturing || locationStatus === 'loading' || !!cameraError}
          className={`w-32 h-32 rounded-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 transition-all duration-200 ${
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
        <Card className="bg-emerald-50 border-emerald-200">
          <CardContent className="p-3">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <div>
                <p className="text-sm font-medium text-emerald-800">
                  Comprovante fotografado com sucesso!
                </p>
                <p className="text-xs text-emerald-600">
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
