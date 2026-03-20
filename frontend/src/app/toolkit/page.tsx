'use client';
import { useState } from 'react';

export default function Home() {
  const [text, setText] = useState('');
  return (
    <div style={{ padding: 40 }}>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{ fontSize: 20, padding: 10, width: 400 }}
      />
      <p>{text}</p>
    </div>
  );
}