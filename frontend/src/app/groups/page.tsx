'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import { AnimatePresence, motion } from 'framer-motion';
import AuthGuard from '@/components/AuthGuard';
import { useGroupStore } from '@/store/useGroupStore';

const groupColors = ['#ffedd5', '#e0e7ff', '#dcfce7', '#fae8ff', '#fef9c3', '#dbeafe'];

type RosterEntry = { name: string; rollNo?: string };

function GroupsContent() {
  const { groups, isLoading, error, fetchGroups, createGroup, updateGroup, deleteGroup, clearError } = useGroupStore();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [groupOpenId, setGroupOpenId] = useState<string | null>(null);
  const [rosterOpenFor, setRosterOpenFor] = useState<string | null>(null);
  const [rosterDraft, setRosterDraft] = useState<RosterEntry[]>([]);
  const [form, setForm] = useState({ title: '', students: 0, term: '', color: groupColors[0] });

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  const filteredGroups = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return groups;
    return groups.filter((g) => g.title.toLowerCase().includes(q) || g.term.toLowerCase().includes(q));
  }, [groups, query]);

  const openedGroup = useMemo(() => groups.find((g) => g._id === groupOpenId) || null, [groups, groupOpenId]);

  const openCreate = () => {
    setEditingId(null);
    setForm({ title: '', students: 0, term: '', color: groupColors[0] });
    setShowForm(true);
  };

  const openEdit = (id: string) => {
    const g = groups.find((group) => group._id === id);
    if (!g) return;
    setEditingId(id);
    setForm({ title: g.title, students: g.students, term: g.term, color: g.color || groupColors[0] });
    setShowForm(true);
  };

  const submitGroup = async () => {
    if (!form.title.trim() || !form.term.trim()) return;

    if (editingId) {
      await updateGroup(editingId, {
        title: form.title.trim(),
        students: form.students,
        term: form.term.trim(),
        color: form.color,
      });
    } else {
      await createGroup({
        title: form.title.trim(),
        students: form.students,
        term: form.term.trim(),
        color: form.color,
      });
    }

    setShowForm(false);
    setEditingId(null);
    setForm({ title: '', students: 0, term: '', color: groupColors[0] });
  };

  const openRoster = (groupId: string) => {
    const group = groups.find((g) => g._id === groupId);
    if (!group) return;
    setRosterOpenFor(groupId);
    setRosterDraft(group.roster && group.roster.length ? group.roster : [{ name: '', rollNo: '' }]);
  };

  const updateRosterEntry = (index: number, key: keyof RosterEntry, value: string) => {
    setRosterDraft((prev) => prev.map((item, i) => (i === index ? { ...item, [key]: value } : item)));
  };

  const addRosterEntry = () => {
    setRosterDraft((prev) => [...prev, { name: '', rollNo: '' }]);
  };

  const removeRosterEntry = (index: number) => {
    setRosterDraft((prev) => prev.filter((_, i) => i !== index));
  };

  const saveRoster = async () => {
    if (!rosterOpenFor) return;
    const clean = rosterDraft
      .filter((r) => r.name.trim())
      .map((r) => ({ name: r.name.trim(), rollNo: r.rollNo?.trim() || '' }));

    await updateGroup(rosterOpenFor, { roster: clean, students: clean.length });
    setRosterOpenFor(null);
    setRosterDraft([]);
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <TopBar title="My Groups" />
        <div className="page-container" style={{ padding: 'clamp(14px, 3vw, 30px)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 6 }}>Class Groups</h1>
              <p style={{ color: 'var(--text-secondary)' }}>Manage classes and maintain a working roster for each group.</p>
            </div>
            <button className="btn-create-assignment" style={{ margin: 0, padding: '10px 20px' }} onClick={openCreate}>
              + New Group
            </button>
          </div>

          <AnimatePresence>
            {showForm && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="profile-card" style={{ padding: 22, marginBottom: 16 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>{editingId ? 'Edit Group' : 'Create Group'}</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
                  <input className="form-input" placeholder="Group Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                  <input className="form-input" placeholder="Term" value={form.term} onChange={(e) => setForm({ ...form, term: e.target.value })} />
                  <input className="form-input" type="number" placeholder="Students" value={form.students || ''} onChange={(e) => setForm({ ...form, students: parseInt(e.target.value, 10) || 0 })} />
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    {groupColors.map((c) => (
                      <button
                        key={c}
                        onClick={() => setForm({ ...form, color: c })}
                        style={{
                          width: 26,
                          height: 26,
                          borderRadius: 999,
                          border: form.color === c ? '3px solid var(--brand-orange)' : '1px solid var(--border-strong)',
                          background: c,
                          cursor: 'pointer',
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
                  <button className="btn-nav-prev" onClick={() => setShowForm(false)}>Cancel</button>
                  <button className="btn-nav-next" onClick={submitGroup}>{editingId ? 'Update Group' : 'Create Group'}</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="profile-card" style={{ padding: 14, marginBottom: 16 }}>
            <input className="form-input" placeholder="Search groups by title or term" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>

          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: 60, color: 'var(--text-secondary)' }}>
                Loading groups...
              </motion.div>
            ) : filteredGroups.length === 0 ? (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: 60 }}>
                <div style={{ fontSize: 58, marginBottom: 12 }}>👥</div>
                <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>No groups found</h2>
                <p style={{ color: 'var(--text-secondary)' }}>Create your first group and start managing rosters.</p>
              </motion.div>
            ) : (
              <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
                {filteredGroups.map((g) => (
                  <motion.div key={g._id} whileHover={{ y: -3 }} className="profile-card" style={{ padding: 0, overflow: 'hidden' }}>
                    <div style={{ height: 72, background: g.color || '#e0e7ff' }} />
                    <div style={{ padding: 18 }}>
                      <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>{g.title}</h3>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 14 }}>
                        <span>{g.students} students</span>
                        <span>{g.term}</span>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 8 }}>
                        <button className="btn-nav-next" style={{ padding: '8px 0' }} onClick={() => setGroupOpenId(g._id)}>Open</button>
                        <button className="btn-nav-prev" style={{ padding: '8px 0' }} onClick={() => openEdit(g._id)}>Edit</button>
                        <button className="btn-nav-prev" style={{ padding: '8px 0' }} onClick={() => openRoster(g._id)}>Roster</button>
                        <button className="btn-nav-next" style={{ padding: '8px 0' }} onClick={() => deleteGroup(g._id)}>Delete</button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {openedGroup && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
                <motion.div initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="profile-card" style={{ width: '100%', maxWidth: 820, maxHeight: '80vh', overflowY: 'auto', padding: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, flexWrap: 'wrap', marginBottom: 10 }}>
                    <div>
                      <h3 style={{ fontSize: 18, fontWeight: 700 }}>{openedGroup.title}</h3>
                      <p style={{ marginTop: 4, color: 'var(--text-secondary)', fontSize: 13 }}>{openedGroup.term} • {openedGroup.students} students</p>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn-nav-prev" onClick={() => openRoster(openedGroup._id)}>Manage Roster</button>
                      <button className="btn-nav-next" onClick={() => setGroupOpenId(null)}>Close</button>
                    </div>
                  </div>

                  <div style={{ marginTop: 8, borderTop: '1px solid var(--border-light)', paddingTop: 10 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Students in this group</div>
                    {openedGroup.roster && openedGroup.roster.length > 0 ? (
                      <div style={{ display: 'grid', gap: 8 }}>
                        {openedGroup.roster.map((student, idx) => (
                          <div key={`${student.name}-${student.rollNo || idx}`} style={{ border: '1px solid var(--border-light)', borderRadius: 10, padding: '9px 12px', display: 'flex', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
                            <span style={{ fontWeight: 600, fontSize: 13 }}>{student.name}</span>
                            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Roll No: {student.rollNo || 'Not set'}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>No students added yet. Use Manage Roster to add students and roll numbers.</p>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            )}

            {rosterOpenFor && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
                <motion.div initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="profile-card" style={{ width: '100%', maxWidth: 700, maxHeight: '80vh', overflowY: 'auto', padding: 20 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>Roster Manager</h3>
                  <div style={{ display: 'grid', gap: 8 }}>
                    {rosterDraft.map((entry, idx) => (
                      <div key={`${idx}-${entry.rollNo || 'x'}`} style={{ display: 'grid', gridTemplateColumns: '1fr 0.7fr auto', gap: 8 }}>
                        <input className="form-input" placeholder="Student name" value={entry.name} onChange={(e) => updateRosterEntry(idx, 'name', e.target.value)} />
                        <input className="form-input" placeholder="Roll no" value={entry.rollNo || ''} onChange={(e) => updateRosterEntry(idx, 'rollNo', e.target.value)} />
                        <button className="btn-nav-prev" onClick={() => removeRosterEntry(idx)}>Remove</button>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
                    <button className="btn-nav-prev" onClick={addRosterEntry}>+ Add Student</button>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn-nav-prev" onClick={() => setRosterOpenFor(null)}>Cancel</button>
                      <button className="btn-nav-next" onClick={saveRoster}>Save Roster</button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <div style={{ marginTop: 12, color: '#ef4444', fontSize: 13, fontWeight: 600 }}>
              {error}
              <button onClick={clearError} style={{ marginLeft: 8, border: 'none', background: 'none', color: '#ef4444', textDecoration: 'underline', cursor: 'pointer' }}>
                dismiss
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function GroupsPage() {
  return (
    <AuthGuard>
      <GroupsContent />
    </AuthGuard>
  );
}
