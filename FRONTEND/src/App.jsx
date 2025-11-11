import React, { useState } from 'react';
import HomePage from './pages/HomePage';
import LoginForm from './components/LoginForm';
import AuthPage from './pages/AuthPage';

const App = () => {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    setError('');
    setShortUrl('');

    try {
      const response = await fetch('http://localhost:3000/api/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (response.ok) {
        const shortUrlResult = await response.text();
        setShortUrl(shortUrlResult);
      } else {
        setError('Failed to create short URL');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortUrl);
  };

  return (
    <div>
      {/* <HomePage /> */}
      {/* <LoginForm /> */}
      <AuthPage/>
    </div>
  );
};

export default App;