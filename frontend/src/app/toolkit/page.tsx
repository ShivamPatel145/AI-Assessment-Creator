'use client';
import React from 'react';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import { motion } from 'framer-motion';
import AuthGuard from '@/components/AuthGuard';

function ToolkitContent() {
  const tools = [
    { title: 'Essay Grader AI', desc: 'Automatically evaluate essays using deep analytical rubrics and instant feedback.', icon: '📝' },
    { title: 'Plagiarism Checker', desc: 'Scan student assignments against 10B+ academic papers in seconds.', icon: '🔍' },
    { title: 'Lesson Planner', desc: 'Generate complete 40-minute lesson plans based on regional curriculum.', icon: '📅' },
    { title: 'Flashcard Maker', desc: 'Instantly convert PDF textbooks into interactive student flashcards.', icon: '📇' },
    { title: 'Rubric Generator', desc: 'Create complex assessment rubrics for projects tailored to Grade level.', icon: '📊' },
    { title: 'Difficulty Analyzer', desc: 'Test your exam to ensure appropriate Lexile and Question difficulty curve.', icon: '⚖️' },
  ];

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <TopBar title="AI Teacher's Toolkit" />
        <div className="page-container" style={{ padding: '30px' }}>
          
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginBottom: 40, textAlign: 'center' }}>
            <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 12 }}>Unleash your super-teacher abilities.</h1>
            <p style={{ color: 'var(--text-secondary)', maxWidth: 600, margin: '0 auto' }}>Explore a suite of dedicated generative AI tools precisely tuned for educators. Save hundreds of hours on busywork every semester.</p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
            {tools.map((t, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.02, boxShadow: '0 10px 30px rgba(255,107,0,0.1)', borderColor: 'rgba(255,107,0,0.3)' }}
                style={{ background: 'var(--bg-surface)', padding: 24, borderRadius: 16, border: '1px solid var(--border-light)', cursor: 'pointer' }}
              >
                <div style={{ fontSize: 32, marginBottom: 16 }}>{t.icon}</div>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{t.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{t.desc}</p>
                <div style={{ marginTop: 20, fontSize: 13, fontWeight: 600, color: 'var(--brand-orange)' }}>Try Tool →</div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}

export default function ToolkitPage() {
  return <AuthGuard><ToolkitContent /></AuthGuard>;
}
