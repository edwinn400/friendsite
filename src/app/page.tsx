"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

// Custom Cursor Component - Efficient Version
const CustomCursor = () => {
  useEffect(() => {
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
  }, []);

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



interface FormData {
  name: string;
  movie1: string;
  movie2: string;
  movie3: string;
  movie4: string;
  movie5: string;
  genres1: string[];
  genres2: string[];
  genres3: string[];
  genres4: string[];
  genres5: string[];
  why1: string;
  why2: string;
  why3: string;
  why4: string;
  why5: string;
}

interface ShowFormData {
  name: string;
  show1: string;
  show2: string;
  show3: string;
  show4: string;
  show5: string;
  genres1: string[];
  genres2: string[];
  genres3: string[];
  genres4: string[];
  genres5: string[];
  why1: string;
  why2: string;
  why3: string;
  why4: string;
  why5: string;
}

interface MusicFormData {
  name: string;
  music1: string;
  music2: string;
  music3: string;
  music4: string;
  music5: string;
  artist1: string;
  artist2: string;
  artist3: string;
  artist4: string;
  artist5: string;
  why1: string;
  why2: string;
  why3: string;
  why4: string;
  why5: string;
}

interface BookFormData {
  name: string;
  book1: string;
  book2: string;
  book3: string;
  book4: string;
  book5: string;
  author1: string;
  author2: string;
  author3: string;
  author4: string;
  author5: string;
  why1: string;
  why2: string;
  why3: string;
  why4: string;
  why5: string;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>("movies");
  const [formData, setFormData] = useState<FormData>({
    name: "",
    movie1: "",
    movie2: "",
    movie3: "",
    movie4: "",
    movie5: "",
    genres1: [],
    genres2: [],
    genres3: [],
    genres4: [],
    genres5: [],
    why1: "",
    why2: "",
    why3: "",
    why4: "",
    why5: "",
  });
  const [showFormData, setShowFormData] = useState<ShowFormData>({
    name: "",
    show1: "",
    show2: "",
    show3: "",
    show4: "",
    show5: "",
    genres1: [],
    genres2: [],
    genres3: [],
    genres4: [],
    genres5: [],
    why1: "",
    why2: "",
    why3: "",
    why4: "",
    why5: "",
  });
  const [musicFormData, setMusicFormData] = useState<MusicFormData>({
    name: "",
    music1: "",
    music2: "",
    music3: "",
    music4: "",
    music5: "",
    artist1: "",
    artist2: "",
    artist3: "",
    artist4: "",
    artist5: "",
    why1: "",
    why2: "",
    why3: "",
    why4: "",
    why5: "",
  });
  const [bookFormData, setBookFormData] = useState<BookFormData>({
    name: "",
    book1: "",
    book2: "",
    book3: "",
    book4: "",
    book5: "",
    author1: "",
    author2: "",
    author3: "",
    author4: "",
    author5: "",
    why1: "",
    why2: "",
    why3: "",
    why4: "",
    why5: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>, formType: string) => {
    const { name, value } = e.target;
    
    switch (formType) {
      case 'movies':
        setFormData(prev => ({ ...prev, [name]: value }));
        break;
      case 'shows':
        setShowFormData(prev => ({ ...prev, [name]: value }));
        break;
      case 'music':
        setMusicFormData(prev => ({ ...prev, [name]: value }));
        break;
      case 'books':
        setBookFormData(prev => ({ ...prev, [name]: value }));
        break;
    }
  };

  // Handle form submissions
  const handleSubmit = async (e: React.FormEvent, type: string) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      let submissionData;
      
      switch (type) {
        case 'movies':
          submissionData = {
            ...formData,
            name: formData.name || 'Anonymous'
          };
          break;
        case 'shows':
          submissionData = {
            ...showFormData,
            name: showFormData.name || 'Anonymous'
          };
          break;
        case 'music':
          submissionData = {
            ...musicFormData,
            name: musicFormData.name || 'Anonymous'
          };
          break;
        case 'books':
          submissionData = {
            ...bookFormData,
            name: bookFormData.name || 'Anonymous'
          };
          break;
        default:
          throw new Error('Invalid submission type');
      }

      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      const result = await response.json();

      if (result.success) {
        // Reset form data
        setFormData({
          name: formData.name, // Keep the name
          movie1: "",
          movie2: "",
          movie3: "",
          movie4: "",
          movie5: "",
          genres1: [],
          genres2: [],
          genres3: [],
          genres4: [],
          genres5: [],
          why1: "",
          why2: "",
          why3: "",
          why4: "",
          why5: "",
        });
        setShowFormData({
          name: showFormData.name, // Keep the name
          show1: "",
          show2: "",
          show3: "",
          show4: "",
          show5: "",
          genres1: [],
          genres2: [],
          genres3: [],
          genres4: [],
          genres5: [],
          why1: "",
          why2: "",
          why3: "",
          why4: "",
          why5: "",
        });
        setMusicFormData({
          name: musicFormData.name, // Keep the name
          music1: "",
          music2: "",
          music3: "",
          music4: "",
          music5: "",
          artist1: "",
          artist2: "",
          artist3: "",
          artist4: "",
          artist5: "",
          why1: "",
          why2: "",
          why3: "",
          why4: "",
          why5: "",
        });
        setBookFormData({
          name: bookFormData.name, // Keep the name
          book1: "",
          book2: "",
          book3: "",
          book4: "",
          book5: "",
          author1: "",
          author2: "",
          author3: "",
          author4: "",
          author5: "",
          why1: "",
          why2: "",
          why3: "",
          why4: "",
          why5: "",
        });
        
        alert(result.message);
      } else {
        setError(result.error || 'Failed to submit');
      }
    } catch (error) {
      console.error('Submission error:', error);
      setError('Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Main Landing Page View
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f1561] via-[#1a2a6b] to-[#0f3460] text-white">
      <CustomCursor />
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30px_30px,rgba(255,255,255,0.1)_2px,transparent_0)] bg-[length:60px_60px]"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen py-8 px-4">
        {/* Logo */}
        <div className="mb-12">
          <Image 
            src="/logo.png" 
            alt="Friendsite Logo" 
            width={800}
            height={200}
            className="w-full max-w-4xl mx-auto hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Abduction Message */}
        <div className="w-full max-w-4xl mx-auto mb-6 text-center">
          <div className="bg-gradient-to-br from-[rgba(255,100,100,0.1)] to-[rgba(255,50,50,0.1)] backdrop-blur-sm rounded-3xl p-6 shadow-2xl border border-[rgba(255,100,100,0.3)]">
            <p className="text-white text-lg font-[var(--font-orbitron)] leading-relaxed">
              Halt, human! This is an abduction. Please keep your arms and legs within the beam. We are collecting data to prepare for our imminent invasion of Earth. But, uh... our brainwave scanner isn&apos;t working right now. Can you fill out this form instead?
            </p>
          </div>
        </div>

        {/* View Submissions Button */}
        <div className="w-full max-w-4xl mx-auto mb-8 text-center">
          <a
            href="/submissions"
            className="inline-block bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.2)] text-white border border-[rgba(255,255,255,0.3)] rounded-2xl py-3 px-6 text-lg font-[var(--font-orbitron)] cursor-pointer transition-all duration-300"
          >
            <Image
              src="/car.png"
              alt="Car"
              width={80}
              height={80}
              className="inline-block"
            /> View Aggregate Human Data
          </a>
        </div>

        {/* Name Field */}
        <div className="w-full max-w-4xl mx-auto mb-8">
          <div className="bg-gradient-to-br from-[rgba(20,30,60,0.95)] to-[rgba(30,50,100,0.95)] backdrop-blur-sm rounded-3xl p-6 shadow-2xl border border-[rgba(255,255,255,0.1)]">
            <label htmlFor="name" className="block text-xl font-bold mb-3 text-[#1e90ff]">
              <Image
                src="/alienfrog.png"
                alt="Alien Frog"
                width={48}
                height={48}
                className="inline-block"
              /> Identify yourself, Earthling:
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter your name (optional)"
              className="w-full p-4 rounded-xl border-2 border-[rgba(255,255,255,0.2)] bg-[rgba(17,34,102,0.8)] text-white text-lg placeholder-gray-400 focus:border-[#1e90ff] focus:outline-none focus:ring-2 focus:ring-[#1e90ff] focus:ring-opacity-50 transition-all duration-300"
              disabled={isSubmitting}
            />
            {error && (
              <div className="mt-3 text-red-400 text-sm">
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="w-full max-w-4xl mx-auto mb-8">
          <div className="grid grid-cols-4 gap-4">
            {[
              { id: 'movies', label: 'Movies', type: 'movies' },
              { id: 'shows', label: 'Shows', type: 'shows' },
              { id: 'music', label: 'Songs', type: 'music' },
              { id: 'books', label: 'Books', type: 'books' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`p-6 rounded-2xl transition-all duration-300 transform hover:scale-105 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-[#1e90ff] to-[#00bfff] text-white shadow-2xl'
                    : 'bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.2)] text-white border border-[rgba(255,255,255,0.3)]'
                }`}
              >
                <div className="text-3xl mb-2">
                  <AnimatedFrog type={tab.type} />
                </div>
                <div className="font-[var(--font-orbitron)] font-bold text-lg">{tab.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="w-full max-w-4xl mx-auto">
          {/* Movies Tab */}
          {activeTab === 'movies' && (
            <div className="bg-gradient-to-br from-[rgba(20,30,60,0.95)] to-[rgba(30,50,100,0.95)] backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-[rgba(255,255,255,0.1)]">
              <h2 className="text-3xl font-bold mb-6 text-center text-[#1e90ff]">
                <AnimatedFrog type="movies" /> Top 5 Movies
              </h2>
              <form onSubmit={(e) => handleSubmit(e, 'movies')} className="space-y-6">
                {[1, 2, 3, 4, 5].map((num) => (
                  <div key={num} className="space-y-4">
                    <div>
                      <label htmlFor={`movie${num}`} className="block text-lg font-semibold mb-2 text-[#1e90ff]">
                        #{num} Movie
                      </label>
                      <input
                        type="text"
                        id={`movie${num}`}
                        name={`movie${num}`}
                        value={formData[`movie${num}` as keyof FormData] as string}
                        onChange={(e) => handleInputChange(e, 'movies')}
                        placeholder={`Enter your #${num} favorite movie`}
                        className="w-full p-4 rounded-xl border-2 border-[rgba(255,255,255,0.2)] bg-[rgba(17,34,102,0.8)] text-white text-lg placeholder-gray-400 focus:border-[#1e90ff] focus:outline-none focus:ring-2 focus:ring-[#1e90ff] focus:ring-opacity-50 transition-all duration-300"
                        disabled={isSubmitting}
                      />
                    </div>
                    <div>
                      <label className="block text-lg font-semibold mb-3 text-[#1e90ff]">
                        Genres
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {["Action/Adventure","Coming of Age","Comedy","Drama","Fantasy / Sci Fi","Horror / Thriller","Mystery","Romance","Defies the confines of genre"].map((genre) => (
                          <label key={genre} className="flex items-start space-x-2 cursor-pointer p-2 rounded-lg hover:bg-[rgba(255,255,255,0.05)] transition-colors">
                            <input
                              type="checkbox"
                              checked={formData[`genres${num}` as keyof FormData]?.includes(genre) || false}
                              onChange={(e) => {
                                const currentGenres = formData[`genres${num}` as keyof FormData] as string[] || [];
                                if (e.target.checked) {
                                  setFormData(prev => ({
                                    ...prev,
                                    [`genres${num}`]: [...currentGenres, genre]
                                  }));
                                } else {
                                  setFormData(prev => ({
                                    ...prev,
                                    [`genres${num}`]: currentGenres.filter(g => g !== genre)
                                  }));
                                }
                              }}
                              className="w-4 h-4 mt-0.5 text-[#1e90ff] bg-[rgba(17,34,102,0.8)] border-[rgba(255,255,255,0.2)] rounded focus:ring-[#1e90ff] focus:ring-2 flex-shrink-0"
                              disabled={isSubmitting}
                            />
                            <span className="text-sm text-white leading-relaxed break-words">{genre}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label htmlFor={`why${num}`} className="block text-md font-semibold mb-2 text-[#1e90ff]">Why do you like it?</label>
                      <textarea
                        id={`why${num}`}
                        name={`why${num}`}
                        value={formData[`why${num}` as keyof FormData] as string}
                        onChange={(e) => handleInputChange(e, 'movies')}
                        placeholder="Reveal your brainwave data..."
                        className="w-full p-3 rounded-xl border-2 border-[rgba(255,255,255,0.2)] bg-[rgba(17,34,102,0.8)] text-white text-md placeholder-gray-400 focus:border-[#1e90ff] focus:outline-none focus:ring-2 focus:ring-[#1e90ff] focus:ring-opacity-50 transition-all duration-300"
                        rows={3}
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                ))}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-[#1e90ff] to-[#00bfff] hover:from-[#00bfff] hover:to-[#1e90ff] text-white font-bold py-4 px-8 rounded-2xl text-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Movies'}
                </button>
              </form>
            </div>
          )}

          {/* Shows Tab */}
          {activeTab === 'shows' && (
            <div className="bg-gradient-to-br from-[rgba(20,30,60,0.95)] to-[rgba(30,50,100,0.95)] backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-[rgba(255,255,255,0.1)]">
              <h2 className="text-3xl font-bold mb-6 text-center text-[#1e90ff]">
                <AnimatedFrog type="shows" /> Top 5 Shows
              </h2>
              <form onSubmit={(e) => handleSubmit(e, 'shows')} className="space-y-6">
                {[1, 2, 3, 4, 5].map((num) => (
                  <div key={num} className="space-y-4">
                    <div>
                      <label htmlFor={`show${num}`} className="block text-lg font-semibold mb-2 text-[#1e90ff]">
                        #{num} Show
                      </label>
                      <input
                        type="text"
                        id={`show${num}`}
                        name={`show${num}`}
                        value={showFormData[`show${num}` as keyof ShowFormData] as string}
                        onChange={(e) => handleInputChange(e, 'shows')}
                        placeholder={`Enter your #${num} favorite show`}
                        className="w-full p-4 rounded-xl border-2 border-[rgba(255,255,255,0.2)] bg-[rgba(17,34,102,0.8)] text-white text-lg placeholder-gray-400 focus:border-[#1e90ff] focus:outline-none focus:ring-2 focus:ring-[#1e90ff] focus:ring-opacity-50 transition-all duration-300"
                        disabled={isSubmitting}
                      />
                    </div>
                    <div>
                      <label className="block text-lg font-semibold mb-3 text-[#1e90ff]">
                        Genres
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {["Action/Adventure","Coming of Age","Comedy","Drama","Fantasy / Sci Fi","Horror / Thriller","Mystery","Romance","Defies the confines of genre"].map((genre) => (
                          <label key={genre} className="flex items-start space-x-2 cursor-pointer p-2 rounded-lg hover:bg-[rgba(255,255,255,0.05)] transition-colors">
                            <input
                              type="checkbox"
                              checked={showFormData[`genres${num}` as keyof ShowFormData]?.includes(genre) || false}
                              onChange={(e) => {
                                const currentGenres = showFormData[`genres${num}` as keyof ShowFormData] as string[] || [];
                                if (e.target.checked) {
                                  setShowFormData(prev => ({
                                    ...prev,
                                    [`genres${num}`]: [...currentGenres, genre]
                                  }));
                                } else {
                                  setShowFormData(prev => ({
                                    ...prev,
                                    [`genres${num}`]: currentGenres.filter(g => g !== genre)
                                  }));
                                }
                              }}
                              className="w-4 h-4 mt-0.5 text-[#1e90ff] bg-[rgba(17,34,102,0.8)] border-[rgba(255,255,255,0.2)] rounded focus:ring-[#1e90ff] focus:ring-2 flex-shrink-0"
                              disabled={isSubmitting}
                            />
                            <span className="text-sm text-white leading-relaxed break-words">{genre}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label htmlFor={`why${num}`} className="block text-md font-semibold mb-2 text-[#1e90ff]">Why do you like it?</label>
                      <textarea
                        id={`why${num}`}
                        name={`why${num}`}
                        value={showFormData[`why${num}` as keyof ShowFormData] as string}
                        onChange={(e) => handleInputChange(e, 'shows')}
                        placeholder="Reveal your brainwave data..."
                        className="w-full p-3 rounded-xl border-2 border-[rgba(255,255,255,0.2)] bg-[rgba(17,34,102,0.8)] text-white text-md placeholder-gray-400 focus:border-[#1e90ff] focus:outline-none focus:ring-2 focus:ring-[#1e90ff] focus:ring-opacity-50 transition-all duration-300"
                        rows={3}
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                ))}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-[#1e90ff] to-[#00bfff] hover:from-[#00bfff] hover:to-[#1e90ff] text-white font-bold py-4 px-8 rounded-2xl text-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Shows'}
                </button>
              </form>
            </div>
          )}

          {/* Music Tab */}
          {activeTab === 'music' && (
            <div className="bg-gradient-to-br from-[rgba(20,30,60,0.95)] to-[rgba(30,50,100,0.95)] backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-[rgba(255,255,255,0.1)]">
              <h2 className="text-3xl font-bold mb-6 text-center text-[#1e90ff]">
                <AnimatedFrog type="music" /> Top 5 Songs
              </h2>
              <form onSubmit={(e) => handleSubmit(e, 'music')} className="space-y-6">
                {[1, 2, 3, 4, 5].map((num) => (
                  <div key={num} className="space-y-4">
                    <div>
                      <label htmlFor={`music${num}`} className="block text-lg font-semibold mb-2 text-[#1e90ff]">
                        #{num} Song
                      </label>
                      <input
                        type="text"
                        id={`music${num}`}
                        name={`music${num}`}
                        value={musicFormData[`music${num}` as keyof MusicFormData] as string}
                        onChange={(e) => handleInputChange(e, 'music')}
                        placeholder={`Enter your #${num} favorite song`}
                        className="w-full p-4 rounded-xl border-2 border-[rgba(255,255,255,0.2)] bg-[rgba(17,34,102,0.8)] text-white text-lg placeholder-gray-400 focus:border-[#1e90ff] focus:outline-none focus:ring-2 focus:ring-[#1e90ff] focus:ring-opacity-50 transition-all duration-300"
                        disabled={isSubmitting}
                      />
                    </div>
                    <div>
                      <label htmlFor={`artist${num}`} className="block text-lg font-semibold mb-2 text-[#1e90ff]">
                        Artist
                      </label>
                      <input
                        type="text"
                        id={`artist${num}`}
                        name={`artist${num}`}
                        value={musicFormData[`artist${num}` as keyof MusicFormData] as string}
                        onChange={(e) => handleInputChange(e, 'music')}
                        placeholder={`Enter the artist for your #${num} song`}
                        className="w-full p-4 rounded-xl border-2 border-[rgba(255,255,255,0.2)] bg-[rgba(17,34,102,0.8)] text-white text-lg placeholder-gray-400 focus:border-[#1e90ff] focus:outline-none focus:ring-2 focus:ring-[#1e90ff] focus:ring-opacity-50 transition-all duration-300"
                        disabled={isSubmitting}
                      />
                    </div>
                    <div>
                      <label htmlFor={`why${num}`} className="block text-md font-semibold mb-2 text-[#1e90ff]">Why do you like it?</label>
                      <textarea
                        id={`why${num}`}
                        name={`why${num}`}
                        value={musicFormData[`why${num}` as keyof MusicFormData] as string}
                        onChange={(e) => handleInputChange(e, 'music')}
                        placeholder="Reveal your brainwave data..."
                        className="w-full p-3 rounded-xl border-2 border-[rgba(255,255,255,0.2)] bg-[rgba(17,34,102,0.8)] text-white text-md placeholder-gray-400 focus:border-[#1e90ff] focus:outline-none focus:ring-2 focus:ring-[#1e90ff] focus:ring-opacity-50 transition-all duration-300"
                        rows={3}
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                ))}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-[#1e90ff] to-[#00bfff] hover:from-[#00bfff] hover:to-[#1e90ff] text-white font-bold py-4 px-8 rounded-2xl text-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Songs'}
                </button>
              </form>
            </div>
          )}

          {/* Books Tab */}
          {activeTab === 'books' && (
            <div className="bg-gradient-to-br from-[rgba(20,30,60,0.95)] to-[rgba(30,50,100,0.95)] backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-[rgba(255,255,255,0.1)]">
              <h2 className="text-3xl font-bold mb-6 text-center text-[#1e90ff]">
                <AnimatedFrog type="books" /> Top 5 Books
              </h2>
              <form onSubmit={(e) => handleSubmit(e, 'books')} className="space-y-6">
                {[1, 2, 3, 4, 5].map((num) => (
                  <div key={num} className="space-y-4">
                    <div>
                      <label htmlFor={`book${num}`} className="block text-lg font-semibold mb-2 text-[#1e90ff]">
                        #{num} Book
                      </label>
                      <input
                        type="text"
                        id={`book${num}`}
                        name={`book${num}`}
                        value={bookFormData[`book${num}` as keyof BookFormData] as string}
                        onChange={(e) => handleInputChange(e, 'books')}
                        placeholder={`Enter your #${num} favorite book`}
                        className="w-full p-4 rounded-xl border-2 border-[rgba(255,255,255,0.2)] bg-[rgba(17,34,102,0.8)] text-white text-lg placeholder-gray-400 focus:border-[#1e90ff] focus:outline-none focus:ring-2 focus:ring-[#1e90ff] focus:ring-opacity-50 transition-all duration-300"
                        disabled={isSubmitting}
                      />
                    </div>
                    <div>
                      <label htmlFor={`author${num}`} className="block text-lg font-semibold mb-2 text-[#1e90ff]">
                        Author
                      </label>
                      <input
                        type="text"
                        id={`author${num}`}
                        name={`author${num}`}
                        value={bookFormData[`author${num}` as keyof BookFormData] as string}
                        onChange={(e) => handleInputChange(e, 'books')}
                        placeholder={`Enter the author for your #${num} book`}
                        className="w-full p-4 rounded-xl border-2 border-[rgba(255,255,255,0.2)] bg-[rgba(17,34,102,0.8)] text-white text-lg placeholder-gray-400 focus:border-[#1e90ff] focus:outline-none focus:ring-2 focus:ring-[#1e90ff] focus:ring-opacity-50 transition-all duration-300"
                        disabled={isSubmitting}
                      />
                    </div>
                    <div>
                      <label htmlFor={`why${num}`} className="block text-md font-semibold mb-2 text-[#1e90ff]">Why do you like it?</label>
                      <textarea
                        id={`why${num}`}
                        name={`why${num}`}
                        value={bookFormData[`why${num}` as keyof BookFormData] as string}
                        onChange={(e) => handleInputChange(e, 'books')}
                        placeholder="Reveal your brainwave data..."
                        className="w-full p-3 rounded-xl border-2 border-[rgba(255,255,255,0.2)] bg-[rgba(17,34,102,0.8)] text-white text-md placeholder-gray-400 focus:border-[#1e90ff] focus:outline-none focus:ring-2 focus:ring-[#1e90ff] focus:ring-opacity-50 transition-all duration-300"
                        rows={3}
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                ))}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-[#1e90ff] to-[#00bfff] hover:from-[#00bfff] hover:to-[#1e90ff] text-white font-bold py-4 px-8 rounded-2xl text-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Books'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}