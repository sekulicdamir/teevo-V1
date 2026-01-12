
import React, { useEffect, useRef } from 'react';
import type { Stream } from '../types';

declare const Hls: any;

interface VideoPlayerProps {
  stream: Stream;
  isMainPlayer?: boolean;
  volume?: number;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ stream, isMainPlayer = false, volume }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (stream.playerType === 'hls' && videoRef.current) {
      const video = videoRef.current;
      let hls: any;

      if (typeof Hls !== 'undefined' && Hls.isSupported()) {
        hls = new Hls();
        hls.loadSource(stream.source);
        hls.attachMedia(video);
        hls.on('hlsMediaAttached', () => {
          if (volume !== undefined) {
            video.volume = volume;
            video.muted = volume === 0;
          } else {
            video.muted = true;
          }
          video.play().catch(e => {
             console.error("Autoplay was prevented:", e);
          });
        });
        hls.on('hlsError', function (event: any, data: any) {
          console.error('HLS.js error:', event, data);
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) { // Native HLS support (Safari)
        video.src = stream.source;
        video.addEventListener('loadedmetadata', () => {
          if (volume !== undefined) {
            video.volume = volume;
            video.muted = volume === 0;
          } else {
            video.muted = true;
          }
          video.play().catch(e => {
            console.error("Autoplay was prevented on native HLS:", e);
          });
        });
      }

      return () => {
        if (hls) {
          hls.destroy();
        }
      };
    }
  }, [stream]);

  useEffect(() => {
    if (videoRef.current && stream.playerType === 'hls' && volume !== undefined) {
      videoRef.current.volume = volume;
      videoRef.current.muted = volume === 0;
    }
  }, [volume, stream.playerType]);

  if (stream.playerType === 'hls') {
    return (
      <div className="relative bg-black w-full h-full overflow-hidden flex items-center justify-center">
        <video
          key={stream.id}
          ref={videoRef}
          playsInline
          autoPlay
          muted={volume === 0}
          className={`w-full h-full object-cover ${isMainPlayer ? 'transform scale-[1.15]' : ''}`}
          onClick={(e) => (e.target as HTMLVideoElement).play()}
        />
      </div>
    );
  }
  
  if (stream.playerType === 'iframe') {
    let finalStreamSource = stream.source;
    if (volume !== undefined) {
      // Remove existing mute param and add the correct one.
      finalStreamSource = stream.source.replace(/&?mute=[01]/g, '');
      finalStreamSource += `&mute=${volume === 0 ? 1 : 0}`;
    }

    return (
      <div className={'relative bg-black w-full h-full overflow-hidden'}>
        <iframe
          key={stream.id + finalStreamSource}
          src={finalStreamSource}
          title={stream.title}
          frameBorder="0"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full transform ${isMainPlayer ? 'scale-[1.15]' : ''}`}
        ></iframe>
      </div>
    );
  }

  return (
    <div className="relative bg-black w-full h-full flex items-center justify-center text-white p-4">
        <p className="text-center font-semibold">Unsupported player type for this stream: <span className="font-mono bg-red-800 px-2 py-1 rounded">{stream.playerType}</span></p>
    </div>
  );
};