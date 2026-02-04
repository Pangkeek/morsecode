"use client";

import Image from "next/image";
import React, { useState } from 'react'
import { Space_Mono } from 'next/font/google';


const spmono = Space_Mono({
  subsets: ['latin'],
  weight: ["400", "700"],
})

export default function Home() {
  const [mode, setMode] = useState('encode');
  const [type, setType] = useState('a-z');
  const [length, setLength] = useState('10');
  const [morseInput, setMorseInput] = useState('');
  const [spacebarStartTime, setSpacebarStartTime] = useState(null);
  const [isSpacebarPressed, setIsSpacebarPressed] = useState(false);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successDisplay, setSuccessDisplay] = useState('');
  const [inputTimeout, setInputTimeout] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  
  // const targetLetters = ['A', 'E', 'I', 'O', 'U', 'A', 'E', 'I', 'O', 'U'];
  const targetLetters = ['E'];
  
  // Morse code mappings
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

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' && !isSpacebarPressed) {
        e.preventDefault();
        setIsSpacebarPressed(true);
        setSpacebarStartTime(Date.now());
        
        // Clear any existing timeout when user starts typing
        if (inputTimeout) {
          clearTimeout(inputTimeout);
          setInputTimeout(null);
        }
      } else if (e.code === 'Enter') {
        e.preventDefault();
        setMorseInput('');
        setCurrentCharIndex(0);
        setIsError(false);
        setIsSuccess(false);
        setSuccessDisplay('');
        setIsCompleted(false);
        if (inputTimeout) {
          clearTimeout(inputTimeout);
          setInputTimeout(null);
        }
      }
    };

    const handleKeyUp = (e) => {
      if (e.code === 'Space' && isSpacebarPressed) {
        e.preventDefault();
        const pressDuration = Date.now() - spacebarStartTime;
        const morseChar = pressDuration >= 300 ? '-' : '.';
        const newInput = morseInput + morseChar;
        setMorseInput(newInput);
        
        // Clear any existing timeout
        if (inputTimeout) {
          clearTimeout(inputTimeout);
          setInputTimeout(null);
        }
        
        // Check if current character's Morse code matches
        if (currentCharIndex < targetLetters.length) {
          const currentLetter = targetLetters[currentCharIndex];
          const expectedMorse = morseCodeMap[currentLetter];
          
          // Check if input is starting to be incorrect
          if (!expectedMorse.startsWith(newInput)) {
            // Trigger error state
            setIsError(true);
            setTimeout(() => {
              setIsError(false);
              setMorseInput('');
            }, 500);
          } else if (newInput === expectedMorse) {
            // Show success state with the completed Morse code
            setIsSuccess(true);
            setSuccessDisplay(newInput); // Store the completed Morse code
            
            // Check if this is the last character
            const isLastChar = currentCharIndex === targetLetters.length - 1;
            
            setCurrentCharIndex(prev => prev + 1);
            setMorseInput(''); // Clear input for next character
            
            // Clear success state after animation
            setTimeout(() => {
              setIsSuccess(false);
              setSuccessDisplay(''); // Clear the success display
              
              // If this was the last character, trigger completion
              if (isLastChar) {
                setIsCompleted(true);
              }
            }, 500);
          } else {
            // Set timeout for no input (2 seconds)
            const timeout = setTimeout(() => {
              setIsError(true);
              setTimeout(() => {
                setIsError(false);
                setMorseInput('');
              }, 500);
            }, 1000);
            setInputTimeout(timeout);
          }
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
  }, [isSpacebarPressed, spacebarStartTime, morseInput, currentCharIndex, targetLetters, morseCodeMap, inputTimeout]);

  return (
    <div className='flex flex-col items-center'>
      {!isCompleted && (
        <div className={`${spmono.className} font-bold w-[705px] h-[65px] bg-[#1E2332] rounded-xl flex items-center justify-between mt-14`}>
          <button 
            onClick={() => setMode('decode')}
            className={`pl-10 pr-4 py-4 transition-colors duration-300 ${mode === 'decode' ? 'text-[#EF4444]' : 'text-[#9CA3AF] hover:text-white'}`}
          >
            decode
          </button>
          <button 
            onClick={() => setMode('encode')}
            className={`px-4 py-4 transition-colors duration-300 ${mode === 'encode' ? 'text-[#EF4444]' : 'text-[#9CA3AF] hover:text-white'}`}
          >
            encode
          </button>
          <p className='text-[#9CA3AF]'>|</p>
          <button 
            onClick={() => setType('a-z')}
            className={`px-4 py-4 transition-colors duration-300 ${type === 'a-z' ? 'text-[#EF4444]' : 'text-[#9CA3AF] hover:text-white'}`}
          >
            a-z
          </button>
          <button 
            onClick={() => setType('word')}
            className={`px-4 py-4 transition-colors duration-300 ${type === 'word' ? 'text-[#EF4444]' : 'text-[#9CA3AF] hover:text-white'}`}
          >
            word
          </button>
          <p className='text-[#9CA3AF]'>|</p>
          <div className="flex">
            {['10', '15', '50', '100'].map((len) => (
              <button
                key={len}
                onClick={() => setLength(len)}
                className={`px-4 py-4 transition-colors duration-300 ${length === len ? 'text-[#EF4444]' : 'text-[#9CA3AF] hover:text-white'} ${len === '100' ? 'pr-10' : ''}`}
              >
                {len}
              </button>
            ))}
          </div>
        </div>
      )}
      {isCompleted ? (
        <div className='flex flex-col items-center mt-40 animate-fadeIn'>
          <div>
            <div className='flex'>
              <div>
                <p className={`${spmono.className} text-[#9CA3AF] font-bold text-[20px]`}>wpm</p>
                <p className={`${spmono.className} text-[#EF4444] text-[96px]`}>53</p>
              </div>
              <div className="ml-10">
                <p className={`${spmono.className} text-[#9CA3AF] font-bold text-[20px]`}>accuracy</p>
                <p className={`${spmono.className} text-[#EF4444] text-[96px]`}>90%</p>
              </div>
              <div className="ml-10">
                <p className={`${spmono.className} text-[#9CA3AF] font-bold text-[20px]`}>time</p>
                <p className={`${spmono.className} text-[#EF4444] text-[96px]`}>99s</p>
              </div>
            </div>
            <div className='flex'>
              <div>
                <p className={`${spmono.className} text-[#9CA3AF] font-bold text-[20px]`}>mode</p>
                <p className={`${spmono.className} text-[#EF4444] text-[20px]`}>decode word</p>
              </div>
              <div className="ml-10">
                <p className={`${spmono.className} text-[#9CA3AF] font-bold text-[20px]`}>date</p>
                <p className={`${spmono.className} text-[#EF4444] text-[20px]`}>56/87/21%</p>
              </div>
            </div>
          </div>
          <Image 
            src="/reset-svgrepo-com 1.svg" 
            width={14} 
            height={14} 
            alt="" 
            className="mt-12 cursor-pointer hover:opacity-70 transition-opacity mt-20"
            onClick={() => {
              setMorseInput('');
              setCurrentCharIndex(0);
              setIsError(false);
              setIsSuccess(false);
              setSuccessDisplay('');
              setIsCompleted(false);
              if (inputTimeout) {
                clearTimeout(inputTimeout);
                setInputTimeout(null);
              }
            }}
          />
        </div>
      ) : (
        <>
          <div className='flex mt-40'>
            {targetLetters.map((letter, index) => (
              <p 
                key={index}
                className={`${spmono.className} text-[48px] font-bold ${index === 0 ? '' : 'ml-8'} transition-colors duration-300 ${
                  index < currentCharIndex 
                    ? 'text-white' 
                    : index === currentCharIndex && isError
                      ? 'text-red-500 animate-shake'
                      : 'text-[#5a5e61]'
                }`}
              >
                {letter}
              </p>
            ))}
          </div>
          <Image 
            src="/reset-svgrepo-com 1.svg" 
            width={14} 
            height={14} 
            alt="" 
            className="mt-10 cursor-pointer hover:opacity-70 transition-opacity"
            onClick={() => {
              setMorseInput('');
              setCurrentCharIndex(0);
              setIsError(false);
              setIsSuccess(false);
              setSuccessDisplay('');
              setIsCompleted(false);
              if (inputTimeout) {
                clearTimeout(inputTimeout);
                setInputTimeout(null);
              }
            }}
          />
          <p className={`${spmono.className} text-[48px] font-bold mt-20 transition-colors duration-300 ${
            isError ? 'text-red-500 animate-shake' : isSuccess ? 'text-green-500' : 'text-white'
          }`}>{isSuccess ? successDisplay : (morseInput || <span className="text-[24px] text-[#9CA3AF]">press spacebar</span>)}</p>
          <div className="mt-30">
            <div className="bg-[#717171] text-[11px]">
                <p className={`${spmono.className} font-bold text-[#141720] mx-1`}>spacebar - to input</p>
            </div>
            <div className="bg-[#717171] text-[11px]">
              <p className={`${spmono.className} font-bold text-[#141720] mx-1 mt-3`}>enter - to reset</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
