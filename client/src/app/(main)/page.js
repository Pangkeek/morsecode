"use client";

import Image from "next/image";

import React, { useState } from "react";

import { Space_Mono } from "next/font/google";

const spmono = Space_Mono({
  subsets: ["latin"],

  weight: ["400", "700"],
});

export default function Home() {
  const [mode, setMode] = useState("encode");

  const [type, setType] = useState("a-z");

  const [length, setLength] = useState("10");

  const [morseInput, setMorseInput] = useState("");

  const [spacebarStartTime, setSpacebarStartTime] = useState(null);

  const [isSpacebarPressed, setIsSpacebarPressed] = useState(false);

  const [encodeCurrentCharIndex, setEncodeCurrentCharIndex] = useState(0);

  const [decodeCurrentCharIndex, setDecodeCurrentCharIndex] = useState(0);

  const [encodeWordIndex, setEncodeWordIndex] = useState(0);

  const [encodeLetterInWordIndex, setEncodeLetterInWordIndex] = useState(0);

  const [decodeWordIndex, setDecodeWordIndex] = useState(0);

  const [decodeLetterInWordIndex, setDecodeLetterInWordIndex] = useState(0);

  // Use the appropriate index based on current mode

  const currentCharIndex =
    mode === "encode" ? encodeCurrentCharIndex : decodeCurrentCharIndex;

  const setCurrentCharIndex =
    mode === "encode" ? setEncodeCurrentCharIndex : setDecodeCurrentCharIndex;

  // Reset current mode's progress when switching away from it

  const [previousMode, setPreviousMode] = useState(mode);

  const [previousType, setPreviousType] = useState(type);

  React.useEffect(() => {
    if (previousMode !== mode) {
      if (previousMode === "encode") {
        setEncodeCurrentCharIndex(0);

        setEncodeWordIndex(0);

        setEncodeLetterInWordIndex(0);
      } else {
        setDecodeCurrentCharIndex(0);

        setDecodeWordIndex(0);

        setDecodeLetterInWordIndex(0);
      }

      setPreviousMode(mode);
    }

    if (previousType !== type) {
      setEncodeWordIndex(0);

      setEncodeLetterInWordIndex(0);

      setDecodeWordIndex(0);

      setDecodeLetterInWordIndex(0);

      setPreviousType(type);
    }

    setCurrentLine(0);

    setDecodeCurrentLine(0);
  }, [mode, previousMode, type, previousType]);

  const [isError, setIsError] = useState(false);

  const [isSuccess, setIsSuccess] = useState(false);

  const [successDisplay, setSuccessDisplay] = useState("");

  const [inputTimeout, setInputTimeout] = useState(null);

  const [isCompleted, setIsCompleted] = useState(false);

  const [isFading, setIsFading] = useState(false);

  const [charInput, setCharInput] = useState("");

  // State for sliding window - track which line is currently visible

  const [currentLine, setCurrentLine] = useState(0);

  const [decodeCurrentLine, setDecodeCurrentLine] = useState(0);

  const containerRef = React.useRef(null);

  // Effect to update current line based on progress - wait until line is fully completed

  React.useEffect(() => {
    // Encode mode: Show 20 characters at a time

    const charsPerLine = 20;

    const completedLines = Math.floor(currentCharIndex / charsPerLine);

    setCurrentLine(completedLines);

    // Decode mode: Account for alternating line lengths (13, 12, 13, 12...)

    // Line 0: chars 0-12 (13 chars), Line 1: chars 13-24 (12 chars), Line 2: chars 25-37 (13 chars), etc.

    let decodeCompletedLines = 0;

    let remainingChars = currentCharIndex;

    while (remainingChars > 0) {
      const isOddLine = decodeCompletedLines % 2 === 1;

      const charsInThisLine = isOddLine ? 12 : 13;

      if (remainingChars >= charsInThisLine) {
        remainingChars -= charsInThisLine;

        decodeCompletedLines++;
      } else {
        break;
      }
    }

    setDecodeCurrentLine(decodeCompletedLines);
  }, [currentCharIndex]);

  // Generate full 100-length arrays

  const fullEncodeArray = [
    "A",

    "E",

    "I",

    "O",

    "U",

    "A",

    "E",

    "I",

    "O",

    "U",

    "A",

    "E",

    "I",

    "O",

    "U",

    "A",

    "E",

    "I",

    "O",

    "U",

    "A",

    "E",

    "I",

    "O",

    "U",

    "A",

    "E",

    "I",

    "O",

    "U",

    "A",

    "E",

    "I",

    "O",

    "U",

    "A",

    "E",

    "I",

    "O",

    "U",

    "A",

    "E",

    "I",

    "O",

    "U",

    "A",

    "E",

    "I",

    "O",

    "U",

    "A",

    "E",

    "I",

    "O",

    "U",

    "A",

    "E",

    "I",

    "O",

    "U",

    "A",

    "E",

    "I",

    "O",

    "U",

    "A",

    "E",

    "I",

    "O",

    "U",

    "A",

    "E",

    "I",

    "O",

    "U",

    "A",

    "E",

    "I",

    "O",

    "U",

    "A",

    "E",

    "I",

    "O",

    "U",

    "A",

    "E",

    "I",

    "O",

    "U",
  ];

  const fullDecodeArray = [
    ".-",

    ".",

    "..",

    "---",

    "..-",

    ".-",

    ".",

    "..",

    "---",

    "..-",

    ".-",

    ".",

    "..",

    "---",

    "..-",

    ".-",

    ".",

    "..",

    "---",

    "..-",

    ".-",

    ".",

    "..",

    "---",

    "..-",

    ".-",

    ".",

    "..",

    "---",

    "..-",

    ".-",

    ".",

    "..",

    "---",

    "..-",

    ".-",

    ".",

    "..",

    "---",

    "..-",

    ".-",

    ".",

    "..",

    "---",

    "..-",

    ".-",

    ".",

    "..",

    "---",

    "..-",

    ".-",

    ".",

    "..",

    "---",

    "..-",

    ".-",

    ".",

    "..",

    "---",

    "..-",

    ".-",

    ".",

    "..",

    "---",

    "..-",

    ".-",

    ".",

    "..",

    "---",

    "..-",

    ".-",

    ".",

    "..",

    "---",

    "..-",

    ".-",

    ".",

    "..",

    "---",

    "..-",

    ".-",

    ".",

    "..",

    "---",

    "..-",

    ".-",

    ".",

    "..",

    "---",

    "..-",

    ".-",

    ".",

    "..",

    "---",

    "..-",

    ".-",

    ".",

    "..",

    "---",

    "..-",

    ".-",

    ".",

    "..",

    "---",

    "..-",
  ];

  // Use selected length from menu

  const targetLettersEncode = fullEncodeArray.slice(0, parseInt(length));

  const targetLettersDecode = fullDecodeArray.slice(0, parseInt(length));

  const targetLetters =
    mode === "encode" ? targetLettersEncode : targetLettersDecode;

  // Morse code mappings

  const morseCodeMap = {
    A: ".-",

    B: "-...",

    C: "-.-.",

    D: "-..",

    E: ".",

    F: "..-.",

    G: "--.",

    H: "....",

    I: "..",

    J: ".---",

    K: "-.-",

    L: ".-..",

    M: "--",

    N: "-.",

    O: "---",

    P: ".--.",

    Q: "--.-",

    R: ".-.",

    S: "...",

    T: "-",

    U: "..-",

    V: "...-",

    W: ".--",

    X: "-..-",

    Y: "-.--",

    Z: "--..",
  };

  // Word mode: list of words (A–Z only). Length = number of words (10, 15, 50, 100).

  const WORD_LIST = [
    "THE",
    "AND",
    "FOR",
    "ARE",
    "BUT",
    "NOT",
    "YOU",
    "ALL",
    "CAN",
    "HAD",

    "HER",
    "WAS",
    "ONE",
    "OUR",
    "OUT",
    "DAY",
    "GET",
    "HAS",
    "HIM",
    "HIS",

    "HOW",
    "MAN",
    "NEW",
    "NOW",
    "OLD",
    "SEE",
    "WAY",
    "WHO",
    "BOY",
    "DID",

    "ITS",
    "LET",
    "PUT",
    "SAY",
    "SHE",
    "TOO",
    "USE",
    "CAT",
    "DOG",
    "RUN",

    "SUN",
    "FUN",
    "BIG",
    "RED",
    "BLUE",
    "GREEN",
    "CODE",
    "MORE",
    "SOME",

    "COME",
    "HOME",
    "LIVE",
    "LOVE",
    "WORK",
    "WORD",
    "LONG",
    "TIME",
    "GOOD",

    "MUCH",
    "MUST",
    "OVER",
    "SUCH",
    "TAKE",
    "THAN",
    "THEM",
    "THEN",
    "THEY",

    "THIS",
    "WITH",
    "FROM",
    "HAVE",
    "BEEN",
    "WERE",
    "WHAT",
    "WHEN",
    "WILL",

    "YOUR",
    "ABOUT",
    "AFTER",
    "AGAIN",
    "BEFORE",
    "EVERY",
    "FIRST",
    "OTHER",

    "RIGHT",
    "SOUND",
    "STILL",
    "THREE",
    "WATER",
    "WHERE",
    "WHICH",
    "WORLD",

    "WRITE",
    "LETTER",
    "NUMBER",
    "LITTLE",
    "PEOPLE",
    "THINK",
    "THING",
    "PLACE",
  ];

  const numWords = parseInt(length, 10);

  const targetWordsEncode = WORD_LIST.slice(
    0,
    Math.min(numWords, WORD_LIST.length),
  );

  const targetWordsDecode = targetWordsEncode.map((word) =>
    word
      .split("")
      .map((c) => morseCodeMap[c])
      .filter(Boolean),
  );

  const encodeCurrentWord = targetWordsEncode[encodeWordIndex] ?? "";

  const encodeCurrentLetter =
    encodeCurrentWord[encodeLetterInWordIndex] ?? null;

  const decodeCurrentWordMorse = targetWordsDecode[decodeWordIndex] ?? [];

  const decodeCurrentMorse =
    decodeCurrentWordMorse[decodeLetterInWordIndex] ?? null;

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === "Space" && !isSpacebarPressed) {
        e.preventDefault();

        setIsSpacebarPressed(true);

        setSpacebarStartTime(Date.now());

        // Clear any existing timeout when user starts typing

        if (inputTimeout) {
          clearTimeout(inputTimeout);

          setInputTimeout(null);
        }
      } else if (e.code === "Enter") {
        e.preventDefault();

        setMorseInput("");

        setCharInput("");

        setEncodeCurrentCharIndex(0);

        setDecodeCurrentCharIndex(0);

        setEncodeWordIndex(0);

        setEncodeLetterInWordIndex(0);

        setDecodeWordIndex(0);

        setDecodeLetterInWordIndex(0);

        setIsError(false);

        setIsSuccess(false);

        setSuccessDisplay("");

        setIsCompleted(false);

        if (inputTimeout) {
          clearTimeout(inputTimeout);

          setInputTimeout(null);
        }
      } else if (
        mode === "decode" &&
        e.key.length === 1 &&
        e.key.match(/[a-zA-Z]/)
      ) {
        const newCharInput = e.key.toUpperCase();

        setCharInput(newCharInput);

        if (type === "word") {
          if (
            decodeWordIndex < targetWordsDecode.length &&
            decodeLetterInWordIndex < decodeCurrentWordMorse.length
          ) {
            const currentMorse = decodeCurrentMorse;

            const expectedLetter = Object.keys(morseCodeMap).find(
              (key) => morseCodeMap[key] === currentMorse,
            );

            if (expectedLetter && expectedLetter === newCharInput) {
              setIsSuccess(true);

              setSuccessDisplay(newCharInput);

              setMorseInput("");

              setCharInput("");

              const isLastLetterInWord =
                decodeLetterInWordIndex === decodeCurrentWordMorse.length - 1;

              const isLastWord =
                decodeWordIndex === targetWordsDecode.length - 1;

              if (isLastLetterInWord) {
                setDecodeWordIndex((prev) => prev + 1);

                setDecodeLetterInWordIndex(0);

                if (isLastWord) setIsCompleted(true);
              } else {
                setDecodeLetterInWordIndex((prev) => prev + 1);
              }

              setTimeout(() => {
                setIsSuccess(false);
                setSuccessDisplay("");
              }, 500);
            } else {
              setIsError(true);

              setTimeout(() => {
                setIsError(false);
                setMorseInput("");
                setCharInput("");
              }, 500);
            }
          }
        } else if (currentCharIndex < targetLetters.length) {
          const currentMorse = targetLetters[currentCharIndex];

          const expectedLetter = Object.keys(morseCodeMap).find(
            (key) => morseCodeMap[key] === currentMorse,
          );

          if (expectedLetter && expectedLetter === newCharInput) {
            setIsSuccess(true);

            setSuccessDisplay(newCharInput);

            setCurrentCharIndex((prev) => prev + 1);

            setMorseInput("");

            setCharInput("");

            setTimeout(() => {
              setIsSuccess(false);

              setSuccessDisplay("");

              if (currentCharIndex + 1 === targetLetters.length)
                setIsCompleted(true);
            }, 500);
          } else {
            // Error - wrong character

            setIsError(true);

            setTimeout(() => {
              setIsError(false);

              setMorseInput("");

              setCharInput("");
            }, 500);
          }
        }
      }
    };

    const handleKeyUp = (e) => {
      if (e.code === "Space" && isSpacebarPressed) {
        e.preventDefault();

        const pressDuration = Date.now() - spacebarStartTime;

        const morseChar = pressDuration >= 150 ? "-" : ".";

        const newInput = morseInput + morseChar;

        setMorseInput(newInput);

        // Clear any existing timeout

        if (inputTimeout) {
          clearTimeout(inputTimeout);

          setInputTimeout(null);
        }

        if (mode === "encode") {
          if (type === "word") {
            if (
              encodeWordIndex < targetWordsEncode.length &&
              encodeCurrentLetter
            ) {
              const expectedMorse = morseCodeMap[encodeCurrentLetter];

              if (!expectedMorse.startsWith(newInput)) {
                setIsError(true);

                setTimeout(() => {
                  setIsError(false);
                  setMorseInput("");
                }, 500);
              } else if (newInput === expectedMorse) {
                setIsSuccess(true);

                setSuccessDisplay(newInput);

                const isLastLetterInWord =
                  encodeLetterInWordIndex === encodeCurrentWord.length - 1;

                const isLastWord =
                  encodeWordIndex === targetWordsEncode.length - 1;

                if (isLastLetterInWord) {
                  setEncodeWordIndex((prev) => prev + 1);

                  setEncodeLetterInWordIndex(0);

                  if (isLastWord) setIsCompleted(true);
                } else {
                  setEncodeLetterInWordIndex((prev) => prev + 1);
                }

                setMorseInput("");

                setTimeout(() => {
                  setIsSuccess(false);
                  setSuccessDisplay("");
                }, 500);
              } else {
                const timeout = setTimeout(() => {
                  setIsError(true);

                  setTimeout(() => {
                    setIsError(false);
                    setMorseInput("");
                  }, 500);
                }, 1000);

                setInputTimeout(timeout);
              }
            }
          } else if (currentCharIndex < targetLetters.length) {
            const currentLetter = targetLetters[currentCharIndex];

            const expectedMorse = morseCodeMap[currentLetter];

            if (!expectedMorse.startsWith(newInput)) {
              setIsError(true);

              setTimeout(() => {
                setIsError(false);
                setMorseInput("");
              }, 500);
            } else if (newInput === expectedMorse) {
              setIsSuccess(true);

              setSuccessDisplay(newInput);

              const isLastChar = currentCharIndex === targetLetters.length - 1;

              setCurrentCharIndex((prev) => prev + 1);

              setMorseInput("");

              setTimeout(() => {
                setIsSuccess(false);

                setSuccessDisplay("");

                if (isLastChar) setIsCompleted(true);
              }, 500);
            } else {
              const timeout = setTimeout(() => {
                setIsError(true);

                setTimeout(() => {
                  setIsError(false);
                  setMorseInput("");
                }, 500);
              }, 1000);

              setInputTimeout(timeout);
            }
          }
        }

        setIsSpacebarPressed(false);

        setSpacebarStartTime(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);

      window.removeEventListener("keyup", handleKeyUp);

      if (inputTimeout) {
        clearTimeout(inputTimeout);
      }
    };
  }, [
    isSpacebarPressed,

    spacebarStartTime,

    morseInput,

    currentCharIndex,

    targetLetters,

    morseCodeMap,

    inputTimeout,

    mode,

    type,

    setCurrentCharIndex,

    targetWordsEncode,

    targetWordsDecode,

    encodeWordIndex,

    encodeLetterInWordIndex,

    encodeCurrentWord,

    encodeCurrentLetter,

    decodeWordIndex,

    decodeLetterInWordIndex,

    decodeCurrentWordMorse,

    decodeCurrentMorse,
  ]);

  return (
    <div className="flex flex-col items-center">
      {!isCompleted && (
        <div
          className={`${spmono.className} font-bold w-[705px] h-[65px] bg-[#1E2332] rounded-xl flex items-center justify-between mt-14`}
        >
          <button
            onClick={() => setMode("decode")}
            className={`pl-10 pr-4 py-4 transition-colors duration-300 ${
              mode === "decode"
                ? "text-[#EF4444]"
                : "text-[#9CA3AF] hover:text-white"
            }`}
          >
            decode
          </button>

          <button
            onClick={() => setMode("encode")}
            className={`px-4 py-4 transition-colors duration-300 ${
              mode === "encode"
                ? "text-[#EF4444]"
                : "text-[#9CA3AF] hover:text-white"
            }`}
          >
            encode
          </button>

          <p className="text-[#9CA3AF]">|</p>

          <button
            onClick={() => setType("a-z")}
            className={`px-4 py-4 transition-colors duration-300 ${
              type === "a-z"
                ? "text-[#EF4444]"
                : "text-[#9CA3AF] hover:text-white"
            }`}
          >
            a-z
          </button>

          <button
            onClick={() => setType("word")}
            className={`px-4 py-4 transition-colors duration-300 ${
              type === "word"
                ? "text-[#EF4444]"
                : "text-[#9CA3AF] hover:text-white"
            }`}
          >
            word
          </button>

          <p className="text-[#9CA3AF]">|</p>

          <div className="flex">
            {["10", "15", "50", "100"].map((len) => (
              <button
                key={len}
                onClick={() => setLength(len)}
                className={`px-4 py-4 transition-colors duration-300 ${
                  length === len
                    ? "text-[#EF4444]"
                    : "text-[#9CA3AF] hover:text-white"
                } ${len === "100" ? "pr-10" : ""}`}
              >
                {len}
              </button>
            ))}
          </div>
        </div>
      )}

      {isCompleted ? (
        <div className="flex flex-col items-center mt-40 animate-fadeIn">
          <div>
            <div className="flex">
              <div>
                <p
                  className={`${spmono.className} text-[#9CA3AF] font-bold text-[20px]`}
                >
                  wpm
                </p>

                <p className={`${spmono.className} text-[#EF4444] text-[96px]`}>
                  53
                </p>
              </div>

              <div className="ml-10">
                <p
                  className={`${spmono.className} text-[#9CA3AF] font-bold text-[20px]`}
                >
                  accuracy
                </p>

                <p className={`${spmono.className} text-[#EF4444] text-[96px]`}>
                  90%
                </p>
              </div>

              <div className="ml-10">
                <p
                  className={`${spmono.className} text-[#9CA3AF] font-bold text-[20px]`}
                >
                  time
                </p>

                <p className={`${spmono.className} text-[#EF4444] text-[96px]`}>
                  99s
                </p>
              </div>
            </div>

            <div className="flex">
              <div>
                <p
                  className={`${spmono.className} text-[#9CA3AF] font-bold text-[20px]`}
                >
                  mode
                </p>

                <p className={`${spmono.className} text-[#EF4444] text-[20px]`}>
                  {mode} {type}
                </p>
              </div>

              <div className="ml-10">
                <p
                  className={`${spmono.className} text-[#9CA3AF] font-bold text-[20px]`}
                >
                  date
                </p>

                <p className={`${spmono.className} text-[#EF4444] text-[20px]`}>
                  56/87/21%
                </p>
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
              setMorseInput("");

              setCharInput("");

              setEncodeCurrentCharIndex(0);

              setDecodeCurrentCharIndex(0);

              setEncodeWordIndex(0);

              setEncodeLetterInWordIndex(0);

              setDecodeWordIndex(0);

              setDecodeLetterInWordIndex(0);

              setCurrentLine(0);

              setDecodeCurrentLine(0);

              setIsError(false);

              setIsSuccess(false);

              setSuccessDisplay("");

              setIsCompleted(false);

              setIsFading(false);

              if (inputTimeout) {
                clearTimeout(inputTimeout);

                setInputTimeout(null);
              }
            }}
          />
        </div>
      ) : mode === "decode" ? (
        <div
          className={`${
            isFading ? "animate-fadeOut" : ""
          } flex flex-col items-center`}
        >
          <div
            className="flex flex-wrap justify-center mt-40 max-w-7xl relative"
            style={{ height: "60px", overflow: "hidden" }}
          >
            <div
              className="flex flex-wrap justify-center"
              style={
                type === "word"
                  ? undefined
                  : {
                      transform: `translateY(-${decodeCurrentLine * 80}px)`,

                      transition:
                        "transform 0.5s cubic-bezier(0.4, 0.0, 0.2, 1)",
                    }
              }
            >
              {(type === "word" ? decodeCurrentWordMorse : targetLetters).map(
                (letter, index) => {
                  const currentIdx =
                    type === "word"
                      ? decodeLetterInWordIndex
                      : currentCharIndex;

                  const isPast =
                    type === "word"
                      ? index < decodeLetterInWordIndex
                      : index < currentCharIndex;

                  const isCurrent = index === currentIdx;

                  return (
                    <p
                      key={
                        type === "word" ? `w${decodeWordIndex}-${index}` : index
                      }
                      className={`${
                        spmono.className
                      } text-[48px] font-bold transition-colors duration-300 ${
                        isPast
                          ? "text-white"
                          : isCurrent && isError
                            ? "text-red-500 animate-shake"
                            : "text-[#5a5e61]"
                      }`}
                      style={{ margin: "0 1rem" }}
                    >
                      {letter}
                    </p>
                  );
                },
              )}
            </div>

            {type === "word" && targetWordsDecode.length > 0 && (
              <p
                className={`${spmono.className} text-[#9CA3AF] text-sm mt-2 w-full text-center`}
              >
                word {decodeWordIndex + 1} of {targetWordsDecode.length}
              </p>
            )}
          </div>

          <Image
            src="/reset-svgrepo-com 1.svg"
            width={14}
            height={14}
            alt=""
            className="mt-10 cursor-pointer hover:opacity-70 transition-opacity"
            onClick={() => {
              setMorseInput("");

              setCharInput("");

              setEncodeCurrentCharIndex(0);

              setDecodeCurrentCharIndex(0);

              setCurrentLine(0);

              setDecodeCurrentLine(0);

              setIsError(false);

              setIsSuccess(false);

              setSuccessDisplay("");

              setIsCompleted(false);

              setIsFading(false);

              if (inputTimeout) {
                clearTimeout(inputTimeout);

                setInputTimeout(null);
              }
            }}
          />

          <p
            className={`${
              spmono.className
            } text-[48px] font-bold mt-20 transition-colors duration-300 ${
              isError
                ? "text-red-500 animate-shake"
                : isSuccess
                  ? "text-green-500"
                  : "text-white"
            }`}
          >
            {isSuccess
              ? successDisplay
              : charInput || (
                  <span className="text-[24px] text-[#9CA3AF]">type</span>
                )}
          </p>

          <div className="mt-30">
            <div className="bg-[#717171] text-[11px]">
              <p
                className={`${spmono.className} font-bold text-[#141720] mx-1`}
              >
                type - to input
              </p>
            </div>

            <div className="bg-[#717171] text-[11px]">
              <p
                className={`${spmono.className} font-bold text-[#141720] mx-1 mt-3`}
              >
                enter - to reset
              </p>
            </div>
          </div>
        </div>
      ) : isCompleted ? (
        <div className="flex flex-col items-center mt-40 animate-fadeIn">
          <div>
            <div className="flex">
              <div>
                <p
                  className={`${spmono.className} text-[#9CA3AF] font-bold text-[20px]`}
                >
                  wpm
                </p>

                <p className={`${spmono.className} text-[#EF4444] text-[96px]`}>
                  53
                </p>
              </div>

              <div className="ml-10">
                <p
                  className={`${spmono.className} text-[#9CA3AF] font-bold text-[20px]`}
                >
                  accuracy
                </p>

                <p className={`${spmono.className} text-[#EF4444] text-[96px]`}>
                  90%
                </p>
              </div>

              <div className="ml-10">
                <p
                  className={`${spmono.className} text-[#9CA3AF] font-bold text-[20px]`}
                >
                  time
                </p>

                <p className={`${spmono.className} text-[#EF4444] text-[96px]`}>
                  99s
                </p>
              </div>
            </div>

            <div className="flex">
              <div>
                <p
                  className={`${spmono.className} text-[#9CA3AF] font-bold text-[20px]`}
                >
                  mode
                </p>

                <p className={`${spmono.className} text-[#EF4444] text-[20px]`}>
                  {mode} {type}
                </p>
              </div>

              <div className="ml-10">
                <p
                  className={`${spmono.className} text-[#9CA3AF] font-bold text-[20px]`}
                >
                  date
                </p>

                <p className={`${spmono.className} text-[#EF4444] text-[20px]`}>
                  56/87/21%
                </p>
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
              setMorseInput("");

              setCurrentCharIndex(0);

              setIsError(false);

              setIsSuccess(false);

              setSuccessDisplay("");

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
          <div
            ref={containerRef}
            className={`flex flex-wrap mt-40 max-w-7xl relative ${
              type === "word" ? "justify-center" : ""
            }`}
            style={{ height: "60px", overflow: "hidden" }}
          >
            <div
              className={`flex flex-wrap ${
                type === "word" ? "justify-center" : ""
              }`}
              style={
                type === "word"
                  ? undefined
                  : {
                      transform: `translateY(-${currentLine * 80}px)`,

                      transition:
                        "transform 0.5s cubic-bezier(0.4, 0.0, 0.2, 1)",
                    }
              }
            >
              {(type === "word"
                ? encodeCurrentWord.split("")
                : targetLettersEncode
              ).map((letter, index) => {
                const currentIdx =
                  type === "word" ? encodeLetterInWordIndex : currentCharIndex;

                const isPast =
                  type === "word"
                    ? index < encodeLetterInWordIndex
                    : index < currentCharIndex;

                const isCurrent = index === currentIdx;

                return (
                  <p
                    key={
                      type === "word" ? `w${encodeWordIndex}-${index}` : index
                    }
                    className={`${
                      spmono.className
                    } text-[48px] font-bold transition-colors duration-300 ${
                      isPast
                        ? "text-white"
                        : isCurrent && isError
                          ? "text-red-500 animate-shake"
                          : "text-[#5a5e61]"
                    }`}
                    style={{ margin: "0 1rem" }}
                  >
                    {letter}
                  </p>
                );
              })}
            </div>

            {type === "word" && targetWordsEncode.length > 0 && (
              <p
                className={`${spmono.className} text-[#9CA3AF] text-sm mt-2 w-full text-center`}
              >
                word {encodeWordIndex + 1} of {targetWordsEncode.length}
              </p>
            )}
          </div>

          <Image
            src="/reset-svgrepo-com 1.svg"
            width={14}
            height={14}
            alt=""
            className="mt-10 cursor-pointer hover:opacity-70 transition-opacity"
            onClick={() => {
              setMorseInput("");

              setEncodeCurrentCharIndex(0);

              setDecodeCurrentCharIndex(0);

              setEncodeWordIndex(0);

              setEncodeLetterInWordIndex(0);

              setDecodeWordIndex(0);

              setDecodeLetterInWordIndex(0);

              setCurrentLine(0);

              setDecodeCurrentLine(0);

              setIsError(false);

              setIsSuccess(false);

              setSuccessDisplay("");

              setIsCompleted(false);

              if (inputTimeout) {
                clearTimeout(inputTimeout);

                setInputTimeout(null);
              }
            }}
          />

          <p
            className={`${
              spmono.className
            } text-[48px] font-bold mt-20 transition-colors duration-300 ${
              isError
                ? "text-red-500 animate-shake"
                : isSuccess
                  ? "text-green-500"
                  : "text-white"
            }`}
          >
            {isSuccess
              ? successDisplay
              : morseInput || (
                  <span className="text-[24px] text-[#9CA3AF]">
                    press spacebar
                  </span>
                )}
          </p>

          <div className="mt-30">
            <div className="bg-[#717171] text-[11px]">
              <p
                className={`${spmono.className} font-bold text-[#141720] mx-1`}
              >
                spacebar - to input
              </p>
            </div>

            <div className="bg-[#717171] text-[11px]">
              <p
                className={`${spmono.className} font-bold text-[#141720] mx-1 mt-3 text-center`}
              >
                enter - to reset
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
