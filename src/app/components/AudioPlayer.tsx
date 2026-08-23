"use client";

import { useState, useRef, useEffect } from "react";

interface AudioPlayerProps {
  postNumber: string;
  locale: "en" | "he";
}

export default function AudioPlayer({ postNumber, locale }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioSrc = `/content/blog/${postNumber}/listen-${locale}.opus`;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => {
      setDuration(audio.duration);
      setLoading(false);
    };
    const handleError = () => {
      setError(true);
      setLoading(false);
    };
    const handleLoadStart = () => {
      setLoading(true);
      setError(false);
    };
    const handleCanPlay = () => {
      setLoading(false);
      setError(false);
    };
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    // Check if audio file exists
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("error", handleError);
    audio.addEventListener("loadstart", handleLoadStart);
    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);

    // Try to load the audio file
    audio.load();

    // Check after a delay if audio failed to load (e.g., 404)
    const errorTimeout = setTimeout(() => {
      if (audio.readyState === 0) {
        setError(true);
        setLoading(false);
      }
    }, 3000);

    return () => {
      clearTimeout(errorTimeout);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("error", handleError);
      audio.removeEventListener("loadstart", handleLoadStart);
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [audioSrc]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch((err) => {
        console.error("Error playing audio:", err);
        setError(true);
      });
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = parseFloat(e.target.value);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (seconds: number): string => {
    if (!isFinite(seconds) || isNaN(seconds) || seconds < 0) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Don't render if there's an error (audio file doesn't exist)
  if (error && !loading) {
    return null;
  }

  const isRTL = locale === "he";
  const isValidDuration = isFinite(duration) && !isNaN(duration) && duration > 0;

  return (
    <div
      className="w-full mt-4 mb-6"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          disabled={loading || error}
          className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-900 dark:bg-gray-100 text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          aria-label={isPlaying ? (locale === "he" ? "עצור" : "Pause") : (locale === "he" ? "נגן" : "Play")}
        >
          {loading ? (
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : isPlaying ? (
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          ) : (
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        {/* Progress Bar - Centered relative to button */}
        <div className="flex-1 flex items-center justify-center">
          <input
            type="range"
            min="0"
            max={isValidDuration ? duration : 0}
            value={isValidDuration ? currentTime : 0}
            onChange={handleSeek}
            disabled={loading || error || !isValidDuration}
            className="w-full h-2 sm:h-2.5 rounded-lg appearance-none cursor-pointer bg-gray-200 dark:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed accent-gray-900 dark:accent-gray-100"
            style={{
              background: isValidDuration
                ? `linear-gradient(to right, currentColor 0%, currentColor ${(currentTime / duration) * 100}%, rgb(229 231 235) ${(currentTime / duration) * 100}%, rgb(229 231 235) 100%)`
                : undefined,
            }}
          />
        </div>

        {/* Time Metadata - Positioned relative to play button */}
        <div className={`flex-shrink-0 flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <span>{formatTime(currentTime)}</span>
          <span className="opacity-60">/</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Hidden Audio Element */}
      <audio ref={audioRef} src={audioSrc} preload="metadata">
        <track kind="captions" />
      </audio>
    </div>
  );
}

