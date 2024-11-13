'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import TrusteeDropdown from '@/src/components/TrusteeDropdown';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import SSS from 'shamirs-secret-sharing';

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
  const session = useSession();

  if (!session?.data?.user) {
    redirect('/signin/student');
  }

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
  const [trusteeShares, setTrusteeShares] = useState<{ name: string; share: string }[]>([]);

  useEffect(() => {
    const fetchTrustees = async () => {
      try {
        const response = await axios.get('/api/trustees');
        setTrustees(response.data.data || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching trustees:', error);
        setLoading(false);
      }
    };

    fetchTrustees();
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
      const secretBuffer = Buffer.from(secretKey, 'utf8');
    
      // Set shares to 3 and threshold to 2 for a 2/3 split
      const shares = SSS.split(secretBuffer, { shares: 3, threshold: 2 });
    
      // Map the first 3 shares to the selected trustees
      const trusteeShares = selectedTrustees.slice(0, 3).map((trusteeId, index) => {
        const trustee = trustees.find((t) => t._id === trusteeId);
        return {
          name: trustee?.username || trustee?.email || 'Unknown Trustee',
          share: shares[index].toString('hex'),
        };
      });
    
      setTrusteeShares(trusteeShares);
    
      // Optional: Upload the questions and shares to the server
      await axios.post('/api/questions', {
        questions: encryptedQuestions,
        trustees: trusteeShares.map((t) => ({ id: t.share, name: t.name })),
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
              <li key={`question-${index}`} className="mb-4">
                <div>
                  <strong>Question {index + 1}:</strong> {q.question}
                </div>
                <ul className="ml-6 mt-2">
                  <li>
                    <strong>Option A:</strong> {q.optionA}
                  </li>
                  <li>
                    <strong>Option B:</strong> {q.optionB}
                  </li>
                  <li>
                    <strong>Option C:</strong> {q.optionC}
                  </li>
                  <li>
                    <strong>Option D:</strong> {q.optionD}
                  </li>
                </ul>
              </li>
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

      {/* Trustee Shares Table */}
      {trusteeShares.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-4">Trustee Shares</h2>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2">Trustee Name</th>
                <th className="border border-gray-300 p-2">Share</th>
              </tr>
            </thead>
            <tbody>
              {trusteeShares.map((share, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 p-2">{share.name}</td>
                  <td className="border border-gray-300 p-2">{share.share}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CenterPage;
