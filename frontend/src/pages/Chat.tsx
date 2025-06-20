import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { io as socketIO, Socket as SocketType } from 'socket.io-client';
import toast from 'react-hot-toast';
import axios from 'axios';

interface Message {
  _id: string;
  sender: {
    _id: string;
    name: string;
    role: string;
  };
  content: string;
  createdAt: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function Chat() {
  const location = useLocation();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const socketRef = useRef<SocketType | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const orderId = new URLSearchParams(location.search).get('orderId');

  useEffect(() => {
    if (!orderId) return;

    // Connect to Socket.IO server
    socketRef.current = socketIO('http://localhost:5000');

    // Join the order-specific chat room
    socketRef.current.emit('join_chat', orderId);

    // Listen for new messages
    socketRef.current.on('new_message', (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    // Fetch existing messages
    fetchMessages();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [orderId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/messages/${orderId}`
      );
      setMessages(response.data);
    } catch (error) {
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !socketRef.current || !user) return;

    try {
      const messageData = {
        sender: user.id,
        content: newMessage,
        orderId,
      };

      socketRef.current.emit('send_message', messageData);
      setNewMessage('');
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (!orderId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">No order selected</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">
              Chat - Order #{orderId.slice(-6)}
            </h2>
          </div>

          <div className="h-[60vh] overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message._id}
                className={`flex ${
                  message.sender._id === user?.id ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    message.sender._id === user?.id
                      ? 'bg-accent-500 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-sm font-medium">
                      {message.sender.name}
                    </span>
                    <span className="text-xs opacity-75">
                      {new Date(message.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                  <p>{message.content}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t">
            <form onSubmit={sendMessage} className="flex space-x-4">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="input flex-1"
              />
              <button type="submit" className="btn btn-primary">
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 