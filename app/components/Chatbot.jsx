"use client";
import { useState, useEffect } from "react";
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
import { Timestamp } from "firebase/firestore";
import ReactMarkdown from "react-markdown";

export default function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [chat, setChat] = useState(null);
  const [theme, setTheme] = useState("Light");
  const [error, setError] = useState(null);

  const API_KEY = "AIzaSyBkWtzTQbLcLf-ONFYjyiOz8DmrJ298F4M";
  const MODEL_NAME = "gemini-1.5-flash";

  const genAi = new GoogleGenerativeAI(API_KEY);
  const generationConfig = {
    temperature: 0.9,
    topK: 1,
    topP: 1,
    maxOutputTokens: 2048,
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ];

  useEffect(() => {
    const initChat = async () => {
      try {
        const newChat = await genAi
          .getGenerativeModel({ model: MODEL_NAME })
          .startChat({
            generationConfig,
            safetySettings,
            history: messages.map((msg) => ({
              text: msg.text,
              role: msg.role,
            })),
          });
        setChat(newChat);
      } catch (error) {
        setError("Could not initialize chat. Please try again.");
      }
    };
    initChat();
  }, []);


  const handleSendMessage = async () => {
    try {
      const userMessage = {
        text: userInput,
        role: "user",
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setUserInput("");

      if (chat) {
        const result = await chat.sendMessage(userInput);
        const botMessage = {
          text: "",
          role: "bot",
          timestamp: new Date(),
        };

        setMessages((prevMessages) => [...prevMessages, botMessage]);

        
        const responseText = result.response.text();
        let currentIndex = 0;
        const intervalId = setInterval(() => {
          const nextChar = responseText[currentIndex];
          botMessage.text += nextChar;
          setMessages((prevMessages) => [
            ...prevMessages.slice(0, -1),
            botMessage,
          ]);
          currentIndex++;
          if (currentIndex >= responseText.length) {
            clearInterval(intervalId);
          }
        }, 10); 
      }
    } catch (error) {
      setError("Failed to send message. Please try again.");
    }
  };


  const handleThemeChange = (e) => {
    setTheme(e.target.value);
  };

  const getThemeColors = () => {
    if (theme === "Light") {
      return {
        backgroundColor: "#f5f5f5",
        textColor: "#000000",
        secondary: "bg-gray-100",
        accent: "bg-blue-500",
      };
    } else if (theme === "Dark") {
      return {
        backgroundColor: "#000000",
        textColor: "#ffffff",
      };
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); 
      handleSendMessage();
    }
  };

  const { primary, secondary, accent, text } = getThemeColors() || {};

  return (
  
    <div
      className={`flex min-h-screen bg-gradient-to-t from-purple-400 to-black ${
        primary || ""
      }`}
    >
      <div className="w-64 bg-black p-4 shadow-lg">
        <h2 className="text-4xl font-bold mt-12 text-gradient-to-r from-blue-400 via-blue-300 to-purple-500">
          Crayo AI
        </h2>
        <ul className="text-gray-300 mt-6">
          <li className="mt-4">
            <a
              href="/"
              className="block py-2 px-4 rounded transition duration-300 hover:bg-gray-800 hover:text-white"
              aria-current="page"
            >
              Home
            </a>
          </li>
          <li className="mt-2">
            <a
              href="/services"
              className="block py-2 px-4 rounded transition duration-300 hover:bg-gray-800 hover:text-white"
            >
              Services
            </a>
          </li>
          <li className="mt-2">
            <a
              href="/contact"
              className="block py-2 px-4 rounded transition duration-300 hover:bg-gray-800 hover:text-white"
            >
              Contact Us
            </a>
          </li>
        </ul>
      </div>
      <div className="flex flex-col flex-1 p-4">
        <div className="flex-1 overflow-auto p-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-4 p-4 rounded-lg ${
                message.role === "user"
                  ? " text-white text-right"
                  : "bg-black text-white text-left"
              }`}
            >
              {message.role === "bot" ? (
                <ReactMarkdown>{message.text}</ReactMarkdown>
              ) : (
                <span
                  className={`p-2 rounded-lg ${
                    message.role === "user" ? "bg-gray-900" : "bg-gray-800"
                  }`}
                >
                  {message.text}
                </span>
              )}
              <p className={`text-xs text-gray-300 mt-1`}>
                {message.role === "bot" ? "Bot" : "You"} -{" "}
                {message.timestamp.toLocaleString()}
              </p>
            </div>
          ))}
          {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
        </div>
        <div className="flex items-center mt-4">
          <input
            type="text"
            placeholder="Type your message..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={handleKeyPress}
            className={`flex-1 p-3 rounded-md border text-black border-black focus:outline-none focus:ring-2 focus:ring-purple-500`}
          />
          <button
            onClick={handleSendMessage}
            className={`ml-2 p-3 rounded-md bg-black hover:bg-purple-900 text-white transition duration-300`}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
