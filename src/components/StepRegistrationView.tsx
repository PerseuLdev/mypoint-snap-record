
import React, { useState, useRef, useEffect } from 'react';
import { Camera, MapPin, Clock, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { TimeRecord, ShiftType } from '@/types';

interface StepRegistrationViewProps {
  onPhotoCapture: (photoData: string, type: TimeRecord['type']) => void;
  currentTime: Date;
  locationStatus: 'loading' | 'success' | 'error';
  timeRecords: TimeRecord[];
  shiftTypes: ShiftType[];
  activeShiftType?: ShiftType;
}

const StepRegistrationView: React.FC<StepRegistrationViewProps> = ({
  onPhotoCapture,
  currentTime,
  locationStatus,
  timeRecords,
  shiftTypes,
  activeShiftType
}) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<TimeRecord['type']>('entrada');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  // Determine next step based on today's records
  const getNextStep = (): TimeRecord['type'] => {
    const today = new Date().toDateString();
    const todayRecords = timeRecords.filter(record => 
      new Date(record.timestamp).toDateString() === today && !record.deleted
    ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    if (todayRecords.length === 0) return 'entrada';
    
    const lastRecord = todayRecords[todayRecords.length - 1];
    
    switch (lastRecord.type) {
      case 'entrada':
        return 'pausa_inicio';
      case 'pausa_inicio':
        return 'pausa_fim';
      case 'pausa_fim':
        return 'saida';
      case 'saida':
        return 'entrada'; // Novo dia
      default:
        return 'entrada';
    }
  };

  useEffect(() => {
    setSelectedType(getNextStep());
  }, [timeRecords]);

  // Initialize camera
  useEffect(() => {
    const initCamera = async () => {
      try {
        const savedPrefs = localStorage.getItem('mypoint-preferences');
        const preferences = savedPrefs ? JSON.parse(savedPrefs) : { defaultCamera: 'back' };
        
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: preferences.defaultCamera === 'front' ? 'user' : 'environment',
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
      }
    };

    initCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const getStepInfo = (type: TimeRecord['type']) => {
    switch (type) {
      case 'entrada':
        return { label: 'Entrada', color: 'bg-green-600', icon: '→' };
      case 'pausa_inicio':
        return { label: 'Iniciar Pausa', color: 'bg-orange-600', icon: '⏸' };
      case 'pausa_fim':
        return { label: 'Finalizar Pausa', color: 'bg-blue-600', icon: '▶' };
      case 'saida':
        return { label: 'Saída', color: 'bg-red-600', icon: '←' };
    }
  };

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

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Add overlay with shift info
      const stepInfo = getStepInfo(selectedType);
      const timestamp = currentTime.toLocaleString();
      
      // Semi-transparent overlay
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(0, 0, canvas.width, 60);
      
      // Shift type label
      if (activeShiftType) {
        ctx.fillStyle = activeShiftType.color;
        ctx.fillRect(0, 0, canvas.width, 30);
        ctx.fillStyle = 'white';
        ctx.font = 'bold 16px Arial';
        ctx.fillText(`Turno: ${activeShiftType.name}`, 10, 20);
      }
      
      // Step info
      ctx.fillStyle = 'white';
      ctx.font = 'bold 18px Arial';
      ctx.fillText(`${stepInfo.icon} ${stepInfo.label}`, 10, 45);
      
      ctx.font = '14px Arial';
      ctx.fillText(timestamp, 10, canvas.height - 10);
      
      if (locationStatus === 'success') {
        ctx.fillText('📍 Localização confirmada', canvas.width - 200, canvas.height - 10);
      }
      
      const photoData = canvas.toDataURL('image/jpeg', 0.8);
      onPhotoCapture(photoData, selectedType);
      setIsCapturing(false);
      
    } catch (error) {
      console.error('Erro ao capturar foto:', error);
      setIsCapturing(false);
      toast({
        title: "Erro na captura",
        description: "Não foi possível capturar a foto. Tente novamente.",
      });
    }
  };

  const stepOptions: Array<{ type: TimeRecord['type']; available: boolean }> = [
    { type: 'entrada', available: true },
    { type: 'pausa_inicio', available: true },
    { type: 'pausa_fim', available: true },
    { type: 'saida', available: true }
  ];

  return (
    <div className="p-4 space-y-4 pb-24">
      {/* Active Shift Info */}
      {activeShiftType && (
        <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></div>
              <div>
                <p className="text-sm opacity-90">Turno Ativo</p>
                <p className="font-bold text-lg">{activeShiftType.name}</p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-sm opacity-90">Próximo Evento</p>
                <p className="font-bold">Fim da Jornada</p>
                <p className="text-lg">05:36:57</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step Selection */}
      <Card className="bg-secondary/30 border-secondary">
        <CardContent className="p-4">
          <h3 className="font-medium text-white mb-4">Selecione o Tipo de Registro</h3>
          <div className="grid grid-cols-2 gap-3">
            {stepOptions.map(({ type, available }) => {
              const stepInfo = getStepInfo(type);
              const isSelected = selectedType === type;
              const isNext = type === getNextStep();
              
              return (
                <Button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  disabled={!available}
                  className={`h-20 flex flex-col space-y-1 ${
                    isSelected 
                      ? `${stepInfo.color} text-white` 
                      : 'bg-secondary/50 text-muted-foreground hover:bg-secondary/70'
                  } ${isNext ? 'ring-2 ring-blue-400' : ''}`}
                >
                  <span className="text-2xl">{stepInfo.icon}</span>
                  <span className="text-sm font-medium">{stepInfo.label}</span>
                  {isNext && <Badge variant="secondary" className="text-xs">Sugerido</Badge>}
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* GPS Status */}
      <Card className={`${
        locationStatus === 'success' ? 'bg-emerald-600/20 border-emerald-600/30' :
        locationStatus === 'error' ? 'bg-red-600/20 border-red-600/30' :
        'bg-amber-600/20 border-amber-600/30'
      }`}>
        <CardContent className="p-3">
          <div className="flex items-center space-x-2">
            {locationStatus === 'loading' && (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-amber-500 border-t-transparent" />
            )}
            {locationStatus === 'success' && <CheckCircle className="w-4 h-4 text-emerald-400" />}
            {locationStatus === 'error' && <AlertCircle className="w-4 h-4 text-red-400" />}
            <div>
              <p className={`text-sm font-medium ${
                locationStatus === 'success' ? 'text-emerald-200' :
                locationStatus === 'error' ? 'text-red-200' :
                'text-amber-200'
              }`}>
                {locationStatus === 'loading' && 'Obtendo localização...'}
                {locationStatus === 'success' && 'GPS OK'}
                {locationStatus === 'error' && 'Erro no GPS'}
              </p>
            </div>
            <div className="ml-auto">
              <Button variant="ghost" size="sm">
                <RefreshCw className="w-4 h-4" />
              </Button>
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
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            )}
            
            {/* Crosshair overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-64 h-64 border-2 border-white border-dashed opacity-50"></div>
            </div>
          </div>
        </CardContent>
      </Card>

      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* Capture Button */}
      <div className="flex justify-center pt-4">
        <Button
          onClick={handleCapture}
          disabled={isCapturing || locationStatus === 'loading' || !!cameraError}
          className={`w-32 h-32 rounded-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 transition-all duration-200 ${
            isCapturing ? 'scale-95' : 'hover:scale-105'
          }`}
        >
          <div className="text-center">
            {isCapturing ? (
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-white border-t-transparent mx-auto mb-2" />
            ) : (
              <Camera className="w-8 h-8 mx-auto mb-2" />
            )}
            <span className="text-sm font-bold block">
              {isCapturing ? 'Registrando...' : `Registrando como: ${getStepInfo(selectedType).label}`}
            </span>
          </div>
        </Button>
      </div>
    </div>
  );
};

export default StepRegistrationView;
