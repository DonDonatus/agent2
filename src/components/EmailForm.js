// components/EmailForm.js
import { useState } from 'react';

export default function EmailForm() {
  const [email, setEmail] = useState('');

  const generateEmail = async () => {
    const res = await fetch('/api/sendRequest', {
      method: 'POST',
      body: JSON.stringify({ /* your data */ })
    });
    const data = await res.json();
    setEmail(data.email);
  };

  return (
    <div>
      <button onClick={generateEmail}>Generate Email</button>
      <div>{email}</div>
    </div>
  );
}