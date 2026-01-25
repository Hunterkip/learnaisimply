import { useState, useRef, useEffect } from "react";
import { Play, Pause, Maximize, Volume2, VolumeX, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface VideoPlayerProps {
  videoUrl?: string;
  posterUrl?: string;
  className?: string;
  onPlay?: () => void;
  onPause?: () => void;
  onEnd?: () => void;
  autoplay?: boolean;
}

export function VideoPlayer({ 
  videoUrl, 
  posterUrl, 
  className,
  onPlay,
  onPause,
  onEnd,
  autoplay = false 
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [isLoading, setIsLoading] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Reset video state when videoUrl changes (lesson navigation)
  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setIsLoading(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [videoUrl]);

  // If no video URL, show placeholder
  if (!videoUrl) {
    return (
      <div className={cn("relative bg-foreground/5 rounded-xl overflow-hidden", className)}>
        <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <Play className="h-10 w-10 text-primary ml-1" />
            </div>
            <p className="text-muted-foreground">No video added yet</p>
          </div>
        </div>
      </div>
    );
  }

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
        onPause?.();
      } else {
        videoRef.current.play();
        setIsPlaying(true);
        onPlay?.();
      }
    }
  };

  const handlePlaybackRate = (rate: number) => {
    setPlaybackRate(rate);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen().catch(err => {
          console.error('Fullscreen request failed:', err);
        });
      }
    }
  };

  const handleLoadStart = () => {
    setIsLoading(true);
  };

  const handleCanPlay = () => {
    setIsLoading(false);
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    onEnd?.();
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    }
    return `${minutes}:${String(secs).padStart(2, "0")}`;
  };

  const playbackRates = [0.75, 1, 1.25, 1.5];

  return (
    <div className={cn("space-y-4", className)}>
      {/* Video Container */}
      <div className="relative bg-black rounded-xl overflow-hidden aspect-video">
        <video
          ref={videoRef}
          className="w-full h-full object-contain"
          poster={posterUrl}
          playsInline
          onLoadStart={handleLoadStart}
          onCanPlay={handleCanPlay}
          onLoadedMetadata={handleLoadedMetadata}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
        >
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Loading Indicator */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <Loader className="h-10 w-10 text-white animate-spin" />
          </div>
        )}

        {/* Play Overlay */}
        {!isPlaying && videoUrl && (
          <div 
            className="absolute inset-0 flex items-center justify-center bg-black/20 cursor-pointer hover:bg-black/40 transition-colors"
            onClick={togglePlay}
          >
            <div className="w-16 h-16 rounded-full bg-white/30 flex items-center justify-center hover:bg-white/40 transition-colors">
              <Play className="h-8 w-8 text-white ml-1" />
            </div>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      {videoUrl && (
        <div className="space-y-2">
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleProgressChange}
            className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="p-4 bg-card border border-border rounded-xl">
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

          {/* Mute */}
          <Button
            variant="secondary"
            size="icon"
            onClick={toggleMute}
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? (
              <VolumeX className="h-5 w-5" />
            ) : (
              <Volume2 className="h-5 w-5" />
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
          <Button variant="secondary" size="icon" onClick={toggleFullscreen} title="Fullscreen">
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

  // Reset audio state when audioUrl changes (lesson navigation)
  useEffect(() => {
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [audioUrl]);

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
