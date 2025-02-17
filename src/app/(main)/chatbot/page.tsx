import React from "react";
import ChatBot from "./Chatbot";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chatbot",
};
const ChatBotPage = () => {
  return (
    <div>
      <ChatBot />
    </div>
  );
};

export default ChatBotPage;
