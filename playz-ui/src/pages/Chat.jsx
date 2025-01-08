import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "../utils/firebase-config";


function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { roomId } = useParams();
  const wsRef = useRef(null);

  useEffect(() => {
    onAuthStateChanged(firebaseAuth, (currentUser) => {
      if (!currentUser) {
        navigate("/login");
      } else {
        setUser(currentUser);
      }
    });
  }, [navigate]);
  
  useEffect(() => {
    if (user) {
      wsRef.current = new WebSocket("ws://localhost:8080");
      wsRef.current.onopen = () => {
        wsRef.current.send(JSON.stringify({ type: "join", room: roomId, user: user.email }));
      };
      wsRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === "message") {
          setMessages((prev) => [...prev, data.chatMessage]);
        } else if (data.type === "history") {
          setMessages(data.history);
        }
      };
  
      return () => {
        wsRef.current.close();
      };
    }
  }, [roomId, user]);
  
  const sendMessage = () => {
    if (!user) return;
    if (message.trim() && wsRef.current) {
      const newMessage = { email: user.email, message };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
  
      wsRef.current.send(
        JSON.stringify({
          type: "message",
          room: roomId,
          email: user.email,
          message,
        })
      );
  
      setMessage("");
    }
  };
  

  return (
    <Container>
      <div className="chat-container">
        <h3>Room: {roomId}</h3>
        <div className="messages">
          {messages.map((msg, index) => (
            <div key={index} className="message">
              <strong>{msg.email}</strong>: {msg.message}
            </div>
          ))}
        </div>
        <div className="input-container">
          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </Container>
  );
}

const Container = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.8);
  .chat-container {
    background-color: #000000b0;
    padding: 2rem;
    color: white;
    width: 50vw;
    height: 70vh;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    .messages {
      flex: 1;
      overflow-y: auto;
      padding: 1rem;
      background-color: rgba(255, 255, 255, 0.1);
      border-radius: 0.5rem;
      .message {
        margin-bottom: 0.5rem;
        strong {
          color: #e50914;
        }
      }
    }
    .input-container {
      display: flex;
      gap: 1rem;
      input {
        flex: 1;
        padding: 0.5rem;
        border: none;
        border-radius: 0.5rem;
        background-color: rgba(255, 255, 255, 0.2);
        color: white;
      }
      button {
        padding: 0.5rem 1rem;
        background-color: #e50914;
        border: none;
        color: white;
        border-radius: 0.5rem;
        cursor: pointer;
        font-weight: bold;
      }
    }
  }
`;

export default Chat;
