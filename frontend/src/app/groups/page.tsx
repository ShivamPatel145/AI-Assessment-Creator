'use client';
import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import { motion, AnimatePresence } from 'framer-motion';
import AuthGuard from '@/components/AuthGuard';
import { useGroupStore } from '@/store/useGroupStore';

const groupColors = ['#ffedd5', '#e0e7ff', '#dcfce7', '#fae8ff', '#fef9c3', '#dbeafe'];

function GroupsContent() {
  const { groups, isLoading, fetchGroups, createGroup } = useGroupStore();
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ title: '', students: 0, term: '', color: groupColors[0] });

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  const handleCreate = async () => {
    if (!form.title || !form.term) return;
    await createGroup(form);
    setShowCreate(false);
    setForm({ title: '', students: 0, term: '', color: groupColors[0] });
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <TopBar title="My Groups" />
        <div className="page-container" style={{ padding: '30px' }}>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 }}>
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 700 }}>My Student Groups</h1>
              <p style={{ color: 'var(--text-secondary)' }}>Manage your classrooms and student rosters.</p>
            </div>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn-create-assignment" style={{ margin: 0, padding: '10px 20px', fontSize: 14 }} onClick={() => setShowCreate(true)}>
              + Create New Group
            </motion.button>
          </div>

          {/* Create Group Modal */}
          <AnimatePresence>
            {showCreate && (
              <motion.div
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-light)', borderRadius: 16, padding: 24, marginBottom: 24 }}
              >
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>New Group</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                  <input placeholder="Group Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                    style={{ padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border-strong)', background: 'var(--bg-main)', fontSize: 14 }} />
                  <input placeholder="Term (e.g. Fall 2026)" value={form.term} onChange={e => setForm({ ...form, term: e.target.value })}
                    style={{ padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border-strong)', background: 'var(--bg-main)', fontSize: 14 }} />
                  <input type="number" placeholder="Students" value={form.students || ''} onChange={e => setForm({ ...form, students: parseInt(e.target.value) || 0 })}
                    style={{ padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border-strong)', background: 'var(--bg-main)', fontSize: 14 }} />
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    {groupColors.map(c => (
                      <div key={c} onClick={() => setForm({ ...form, color: c })}
                        style={{ width: 28, height: 28, borderRadius: '50%', background: c, cursor: 'pointer', border: form.color === c ? '3px solid var(--brand-orange)' : '2px solid transparent' }} />
                    ))}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                  <button onClick={() => setShowCreate(false)} style={{ padding: '8px 16px', background: 'var(--border-light)', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
                  <button onClick={handleCreate} style={{ padding: '8px 16px', background: 'var(--brand-black)', color: 'var(--bg-surface)', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>Create</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Groups Grid */}
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: 60, color: 'var(--text-secondary)' }}>
                <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2 }}>Loading groups...</motion.span>
              </motion.div>
            ) : groups.length === 0 ? (
              <motion.div key="empty" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                style={{ textAlign: 'center', padding: 60 }}>
                <div style={{ fontSize: 64, marginBottom: 16 }}>👥</div>
                <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>No groups yet</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Create your first group to organize students 🚀</p>
              </motion.div>
            ) : (
              <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
                {groups.map((g, i) => (
                  <motion.div
                    key={g._id}
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                    whileHover={{ y: -5, boxShadow: '0 12px 30px rgba(0,0,0,0.08)' }}
                    style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-light)', borderRadius: 16, overflow: 'hidden' }}
                  >
                    <div style={{ height: 80, background: g.color || '#e0e7ff' }}></div>
                    <div style={{ padding: 24, position: 'relative' }}>
                      <div style={{ position: 'absolute', top: -30, right: 24, background: 'var(--bg-surface)', width: 60, height: 60, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '4px solid var(--bg-main)', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', fontSize: 20 }}>
                        👥
                      </div>
                      <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, marginTop: 10 }}>{g.title}</h3>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: 13, marginBottom: 20 }}>
                        <span>{g.students} Students</span>
                        <span>{g.term}</span>
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button style={{ flex: 1, padding: '8px 0', background: 'var(--border-light)', color: 'var(--text-primary)', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>Roster</button>
                        <button style={{ flex: 1, padding: '8px 0', background: 'var(--text-primary)', color: 'var(--bg-surface)', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>Analytics</button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </div>
  );
}

export default function GroupsPage() {
  return <AuthGuard><GroupsContent /></AuthGuard>;
}
