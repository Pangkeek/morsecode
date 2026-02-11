import React, { useState, useEffect } from 'react';
import { Space_Mono } from 'next/font/google';
import Image from 'next/image';

const spmono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
});

export default function About() {
  return (
    <div>
      <h1>About</h1>
    </div>
  );
}