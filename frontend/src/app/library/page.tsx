'use client';
import React, { useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import { motion, AnimatePresence } from 'framer-motion';
import AuthGuard from '@/components/AuthGuard';
import { useLibraryStore } from '@/store/useLibraryStore';

function LibraryContent() {
  const { files, isLoading, fetchFiles } = useLibraryStore();

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  // Derive unique folders from real files
  const folders = [...new Set(files.map(f => f.folder || 'Uncategorized'))];

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const typeIcon = (type: string) => {
    if (type.includes('pdf')) return '📄';
    if (type.includes('doc')) return '📝';
    if (type.includes('image') || type.includes('png') || type.includes('jpg')) return '🖼️';
    return '📄';
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <TopBar title="My Library" />
        <div className="page-container" style={{ padding: '30px' }}>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 }}>
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 700 }}>My Deep Library</h1>
              <p style={{ color: 'var(--text-secondary)' }}>All your saved assets, files, schemas, and historical tests.</p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: 60, color: 'var(--text-secondary)' }}>
                <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2 }}>Loading library...</motion.span>
              </motion.div>
            ) : files.length === 0 ? (
              <motion.div key="empty" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                style={{ textAlign: 'center', padding: 60 }}>
                <div style={{ fontSize: 64, marginBottom: 16 }}>📚</div>
                <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>No files yet</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Your library is empty. Files will appear here as you create assignments.</p>
              </motion.div>
            ) : (
              <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {/* Folders */}
                {folders.length > 0 && (
                  <>
                    <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Folders</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 40 }}>
                      {folders.map((f, i) => (
                        <motion.div
                          key={f}
                          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
                          whileHover={{ scale: 1.05, background: 'var(--bg-main)' }}
                          style={{ padding: 20, border: '1px solid var(--border-light)', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', background: 'var(--bg-surface)' }}
                        >
                          <div style={{ fontSize: 24, color: '#f59e0b' }}>📁</div>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: 13 }}>{f}</div>
                            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                              {files.filter(file => (file.folder || 'Uncategorized') === f).length} files
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </>
                )}

                {/* Recent Files */}
                <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Recent Files</h3>
                <div style={{ background: 'var(--bg-surface)', borderRadius: 16, border: '1px solid var(--border-light)', overflow: 'hidden' }}>
                  {files.slice(0, 10).map((f, i) => (
                    <motion.div
                      key={f._id}
                      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                      whileHover={{ background: 'var(--bg-main)' }}
                      style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', borderBottom: i !== Math.min(files.length, 10) - 1 ? '1px solid var(--border-light)' : 'none', cursor: 'pointer' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div>{typeIcon(f.type)}</div>
                        <div>
                          <div style={{ fontWeight: 500, fontSize: 14 }}>{f.name}</div>
                          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{f.folder}</div>
                        </div>
                      </div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{formatDate(f.createdAt)}</div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </div>
  );
}

export default function LibraryPage() {
  return <AuthGuard><LibraryContent /></AuthGuard>;
}
