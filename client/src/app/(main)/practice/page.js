'use client';

import React, { useState, useEffect } from 'react';
import { Space_Mono } from 'next/font/google';
import Image from 'next/image';

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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completed, setCompleted] = useState(new Set());
  const [morseInput, setMorseInput] = useState('');
  const [spacebarStartTime, setSpacebarStartTime] = useState(null);
  const [isSpacebarPressed, setIsSpacebarPressed] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [inputTimeout, setInputTimeout] = useState(null);

  const currentLetter = allLetters[currentIndex];

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

        if (inputTimeout) {
          clearTimeout(inputTimeout);
          setInputTimeout(null);
        }
      } else if (e.code === 'Enter') {
        e.preventDefault();
        resetProgress();
      }
    };

    const handleKeyUp = (e) => {
      if (e.code === 'Space' && isSpacebarPressed) {
        e.preventDefault();
        const pressDuration = Date.now() - spacebarStartTime;
        const morseChar = pressDuration >= 150 ? '-' : '.';
        const newInput = morseInput + morseChar;
        setMorseInput(newInput);

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
          setCompleted(prev => new Set([...prev, currentLetter]));

          setTimeout(() => {
            nextCharacter();
          }, 500);
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
              <p className={`${spmono.className} text-3xl sm:text-4xl md:text-[48px] font-bold transition-colors duration-300 ${
                isSuccess && isCurrent
                  ? 'text-green-500'
                  : isError && isCurrent
                    ? 'text-red-500 animate-shake'
                    : isCompleted 
                      ? 'text-white' 
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
                      ? 'text-[#9CA3AF]' 
                      : 'text-[#5a5e61]'
              }`}>
                {morseCodeMap[letter]}
              </p>
            </div>
          );
        })}
      </div>

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
      <p className={`${spmono.className} text-3xl sm:text-4xl md:text-[48px] font-bold transition-colors duration-300 mt-5 ${
        isError ? 'text-red-500 animate-shake' : isSuccess ? 'text-green-500' : 'text-white'
      }`}>{isSuccess ? morseCodeMap[currentLetter] : (morseInput || <span className="text-[24px] text-[#9CA3AF]">press spacebar</span>)}</p>

      {/* Instructions */}
      <div className="mt-15">
        <div className="bg-[#717171] text-[11px]">
            <p className={`${spmono.className} font-bold text-[#141720] mx-1`}>spacebar - to input</p>
        </div>
        <div className="bg-[#717171] text-[11px]">
          <p className={`${spmono.className} font-bold text-[#141720] mx-1 mt-3`}>enter - to reset</p>
        </div>
      </div>
    </div>
  );
}
