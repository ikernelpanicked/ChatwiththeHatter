// src/App.js
import React, { useState } from 'react';
import ThreeScene from './components/ThreeScene';
import { Box, Paper, TextField, Button, Typography } from '@mui/material';
import { FaPenFancy } from 'react-icons/fa';

function App() {
  const [query, setQuery] = useState('');
  const [conversation, setConversation] = useState([]);
  const [jumpTrigger, setJumpTrigger] = useState(0);

  const callFlaskApi = async (promptText) => {
    try {
      const res = await fetch('http://127.0.0.1:5000/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: promptText,
          history: conversation.map((msg) => msg.text).join('\n'),
        }),
      });
      const data = await res.json();
      return data.response;
    } catch (error) {
      console.error('Error calling Flask API:', error);
      return 'The Hatter is not being very chatty at the moment.';
    }
  };

  // Clicking on the interactive object
  const onInteractiveObjectClick = async (promptText) => {
    // Append the prompt text as a User message
    const userMessage = { sender: 'env', text: promptText };
    setConversation((prev) => [...prev, userMessage]);

    // Call the backend api to talk to chatgtp
    const responseText = await callFlaskApi(promptText);

        // Append model's response
    const hatterMessage = { sender: 'Hatter', text: responseText };
    setConversation((prev) => [...prev, hatterMessage]);

    // Trigger the character's jump and expressions
    setJumpTrigger((prev) => prev + 1);
  };

  // user's prompt
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Append the typed prompt as a User message.
    const userMessage = { sender: 'User', text: query };
    setConversation((prev) => [...prev, userMessage]);

    // Call the backend api to talk to chatgtp
    const responseText = await callFlaskApi(query);

    // Append model's response
    const hatterMessage = { sender: 'Hatter', text: responseText };
    setConversation((prev) => [...prev, hatterMessage]);

    // Trigger the character's jump and expressions
    setJumpTrigger((prev) => prev + 1);
    setQuery('');
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Left side: Three.js viewport */}
      <Box sx={{ width: '50%', height: '100%', backgroundColor: '#272727' }}>
        <ThreeScene jumpTrigger={jumpTrigger} onInteractiveObjectClick={onInteractiveObjectClick} />
      </Box>

      {/* Right side: Chat area */}
      <Box
        sx={{
          width: '50%',
          height: '100%',
          backgroundColor: '#fdf6e3',
          display: 'flex',
          flexDirection: 'column',
          p: 2,
        }}
      >
        {/* Conversation display */}
        <Paper
          sx={{
            flex: 1,
            overflowY: 'auto',
            p: 2,
            mb: 2,
            backgroundColor: '#fffbe6',
          }}
        >
          {conversation.map((msg, index) => (
            <Typography
              key={index}
              variant="body1"
              gutterBottom
              sx={{ fontFamily: 'serif', whiteSpace: 'pre-wrap' }}
            >
              {msg.sender === 'User'
                ? `"${msg.text}" said the User.`
                : msg.text}
            </Typography>
          ))}
        </Paper>
        {/* Input area */}
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Enter message..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button type="submit" variant="contained" color="primary">
            <FaPenFancy fontSize="large" />
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default App;
