import React, { useState, useRef, useEffect } from 'react';
import { Camera, ArrowLeft, Calendar, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { AttestadoRecord } from '@/types';

interface AttestadoViewProps {
  onBack: () => void;
  onCreateAttestado: (attestado: Omit<AttestadoRecord, 'id' | 'timestamp'>) => void;
  attestadoRecords: AttestadoRecord[];
}

const AttestadoView: React.FC<AttestadoViewProps> = ({ onBack, onCreateAttestado, attestadoRecords }) => {
  const [photo, setPhoto] = useState<string | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [description, setDescription] = useState('');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
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
    ctx.fillText('MyPoint - Atestado Médico', 10, 25);
    ctx.font = '14px Arial';
    ctx.fillText(new Date().toLocaleString(), 10, canvas.height - 10);
    
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
    if (!photo || !startDate || !description) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios.",
      });
      return;
    }

    onCreateAttestado({
      photo,
      startDate,
      endDate,
      description
    });

    toast({
      title: "Atestado enviado!",
      description: "Seu atestado médico foi registrado com sucesso.",
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
            <h1 className="text-xl font-bold text-white">Fotografar Atestado</h1>
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
                <div className="absolute top-8 left-8 right-8 bottom-8 border-2 border-white border-dashed rounded-lg opacity-70">
                  <div className="absolute -top-6 left-2 text-white text-xs bg-black bg-opacity-50 px-2 py-1 rounded">
                    📄 Posicione o atestado aqui
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <canvas ref={canvasRef} style={{ display: 'none' }} />

          <div className="flex justify-center pt-6">
            <Button
              onClick={capturePhoto}
              className="w-24 h-24 rounded-full bg-blue-600 hover:bg-blue-700"
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
          <FileText className="w-6 h-6 text-blue-400" />
          <h1 className="text-xl font-bold text-white">Enviar Novo Atestado</h1>
        </div>

        {/* Photo Section */}
        <Card className="bg-secondary/30 border-secondary">
          <CardHeader>
            <CardTitle className="text-white">Foto do Atestado</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {photo ? (
              <div className="relative">
                <img src={photo} alt="Atestado" className="w-full rounded-lg" />
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
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Fotografar Atestado
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
                <p className="text-sm text-muted-foreground text-center">
                  Nenhum... escolhido
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Date Section */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-secondary/30 border-secondary">
            <CardContent className="p-4">
              <Label className="text-white">Data de Início</Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="mt-2 bg-background border-border text-white"
                placeholder="dd/mm/aaaa"
              />
            </CardContent>
          </Card>

          <Card className="bg-secondary/30 border-secondary">
            <CardContent className="p-4">
              <Label className="text-white">Data de Fim</Label>
              <p className="text-sm text-muted-foreground mb-2">(Opcional)</p>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-background border-border text-white"
                placeholder="dd/mm/aaaa"
              />
            </CardContent>
          </Card>
        </div>

        {/* Description */}
        <Card className="bg-secondary/30 border-secondary">
          <CardContent className="p-4">
            <Label className="text-white">Descrição</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Atestado de 3 dias..."
              className="mt-2 bg-background border-border text-white min-h-[100px]"
            />
          </CardContent>
        </Card>

        {/* Submit Button */}
        <Button
          onClick={handleSave}
          className="w-full bg-blue-600 hover:bg-blue-700 h-12"
        >
          Enviar Atestado
        </Button>

        {/* History */}
        <Card className="bg-secondary/30 border-secondary">
          <CardHeader>
            <CardTitle className="text-white">Histórico de Envios</CardTitle>
          </CardHeader>
          <CardContent>
            {attestadoRecords.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Nenhum atestado enviado.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {attestadoRecords.map((record) => (
                  <div key={record.id} className="p-3 bg-background rounded-lg">
                    <p className="text-white font-medium">{record.description}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(record.startDate).toLocaleDateString('pt-BR')}
                      {record.endDate && ` - ${new Date(record.endDate).toLocaleDateString('pt-BR')}`}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AttestadoView;
