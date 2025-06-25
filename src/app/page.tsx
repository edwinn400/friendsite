'use client';

import React, { useState } from 'react';

interface FormData {
  name: string;
  movie1: string;
  movie2: string;
  movie3: string;
  movie4: string;
  movie5: string;
}

interface Submission {
  id: string;
  name: string;
  movie1: string;
  movie2: string;
  movie3: string;
  movie4: string;
  movie5: string;
  submitted_at: string;
}

export default function Home() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    movie1: '',
    movie2: '',
    movie3: '',
    movie4: '',
    movie5: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showSubmissions, setShowSubmissions] = useState(false);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        alert('✅ Your submission was saved successfully!');
        // Reset form
        setFormData({
          name: '',
          movie1: '',
          movie2: '',
          movie3: '',
          movie4: '',
          movie5: '',
        });
      } else {
        alert(`❌ Error: ${result.error || 'Failed to submit form'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Network error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewSubmissions = async () => {
    try {
      const response = await fetch('/api/submissions');
      const result = await response.json();

      if (result.success) {
        setSubmissions(result.submissions);
        setShowSubmissions(true);
      } else {
        setError(result.error || 'Failed to load submissions');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to load submissions');
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetForm = () => {
    setShowSuccess(false);
    setShowSubmissions(false);
    setError(null);
  };

  // Success View
  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a174e] via-[#1a2a6b] to-[#0f3460] text-white flex items-center justify-center">
        <div className="text-center max-w-2xl mx-auto px-4">
          <div className="bg-gradient-to-br from-[rgba(20,30,60,0.95)] to-[rgba(30,50,100,0.95)] backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-[rgba(255,255,255,0.1)]">
            <div className="text-6xl mb-6">🎉</div>
            <h1 className="font-[var(--font-orbitron)] text-4xl font-bold mb-4 bg-gradient-to-r from-[#1e90ff] to-[#00bfff] bg-clip-text text-transparent">
              Thank You!
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Your movie favorites have been saved successfully! 🎬
            </p>
            <div className="space-y-4">
              <button
                onClick={handleViewSubmissions}
                className="bg-gradient-to-r from-[#1e90ff] to-[#00bfff] hover:from-[#00bfff] hover:to-[#1e90ff] text-white border-none rounded-2xl py-4 px-8 text-lg font-[var(--font-orbitron)] font-bold cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-lg w-full"
              >
                👥 See Everyone's Favorites
              </button>
              <button
                onClick={resetForm}
                className="bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.2)] text-white border border-[rgba(255,255,255,0.3)] rounded-2xl py-4 px-8 text-lg font-[var(--font-orbitron)] cursor-pointer transition-all duration-300 w-full"
              >
                ✨ Submit Another Response
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Submissions View
  if (showSubmissions) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a174e] via-[#1a2a6b] to-[#0f3460] text-white py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="font-[var(--font-orbitron)] text-5xl font-bold tracking-wider mb-4 bg-gradient-to-r from-[#1e90ff] to-[#00bfff] bg-clip-text text-transparent">
              🎬 All Movie Favorites
            </h1>
            <p className="text-xl text-gray-300 mb-6">
              Discover what everyone loves to watch! ({submissions.length} submissions)
            </p>
            <button
              onClick={resetForm}
              className="bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.2)] text-white border border-[rgba(255,255,255,0.3)] rounded-2xl py-3 px-6 text-lg font-[var(--font-orbitron)] cursor-pointer transition-all duration-300"
            >
              ← Back to Form
            </button>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {submissions.map((submission) => (
              <div key={submission.id} className="bg-gradient-to-br from-[rgba(20,30,60,0.95)] to-[rgba(30,50,100,0.95)] backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-[rgba(255,255,255,0.1)] hover:border-[rgba(30,144,255,0.3)] transition-all duration-300">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-[#1e90ff] to-[#00bfff] rounded-full flex items-center justify-center text-white font-bold mr-3">
                    👤
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#1e90ff]">{submission.name}</h3>
                    <p className="text-sm text-gray-400">
                      {new Date(submission.submitted_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {[submission.movie1, submission.movie2, submission.movie3, submission.movie4, submission.movie5].map((movie, index) => (
                    movie && (
                      <div key={index} className="flex items-center">
                        <span className="w-6 h-6 bg-[rgba(30,144,255,0.2)] rounded-full flex items-center justify-center text-[#1e90ff] text-xs font-bold mr-3">
                          {index + 1}
                        </span>
                        <span className="text-gray-300">{movie}</span>
                      </div>
                    )
                  ))}
                </div>
              </div>
            ))}
          </div>

          {submissions.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎭</div>
              <h2 className="text-2xl font-bold text-gray-300 mb-2">No submissions yet</h2>
              <p className="text-gray-400">Be the first to share your favorite movies!</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Main Form View
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a174e] via-[#1a2a6b] to-[#0f3460] text-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30px_30px,rgba(255,255,255,0.1)_2px,transparent_0)] bg-[length:60px_60px]"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-start py-8 px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-[var(--font-orbitron)] text-6xl font-bold tracking-wider mb-4 bg-gradient-to-r from-[#1e90ff] to-[#00bfff] bg-clip-text text-transparent">
            FRIENDSITE
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed mb-6">
            Share your top 5 favorite movies and discover what your friends love to watch. 
            Let&apos;s build the ultimate movie recommendation community! 🎬
          </p>
          <a 
            href="/submissions" 
            className="inline-block bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.2)] text-white border border-[rgba(255,255,255,0.3)] rounded-2xl py-3 px-6 text-lg font-[var(--font-orbitron)] cursor-pointer transition-all duration-300"
          >
            👥 View All Submissions
          </a>
        </div>
        
        {/* Error Message */}
        {error && (
          <div className="w-full max-w-4xl mx-auto mb-6">
            <div className="bg-red-500/20 border border-red-500/50 rounded-2xl p-4 text-red-200">
              <p className="text-center">❌ {error}</p>
            </div>
          </div>
        )}

        {/* Form Container */}
        <div className="w-full max-w-4xl mx-auto">
          <form 
            onSubmit={handleSubmit}
            className="bg-gradient-to-br from-[rgba(20,30,60,0.95)] to-[rgba(30,50,100,0.95)] backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-[rgba(255,255,255,0.1)]"
          >
            {/* Name Section */}
            <div className="mb-8">
              <label htmlFor="name" className="block text-xl font-bold mb-3 text-[#1e90ff]">
                👤 Your Name
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter your name"
                className="w-full p-4 rounded-xl border-2 border-[rgba(255,255,255,0.2)] bg-[rgba(17,34,102,0.8)] text-white text-lg placeholder-gray-400 focus:border-[#1e90ff] focus:outline-none focus:ring-2 focus:ring-[#1e90ff] focus:ring-opacity-50 transition-all duration-300"
                required
                disabled={isSubmitting}
              />
            </div>
            
            {/* Movies Sections */}
            <div className="space-y-8">
              {[1, 2, 3, 4, 5].map((num) => (
                <div key={num} className="bg-gradient-to-r from-[rgba(255,255,255,0.05)] to-[rgba(255,255,255,0.02)] rounded-2xl p-6 border border-[rgba(255,255,255,0.1)] hover:border-[rgba(30,144,255,0.3)] transition-all duration-300">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-[#1e90ff] to-[#00bfff] rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                      {num}
                    </div>
                    <label htmlFor={`movie${num}`} className="text-xl font-bold text-[#1e90ff]">
                      Movie {num}
                    </label>
                  </div>
                  
                  <input
                    type="text"
                    id={`movie${num}`}
                    value={formData[`movie${num}` as keyof FormData]}
                    onChange={(e) => handleInputChange(`movie${num}` as keyof FormData, e.target.value)}
                    placeholder={`Enter your ${num}${num === 1 ? 'st' : num === 2 ? 'nd' : num === 3 ? 'rd' : 'th'} favorite movie`}
                    className="w-full p-4 rounded-xl border-2 border-[rgba(255,255,255,0.2)] bg-[rgba(17,34,102,0.8)] text-white text-lg placeholder-gray-400 focus:border-[#1e90ff] focus:outline-none focus:ring-2 focus:ring-[#1e90ff] focus:ring-opacity-50 transition-all duration-300 mb-4"
                    disabled={isSubmitting}
                  />
                  
                  <div className="mb-4">
                    <span className="block text-lg font-semibold mb-3 text-gray-300">
                      🎭 Genre? (Check all that apply):
                    </span>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {[
                        'Action/Adventure',
                        'Comedy',
                        'Coming of Age',
                        'Romance',
                        'Fantasy/Sci Fi',
                        'Historic/Period',
                        'Horror/Thriller',
                        'Mystery',
                        'Defies the confines of genre'
                      ].map((genre) => (
                        <label key={genre} className="flex items-center p-2 rounded-lg bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(30,144,255,0.1)] transition-colors duration-200 cursor-pointer">
                          <input
                            type="checkbox"
                            name={`movie${num}_genre`}
                            value={genre}
                            className="mr-3 w-4 h-4 text-[#1e90ff] bg-[rgba(17,34,102,0.8)] border-[rgba(255,255,255,0.3)] rounded focus:ring-[#1e90ff] focus:ring-2"
                            disabled={isSubmitting}
                          />
                          <span className="text-sm">{genre}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label htmlFor={`movie${num}_why`} className="block text-lg font-semibold mb-3 text-gray-300">
                      💭 Why do you love it?
                    </label>
                    <textarea
                      id={`movie${num}_why`}
                      name={`movie${num}_why`}
                      rows={3}
                      placeholder="Tell us what makes this movie special to you..."
                      className="w-full p-4 rounded-xl border-2 border-[rgba(255,255,255,0.2)] bg-[rgba(17,34,102,0.8)] text-white text-lg placeholder-gray-400 focus:border-[#1e90ff] focus:outline-none focus:ring-2 focus:ring-[#1e90ff] focus:ring-opacity-50 transition-all duration-300 resize-y"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              ))}
            </div>
            
            {/* Submit Button */}
            <div className="mt-10 text-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`bg-gradient-to-r from-[#1e90ff] to-[#00bfff] hover:from-[#00bfff] hover:to-[#1e90ff] text-white border-none rounded-2xl py-4 px-12 text-xl font-[var(--font-orbitron)] font-bold cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-lg ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? '🚀 Submitting...' : '🚀 Submit My Favorites'}
              </button>
              <p className="text-gray-400 mt-4 text-sm">
                Your submissions will be saved securely and shared with the community
              </p>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-400">
          <p className="text-sm">
            Made with ❤️ for movie lovers everywhere
          </p>
        </div>
      </div>
    </div>
  );
}
