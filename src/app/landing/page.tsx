// src/app/landing/page.tsx
"use client";

import React from 'react';
import ProfessionalGridBackground from '@/components/ProfessionalGridBackground';

export default function LandingPage() {
  return (
    <div className='relative w-full overflow-hidden' style={{ height: '100vh' }}>
      {/* Professional Grid Distortion Background */}
      <div className="absolute inset-0 z-0">
        <ProfessionalGridBackground
          grid={30}
          mouse={0.1}
          strength={0.12}
          relaxation={0.9}
          className="w-full h-full"
        />
      </div>

      {/* Subtle overlay for depth */}
      <div className="absolute inset-0 z-5 bg-gradient-to-br from-black/10 via-transparent to-black/20" />
      
      {/* Main Content */}
      <div className='relative z-10 flex flex-col justify-center items-center min-h-screen px-6 py-20'>
        
        {/* Hero Section */}
        <div className="max-w-6xl mx-auto text-center">
          
          {/* Main Heading */}
          <div className="mb-12">
            <h1 className='text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-tight text-white mb-4'>
              Welcome to
            </h1>
            <h2 className='text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-extralight tracking-wider text-white'>
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                AyuVerse
              </span>
            </h2>
          </div>
          
          {/* Subtitle */}
          <div className="mb-16">
            <p className='max-w-4xl mx-auto text-xl md:text-2xl lg:text-3xl font-light text-gray-300 leading-relaxed'>
              Discover the future of health analysis through{' '}
              <span className='text-blue-400 font-normal'>
                advanced AI technology
              </span>{' '}
              combined with the ancient wisdom of{' '}
              <span className='text-purple-400 font-normal'>
                Ayurveda
              </span>
            </p>
          </div>

          {/* Features Grid */}
          {/* <div className="grid md:grid-cols-3 gap-8 mb-16 max-w-4xl mx-auto">
            <div className="text-center p-6 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-white mb-2">AI-Powered Analysis</h3>
              <p className="text-gray-400 text-sm">Advanced machine learning algorithms for precise health insights</p>
            </div>
            
            <div className="text-center p-6 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Ayurvedic Wisdom</h3>
              <p className="text-gray-400 text-sm">Ancient knowledge meets modern technology for holistic health</p>
            </div>
            
            <div className="text-center p-6 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Instant Results</h3>
              <p className="text-gray-400 text-sm">Get comprehensive health insights in seconds, not days</p>
            </div>
          </div> */}

          {/* Call to Action */}
          <div className="space-y-6">
            <button className="group relative px-12 py-4 text-lg font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105 active:scale-95">
              <span className="relative z-10">Start Your Analysis</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
            
            <p className="text-gray-400 text-sm">
              Free analysis • No registration required • Results in 30 seconds
            </p>
          </div>

        </div>
      </div>

      {/* Subtle animated elements */}
      <div className="absolute top-20 left-20 w-2 h-2 bg-blue-400 rounded-full opacity-30 animate-pulse"></div>
      <div className="absolute top-40 right-32 w-1 h-1 bg-purple-400 rounded-full opacity-40 animate-pulse delay-1000"></div>
      <div className="absolute bottom-32 left-1/4 w-1.5 h-1.5 bg-blue-300 rounded-full opacity-20 animate-pulse delay-2000"></div>
    </div>
  );
}