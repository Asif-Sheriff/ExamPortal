import React, { useState } from 'react';
import './App.css'; // Add your custom CSS here
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationArrow, faMicrophone } from '@fortawesome/free-solid-svg-icons';

function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!input) return;

    const date = new Date();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const strTime = `${hour}:${minute < 10 ? '0' : ''}${minute}`;

    // User's message
    const userMessage = {
      text: input,
      time: strTime,
      sender: 'user',
    };

    setMessages([...messages, userMessage]);

    setInput('');

    // Sending the user's message to the server
    try {
      const response = await fetch('/get', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ msg: input }),
      });

      const data = await response.text();

      // Bot's response
      const botMessage = {
        text: data,
        time: strTime,
        sender: 'bot',
      };

      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const startDictation = () => {
    if (window.hasOwnProperty('webkitSpeechRecognition')) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      recognition.start();

      recognition.onresult = function (e) {
        setInput(e.results[0][0].transcript);
        recognition.stop();
      };

      recognition.onerror = function () {
        recognition.stop();
      };
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-gray-100">
      <div className="w-full max-w-xl">
        <div className="bg-white shadow-lg rounded-lg">
          <div className="bg-gray-800 text-white p-4 rounded-t-lg flex items-center">
            {/* <img src="https://i.ibb.co/fSNP7Rz/icons8-chatgpt-512.png" alt="ChatBot" className="w-10 h-10 rounded-full mr-3" /> */}
            <div>
              <h2 className="text-lg font-semibold">ChatBot</h2>
              <p className="text-sm">Ask me anything!</p>
            </div>
          </div>
          <div id="messageFormeight" className="p-4 overflow-y-auto h-96 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {/* {message.sender === 'bot' && (
                  // <img
                  //   src="https://i.ibb.co/fSNP7Rz/icons8-chatgpt-512.png"
                  //   alt="Bot"
                  //   className="w-8 h-8 rounded-full mr-3"
                  // />
                )} */}
                <div
                  className={`max-w-xs p-3 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  <p>{message.text}</p>
                  {/* <span className="block text-xs mt-2 text-right">
                    {message.time}
                  </span> */}
                </div>
                {/* {message.sender === 'user' && (
                  // <img
                  //   src="https://i.ibb.co/d5b84Xw/Untitled-design.png"
                  //   alt="User"
                  //   className="w-8 h-8 rounded-full ml-3"
                  // />
                )} */}
              </div>
            ))}
          </div>
          <div className="bg-gray-100 p-4 rounded-b-lg">
            <form id="messageArea" className="flex" onSubmit={handleSubmit}>
              <input
                type="text"
                id="text"
                name="msg"
                placeholder="Type your message..."
                autoComplete="off"
                className="w-full p-3 rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                required
              />
              <button
                type="button"
                id="dictate"
                className="bg-blue-500 text-white p-3 rounded-r-none hover:bg-blue-600"
                onClick={startDictation}
              >
                <FontAwesomeIcon icon={faMicrophone} />
              </button>
              <button
                type="submit"
                id="send"
                className="bg-blue-500 text-white p-3 rounded-r-lg hover:bg-blue-600"
              >
                <FontAwesomeIcon icon={faLocationArrow} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatBot;
