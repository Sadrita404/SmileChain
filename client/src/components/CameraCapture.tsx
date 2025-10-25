import { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Camera, RotateCw, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface CameraCaptureProps {
  onCapture: (imageSrc: string) => void;
  isProcessing?: boolean;
}

export function CameraCapture({ onCapture, isProcessing = false }: CameraCaptureProps) {
  const webcamRef = useRef<Webcam>(null);
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState(false);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setImgSrc(imageSrc);
    }
  }, [webcamRef]);

  const retake = () => {
    setImgSrc(null);
  };

  const confirmCapture = () => {
    if (imgSrc) {
      onCapture(imgSrc);
      setImgSrc(null);
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="relative bg-muted aspect-[3/4] max-h-[600px] flex items-center justify-center">
        {!imgSrc ? (
          <>
            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/jpeg"
              videoConstraints={{
                width: 720,
                height: 960,
                facingMode: 'user',
              }}
              onUserMedia={() => {
                setCameraReady(true);
                setCameraError(false);
              }}
              onUserMediaError={() => {
                setCameraError(true);
                setCameraReady(false);
              }}
              className="w-full h-full object-cover"
              data-testid="webcam-feed"
            />
            
            {/* Face detection guide overlay */}
            {cameraReady && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="border-4 border-primary/40 rounded-full w-72 h-96 max-w-[80%] max-h-[80%]" />
              </div>
            )}

            {/* Camera status indicators */}
            {!cameraReady && !cameraError && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                <div className="text-center space-y-2">
                  <Camera className="h-12 w-12 mx-auto text-muted-foreground animate-pulse" />
                  <p className="text-sm text-muted-foreground">Initializing camera...</p>
                </div>
              </div>
            )}

            {cameraError && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                <div className="text-center space-y-2">
                  <XCircle className="h-12 w-12 mx-auto text-destructive" />
                  <p className="text-sm text-foreground font-medium">Camera access denied</p>
                  <p className="text-xs text-muted-foreground">Please allow camera permissions</p>
                </div>
              </div>
            )}
          </>
        ) : (
          <img src={imgSrc} alt="Captured selfie" className="w-full h-full object-cover" data-testid="img-captured" />
        )}
      </div>

      <div className="p-6 space-y-4">
        {!imgSrc ? (
          <Button
            onClick={capture}
            disabled={!cameraReady || isProcessing}
            size="lg"
            className="w-full gap-2"
            data-testid="button-capture"
          >
            <Camera className="h-5 w-5" />
            Capture Smile
          </Button>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={retake}
              variant="outline"
              size="lg"
              className="gap-2"
              data-testid="button-retake"
            >
              <RotateCw className="h-4 w-4" />
              Retake
            </Button>
            <Button
              onClick={confirmCapture}
              size="lg"
              className="gap-2"
              disabled={isProcessing}
              data-testid="button-analyze"
            >
              <CheckCircle className="h-4 w-4" />
              {isProcessing ? 'Analyzing...' : 'Analyze Smile'}
            </Button>
          </div>
        )}

        <p className="text-xs text-center text-muted-foreground">
          Position your face within the oval guide for best results
        </p>
      </div>
    </Card>
  );
}
