// page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import TrusteeDropdown from '@/src/components/TrusteeDropdown'; // Adjust the import path as necessary

type Question = {
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
};

type Trustee = {
    _id: string;
    username: string;
    email: string;
    type: string;
  };

const CenterPage = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question>({
    question: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
  });
  const [secretKey, setSecretKey] = useState('');
  const [trustees, setTrustees] = useState<Trustee[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrustees, setSelectedTrustees] = useState<string[]>([]);

  // Fetch trustees once on mount
  useEffect(() => {
    let isMounted = true;

    const fetchTrustees = async () => {
      try {
        const response = await axios.get('/api/trustees');
        if (isMounted) {
          setTrustees(response.data.data || []);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching trustees:', error);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchTrustees();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleAddQuestion = () => {
    if (
      !currentQuestion.question ||
      !currentQuestion.optionA ||
      !currentQuestion.optionB ||
      !currentQuestion.optionC ||
      !currentQuestion.optionD
    ) {
      alert('All fields are required to add a question.');
      return;
    }

    setQuestions((prevQuestions) => [...prevQuestions, currentQuestion]);
    setCurrentQuestion({
      question: '',
      optionA: '',
      optionB: '',
      optionC: '',
      optionD: '',
    });
  };

  const handleUploadQuestions = async () => {
    if (!secretKey.trim()) {
      alert('Please provide a secret key.');
      return;
    }

    if (selectedTrustees.length === 0) {
      alert('Please select at least one trustee.');
      return;
    }

    const encryptedQuestions = questions.map((q) => ({
      question: CryptoJS.AES.encrypt(q.question, secretKey).toString(),
      options: {
        A: CryptoJS.AES.encrypt(q.optionA, secretKey).toString(),
        B: CryptoJS.AES.encrypt(q.optionB, secretKey).toString(),
        C: CryptoJS.AES.encrypt(q.optionC, secretKey).toString(),
        D: CryptoJS.AES.encrypt(q.optionD, secretKey).toString(),
      },
    }));

    try {
      await axios.post('/api/questions', {
        questions: encryptedQuestions,
        trustees: selectedTrustees,
      });
      alert('Questions uploaded successfully!');
      setQuestions([]);
      setSecretKey('');
      setSelectedTrustees([]);
    } catch (error) {
      console.error('Error uploading questions:', error);
      alert('Failed to upload questions. Please try again.');
    }
  };

  const handleTrusteeChange = (updatedSelectedTrustees: string[]) => {
    setSelectedTrustees(updatedSelectedTrustees);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Exam Center</h1>

      {/* Add Question Section */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold">Add Question</h2>
        <div className="grid grid-cols-1 gap-4 mt-4">
          <input
            type="text"
            placeholder="Enter Question"
            value={currentQuestion.question}
            onChange={(e) =>
              setCurrentQuestion({ ...currentQuestion, question: e.target.value })
            }
            className="p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            placeholder="Option A"
            value={currentQuestion.optionA}
            onChange={(e) =>
              setCurrentQuestion({ ...currentQuestion, optionA: e.target.value })
            }
            className="p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            placeholder="Option B"
            value={currentQuestion.optionB}
            onChange={(e) =>
              setCurrentQuestion({ ...currentQuestion, optionB: e.target.value })
            }
            className="p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            placeholder="Option C"
            value={currentQuestion.optionC}
            onChange={(e) =>
              setCurrentQuestion({ ...currentQuestion, optionC: e.target.value })
            }
            className="p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            placeholder="Option D"
            value={currentQuestion.optionD}
            onChange={(e) =>
              setCurrentQuestion({ ...currentQuestion, optionD: e.target.value })
            }
            className="p-2 border border-gray-300 rounded"
          />
        </div>
        <button
          onClick={handleAddQuestion}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Add Question
        </button>
      </div>

      {/* Question List */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold">Questions Added</h2>
        {questions.length === 0 ? (
          <p>No questions added yet.</p>
        ) : (
          <ul className="list-disc list-inside">
            {questions.map((q, index) => (
              <li key={`question-${index}`}>{q.question}</li>
            ))}
          </ul>
        )}
      </div>

      {/* Secret Key and Trustees */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold">Encryption Details</h2>
        <input
          type="password"
          placeholder="Enter Secret Key"
          value={secretKey}
          onChange={(e) => setSecretKey(e.target.value)}
          className="p-2 border border-gray-300 rounded w-full"
        />

        {loading ? (
          <p>Loading trustees...</p>
        ) : (
          <TrusteeDropdown
            trustees={trustees}
            selectedTrustees={selectedTrustees}
            onTrusteeChange={handleTrusteeChange}
          />
        )}
      </div>

      {/* Upload Questions */}
      <button
        onClick={handleUploadQuestions}
        className="px-4 py-2 bg-green-500 text-white rounded"
      >
        Upload Questions
      </button>
    </div>
  );
};

export default CenterPage;
