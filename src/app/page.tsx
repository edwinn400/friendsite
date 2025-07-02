'use client';

import React, { useState } from 'react';



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
  const [activeTab, setActiveTab] = useState('new-entry');
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

  const tabs = [
    { id: 'new-entry', label: 'New Entry' },
    { id: 'all-entries', label: 'All Entries' },
    { id: 'all-favorites', label: 'All Favorites' },
    { id: 'world-map', label: 'World Map' },
    { id: 'year', label: 'Year' },
    { id: 'genre', label: 'Genre' }
  ];

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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Reader's Companion
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            A comprehensive tool for tracking and analyzing your reading journey
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex flex-wrap justify-center gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="text-center text-gray-500">
            <h2 className="text-2xl font-semibold mb-4">
              {tabs.find(tab => tab.id === activeTab)?.label}
            </h2>
            <p className="text-gray-400">
              Content for this section will be implemented in the next phase.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}