'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

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

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const response = await fetch('/api/submissions');
      const result = await response.json();

      if (result.success) {
        setSubmissions(result.submissions);
      } else {
        setError(result.error || 'Failed to load submissions');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to load submissions');
    } finally {
      setLoading(false);
    }
  };

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
            <div className="text-6xl mb-6">❌</div>
            <h1 className="font-[var(--font-orbitron)] text-3xl font-bold mb-4 text-red-400">
              Submissions
            </h1>
            <p className="text-gray-300 mb-6">{error}</p>
            <div className="space-y-4">
              <button
                onClick={fetchSubmissions}
                className="bg-gradient-to-r from-[#1e90ff] to-[#00bfff] hover:from-[#00bfff] hover:to-[#1e90ff] text-white border-none rounded-2xl py-3 px-6 text-lg font-[var(--font-orbitron)] font-bold cursor-pointer transition-all duration-300"
              >
                🔄 Try Again
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
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30px_30px,rgba(255,255,255,0.1)_2px,transparent_0)] bg-[length:60px_60px]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-[var(--font-orbitron)] text-6xl font-bold tracking-wider mb-4 bg-gradient-to-r from-[#1e90ff] to-[#00bfff] bg-clip-text text-transparent">
            🎬 All Movie Favorites
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            Discover what everyone loves to watch! ({submissions.length} submissions)
          </p>
          <Link href="/">
            <button className="bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.2)] text-white border border-[rgba(255,255,255,0.3)] rounded-2xl py-3 px-6 text-lg font-[var(--font-orbitron)] cursor-pointer transition-all duration-300">
              ✨ Submit Your Favorites
            </button>
          </Link>
        </div>

        {/* Submissions Grid */}
        {submissions.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {submissions.map((submission) => (
              <div key={submission.id} className="bg-gradient-to-br from-[rgba(20,30,60,0.95)] to-[rgba(30,50,100,0.95)] backdrop-blur-sm rounded-3xl p-6 shadow-2xl border border-[rgba(255,255,255,0.1)] hover:border-[rgba(30,144,255,0.3)] transition-all duration-300 transform hover:scale-105">
                {/* User Header */}
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#1e90ff] to-[#00bfff] rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                    👤
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-[#1e90ff]">{submission.name}</h3>
                    <p className="text-sm text-gray-400">
                      {new Date(submission.submitted_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
                
                {/* Movies List */}
                <div className="space-y-3">
                  <h4 className="text-lg font-semibold text-gray-300 mb-4">🎭 Top 5 Movies:</h4>
                  {[submission.movie1, submission.movie2, submission.movie3, submission.movie4, submission.movie5].map((movie, index) => (
                    movie && (
                      <div key={index} className="flex items-center p-3 bg-[rgba(255,255,255,0.05)] rounded-xl">
                        <span className="w-8 h-8 bg-gradient-to-r from-[#1e90ff] to-[#00bfff] rounded-full flex items-center justify-center text-white text-sm font-bold mr-4">
                          {index + 1}
                        </span>
                        <span className="text-gray-200 font-medium">{movie}</span>
                      </div>
                    )
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="bg-gradient-to-br from-[rgba(20,30,60,0.95)] to-[rgba(30,50,100,0.95)] backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-[rgba(255,255,255,0.1)] max-w-2xl mx-auto">
              <div className="text-8xl mb-6">🎭</div>
              <h2 className="text-3xl font-bold text-gray-300 mb-4">No submissions yet</h2>
              <p className="text-gray-400 mb-8 text-lg">Be the first to share your favorite movies and inspire others!</p>
              <Link href="/">
                <button className="bg-gradient-to-r from-[#1e90ff] to-[#00bfff] hover:from-[#00bfff] hover:to-[#1e90ff] text-white border-none rounded-2xl py-4 px-8 text-xl font-[var(--font-orbitron)] font-bold cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-lg">
                  🚀 Be the First!
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 