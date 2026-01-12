
import React, { useEffect, useRef, useState } from 'react';
import type { Stream } from '../types';

// Hls is loaded from the CDN script in index.html, we declare it here for TypeScript
declare const Hls: any;

interface VideoPlayerProps {
  stream: Stream;
  isMainPlayer?: boolean;
  onStreamError?: (streamId: string) => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ stream, isMainPlayer = false, onStreamError }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const errorReportedRef = useRef(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null); // Reset error on stream change
    errorReportedRef.current = false; // Reset error reported flag

    if (stream.playerType === 'hls' && videoRef.current) {
      const video = videoRef.current;
      let hls: any;

      // Use hls.js for HLS playback if supported
      if (Hls.isSupported()) {
        hls = new Hls();
        hls.loadSource(stream.source);
        hls.attachMedia(video);
        hls.on('hlsMediaAttached', () => {
          video.muted = true;
          video.play().catch((e: any) => {
             console.error("Autoplay was prevented:", e);
             setError("Autoplay is blocked by the browser. Please click the video to play.");
          });
        });
        hls.on('hlsError', function (event: any, data: any) {
          console.error('HLS.js error:', event, data);
          if (data.fatal) {
            if (!errorReportedRef.current && onStreamError) {
                onStreamError(stream.id);
                errorReportedRef.current = true;
            }
            switch (data.type) {
              case 'networkError':
                setError(`Could not load stream. Please check your network connection or try another channel.`);
                break;
              case 'mediaError':
                setError(`There was a problem with the video stream. It may be offline or incompatible.`);
                break;
              default:
                setError("An unknown error occurred while trying to load the video stream.");
                break;
            }
          }
        });
      } 
      // Fallback for browsers with native HLS support (like Safari)
      else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = stream.source;
        video.addEventListener('loadedmetadata', () => {
          video.muted = true;
          video.play().catch((e: any) => {
            console.error("Autoplay was prevented:", e);
            setError("Autoplay is blocked. Please click the video to play.");
          });
        });
         video.addEventListener('error', () => {
             if (!errorReportedRef.current && onStreamError) {
                onStreamError(stream.id);
                errorReportedRef.current = true;
            }
             setError("Could not load the video. The stream may be offline.");
        });
      }

      // Cleanup function to destroy hls instance on component unmount or stream change
      return () => {
        if (hls) {
          hls.destroy();
        }
      };
    }
  }, [stream.source, stream.playerType, stream.id, onStreamError]);

  if (stream.playerType === 'hls') {
    return (
      <div className="relative bg-black w-full h-full overflow-hidden flex items-center justify-center">
        <video
          ref={videoRef}
          playsInline
          autoPlay
          muted
          className={`w-full h-full object-cover ${isMainPlayer ? 'transform scale-[1.2]' : ''}`}
          onClick={(e) => (e.target as HTMLVideoElement).play()}
        />
        {error && (
            <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-white p-4 z-10">
                <p className="font-bold text-xl mb-2 text-red-500">Stream Error</p>
                <p className="text-sm text-center text-gray-300">{error}</p>
            </div>
        )}
      </div>
    );
  }

  // Original iframe player for non-HLS streams (like the traffic cameras)
  return (
    <div className={'relative bg-black w-full h-full'}>
      <iframe
        src={stream.source}
        title={stream.title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute top-0 left-0 w-full h-full"
      ></iframe>
    </div>
  );
};