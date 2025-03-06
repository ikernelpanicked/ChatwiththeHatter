import React, { useState } from 'react';
import ThreeScene from './components/ThreeScene';
import { Box, Paper, TextField, Button, Typography } from '@mui/material';

function App() {
  const [query, setQuery] = useState('');
  const [conversation, setConversation] = useState([]); // message objects
  const [jumpTrigger, setJumpTrigger] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Append user's message to conversation history
    const userMessage = { sender: 'User', text: query };
    setConversation((prev) => [...prev, userMessage]);

    try {
      // Call your Flask API endpoint
      const res = await fetch('http://127.0.0.1:5000/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, history: conversation.map(m => m.text).join('\n') }),
      });
      const data = await res.json();

      // Append character's response
      const hatterMessage = { sender: 'Hatter', text: data.response };
      setConversation((prev) => [...prev, hatterMessage]);

      // Trigger the jump animation on the character
      setJumpTrigger((prev) => prev + 1);

      // Clear the prompt input
      setQuery('');
    } catch (error) {
      console.error("Error fetching API:", error);
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', width: '100vw' }}>
      {/* Left column Three.js viewport */}
      <Box sx={{ width: '50%', height: '100vh', backgroundColor: '#272727' }}>
        <ThreeScene jumpTrigger={jumpTrigger} />
      </Box>

      {/* Right column panel */}
      <Box
        sx={{
          width: '50%',
          height: '100vh',
          backgroundColor: '#fdf6e3',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Conversation */}
        <Paper
          sx={{
            flex: 1,
            m: 2,
            p: 2,
            overflowY: 'auto',
            backgroundColor: '#fffbe6',
          }}
        >
          {conversation.map((msg, index) => {
            // Base styling for each message container
            const containerStyle = {
              display: 'flex',
              justifyContent: msg.sender === 'User' ? 'flex-end' : 'flex-start',
              marginBottom: '8px',
            };

            // formats user's prompt with a prose like text wrap
            let textDisplay = msg.text;
            if (msg.sender === 'User') {
              const templates = [
                `"${msg.text}" said the User.`,
                `"${msg.text}" the User stated.`,
                `"${msg.text}" the User inquired.`,
                `"${msg.text}" the User remarked.`,
              ];
              textDisplay = templates[index % templates.length];
            }

            // Each dialogue bubble
            const bubbleStyle = {
              padding: '10px 15px',
              borderRadius: '10px',
              maxWidth: '80%',
              backgroundColor: msg.sender === 'User' ? '#e0f7fa' : '#fffbe6',
              boxShadow: '0px 1px 3px rgba(0,0,0,0.2)',
            };

            return (
              <div key={index} style={containerStyle}>
                <div style={bubbleStyle}>
                  <p style={{ margin: 0, fontFamily: 'serif', whiteSpace: 'pre-wrap' }}>
                    {textDisplay}
                  </p>
                </div>
              </div>
            );
          })}
        </Paper>

        {/* prompt input */}
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: 'flex', m: 2, gap: 1 }}
        >
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Enter message..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button type="submit" variant="contained" color="primary">
            Send
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default App;
