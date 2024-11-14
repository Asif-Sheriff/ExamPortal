'use client';

import React, { useState, useEffect } from 'react';
import { io } from "socket.io-client";
import axios from 'axios';
import SSS from 'shamirs-secret-sharing';
import CryptoJS from 'crypto-js';

type Option = { [key: string]: string };

type Question = {
  question: string;
  options: Option;
  selectedOption?: string;
};

type QuestionPaper = {
  questions: Question[];
};

const socket = io("http://localhost:4000");

const StudentPage: React.FC = () => {
  const [keyParts, setKeyParts] = useState<string[]>([]);
  const [questionPaper, setQuestionPaper] = useState<QuestionPaper | null>(null);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    // Listen for Shamir keys from the server
    socket.on("receive-key", ({ keyPart }: { keyPart: string }) => {
      setKeyParts((prevKeys) => [...prevKeys, keyPart]);
      setMessage(`Received a Shamir key part.`);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    // reconstruct key if threshold parts r received
    if (keyParts.length >= 2) {
      reconstructSecretKey();
    }
  }, [keyParts]);

  const reconstructSecretKey = async () => {
    try {
      
      // Combine the key parts
      const buffers = keyParts.map((key) => Buffer.from(key, 'hex'));
      const secretBuffer = SSS.combine(buffers); // Combine the key parts
      const secretKey = secretBuffer.toString('utf8');
      

      setMessage('Successfully reconstructed the secret key.');
      fetchAndDecryptQuestionPaper(secretKey);
    } catch (error) {
      console.error('Error reconstructing the key:', error);
      setMessage('Error reconstructing the secret key.');
    }
  };

  const fetchAndDecryptQuestionPaper = async (secretKey: string) => {
    try {
      // Fetch the encrypted question paper from the backend
      const response = await axios.get('/api/questions');
      const encryptedQuestions = response.data.questions[0].questions;
  
      // Decrypt each question and its options
      const decryptedQuestions = encryptedQuestions.map((item: any) => {
        const decryptedQuestion = CryptoJS.AES.decrypt(item.question, secretKey).toString(CryptoJS.enc.Utf8);
        const decryptedOptions = {
          A: CryptoJS.AES.decrypt(item.options.A, secretKey).toString(CryptoJS.enc.Utf8),
          B: CryptoJS.AES.decrypt(item.options.B, secretKey).toString(CryptoJS.enc.Utf8),
          C: CryptoJS.AES.decrypt(item.options.C, secretKey).toString(CryptoJS.enc.Utf8),
          D: CryptoJS.AES.decrypt(item.options.D, secretKey).toString(CryptoJS.enc.Utf8),
        };
  
        return {
          question: decryptedQuestion,
          options: decryptedOptions,
        };
      });
  
      setQuestionPaper({ questions: decryptedQuestions });
      setMessage('Question paper successfully decrypted!');
    } catch (error) {
      console.error('Error fetching or decrypting the question paper:', error);
      setMessage('Error fetching or decrypting the question paper.');
    }
  };
  

  const handleSubmit = async () => {
    try {
      if (!questionPaper) {
        setMessage('No question paper to submit.');
        return;
      }

      // Submit the student's answers
      const response = await axios.post('/api/submit', { answers: questionPaper.questions });
      setMessage('Test submitted successfully!');
    } catch (error) {
      console.error('Error submitting the test:', error);
      setMessage('Error submitting the test.');
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Student Portal</h1>

      {message && <p className="text-sm text-green-600">{message}</p>}

      {questionPaper ? (
        <div>
          <h2 className="text-lg font-semibold mb-4">Question Paper</h2>
          <ul className="list-disc ml-6">
            {questionPaper.questions.map((q, index) => (
              <li key={index} className="mb-4">
                <div>
                  <strong>Q{index + 1}:</strong> {q.question}
                </div>
                <div className="ml-4">
                  {Object.entries(q.options).map(([key, value]) => (
                    <label key={key} className="block">
                      <input
                        type="radio"
                        name={`question-${index}`}
                        value={key}
                        checked={q.selectedOption === key}
                        onChange={() => {
                          const updatedQuestions = [...questionPaper.questions];
                          updatedQuestions[index].selectedOption = key;
                          setQuestionPaper({ ...questionPaper, questions: updatedQuestions });
                        }}
                      />{' '}
                      {value}
                    </label>
                  ))}
                </div>
              </li>
            ))}
          </ul>
          <button
            onClick={handleSubmit}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Submit Test
          </button>
        </div>
      ) : (
        <p>Waiting for the question paper...</p>
      )}
    </div>
  );
};

export default StudentPage;
