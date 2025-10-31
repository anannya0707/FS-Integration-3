import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const Chat = () => {
  const [name, setName] = useState('');
  const [joined, setJoined] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on('message', (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    return () => {
      socket.off('message');
    };
  }, []);

  const handleJoin = () => {
    if (name.trim()) {
      socket.emit('join', name);
      setJoined(true);
    }
  };

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit('sendMessage', message);
      setMessage('');
    }
  };

  return (
    <div>
      {!joined ? (
        <div>
          <h2>Enter your name to join</h2>
          <input value={name} onChange={e => setName(e.target.value)} />
          <button onClick={handleJoin}>Join</button>
        </div>
      ) : (
        <div>
          <h2>Welcome, {name}</h2>
          <div style={{ border: '1px solid #ccc', padding: '10px', height: '300px', overflowY: 'scroll' }}>
            {messages.map((msg, i) => (
              <div key={i}><strong>{msg.user}:</strong> {msg.text}</div>
            ))}
          </div>
          <input value={message} onChange={e => setMessage(e.target.value)} />
          <button onClick={sendMessage}>Send</button>
        </div>
      )}
    </div>
  );
};

export default Chat;
