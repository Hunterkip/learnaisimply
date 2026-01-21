import { useState, useRef } from "react";
import { Play, Pause, Maximize, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface VideoPlayerProps {
  videoUrl?: string;
  posterUrl?: string;
  className?: string;
}

export function VideoPlayer({ videoUrl, posterUrl, className }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handlePlaybackRate = (rate: number) => {
    setPlaybackRate(rate);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const playbackRates = [0.75, 1, 1.25, 1.5];

  return (
    <div className={cn("relative bg-foreground/5 rounded-xl overflow-hidden", className)}>
      {/* Video Placeholder */}
      <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center relative">
        {/* Demo placeholder - would be replaced with actual video */}
        <div className="text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <Play className="h-10 w-10 text-primary ml-1" />
          </div>
          <p className="text-muted-foreground">Video lesson content</p>
        </div>
        
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover opacity-0 pointer-events-none"
          poster={posterUrl}
          playsInline
        >
          {videoUrl && <source src={videoUrl} type="video/mp4" />}
        </video>
      </div>

      {/* Controls */}
      <div className="p-4 bg-card border-t border-border">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          {/* Play/Pause */}
          <Button
            variant="default"
            size="default"
            onClick={togglePlay}
            className="gap-2"
          >
            {isPlaying ? (
              <>
                <Pause className="h-5 w-5" />
                Pause
              </>
            ) : (
              <>
                <Play className="h-5 w-5" />
                Play Video
              </>
            )}
          </Button>

          {/* Speed Control */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Speed:</span>
            <div className="flex gap-1">
              {playbackRates.map((rate) => (
                <button
                  key={rate}
                  onClick={() => handlePlaybackRate(rate)}
                  className={cn(
                    "px-3 py-2 text-sm rounded-lg transition-colors min-h-[44px]",
                    playbackRate === rate
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary hover:bg-secondary/80 text-foreground"
                  )}
                >
                  {rate}x
                </button>
              ))}
            </div>
          </div>

          {/* Fullscreen */}
          <Button variant="secondary" size="icon" onClick={toggleFullscreen}>
            <Maximize className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

interface AudioOptionProps {
  audioUrl?: string;
}

export function AudioOption({ audioUrl }: AudioOptionProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  if (!audioUrl) {
    return (
      <div className="flex items-center gap-4 p-4 bg-secondary/50 rounded-xl">
        <Button variant="audio" className="gap-2" disabled>
          <Volume2 className="h-5 w-5" />
          Audio Coming Soon
        </Button>
        <span className="text-sm text-muted-foreground">
          Audio version will be available soon.
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 p-4 bg-secondary/50 rounded-xl">
      <audio ref={audioRef} src={audioUrl} onEnded={handleAudioEnded} />
      <Button variant="audio" className="gap-2" onClick={toggleAudio}>
        {isPlaying ? <Pause className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
        {isPlaying ? "Pause Audio" : "Listen to Audio Version"}
      </Button>
      <span className="text-sm text-muted-foreground">
        Prefer to listen? Play the audio version.
      </span>
    </div>
  );
}
