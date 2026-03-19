'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

export default function TopBar({ title }: { title: string }) {
  const router = useRouter();

  return (
    <div className="top-bar">
      <div className="top-bar-left">
        <button className="back-btn" onClick={() => router.back()}>←</button>
        <span style={{ opacity: 0.5 }}>㗊</span> {title}
      </div>
      <div className="top-bar-right">
        <button style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', position: 'relative' }}>
          🔔
          <span style={{ position: 'absolute', top: 0, right: 0, width: 6, height: 6, background: 'var(--brand-orange)', borderRadius: '50%' }}></span>
        </button>
        <div className="user-dropdown">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=John" alt="User" style={{ width: 28, height: 28, borderRadius: 14, background: '#f3f4f6' }} />
          John Doe <span style={{ opacity: 0.5 }}>⌄</span>
        </div>
      </div>
    </div>
  );
}
