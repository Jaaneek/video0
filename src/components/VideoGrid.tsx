"use client";
import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";

const VIDEOS = [
  {
    id: "video1",
    thumbnail: "https://fqnqeyjbhlesotcxsibt.supabase.co/storage/v1/object/sign/images/34a5a816-e3b4-44f4-8c63-bf573fb34ba2.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InN0b3JhZ2UtdXJsLXNpZ25pbmcta2V5XzUwOWJjNzhhLThhYzQtNDJkNS1hNTg5LTA1YjUyY2ZhNDQwYyJ9.eyJ1cmwiOiJpbWFnZXMvMzRhNWE4MTYtZTNiNC00NGY0LThjNjMtYmY1NzNmYjM0YmEyLmpwZyIsImlhdCI6MTc0NDk0NDc1MSwiZXhwIjozMTUzNjE3MTM0MDg3NTF9.FGNbgicVGk19HrhhNN8dbCzqOMqWkt7pjyPqh3TvWLA",
    videoUrl: "https://fqnqeyjbhlesotcxsibt.supabase.co/storage/v1/object/sign/videos/f4da4c2f-0ff5-47a6-aba6-1b7041305835.mp4?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InN0b3JhZ2UtdXJsLXNpZ25pbmcta2V5XzUwOWJjNzhhLThhYzQtNDJkNS1hNTg5LTA1YjUyY2ZhNDQwYyJ9.eyJ1cmwiOiJ2aWRlb3MvZjRkYTRjMmYtMGZmNS00N2E2LWFiYTYtMWI3MDQxMzA1ODM1Lm1wNCIsImlhdCI6MTc0NDk0NDgzMywiZXhwIjozMTU1MzEzNDA4ODMzfQ.0OoSo1z9IOeLep4cqd1LtKXxWl4sS7j-vAIhh0vIxC4"
  },
  {
    id: "video2",
    thumbnail: "https://fqnqeyjbhlesotcxsibt.supabase.co/storage/v1/object/sign/images/5ec47f8d-2132-45d8-b714-9ab46d876cbe.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InN0b3JhZ2UtdXJsLXNpZ25pbmcta2V5XzUwOWJjNzhhLThhYzQtNDJkNS1hNTg5LTA1YjUyY2ZhNDQwYyJ9.eyJ1cmwiOiJpbWFnZXMvNWVjNDdmOGQtMjEzMi00NWQ4LWI3MTQtOWFiNDZkODc2Y2JlLmpwZyIsImlhdCI6MTc0NDk0NTM2NiwiZXhwIjozMTUzNzcxMzQwOTM2Nn0.Z5XgftcD4Bsr1X0GJ6sLLe2SFfMEiYnZUTVTVu6slGE",
    videoUrl: "https://fqnqeyjbhlesotcxsibt.supabase.co/storage/v1/object/sign/videos/93ec3d31-3544-416b-bb36-0eec718a87c4.mp4?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InN0b3JhZ2UtdXJsLXNpZ25pbmcta2V5XzUwOWJjNzhhLThhYzQtNDJkNS1hNTg5LTA1YjUyY2ZhNDQwYyJ9.eyJ1cmwiOiJ2aWRlb3MvOTNlYzNkMzEtMzU0NC00MTZiLWJiMzYtMGVlYzcxOGE4N2M0Lm1wNCIsImlhdCI6MTc0NDk0NTI4NiwiZXhwIjozMTU1MzEzNDA5Mjg2fQ.yUHwoc-2-nE-xfuTeoTIvqsYZ-VhqAIg1Vm8oHbQauk"
  },
  {
    id: "video3",
    thumbnail: "https://fqnqeyjbhlesotcxsibt.supabase.co/storage/v1/object/sign/images/334ab3a9-3379-43ef-8cc4-b871bad40e85.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InN0b3JhZ2UtdXJsLXNpZ25pbmcta2V5XzUwOWJjNzhhLThhYzQtNDJkNS1hNTg5LTA1YjUyY2ZhNDQwYyJ9.eyJ1cmwiOiJpbWFnZXMvMzM0YWIzYTktMzM3OS00M2VmLThjYzQtYjg3MWJhZDQwZTg1LmpwZyIsImlhdCI6MTc0NDk0NTczMCwiZXhwIjozMTcwNzM0MDk3MzB9.w0OpPf0PFDT7QIw_fiyrn8s61qPdJifUT9RJYNc-kss",
    videoUrl: "https://fqnqeyjbhlesotcxsibt.supabase.co/storage/v1/object/sign/videos/e32651c4-32e7-43ee-a4a5-65ef310d7ac4.mp4?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InN0b3JhZ2UtdXJsLXNpZ25pbmcta2V5XzUwOWJjNzhhLThhYzQtNDJkNS1hNTg5LTA1YjUyY2ZhNDQwYyJ9.eyJ1cmwiOiJ2aWRlb3MvZTMyNjUxYzQtMzJlNy00M2VlLWE0YTUtNjVlZjMxMGQ3YWM0Lm1wNCIsImlhdCI6MTc0NDk0NTQ5OSwiZXhwIjozMTUzNzcxMzQwOTQ5OX0.v86BmQwqjI783WENX3DGDsesjpWcKEtVQWRmFXtfV7s"
  },
  {
    id: "video4",
    thumbnail: "https://fqnqeyjbhlesotcxsibt.supabase.co/storage/v1/object/sign/images/025c3175-5e7f-4dda-a22c-e26eb5f709d4.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InN0b3JhZ2UtdXJsLXNpZ25pbmcta2V5XzUwOWJjNzhhLThhYzQtNDJkNS1hNTg5LTA1YjUyY2ZhNDQwYyJ9.eyJ1cmwiOiJpbWFnZXMvMDI1YzMxNzUtNWU3Zi00ZGRhLWEyMmMtZTI2ZWI1ZjcwOWQ0LmpwZyIsImlhdCI6MTc0NDk0NTY1MiwiZXhwIjoxNDAxNzczMDkyOTY1Mn0.goRr26sOiyyFbE4NA1Ebck2Atg_CiIC24r3nKmroKP0",
    videoUrl: "https://fqnqeyjbhlesotcxsibt.supabase.co/storage/v1/object/sign/videos/93ec3d31-3544-416b-bb36-0eec718a87c4.mp4?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InN0b3JhZ2UtdXJsLXNpZ25pbmcta2V5XzUwOWJjNzhhLThhYzQtNDJkNS1hNTg5LTA1YjUyY2ZhNDQwYyJ9.eyJ1cmwiOiJ2aWRlb3MvOTNlYzNkMzEtMzU0NC00MTZiLWJiMzYtMGVlYzcxOGE4N2M0Lm1wNCIsImlhdCI6MTc0NDk0NTI4NiwiZXhwIjozMTU1MzEzNDA5Mjg2fQ.yUHwoc-2-nE-xfuTeoTIvqsYZ-VhqAIg1Vm8oHbQauk"
  },
  {
    id: "video5",
    thumbnail: "https://fqnqeyjbhlesotcxsibt.supabase.co/storage/v1/object/sign/images/289148c1-b0ca-43c7-9746-5f3a7efc8db9.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InN0b3JhZ2UtdXJsLXNpZ25pbmcta2V5XzUwOWJjNzhhLThhYzQtNDJkNS1hNTg5LTA1YjUyY2ZhNDQwYyJ9.eyJ1cmwiOiJpbWFnZXMvMjg5MTQ4YzEtYjBjYS00M2M3LTk3NDYtNWYzYTdlZmM4ZGI5LmpwZyIsImlhdCI6MTc0NDk0NTY5MSwiZXhwIjozMTU1MzEzNDA5NjkxfQ.qN6JnEqJ0Qt0hlLgM1Lz4ernI6yX18shmU3hnIXaKzA",
    videoUrl: "https://fqnqeyjbhlesotcxsibt.supabase.co/storage/v1/object/sign/videos/f4da4c2f-0ff5-47a6-aba6-1b7041305835.mp4?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InN0b3JhZ2UtdXJsLXNpZ25pbmcta2V5XzUwOWJjNzhhLThhYzQtNDJkNS1hNTg5LTA1YjUyY2ZhNDQwYyJ9.eyJ1cmwiOiJ2aWRlb3MvZjRkYTRjMmYtMGZmNS00N2E2LWFiYTYtMWI3MDQxMzA1ODM1Lm1wNCIsImlhdCI6MTc0NDk0NDgzMywiZXhwIjozMTU1MzEzNDA4ODMzfQ.0OoSo1z9IOeLep4cqd1LtKXxWl4sS7j-vAIhh0vIxC4"
  },
  {
    id: "video6",
    thumbnail: "https://fqnqeyjbhlesotcxsibt.supabase.co/storage/v1/object/sign/images/7f042255-d169-4b55-8b96-2f333b119a80.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InN0b3JhZ2UtdXJsLXNpZ25pbmcta2V5XzUwOWJjNzhhLThhYzQtNDJkNS1hNTg5LTA1YjUyY2ZhNDQwYyJ9.eyJ1cmwiOiJpbWFnZXMvN2YwNDIyNTUtZDE2OS00YjU1LThiOTYtMmYzMzNiMTE5YTgwLmpwZyIsImlhdCI6MTc0NDk0NjI1OCwiZXhwIjozMTcwNzM0MTAyNTh9.hYMXMjDnmnHc0sJOk4IflXwJzQMLNPrayQPgWGyp3jk",
    videoUrl: "https://fqnqeyjbhlesotcxsibt.supabase.co/storage/v1/object/sign/videos/e9c764dc-1d97-4479-b787-800cd4683abf.mp4?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InN0b3JhZ2UtdXJsLXNpZ25pbmcta2V5XzUwOWJjNzhhLThhYzQtNDJkNS1hNTg5LTA1YjUyY2ZhNDQwYyJ9.eyJ1cmwiOiJ2aWRlb3MvZTljNzY0ZGMtMWQ5Ny00NDc5LWI3ODctODAwY2Q0NjgzYWJmLm1wNCIsImlhdCI6MTc0NDk0NjIyMiwiZXhwIjoyNjA4ODU5ODIyfQ.AYTxGOMu_nV1jLmF5BHh8fGiJf_ESo8oscCowvwoK8M"
  }
];

interface VideoItemProps {
  id: string;
  thumbnail: string;
  videoUrl: string;
  isVertical?: boolean;
  isPlaying: boolean;
  togglePlay: (id: string) => void;
  isHovered?: boolean;
}

const VideoItem = ({
  id,
  thumbnail,
  videoUrl,
  isVertical = true,
  isPlaying,
  togglePlay,
  isHovered
}: VideoItemProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => {
      setCurrentTime(video.currentTime);
      setDuration(video.duration);
    };

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateTime);

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateTime);
    };
  }, []);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current) {
      const newTime = parseFloat(e.target.value);
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const dimensionsClass = isVertical ? "aspect-[1/2]" : "aspect-[3/2]";

  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds)) return "00:00";
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`w-full relative rounded-lg overflow-hidden ${dimensionsClass} group`}>
      <div className={`absolute inset-0 transition-opacity duration-300 ${isPlaying ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <div className="absolute inset-0 bg-black/50 transition-opacity duration-300 group-hover:opacity-0 z-10" />

        <Image
          src={thumbnail}
          alt="Video thumbnail"
          fill
          className="object-cover"
          priority
        />
        <button
          className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg cursor-pointer group z-20"
          onClick={() => togglePlay(id)}
        >
          <div className="bg-black/80 border border-white/10 relative rounded-full flex items-center justify-center transition-all duration-300 overflow-hidden w-16 h-16">
            <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(126,34,206,0.4)_0%,rgba(126,34,206,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <div className="relative z-10 w-0 h-0 border-t-transparent border-b-transparent ml-1 transition-all duration-300 border-t-8 border-b-8 border-l-16 border-l-purple-500 group-hover:border-l-white group-hover:animate-juggle"></div>
          </div>
        </button>
      </div>

      <div className={`absolute inset-0 transition-opacity duration-300 ${isPlaying ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
        <video
          id={id}
          ref={videoRef}
          src={videoUrl}
          className="w-full h-full object-cover"
          loop
          playsInline
          preload="auto"
          muted={!isPlaying}
        />
        {isPlaying && (
          <>
            <button
              className="absolute inset-0 flex items-center justify-center bg-transparent cursor-pointer"
              onClick={() => togglePlay(id)}
              aria-label="Pause video"
            >
              <div className="bg-black/80 border border-white/10 rounded-full flex items-center justify-center w-10 h-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="flex items-center justify-center">
                  <div className="w-1.5 h-5 bg-white rounded-sm mx-0.5"></div>
                  <div className="w-1.5 h-5 bg-white rounded-sm mx-0.5"></div>
                </div>
              </div>
            </button>

            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-4 py-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="flex flex-col gap-2">
                <input
                  type="range"
                  min="0"
                  max={duration || 100}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-1 bg-white/30 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-500"
                />

                <div className="flex justify-between text-xs text-white/80">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const VideoColumn = ({
  videos,
  columnIndex,
  hoveredCol,
  isAnyPlaying,
  playingVideos,
  togglePlay,
  onMouseEnter,
  onMouseLeave
}: {
  videos: typeof VIDEOS,
  columnIndex: number,
  hoveredCol: number | null,
  isAnyPlaying: boolean,
  playingVideos: Set<string>,
  togglePlay: (id: string) => void,
  onMouseEnter: () => void,
  onMouseLeave: () => void
}) => {
  const isMiddleColumn = columnIndex === 1;
  const scrollDirection = isMiddleColumn ? "scroll-down" : "scroll-up";
  const scrollSpeed = columnIndex === 2 ? "scroll-up-fast" : "";

  return (
    <div
      className="relative overflow-hidden h-full"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div
        className={`flex flex-col gap-4 w-full absolute top-0 left-0 right-0 ${scrollDirection} ${scrollSpeed}`}
        style={{ animationPlayState: hoveredCol === columnIndex || isAnyPlaying ? "paused" : "running" }}
      >
        {Array.from({ length: 8 }).flatMap((_, setIndex) =>
          videos.map((video, videoIndex) => {
            const uniqueId = `${video.id}-col${columnIndex}-set${setIndex}-${videoIndex}`;
            return (
              <VideoItem
                key={uniqueId}
                id={uniqueId}
                thumbnail={video.thumbnail}
                videoUrl={video.videoUrl}
                isPlaying={playingVideos.has(uniqueId)}
                togglePlay={togglePlay}
                isHovered={hoveredCol === columnIndex}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

const MobileVideoItem = ({ video, isPlaying, togglePlay }: {
  video: typeof VIDEOS[0],
  isPlaying: boolean,
  togglePlay: (id: string) => void
}) => {
  return (
    <div className="flex-none w-[45%] snap-center">
      <VideoItem
        id={video.id}
        thumbnail={video.thumbnail}
        videoUrl={video.videoUrl}
        isPlaying={isPlaying}
        togglePlay={togglePlay}
      />
    </div>
  );
};

export default function VideoGrid() {
  const [hoveredCol, setHoveredCol] = useState<number | null>(null);
  const [playingVideos, setPlayingVideos] = useState(new Set<string>());

  const isAnyVideoPlaying = playingVideos.size > 0;

  const toggleVideoPlay = (videoId: string) => {
    setPlayingVideos(prev => {
      const newSet = new Set(prev);

      if (newSet.has(videoId)) {
        newSet.delete(videoId);
      } else {
        newSet.clear();
        newSet.add(videoId);
      }

      return newSet;
    });
  };

  const columnVideos = [
    VIDEOS.slice(0, 2),
    VIDEOS.slice(2, 4),
    VIDEOS.slice(4, 6)
  ];

  const mobileVideos = VIDEOS.slice(0, 3);

  return (
    <>
      <style jsx global>{`
        @keyframes scrollUp {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        @keyframes scrollDown {
          0% { transform: translateY(-50%); }
          100% { transform: translateY(0); }
        }
        @keyframes scrollUpFast {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        .scroll-up { animation: scrollUp 45s linear infinite; }
        .scroll-down { animation: scrollDown 45s linear infinite; }
        .scroll-up-fast { animation: scrollUpFast 35s linear infinite; }
      `}</style>

      <div className="block lg:hidden w-full h-full overflow-hidden">
        <div className="flex gap-3 overflow-x-auto pb-4 px-4 snap-x snap-mandatory">
          {mobileVideos.map(video => (
            <MobileVideoItem
              key={video.id}
              video={video}
              isPlaying={playingVideos.has(video.id)}
              togglePlay={toggleVideoPlay}
            />
          ))}
        </div>
      </div>

      <div className="hidden lg:grid grid-cols-3 gap-4 h-screen mr-6">
        {columnVideos.map((videos, index) => (
          <VideoColumn
            key={`column-${index + 1}`}
            videos={videos}
            columnIndex={index}
            hoveredCol={hoveredCol}
            isAnyPlaying={isAnyVideoPlaying}
            playingVideos={playingVideos}
            togglePlay={toggleVideoPlay}
            onMouseEnter={() => setHoveredCol(index)}
            onMouseLeave={() => setHoveredCol(null)}
          />
        ))}
      </div>
    </>
  );
}