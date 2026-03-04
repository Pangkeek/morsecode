'use client';

import React, { useState, useEffect } from 'react';
import { Space_Mono } from 'next/font/google';
import Image from 'next/image';
import { useTheme } from '@/contexts/ThemeContext';

const spmono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
});

const morseCodeMap = {
  'A': '.-',
  'B': '-...',
  'C': '-.-.',
  'D': '-..',
  'E': '.',
  'F': '..-.',
  'G': '--.',
  'H': '....',
  'I': '..',
  'J': '.---',
  'K': '-.-',
  'L': '.-..',
  'M': '--',
  'N': '-.',
  'O': '---',
  'P': '.--.',
  'Q': '--.-',
  'R': '.-.',
  'S': '...',
  'T': '-',
  'U': '..-',
  'V': '...-',
  'W': '.--',
  'X': '-..-',
  'Y': '-.--',
  'Z': '--..'
};

const allLetters = Object.keys(morseCodeMap);

export default function Practice() {
  const { theme } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completed, setCompleted] = useState(new Set());
  const [morseInput, setMorseInput] = useState('');
  const [spacebarStartTime, setSpacebarStartTime] = useState(null);
  const [isSpacebarPressed, setIsSpacebarPressed] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [inputTimeout, setInputTimeout] = useState(null);
  const [showGoodJob, setShowGoodJob] = useState(false);
  const mobileInputRef = React.useRef(null);

  // Audio context for continuous morse code sounds
  // Use refs so AudioContext and oscillator are created once and never recreated on re-render.
  // Creating `new AudioContext()` on every render hits the browser's ~6 context limit
  // and causes sound to stop after a few characters.
  const audioContextRef = React.useRef(null);
  const currentOscillatorRef = React.useRef(null);

  const getAudioContext = () => {
    if (typeof window === 'undefined') return null;
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioContextRef.current;
  };

  const stopMorseSound = () => {
    if (currentOscillatorRef.current) {
      currentOscillatorRef.current.stop();
      currentOscillatorRef.current.disconnect();
      currentOscillatorRef.current = null;
    }
  };

  const startMorseSound = (frequency = 600) => {
    const audioContext = getAudioContext();
    if (!audioContext) return;

    // Resume context if suspended due to browser autoplay policy
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }

    // Stop any existing sound
    if (currentOscillatorRef.current) {
      currentOscillatorRef.current.stop();
      currentOscillatorRef.current.disconnect();
      currentOscillatorRef.current = null;
    }

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);

    oscillator.start();
    currentOscillatorRef.current = oscillator;
  };

  const currentLetter = allLetters[currentIndex];

  // Debug showGoodJob state changes
  React.useEffect(() => {
    console.log('showGoodJob changed to:', showGoodJob);
    console.log('completed size:', completed.size, 'of', allLetters.length);
  }, [showGoodJob, completed]);

  // Move to next character
  const nextCharacter = () => {
    const nextIndex = (currentIndex + 1) % allLetters.length;
    setCurrentIndex(nextIndex);
    setMorseInput('');
    setIsError(false);
    setIsSuccess(false);
    if (inputTimeout) {
      clearTimeout(inputTimeout);
      setInputTimeout(null);
    }
  };

  // Reset all progress
  const resetProgress = () => {
    setCurrentIndex(0);
    setCompleted(new Set());
    setMorseInput('');
    setIsError(false);
    setIsSuccess(false);
    if (inputTimeout) {
      clearTimeout(inputTimeout);
      setInputTimeout(null);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' && !isSpacebarPressed) {
        e.preventDefault();
        setIsSpacebarPressed(true);
        setSpacebarStartTime(Date.now());

        // Play continuous morse sound
        startMorseSound();

        if (inputTimeout) {
          clearTimeout(inputTimeout);
          setInputTimeout(null);
        }
      } else if (e.code === 'Enter') {
        e.preventDefault();
        resetProgress();
      }
      // Handle mobile input (space key from mobile keyboard)
      else if (e.key === ' ' && !isSpacebarPressed) {
        e.preventDefault();
        setIsSpacebarPressed(true);
        setSpacebarStartTime(Date.now());

        // Play continuous morse sound
        startMorseSound();

        if (inputTimeout) {
          clearTimeout(inputTimeout);
          setInputTimeout(null);
        }
      }
    };

    const handleKeyUp = (e) => {
      if ((e.code === 'Space' || e.key === ' ') && isSpacebarPressed) {
        e.preventDefault();
        const pressDuration = Date.now() - spacebarStartTime;
        const morseChar = pressDuration >= 150 ? '-' : '.';
        const newInput = morseInput + morseChar;
        setMorseInput(newInput);

        // Stop morse sound when spacebar is released
        stopMorseSound();

        if (inputTimeout) {
          clearTimeout(inputTimeout);
          setInputTimeout(null);
        }

        const expectedMorse = morseCodeMap[currentLetter];

        // Check if input is starting to be incorrect
        if (!expectedMorse.startsWith(newInput)) {
          setIsError(true);
          setTimeout(() => {
            setIsError(false);
            setMorseInput('');
          }, 500);
        } else if (newInput === expectedMorse) {
          // Success!
          setIsSuccess(true);
          const newCompleted = new Set([...completed, currentLetter]);
          setCompleted(newCompleted);

          // Check if all letters are completed
          console.log('Completion check:', newCompleted.size, 'of', allLetters.length);
          if (newCompleted.size === allLetters.length) {
            console.log('All letters completed! Showing Good Job message.');
            setShowGoodJob(true);
            setTimeout(() => {
              resetProgress();
              setShowGoodJob(false);
            }, 3000);
          } else {
            setTimeout(() => {
              nextCharacter();
            }, 500);
          }
        } else {
          // Set timeout for no input
          const timeout = setTimeout(() => {
            setIsError(true);
            setTimeout(() => {
              setIsError(false);
              setMorseInput('');
            }, 500);
          }, 1000);
          setInputTimeout(timeout);
        }

        setIsSpacebarPressed(false);
        setSpacebarStartTime(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (inputTimeout) {
        clearTimeout(inputTimeout);
      }
    };
  }, [isSpacebarPressed, spacebarStartTime, morseInput, currentLetter, inputTimeout, isSuccess]);

  return (
    <div className="flex flex-col items-center min-h-[calc(100vh-200px)] px-4 py-8 mt-10">
      {/* All characters grid */}
      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-10 gap-4 md:gap-6 lg:gap-x-10 lg:gap-y-10 mb-15">
        {allLetters.map((letter, index) => {
          const isCompleted = completed.has(letter);
          const isCurrent = index === currentIndex;
          
          return (
            <div 
              key={letter}
              className="flex flex-col items-center"
            >
              {/* Character */}
<<<<<<< HEAD
              <p className={`${spmono.className} text-3xl sm:text-4xl md:text-[48px] font-bold transition-colors duration-300 ${
                isSuccess && isCurrent
                  ? 'text-green-500'
                  : isError && isCurrent
                    ? 'text-red-500 animate-shake'
                    : isCompleted 
                      ? 'text-foreground' 
                      : 'text-[#5a5e61]'
              }`}>
                {letter}
              </p>
              {/* Morse code */}
              <p className={`${spmono.className} text-lg sm:text-xl md:text-[24px] font-bold transition-colors duration-300 ${
                isSuccess && isCurrent
                  ? 'text-green-500'
                  : isError && isCurrent
                    ? 'text-red-500'
                    : isCompleted 
                      ? 'text-foreground/70' 
                      : 'text-[#5a5e61]'
              }`}>
=======
              <p 
                className={`${spmono.className} text-3xl sm:text-4xl md:text-[48px] font-bold transition-colors duration-300 ${
                  isError && isCurrent ? 'animate-shake' : ''
                }`}
                style={{
                  color: isSuccess && isCurrent
                    ? '#22c55e'
                    : isError && isCurrent
                      ? '#ef4444'
                      : isCompleted 
                        ? 'var(--foreground)' 
                        : 'var(--foreground)',
                  opacity: isCompleted ? 1 : 0.4
                }}
              >
                {letter}
              </p>
              {/* Morse code */}
              <p 
                className={`${spmono.className} text-lg sm:text-xl md:text-[24px] font-bold transition-colors duration-300`}
                style={{
                  color: isSuccess && isCurrent
                    ? '#22c55e'
                    : isError && isCurrent
                      ? '#ef4444'
                      : isCompleted 
                        ? 'var(--foreground)' 
                        : 'var(--foreground)',
                  opacity: isCompleted ? 0.7 : 0.4
                }}
              >
>>>>>>> origin/main
                {morseCodeMap[letter]}
              </p>
            </div>
          );
        })}
      </div>

      {/* Good Job message */}
      {showGoodJob && (
        <div className="flex flex-col items-center animate-fadeIn">
          <p 
            className={`${spmono.className} text-4xl sm:text-5xl md:text-6xl font-bold`}
            style={{ color: 'var(--primary)' }}
          >
            Good Job!
          </p>
          <p 
            className={`${spmono.className} text-lg sm:text-xl md:text-2xl mt-4`}
            style={{ color: 'var(--foreground)', opacity: 0.8 }}
          >
            You completed all {allLetters.length} letters!
          </p>
          <p 
            className={`${spmono.className} text-sm sm:text-base md:text-lg mt-2`}
            style={{ color: 'var(--foreground)', opacity: 0.6 }}
          >
            Resetting in 3 seconds...
          </p>
        </div>
      )}

      {/* Reset icon */}
      <Image 
        src="/reset-svgrepo-com 1.svg" 
        width={14} 
        height={14} 
        alt="" 
        className="cursor-pointer hover:opacity-70 transition-opacity"
        onClick={resetProgress}
      />

      {/* Current input display */}
<<<<<<< HEAD
      <p className={`${spmono.className} text-3xl sm:text-4xl md:text-[48px] font-bold transition-colors duration-300 mt-5 ${
        isError ? 'text-red-500 animate-shake' : isSuccess ? 'text-green-500' : 'text-foreground'
      }`}>{isSuccess ? morseCodeMap[currentLetter] : (morseInput || <span className="text-[24px] text-foreground/70">press spacebar</span>)}</p>
=======
      <p 
        className={`${spmono.className} text-3xl sm:text-4xl md:text-[48px] font-bold transition-colors duration-300 mt-5`}
        style={{
          color: isError 
            ? '#ef4444' 
            : isSuccess 
              ? '#22c55e' 
              : 'var(--foreground)'
        }}
      >
        {isSuccess ? morseCodeMap[currentLetter] : (morseInput || <span className="text-[24px]" style={{ color: 'var(--foreground)', opacity: 0.7 }}>press spacebar</span>)}
      </p>

      {/* Tap to type button for mobile/tablet */}
      <div
        className="md:hidden w-full max-w-[300px] h-24 rounded-xl flex items-center justify-center mt-6 select-none cursor-pointer transition-colors"
        style={{ 
          backgroundColor: 'var(--card)', 
          color: 'var(--foreground)',
          border: '1px solid var(--border)'
        }}
        onTouchStart={(e) => {
          e.preventDefault();
          // Start morse sound
          startMorseSound();
          // Simulate spacebar keydown
          window.dispatchEvent(new KeyboardEvent('keydown', {
            key: ' ',
            code: 'Space',
            bubbles: true
          }));
        }}
        onTouchEnd={(e) => {
          e.preventDefault();
          // Stop morse sound
          stopMorseSound();
          // Simulate spacebar keyup
          window.dispatchEvent(new KeyboardEvent('keyup', {
            key: ' ',
            code: 'Space',
            bubbles: true
          }));
        }}
        onMouseDown={(e) => {
          e.preventDefault();
          // Start morse sound
          startMorseSound();
          // Simulate spacebar keydown
          window.dispatchEvent(new KeyboardEvent('keydown', {
            key: ' ',
            code: 'Space',
            bubbles: true
          }));
        }}
        onMouseUp={(e) => {
          e.preventDefault();
          // Stop morse sound
          stopMorseSound();
          // Simulate spacebar keyup
          window.dispatchEvent(new KeyboardEvent('keyup', {
            key: ' ',
            code: 'Space',
            bubbles: true
          }));
        }}
      >
        <p className={`${spmono.className} font-bold text-lg select-none pointer-events-none`} style={{ color: 'var(--foreground)', opacity: 0.7 }}>
          tap to type
        </p>
      </div>
>>>>>>> origin/main

      {/* Instructions */}
      <div className="mt-15">
        <div className="bg-[#717171] text-[11px]">
            <p className={`${spmono.className} font-bold text-[#141720] mx-1`}>
              <span className="hidden md:inline">spacebar - to input</span>
              <span className="md:hidden">tap button - to type</span>
            </p>
        </div>
        <div className="bg-[#717171] text-[11px]">
          <p className={`${spmono.className} font-bold text-[#141720] mx-1 mt-3`}>
            <span className="hidden md:inline">enter - to reset</span>
            <span className="md:hidden">tap reset icon above</span>
          </p>
        </div>
      </div>
    </div>
  );
}
