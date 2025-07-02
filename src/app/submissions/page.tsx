'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Submission {
  id: string;
  type: "movie" | "show" | "music" | "book" | "art";
  name: string;
  movie1?: string;
  movie2?: string;
  movie3?: string;
  movie4?: string;
  movie5?: string;
  genres1?: string[];
  genres2?: string[];
  genres3?: string[];
  genres4?: string[];
  genres5?: string[];
  why1?: string;
  why2?: string;
  why3?: string;
  why4?: string;
  why5?: string;
  show1?: string;
  show2?: string;
  show3?: string;
  show4?: string;
  show5?: string;
  music1?: string;
  music2?: string;
  music3?: string;
  music4?: string;
  music5?: string;
  artist1?: string;
  artist2?: string;
  artist3?: string;
  artist4?: string;
  artist5?: string;
  book1?: string;
  book2?: string;
  book3?: string;
  book4?: string;
  book5?: string;
  author1?: string;
  author2?: string;
  author3?: string;
  author4?: string;
  author5?: string;
  artPiece?: string;
  artFile?: string;
  submitted_at: string;
}

// Custom Cursor Component - Efficient Version
const CustomCursor = () => {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    // Check if device supports hover (desktop) vs touch
    const checkDevice = () => {
      const hasHover = window.matchMedia('(hover: hover)').matches;
      const hasPointer = window.matchMedia('(pointer: fine)').matches;
      setIsDesktop(hasHover && hasPointer);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  useEffect(() => {
    if (!isDesktop) return; // Don't initialize cursor on mobile/touch devices

    const cursor = document.getElementById('custom-cursor');
    const trails = Array.from({ length: 7 }, (_, i) => document.getElementById(`trail-${i + 1}`));
    
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    const trailPositions = Array(7).fill(null).map(() => ({ x: 0, y: 0 }));
    let animationId: number;
    
    const updateCursor = () => {
      // Smooth cursor movement with easing
      cursorX += (mouseX - cursorX) * 0.15;
      cursorY += (mouseY - cursorY) * 0.15;
      
      if (cursor) {
        cursor.style.setProperty('--cursor-x', `${cursorX}px`);
        cursor.style.setProperty('--cursor-y', `${cursorY}px`);
      }
      
      // Update trail positions with staggered easing
      trailPositions.forEach((pos, i) => {
        const targetX = i === 0 ? cursorX : trailPositions[i - 1].x;
        const targetY = i === 0 ? cursorY : trailPositions[i - 1].y;
        
        pos.x += (targetX - pos.x) * 0.3;
        pos.y += (targetY - pos.y) * 0.3;
        
        if (trails[i]) {
          trails[i].style.setProperty('--trail-x', `${pos.x}px`);
          trails[i].style.setProperty('--trail-y', `${pos.y}px`);
        }
      });
      
      animationId = requestAnimationFrame(updateCursor);
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    
    const handleMouseLeave = () => {
      document.body.classList.add('cursor-hidden');
    };
    
    const handleMouseEnter = () => {
      document.body.classList.remove('cursor-hidden');
    };
    
    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    
    updateCursor();
    
    return () => {
      cancelAnimationFrame(animationId);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isDesktop]);

  // Don't render cursor elements on mobile/touch devices
  if (!isDesktop) return null;

  return (
    <>
      {/* Main cursor */}
      <div
        id="custom-cursor"
        className="custom-cursor"
        style={{
          '--cursor-x': '0px',
          '--cursor-y': '0px',
          left: 'var(--cursor-x)',
          top: 'var(--cursor-y)'
        } as React.CSSProperties}
      />
      
      {/* Trail dots */}
      {Array.from({ length: 7 }, (_, i) => (
        <div
          key={i}
          id={`trail-${i + 1}`}
          className="cursor-trail"
          style={{
            '--trail-x': '0px',
            '--trail-y': '0px',
            left: 'var(--trail-x)',
            top: 'var(--trail-y)'
          } as React.CSSProperties}
        />
      ))}
    </>
  );
};

// Animated Frog Component - can be used for different types
const AnimatedFrog = ({ type = 'default' }: { type?: string }) => {
  const [currentFrog, setCurrentFrog] = useState(0);
  
  // Different frog sequences for different types
  const frogSequences = {
    movies: [
      '/woahfrog_png.png',
      '/blinkyfrog.png', 
      '/rainbowfrog.png',
      '/blinkyfrog.png',
      '/woahfrog_png.png',
      '/alienfrog.png'
    ],
    shows: [
      '/blinkyfrog.png',
      '/rainbowfrog.png',
      '/alienfrog.png',
      '/woahfrog_png.png',
      '/blinkyfrog.png',
      '/rainbowfrog.png'
    ],
    music: [
      '/rainbowfrog.png',
      '/alienfrog.png',
      '/woahfrog_png.png',
      '/blinkyfrog.png',
      '/rainbowfrog.png',
      '/alienfrog.png'
    ],
    books: [
      '/alienfrog.png',
      '/woahfrog_png.png',
      '/blinkyfrog.png',
      '/rainbowfrog.png',
      '/alienfrog.png',
      '/woahfrog_png.png'
    ],
    art: [
      '/rainbowfrog.png',
      '/alienfrog.png',
      '/woahfrog_png.png',
      '/blinkyfrog.png'
    ],
    default: [
      '/woahfrog_png.png',
      '/blinkyfrog.png', 
      '/rainbowfrog.png',
      '/alienfrog.png'
    ]
  };

  const frogs = frogSequences[type as keyof typeof frogSequences] || frogSequences.default;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFrog((prev) => (prev + 1) % frogs.length);
    }, 2000); // Change every 2 seconds

    return () => clearInterval(interval);
  }, [frogs.length]);

  return (
    <Image
      src={frogs[currentFrog]}
      alt="Animated Frog"
      width={48}
      height={48}
      className="inline-block"
    />
  );
};

// Animated UFO Component
const AnimatedUFO = () => {
  const [currentUFO, setCurrentUFO] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  
  // Initial sequence (only plays once on page load)
  const initialSequence = [
    { src: '/ufothreeblink.png', duration: 3000 } // 3 seconds
  ];
  
  // Regular animation sequence (plays after initial sequence)
  const regularSequence = [
    { src: '/ufo.png', duration: 2000 },           // 2 seconds
    { src: '/ufooneblink.png', duration: 1000 },   // 1 second
    { src: '/ufo.png', duration: 2000 },           // 2 seconds
    { src: '/ufotwoblink.png', duration: 1000 },   // 1 second
    { src: '/ufo.png', duration: 2000 }            // 2 seconds
  ];

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let currentIndex = 0;
    
    const cycleUFO = () => {
      if (!hasStarted) {
        // Play initial sequence (ufothreeblink.png for 3 seconds)
        setCurrentUFO(0);
        timeoutId = setTimeout(() => {
          setHasStarted(true);
          currentIndex = 0;
          cycleUFO();
        }, initialSequence[0].duration);
      } else {
        // Play regular sequence
        setCurrentUFO(currentIndex);
        timeoutId = setTimeout(() => {
          currentIndex = (currentIndex + 1) % regularSequence.length;
          cycleUFO();
        }, regularSequence[currentIndex].duration);
      }
    };
    
    cycleUFO();
    
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [hasStarted]);

  const currentSequence = hasStarted ? regularSequence : initialSequence;
  const currentImage = currentSequence[currentUFO];

  return (
    <Image 
      src={currentImage.src}
      alt="Animated UFO Logo" 
      width={800}
      height={200}
      className="w-full max-w-4xl mx-auto hover:scale-105 transition-transform duration-300"
    />
  );
};

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'movie' | 'show' | 'music' | 'book'>('movie');

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const response = await fetch('/api/submissions');
      const result = await response.json();

      console.log('API Response:', result);
      console.log('Submissions type:', typeof result.submissions);
      console.log('Submissions value:', result.submissions);

      if (response.ok && result.submissions !== undefined) {
        // Ensure submissions is always an array
        const submissionsArray = Array.isArray(result.submissions) ? result.submissions : [];
        console.log('Setting submissions to:', submissionsArray);
        setSubmissions(submissionsArray);
      } else {
        console.log('Setting error:', result.error || 'Failed to load submissions');
        setError(result.error || 'Failed to load submissions');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to load submissions');
    } finally {
      setLoading(false);
    }
  };

  const renderEntry = (entry: string | undefined, index: number, genres?: string[], why?: string) => {
    if (!entry) return null;
    
    return (
      <div key={index} className="mb-4 p-4 bg-[rgba(255,255,255,0.05)] rounded-xl">
        <div className="flex items-center mb-2">
          <span className="w-8 h-8 bg-gradient-to-r from-[#1e90ff] to-[#00bfff] rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
            {index + 1}
          </span>
          <span className="text-gray-200 font-medium text-lg">{entry}</span>
        </div>
        
        {genres && Array.isArray(genres) && genres.length > 0 && (
          <div className="ml-11 mb-2">
            <div className="flex flex-wrap gap-1">
              {genres.map((genre, genreIndex) => (
                <span key={genreIndex} className="px-2 py-1 bg-[rgba(30,144,255,0.2)] text-[#1e90ff] text-xs rounded-full border border-[rgba(30,144,255,0.3)]">
                  {genre}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {why && (
          <div className="ml-11">
            <p className="text-gray-400 text-sm italic">&quot;{why}&quot;</p>
          </div>
        )}
      </div>
    );
  };

  const renderSubmissionContent = (submission: Submission) => {
    switch (submission.type) {
      case 'movie':
        return (
          <div className="space-y-3">
            <h4 className="text-lg font-semibold text-gray-300 mb-4">
              <AnimatedFrog type="movies" /> Top 5 Movies:
            </h4>
            {renderEntry(submission.movie1, 0, submission.genres1, submission.why1)}
            {renderEntry(submission.movie2, 1, submission.genres2, submission.why2)}
            {renderEntry(submission.movie3, 2, submission.genres3, submission.why3)}
            {renderEntry(submission.movie4, 3, submission.genres4, submission.why4)}
            {renderEntry(submission.movie5, 4, submission.genres5, submission.why5)}
          </div>
        );
      
      case 'show':
        return (
          <div className="space-y-3">
            <h4 className="text-lg font-semibold text-gray-300 mb-4">
              <AnimatedFrog type="shows" /> Top 5 Shows:
            </h4>
            {renderEntry(submission.show1, 0, submission.genres1, submission.why1)}
            {renderEntry(submission.show2, 1, submission.genres2, submission.why2)}
            {renderEntry(submission.show3, 2, submission.genres3, submission.why3)}
            {renderEntry(submission.show4, 3, submission.genres4, submission.why4)}
            {renderEntry(submission.show5, 4, submission.genres5, submission.why5)}
          </div>
        );
      
      case 'music':
        return (
          <div className="space-y-3">
            <h4 className="text-lg font-semibold text-gray-300 mb-4">
                              <AnimatedFrog type="music" /> Top 5 Songs:
            </h4>
            {submission.music1 && (
              <div className="mb-4 p-4 bg-[rgba(255,255,255,0.05)] rounded-xl">
                <div className="flex items-center mb-2">
                  <span className="w-8 h-8 bg-gradient-to-r from-[#1e90ff] to-[#00bfff] rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
                    1
                  </span>
                  <div>
                    <span className="text-gray-200 font-medium text-lg">{submission.music1}</span>
                    {submission.artist1 && (
                      <div className="text-[#1e90ff] text-sm">by {submission.artist1}</div>
                    )}
                  </div>
                </div>
                {submission.why1 && (
                  <div className="ml-11">
                    <p className="text-gray-400 text-sm italic">&quot;{submission.why1}&quot;</p>
                  </div>
                )}
              </div>
            )}
            {submission.music2 && (
              <div className="mb-4 p-4 bg-[rgba(255,255,255,0.05)] rounded-xl">
                <div className="flex items-center mb-2">
                  <span className="w-8 h-8 bg-gradient-to-r from-[#1e90ff] to-[#00bfff] rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
                    2
                  </span>
                  <div>
                    <span className="text-gray-200 font-medium text-lg">{submission.music2}</span>
                    {submission.artist2 && (
                      <div className="text-[#1e90ff] text-sm">by {submission.artist2}</div>
                    )}
                  </div>
                </div>
                {submission.why2 && (
                  <div className="ml-11">
                    <p className="text-gray-400 text-sm italic">&quot;{submission.why2}&quot;</p>
                  </div>
                )}
              </div>
            )}
            {submission.music3 && (
              <div className="mb-4 p-4 bg-[rgba(255,255,255,0.05)] rounded-xl">
                <div className="flex items-center mb-2">
                  <span className="w-8 h-8 bg-gradient-to-r from-[#1e90ff] to-[#00bfff] rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
                    3
                  </span>
                  <div>
                    <span className="text-gray-200 font-medium text-lg">{submission.music3}</span>
                    {submission.artist3 && (
                      <div className="text-[#1e90ff] text-sm">by {submission.artist3}</div>
                    )}
                  </div>
                </div>
                {submission.why3 && (
                  <div className="ml-11">
                    <p className="text-gray-400 text-sm italic">&quot;{submission.why3}&quot;</p>
                  </div>
                )}
              </div>
            )}
            {submission.music4 && (
              <div className="mb-4 p-4 bg-[rgba(255,255,255,0.05)] rounded-xl">
                <div className="flex items-center mb-2">
                  <span className="w-8 h-8 bg-gradient-to-r from-[#1e90ff] to-[#00bfff] rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
                    4
                  </span>
                  <div>
                    <span className="text-gray-200 font-medium text-lg">{submission.music4}</span>
                    {submission.artist4 && (
                      <div className="text-[#1e90ff] text-sm">by {submission.artist4}</div>
                    )}
                  </div>
                </div>
                {submission.why4 && (
                  <div className="ml-11">
                    <p className="text-gray-400 text-sm italic">&quot;{submission.why4}&quot;</p>
                  </div>
                )}
              </div>
            )}
            {submission.music5 && (
              <div className="mb-4 p-4 bg-[rgba(255,255,255,0.05)] rounded-xl">
                <div className="flex items-center mb-2">
                  <span className="w-8 h-8 bg-gradient-to-r from-[#1e90ff] to-[#00bfff] rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
                    5
                  </span>
                  <div>
                    <span className="text-gray-200 font-medium text-lg">{submission.music5}</span>
                    {submission.artist5 && (
                      <div className="text-[#1e90ff] text-sm">by {submission.artist5}</div>
                    )}
                  </div>
                </div>
                {submission.why5 && (
                  <div className="ml-11">
                    <p className="text-gray-400 text-sm italic">&quot;{submission.why5}&quot;</p>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      
      case 'book':
        return (
          <div className="space-y-3">
            <h4 className="text-lg font-semibold text-gray-300 mb-4">
              <AnimatedFrog type="books" /> Top 5 Books:
            </h4>
            {submission.book1 && (
              <div className="mb-4 p-4 bg-[rgba(255,255,255,0.05)] rounded-xl">
                <div className="flex items-center mb-2">
                  <span className="w-8 h-8 bg-gradient-to-r from-[#1e90ff] to-[#00bfff] rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
                    1
                  </span>
                  <div>
                    <span className="text-gray-200 font-medium text-lg">{submission.book1}</span>
                    {submission.author1 && (
                      <div className="text-gray-400 text-sm">by {submission.author1}</div>
                    )}
                  </div>
                </div>
                {submission.why1 && (
                  <div className="ml-11">
                    <p className="text-gray-400 text-sm italic">&quot;{submission.why1}&quot;</p>
                  </div>
                )}
              </div>
            )}
            {submission.book2 && (
              <div className="mb-4 p-4 bg-[rgba(255,255,255,0.05)] rounded-xl">
                <div className="flex items-center mb-2">
                  <span className="w-8 h-8 bg-gradient-to-r from-[#1e90ff] to-[#00bfff] rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
                    2
                  </span>
                  <div>
                    <span className="text-gray-200 font-medium text-lg">{submission.book2}</span>
                    {submission.author2 && (
                      <div className="text-gray-400 text-sm">by {submission.author2}</div>
                    )}
                  </div>
                </div>
                {submission.why2 && (
                  <div className="ml-11">
                    <p className="text-gray-400 text-sm italic">&quot;{submission.why2}&quot;</p>
                  </div>
                )}
              </div>
            )}
            {submission.book3 && (
              <div className="mb-4 p-4 bg-[rgba(255,255,255,0.05)] rounded-xl">
                <div className="flex items-center mb-2">
                  <span className="w-8 h-8 bg-gradient-to-r from-[#1e90ff] to-[#00bfff] rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
                    3
                  </span>
                  <div>
                    <span className="text-gray-200 font-medium text-lg">{submission.book3}</span>
                    {submission.author3 && (
                      <div className="text-gray-400 text-sm">by {submission.author3}</div>
                    )}
                  </div>
                </div>
                {submission.why3 && (
                  <div className="ml-11">
                    <p className="text-gray-400 text-sm italic">&quot;{submission.why3}&quot;</p>
                  </div>
                )}
              </div>
            )}
            {submission.book4 && (
              <div className="mb-4 p-4 bg-[rgba(255,255,255,0.05)] rounded-xl">
                <div className="flex items-center mb-2">
                  <span className="w-8 h-8 bg-gradient-to-r from-[#1e90ff] to-[#00bfff] rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
                    4
                  </span>
                  <div>
                    <span className="text-gray-200 font-medium text-lg">{submission.book4}</span>
                    {submission.author4 && (
                      <div className="text-gray-400 text-sm">by {submission.author4}</div>
                    )}
                  </div>
                </div>
                {submission.why4 && (
                  <div className="ml-11">
                    <p className="text-gray-400 text-sm italic">&quot;{submission.why4}&quot;</p>
                  </div>
                )}
              </div>
            )}
            {submission.book5 && (
              <div className="mb-4 p-4 bg-[rgba(255,255,255,0.05)] rounded-xl">
                <div className="flex items-center mb-2">
                  <span className="w-8 h-8 bg-gradient-to-r from-[#1e90ff] to-[#00bfff] rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
                    5
                  </span>
                  <div>
                    <span className="text-gray-200 font-medium text-lg">{submission.book5}</span>
                    {submission.author5 && (
                      <div className="text-gray-400 text-sm">by {submission.author5}</div>
                    )}
                  </div>
                </div>
                {submission.why5 && (
                  <div className="ml-11">
                    <p className="text-gray-400 text-sm italic">&quot;{submission.why5}&quot;</p>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      
      case 'art':
        return (
          <div className="space-y-3">
            <h4 className="text-lg font-semibold text-gray-300 mb-4">
              <AnimatedFrog type="art" /> Art Piece:
            </h4>
            <div className="p-3 bg-[rgba(255,255,255,0.05)] rounded-xl">
              <span className="text-gray-200 font-medium">{submission.artPiece}</span>
            </div>
          </div>
        );
      
      default:
        return <div className="text-gray-400">Unknown submission type</div>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'movie': return <AnimatedFrog type="movies" />;
      case 'show': return <AnimatedFrog type="shows" />;
      case 'music': return <AnimatedFrog type="music" />;
      case 'book': return <AnimatedFrog type="books" />;
      case 'art': return <AnimatedFrog type="art" />;
      default: return <AnimatedFrog type="default" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'movie': return 'Movies';
      case 'show': return 'Shows';
      case 'music': return 'Songs';
      case 'book': return 'Books';
      case 'art': return 'Art';
      default: return 'Unknown';
    }
  };

  const filteredSubmissions = submissions.filter(submission => {
    return submission.type === activeTab;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a174e] via-[#1a2a6b] to-[#0f3460] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#1e90ff] mx-auto mb-4"></div>
          <p className="text-xl text-gray-300">Loading submissions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a174e] via-[#1a2a6b] to-[#0f3460] text-white flex items-center justify-center">
        <div className="text-center max-w-2xl mx-auto px-4">
          <div className="bg-gradient-to-br from-[rgba(20,30,60,0.95)] to-[rgba(30,50,100,0.95)] backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-[rgba(255,255,255,0.1)]">
            <div className="text-6xl mb-6">
              <AnimatedFrog type="default" />
            </div>
            <h1 className="font-[var(--font-orbitron)] text-3xl font-bold mb-4 text-red-400">
              Submissions
            </h1>
            <p className="text-gray-300 mb-6">{error}</p>
            <div className="space-y-4">
              <button
                onClick={fetchSubmissions}
                className="bg-gradient-to-r from-[#1e90ff] to-[#00bfff] hover:from-[#00bfff] hover:to-[#1e90ff] text-white border-none rounded-2xl py-3 px-6 text-lg font-[var(--font-orbitron)] font-bold cursor-pointer transition-all duration-300"
              >
                <AnimatedFrog type="default" /> Try Again
              </button>
              <Link href="/">
                <button className="bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.2)] text-white border border-[rgba(255,255,255,0.3)] rounded-2xl py-3 px-6 text-lg font-[var(--font-orbitron)] cursor-pointer transition-all duration-300">
                  ← Back to Form
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a174e] via-[#1a2a6b] to-[#0f3460] text-white py-8 px-4">
      <CustomCursor />
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30px_30px,rgba(255,255,255,0.1)_2px,transparent_0)] bg-[length:60px_60px]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Logo */}
        <div className="mb-12">
          <AnimatedUFO />
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-[var(--font-orbitron)] text-6xl font-bold tracking-wider mb-4 bg-gradient-to-r from-[#1e90ff] to-[#00bfff] bg-clip-text text-transparent">
            Human Data Collected
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            Discover what everyone loves! ({filteredSubmissions?.length || 0} submissions)
          </p>
          <Link href="/">
            <button className="bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.2)] text-white border border-[rgba(255,255,255,0.3)] rounded-2xl py-3 px-6 text-lg font-[var(--font-orbitron)] cursor-pointer transition-all duration-300">
              <AnimatedFrog type="default" /> Submit Your Favorites
            </button>
          </Link>
          {/* Spotify Playlist Embed - Only show on Songs tab */}
          {activeTab === 'music' && (
            <div className="flex justify-center mt-8">
              <iframe style={{ borderRadius: '12px' }} src="https://open.spotify.com/embed/playlist/4tAELeoj4PHuT9SO5ZQaFD?utm_source=generator" width="100%" height="352" frameBorder="0" allowFullScreen={true} allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={() => setActiveTab('movie')}
              className={`px-3 sm:px-6 py-2 sm:py-3 rounded-2xl font-[var(--font-orbitron)] text-sm sm:text-lg font-bold transition-all duration-300 whitespace-nowrap text-center flex items-center justify-center ${
                activeTab === 'movie'
                  ? 'bg-gradient-to-r from-[#1e90ff] to-[#00bfff] text-white shadow-lg'
                  : 'bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.2)] text-gray-300 border border-[rgba(255,255,255,0.3)]'
              }`}
            >
              <AnimatedFrog type="movies" /> Movies ({submissions.filter(s => s.type === 'movie').length})
            </button>
            <button
              onClick={() => setActiveTab('show')}
              className={`px-3 sm:px-6 py-2 sm:py-3 rounded-2xl font-[var(--font-orbitron)] text-sm sm:text-lg font-bold transition-all duration-300 whitespace-nowrap text-center flex items-center justify-center ${
                activeTab === 'show'
                  ? 'bg-gradient-to-r from-[#1e90ff] to-[#00bfff] text-white shadow-lg'
                  : 'bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.2)] text-gray-300 border border-[rgba(255,255,255,0.3)]'
              }`}
            >
              <AnimatedFrog type="shows" /> Shows ({submissions.filter(s => s.type === 'show').length})
            </button>
            <button
              onClick={() => setActiveTab('music')}
              className={`px-3 sm:px-6 py-2 sm:py-3 rounded-2xl font-[var(--font-orbitron)] text-sm sm:text-lg font-bold transition-all duration-300 whitespace-nowrap text-center flex items-center justify-center ${
                activeTab === 'music'
                  ? 'bg-gradient-to-r from-[#1e90ff] to-[#00bfff] text-white shadow-lg'
                  : 'bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.2)] text-gray-300 border border-[rgba(255,255,255,0.3)]'
              }`}
            >
              <AnimatedFrog type="music" /> Songs ({submissions.filter(s => s.type === 'music').length})
            </button>
            <button
              onClick={() => setActiveTab('book')}
              className={`px-3 sm:px-6 py-2 sm:py-3 rounded-2xl font-[var(--font-orbitron)] text-sm sm:text-lg font-bold transition-all duration-300 whitespace-nowrap text-center flex items-center justify-center ${
                activeTab === 'book'
                  ? 'bg-gradient-to-r from-[#1e90ff] to-[#00bfff] text-white shadow-lg'
                  : 'bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.2)] text-gray-300 border border-[rgba(255,255,255,0.3)]'
              }`}
            >
              <AnimatedFrog type="books" /> Books ({submissions.filter(s => s.type === 'book').length})
            </button>
          </div>
        </div>

        {/* Submissions Grid */}
        {(() => {
          try {
            if (!filteredSubmissions || !Array.isArray(filteredSubmissions) || filteredSubmissions.length === 0) {
              return (
                <div className="text-center py-16">
                  <div className="bg-gradient-to-br from-[rgba(20,30,60,0.95)] to-[rgba(30,50,100,0.95)] backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-[rgba(255,255,255,0.1)] max-w-2xl mx-auto">
                    <div className="text-8xl mb-6">
                      <AnimatedFrog type={activeTab === 'music' ? 'music' : activeTab + 's'} />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-300 mb-4">
                      {`No ${getTypeLabel(activeTab).toLowerCase()} submissions yet`}
                    </h2>
                    <p className="text-gray-400 mb-8 text-lg">
                      {`Be the first to share your favorite ${getTypeLabel(activeTab).toLowerCase()}!`}
                    </p>
                    <Link href="/">
                      <button className="bg-gradient-to-r from-[#1e90ff] to-[#00bfff] hover:from-[#00bfff] hover:to-[#1e90ff] text-white border-none rounded-2xl py-4 px-8 text-xl font-[var(--font-orbitron)] font-bold cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-lg">
                        <AnimatedFrog type="default" /> Be the First!
                      </button>
                    </Link>
                  </div>
                </div>
              );
            }

            return (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {filteredSubmissions.map((submission, index) => {
                  try {
                    if (!submission || !submission.id) {
                      console.warn('Invalid submission at index:', index, submission);
                      return null;
                    }

                    return (
                      <div key={submission.id} className="bg-gradient-to-br from-[rgba(20,30,60,0.95)] to-[rgba(30,50,100,0.95)] backdrop-blur-sm rounded-3xl p-6 shadow-2xl border border-[rgba(255,255,255,0.1)] hover:border-[rgba(30,144,255,0.3)] transition-all duration-300 transform hover:scale-105">
                        {/* User Header */}
                        <div className="flex items-center mb-6">
                          <div className="flex-1">
                            <h3 className="text-2xl font-bold text-[#1e90ff]">{submission.name || 'Anonymous'}</h3>
                            <div className="flex items-center mt-1">
                              <span className="text-2xl mr-2">{getTypeIcon(submission.type || 'unknown')}</span>
                              <span className="text-sm text-gray-400">{getTypeLabel(submission.type || 'unknown')}</span>
                            </div>
                            <p className="text-sm text-gray-400 mt-1">
                              {submission.submitted_at ? new Date(submission.submitted_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              }) : 'Unknown date'}
                            </p>
                          </div>
                        </div>
                        
                        {/* Content */}
                        {renderSubmissionContent(submission)}
                      </div>
                    );
                  } catch (submissionError) {
                    console.error('Error rendering submission at index:', index, submissionError);
                    return (
                      <div key={`error-${index}`} className="bg-gradient-to-br from-[rgba(60,20,20,0.95)] to-[rgba(100,30,30,0.95)] backdrop-blur-sm rounded-3xl p-6 shadow-2xl border border-[rgba(255,100,100,0.3)]">
                        <p className="text-red-300">Error displaying submission</p>
                      </div>
                    );
                  }
                })}
              </div>
            );
          } catch (renderError) {
            console.error('Error rendering submissions grid:', renderError);
            return (
              <div className="text-center py-16">
                <div className="bg-gradient-to-br from-[rgba(60,20,20,0.95)] to-[rgba(100,30,30,0.95)] backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-[rgba(255,100,100,0.3)] max-w-2xl mx-auto">
                  <div className="text-8xl mb-6">
                    <AnimatedFrog type="default" />
                  </div>
                  <h2 className="text-3xl font-bold text-red-300 mb-4">Error displaying submissions</h2>
                  <p className="text-red-200 mb-8 text-lg">There was an error loading the submissions. Please try refreshing the page.</p>
                  <button 
                    onClick={() => window.location.reload()} 
                    className="bg-gradient-to-r from-[#ff6b6b] to-[#ff8e8e] hover:from-[#ff8e8e] hover:to-[#ff6b6b] text-white border-none rounded-2xl py-4 px-8 text-xl font-[var(--font-orbitron)] font-bold cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-lg"
                  >
                    <AnimatedFrog type="default" /> Refresh Page
                  </button>
                </div>
              </div>
            );
          }
        })()}
      </div>
    </div>
  );
} 