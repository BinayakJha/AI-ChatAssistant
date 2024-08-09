"use client";
import React, { useState, useRef, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Send, User, Star, MoreVertical, Smile } from "lucide-react";

const EmojiPicker = ({ onEmojiSelect }) => {
  const emojis = ["😀", "😂", "🥰", "😎", "🤔", "👍", "🎉", "🌈", "🍕", "🚀"];
  return (
    <div className="absolute bottom-full left-0 mb-2 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg flex space-x-2">
      {emojis.map((emoji) => (
        <button
          key={emoji}
          onClick={() => onEmojiSelect(emoji)}
          className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded p-1 transition-colors duration-200"
        >
          {emoji}
        </button>
      ))}
    </div>
  );
};

const Chatbot = () => {
  const genAI = new GoogleGenerativeAI(
    "AIzaSyBgTLInXBrx-mhdLStDlFfknwizmWFKb8I",
  );
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const [theme, setTheme] = useState("light");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async () => {
    if (input.trim() === "") return;

    const newMessage = {
      text: input,
      isUser: true,
      rating: null,
      timestamp: new Date(),
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInput("");
    setTyping(true);

    try {
      const history = messages
        .map(
          (message) =>
            `${message.isUser ? "User" : "Lily"}: ${message.text}${
              message.rating !== null ? ` (Rating: ${message.rating}⭐)` : ""
            }`,
        )
        .join("\n");
      const prompt = `Your name is Lily, and you are an AI Assistant. You can search, give links of images, and perform Google searches. Here is the conversation so far:\n${history}\nUser: ${input}\nLily:`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = await response.text();

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          text: text.trim(),
          isUser: false,
          rating: null,
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      console.error("Error generating response:", error);
    } finally {
      setTyping(false);
    }
  };

  const formatMessage = (text) => {
    const urlRegex = /(\bhttps?:\/\/\S+)/g;
    return text.split(urlRegex).map((part, index) =>
      urlRegex.test(part) ? (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 dark:text-blue-400 underline"
        >
          {part}
        </a>
      ) : (
        part
      ),
    );
  };

  const handleRating = (index, rating) => {
    setMessages((prevMessages) =>
      prevMessages.map((message, i) =>
        i === index ? { ...message, rating } : message,
      ),
    );
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const formatTimestamp = (date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleEmojiSelect = (emoji) => {
    setInput((prevInput) => prevInput + emoji);
    setShowEmojiPicker(false);
  };

  return (
    <div
      className={`flex flex-col h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-blue-900 transition-colors duration-500`}
    >
      <div className="bg-white dark:bg-gray-800 shadow-lg transition-colors duration-500">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img
                src="https://cdn.usegalileo.ai/sdxl10/559d5a52-d216-481a-bf44-a4a16128965d.png"
                alt="Lily"
                className="w-12 h-12 rounded-full object-cover border-2 border-blue-500 dark:border-blue-400 shadow-lg"
              />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                Lily
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                AI Assistant
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full p-2"></button>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.isUser ? "flex-row-reverse" : "flex-row"
            } items-start`}
          >
            <div
              className={`flex-shrink-0 ${message.isUser ? "ml-4" : "mr-4"}`}
            >
              {!message.isUser ? (
                <img
                  src="https://cdn.usegalileo.ai/sdxl10/559d5a52-d216-481a-bf44-a4a16128965d.png"
                  alt="Lily"
                  className="w-10 h-10 rounded-full object-cover border-2 border-blue-500 dark:border-blue-400 shadow-md"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-md">
                  <User size={20} className="text-white" />
                </div>
              )}
            </div>
            <div
              className={`flex-1 rounded-2xl p-4 shadow-lg w-auto max-w-fit ${
                message.isUser
                  ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                  : "bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
              }`}
            >
              <p className="text-sm leading-relaxed">
                {formatMessage(message.text)}
              </p>
              <div className="mt-2 flex justify-between items-center">
                <span className="text-xs opacity-75">
                  {formatTimestamp(message.timestamp)}
                </span>
                {!message.isUser && (
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleRating(index, star)}
                        className={`focus:outline-none transition-colors duration-200 ${
                          message.rating >= star
                            ? "text-yellow-400"
                            : "text-gray-300 dark:text-gray-600 hover:text-yellow-400"
                        }`}
                      >
                        <Star size={16} />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-gray-800 rounded-full p-3 shadow-lg flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-200"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 transition-colors duration-500">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full p-2"
            >
              <Smile size={24} />
            </button>
            {showEmojiPicker && (
              <EmojiPicker onEmojiSelect={handleEmojiSelect} />
            )}
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 transition-colors duration-200 resize-none"
            rows="1"
          />
          <button
            onClick={handleSendMessage}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-3 rounded-lg hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105"
          >
            <Send size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
