'use client';

import React, { useState } from "react";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSendMessage = () => {
    if (input.trim() === "") return;

    setMessages((prevMessages) => [
      ...prevMessages,
      { text: input, isUser: true }
    ]);
    setInput("");

    // Simulate AI response
    setTimeout(() => {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          text:
            "Hi there! I'm Lily, your virtual assistant. How can I help you today?",
          isUser: false
        }
      ]);
    }, 1000);
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div
        className="relative flex flex-col justify-between bg-white rounded-lg shadow-lg overflow-x-hidden sm:min-h-0 sm:h-screen sm:w-full lg:w-1/4 lg:h-3/4 lg:min-h-0"
        style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}
      >
        <div>
          <div className="flex items-center bg-white p-4 pb-2 justify-between">
            <h2 className="text-[#111318] text-lg font-bold leading-tight tracking-[-0.015em] flex-1">
              Chat
            </h2>
            <div className="flex w-12 items-center justify-end">
              <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 bg-transparent text-[#111318] gap-2 text-base font-bold leading-normal tracking-[0.015em] min-w-0 p-0">
                <div
                  className="text-[#111318]"
                  data-icon="X"
                  data-size="24px"
                  data-weight="regular"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24px"
                    height="24px"
                    fill="currentColor"
                    viewBox="0 0 256 256"
                  >
                    <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path>
                  </svg>
                </div>
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-3 p-4 overflow-y-auto max-h-[500px]">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.isUser ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex items-center gap-3 ${
                    message.isUser ? "flex-row-reverse" : ""
                  }`}
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
                    className={`flex flex-col gap-1 items-${
                      message.isUser ? "end" : "start"
                    }`}
                  >
                    <p
                      className={`text-[#616c89] text-[13px] font-normal leading-normal max-w-[360px] ${
                        message.isUser ? "text-right" : ""
                      }`}
                    >
                      {message.isUser ? "User" : "Lily"}
                    </p>
                    <p
                      className={`text-base font-normal leading-normal flex max-w-[360px] rounded-xl px-4 py-3 ${
                        message.isUser
                          ? "bg-[#3466ef] text-white"
                          : "bg-[#f0f1f4] text-[#111318]"
                      }`}
                    >
                      {message.text}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="flex items-center px-4 py-3 gap-3">
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 shrink-0"
              style={{
                backgroundImage:
                  'url("https://cdn.usegalileo.ai/stability/5a1d3583-25a7-4486-b8a6-e663903e1a5b.png")'
              }}
            ></div>
            <label className="flex flex-col min-w-40 h-12 flex-1">
              <div className="flex w-full flex-1 items-stretch rounded-xl h-full">
                <input
                  type="text"
                  placeholder="Write a message"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#111318] focus:outline-0 focus:ring-0 border-none bg-[#f0f1f4] h-full placeholder:text-[#616c89] px-4 rounded-r-none border-r-0 pr-2 text-base font-normal leading-normal"
                />
                <div className="flex border-none bg-[#f0f1f4] items-center justify-center pr-4 rounded-r-xl border-l-0 !pr-2">
                  <button
                    onClick={handleSendMessage}
                    className="flex items-center justify-center p-1.5"
                  >
                    <div
                      className="text-[#616c89]"
                      data-icon="PaperPlane"
                      data-size="20px"
                      data-weight="regular"
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
                    </div>
                  </button>
                </div>
              </div>
            </label>
          </div>
          <div className="h-5 bg-white"></div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
