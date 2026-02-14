"use client";

import React, { useState, useEffect } from 'react';
import { Space_Mono } from 'next/font/google';
import Image from 'next/image';

const spmono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
});

export default function About() {
  return (
    <div className='px-40'>
      <h1 className={`${spmono.className} text-[32px] space-mono font-bold mt-10`}>About</h1>
      <p className={`${spmono.className} text-[16px] space-mono mt-4`}>Currently, Morse code is still used in many contexts, such as emergency communication, radio work, and historical studies. However, mastering Morse code requires consistent practice, as well as tools that can clearly measure speed and accuracy.</p>
      <p className={`${spmono.className} text-[16px] space-mono mt-2`}>This project aims to develop a web application for teaching Morse code, inspired by Monkeytype, a popular typing practice platform. The developed system will allow users to practice Morse code in various formats, record practice results, analyze progress, and compare results with others through a ranking system.</p>
      <p className={`${spmono.className} text-[16px] space-mono text-[#666] mt-6`}>- Create by Pangkeek</p>
    </div>
  );
}