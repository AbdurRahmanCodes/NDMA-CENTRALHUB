import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { X, Send, MessageSquareText } from "lucide-react";
import "./ChatBot.css";

export default function ChatBot() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      sender: "bot",
      text: "Hello! I'm the GIS assistant bot. How can I help you today?",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const chatBodyRef = useRef(null);
  const location = useLocation();
  const isHistoryRoute =
    typeof window !== "undefined" &&
    location &&
    location.pathname &&
    location.pathname.startsWith("/history");
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [chatMessages, isChatOpen]);
  const sendMessage = async () => {
    const message = chatInput.trim();
    if (message === "") return;

    setChatMessages((prev) => [...prev, { sender: "user", text: message }]);

    setChatMessages((prev) => [
      ...prev,
      { sender: "bot", text: "Typing...", loading: true },
    ]);
    setChatInput("");

    try {
      const response = await fetch("http://localhost:3000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: message }),
      });

      const data = await response.json();

      setChatMessages((prev) => prev.filter((msg) => !msg.loading));
      setChatMessages((prev) => [
        ...prev,
        { sender: "bot", text: data.response },
      ]);
    } catch (error) {
      console.error("Error communicating with the chatbot server:", error);
      setChatMessages((prev) => prev.filter((msg) => !msg.loading));
      setChatMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Sorry, there was an error connecting to the chatbot server. Make sure the server is running on port 3000.",
        },
      ]);
    }
  };

  return (
    <div
    className="chat-container"
      style={isHistoryRoute ? { display: "none" } : undefined}
    >
      <button
        id="chat-toggle-btn"
        className="chat-toggle-btn"
        onClick={() => setIsChatOpen((prev) => !prev)}
        aria-label={isChatOpen ? "Close chat" : "Open chat"}
        title={isChatOpen ? "Close chat" : "Open chat"}
      >
        <MessageSquareText />
      </button>
      <div
        id="chat-window"
        className={`chat-window ${isChatOpen ? "" : "hidden"}`}
      >
        <div className="chat-header">
          <h3>Chat Assistant</h3>
          <button
            id="chat-close-btn"
            className="chat-close-btn"
            onClick={() => setIsChatOpen(false)}
            aria-label="Close chat"
            title="Close chat"
          >
            <X />
          </button>
        </div>
        <div id="chat-body" className="chat-body" ref={chatBodyRef}>
          {chatMessages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender}-message`}>
              {msg.text}
            </div>
          ))}
        </div>
        <div className="chat-footer">
          <input
            type="text"
            id="user-input"
            placeholder="Write your message..."
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
            aria-label="Type your message"
          />
          <button id="send-btn" className="send-btn" onClick={sendMessage}>
            <Send />
          </button>
        </div>
      </div>
    </div>
  );
}
