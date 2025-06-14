
import React, { useState, useRef, useEffect } from 'react';
import { Camera, ArrowLeft, AlertTriangle, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { OcorrenciaRecord } from '@/types';

interface OcorrenciaViewProps {
  onBack: () => void;
  onSave: (ocorrencia: Omit<OcorrenciaRecord, 'id'>) => void;
}

const OcorrenciaView: React.FC<OcorrenciaViewProps> = ({ onBack, onSave }) => {
  const [photo, setPhoto] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [location, setLocation] = useState<{ latitude: number; longitude: number; address?: string } | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Get current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            address: "Localização atual"
          });
        },
        (error) => {
          console.error('Erro ao obter localização:', error);
        }
      );
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const initCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false
      });
      setStream(mediaStream);
      setShowCamera(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      toast({
        title: "Erro na câmera",
        description: "Não foi possível acessar a câmera.",
      });
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);
    
    // Add timestamp overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, 40);
    ctx.fillStyle = 'white';
    ctx.font = 'bold 16px Arial';
    ctx.fillText('MyPoint - Ocorrência', 10, 25);
    ctx.font = '14px Arial';
    ctx.fillText(new Date().toLocaleString(), 10, canvas.height - 10);
    
    if (location) {
      ctx.fillText('📍 Localização registrada', canvas.width - 200, canvas.height - 10);
    }
    
    const photoData = canvas.toDataURL('image/jpeg', 0.8);
    setPhoto(photoData);
    setShowCamera(false);
    
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhoto(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!photo || !description) {
      toast({
        title: "Campos obrigatórios",
        description: "Adicione uma foto e descrição da ocorrência.",
      });
      return;
    }

    if (!location) {
      toast({
        title: "Localização necessária",
        description: "A localização é obrigatória para registrar ocorrências.",
      });
      return;
    }

    onSave({
      timestamp: new Date().toISOString(),
      photo,
      description,
      location
    });

    toast({
      title: "Ocorrência registrada!",
      description: "Sua ocorrência foi registrada com sucesso.",
    });

    onBack();
  };

  if (showCamera) {
    return (
      <div className="min-h-screen bg-background">
        <div className="p-4">
          <div className="flex items-center space-x-3 mb-4">
            <Button variant="ghost" size="sm" onClick={() => setShowCamera(false)}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-xl font-bold text-white">Fotografar Ocorrência</h1>
          </div>

          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="relative aspect-[4/3] bg-black">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-8 left-8 right-8 bottom-8 border-2 border-red-500 border-dashed rounded-lg opacity-70">
                  <div className="absolute -top-6 left-2 text-white text-xs bg-red-600 bg-opacity-80 px-2 py-1 rounded">
                    ⚠️ Registre a ocorrência
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <canvas ref={canvasRef} style={{ display: 'none' }} />

          <div className="flex justify-center pt-6">
            <Button
              onClick={capturePhoto}
              className="w-24 h-24 rounded-full bg-red-600 hover:bg-red-700"
            >
              <Camera className="w-8 h-8" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="p-4 space-y-6">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <AlertTriangle className="w-6 h-6 text-orange-400" />
          <h1 className="text-xl font-bold text-white">Reportar Ocorrência</h1>
        </div>

        {/* Photo Section */}
        <Card className="bg-secondary/30 border-secondary">
          <CardHeader>
            <CardTitle className="text-white">Foto da Ocorrência</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {photo ? (
              <div className="relative">
                <img src={photo} alt="Ocorrência" className="w-full rounded-lg" />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPhoto(null)}
                  className="absolute top-2 right-2 bg-black/50 text-white"
                >
                  ×
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <Button
                  onClick={initCamera}
                  className="w-full bg-red-600 hover:bg-red-700"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Fotografar Ocorrência
                </Button>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="w-full border-secondary text-white"
                >
                  Escolher arquivo
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Location */}
        <Card className="bg-secondary/30 border-secondary">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-blue-400" />
              <div>
                <p className="text-sm font-medium text-white">Localização</p>
                {location ? (
                  <p className="text-xs text-muted-foreground">
                    {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground">Obtendo localização...</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Description */}
        <Card className="bg-secondary/30 border-secondary">
          <CardContent className="p-4">
            <Label className="text-white">Descrição da Ocorrência</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva o que aconteceu..."
              className="mt-2 bg-background border-border text-white min-h-[120px]"
            />
          </CardContent>
        </Card>

        {/* Submit Button */}
        <Button
          onClick={handleSave}
          className="w-full bg-red-600 hover:bg-red-700 h-12"
        >
          Registrar Ocorrência
        </Button>
      </div>
    </div>
  );
};

export default OcorrenciaView;
