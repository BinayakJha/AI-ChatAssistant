"use client";

import React, { useState } from "react";
// import css
import "./styles.css";
import { GoogleGenerativeAI } from "@google/generative-ai";

const Chatbot = () => {
  const genAI = new GoogleGenerativeAI("AIzaSyCEUuNqzGz9gwvIVXXEFKwZ9wqnn-w3rLo"); // Add your API key here
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  const handleSendMessage = async () => {
    if (input.trim() === "") return;

    const newMessage = { text: input, isUser: true };

    setMessages((prevMessages) => [
      ...prevMessages,
      newMessage
    ]);
    setInput("");
    setTyping(true);

    try {
      const history = messages.map(message => `${message.isUser ? "User" : "Lily"}: ${message.text}`).join("\n");
      const prompt = `Your name is Lily, and you are an AI Assistant, you can search, give links of images too, then search it on Google too, you are chatting with a user. Here is the conversation so far:\n${history}\nUser: ${input}\nLily:`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = await response.text();

      setMessages((prevMessages) => [
        ...prevMessages,
        { text: text.trim(), isUser: false }
      ]);
    } catch (error) {
      console.error("Error generating response:", error);
    } finally {
      setTyping(false);
    }
  };

  const formatMessage = (text) => {
    const urlRegex = /(\bhttps?:\/\/[^\s]+)/g;
    return text.split(urlRegex).map((part, index) =>
      urlRegex.test(part) ? (
        <>
        <a key={index} href={part} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
          {part}
        </a>
        <br />
        </>

      ) : (
        part
      )
    );
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div
        className="relative flex flex-col justify-between bg-white rounded-lg shadow-lg overflow-x-hidden w-full max-w-md h-full sm:h-auto lg:max-h-[75vh] lg:min-h-0"
        style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}
      >
        <div>
          <div className="flex items-center bg-white p-4 border-b border-gray-200 justify-between">
            <h2 className="text-gray-800 text-lg font-bold leading-tight tracking-[-0.015em] flex-1">
              Chat with Lily
            </h2>
            <button className="text-gray-800 focus:outline-none" onClick={() => setMessages([])}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24px"
                height="24px"
                fill="currentColor"
                viewBox="0 0 256 256"
              >
                <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path>
              </svg>
            </button>
          </div>
          <div className="flex flex-col gap-3 p-4 overflow-y-auto max-h-[500px]">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`flex items-center gap-3 ${message.isUser ? "flex-row-reverse" : ""}`}
                >
                  {!message.isUser && (
                    <div
                      className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-10 shrink-0"
                      style={{
                        backgroundImage:
                          'url("https://cdn.usegalileo.ai/sdxl10/559d5a52-d216-481a-bf44-a4a16128965d.png")'
                      }}
                    ></div>
                  )}
                  <div
                    className={`flex flex-col gap-1 items-${message.isUser ? "end" : "start"}`}
                  >
                    <p
                      className={`text-gray-500 text-[13px] font-normal leading-normal max-w-[360px] ${
                        message.isUser ? "text-right" : ""
                      }`}
                    >
                      {message.isUser ? "User" : "Lily"}
                    </p>
                    <p
                      className={`text-base font-normal leading-normal flex max-w-[360px] rounded-xl px-4 py-3 ${
                        message.isUser ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      {formatMessage(message.text)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="flex items-center gap-3">
                  <div
                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-10 shrink-0"
                    style={{
                      backgroundImage:
                        'url("https://cdn.usegalileo.ai/sdxl10/559d5a52-d216-481a-bf44-a4a16128965d.png")'
                    }}
                  ></div>
                  <div className="flex flex-col gap-1 items-start">
                    <p className="text-gray-500 text-[13px] font-normal leading-normal max-w-[360px]">
                      Lily
                    </p>
                    <p className="text-base font-normal leading-normal flex max-w-[360px] rounded-xl px-4 py-3 bg-gray-200 text-gray-800">
                      Lily is typing...
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Write a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 resize-none overflow-hidden rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-600 border border-gray-300 bg-gray-100 h-12 px-4"
            />
            <button
              onClick={handleSendMessage}
              className="bg-blue-600 text-white rounded-xl h-12 w-12 flex items-center justify-center focus:outline-none hover:bg-blue-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20px"
                height="20px"
                fill="currentColor"
                viewBox="0 0 256 256"
              >
                <path d="M237.9,200.09,141.85,32.18a16,16,0,0,0-27.89,0l-95.89,168a16,16,0,0,0,19.25,22.92l90.47-31,.1,0,.09,0,90.68,31a16,16,0,0,0,19.24-23Zm-14,7.84L136,177.86V120a8,8,0,0,0-16,0v57.78L32.12,207.94,32,208,127.86,40,224,208Z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
