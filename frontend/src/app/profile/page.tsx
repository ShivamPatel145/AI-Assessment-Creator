'use client';
import React, { useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import { motion } from 'framer-motion';
import AuthGuard from '@/components/AuthGuard';
import { useAuthStore } from '@/store/useAuthStore';
import { useDashboardStore } from '@/store/useDashboardStore';

function ProfileContent() {
  const { user } = useAuthStore();
  const { stats, fetchStats } = useDashboardStore();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const formatJoinDate = () => {
    // User model has timestamps, createdAt available
    return 'Member';
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <TopBar title="My Profile" />
        <div className="page-container" style={{ padding: '30px', maxWidth: 800, margin: '0 auto' }}>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
            <div style={{ position: 'relative', marginBottom: 60 }}>
              <div style={{ height: 160, borderRadius: 16, background: 'linear-gradient(135deg, var(--brand-orange), #ff9a44)' }}></div>
              <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${user?.email || 'Teacher'}`} style={{ width: 120, height: 120, borderRadius: '50%', background: 'var(--bg-surface)', border: '4px solid var(--bg-main)', position: 'absolute', bottom: -60, left: 32 }} />
            </div>

            <div style={{ paddingLeft: 32, marginBottom: 40 }}>
              <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>{user?.schoolName || 'Unknown School'}</h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: 15, fontWeight: 500 }}>
                {user?.role || 'TEACHER'} • {user?.location || 'Unknown Location'}
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              <div style={{ background: 'var(--bg-surface)', padding: 24, borderRadius: 16, border: '1px solid var(--border-light)' }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Account Details</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Email</span>
                    <strong>{user?.email || '—'}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Role</span>
                    <strong style={{ color: user?.role === 'TEACHER' ? '#f97316' : '#3b82f6' }}>{user?.role || '—'}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Location</span>
                    <strong>{user?.location || '—'}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Status</span>
                    <strong style={{ color: '#16a34a' }}>Active</strong>
                  </div>
                </div>
              </div>

              <div style={{ background: 'var(--bg-surface)', padding: 24, borderRadius: 16, border: '1px solid var(--border-light)' }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Statistics</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Assignments</span>
                    <strong>{stats?.totalAssignments ?? '—'}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Students</span>
                    <strong>{stats?.activeStudents ?? '—'}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Completion Rate</span>
                    <strong>{stats?.avgCompletion ?? 0}%</strong>
                  </div>
                  <button style={{ marginTop: 8, padding: 8, background: 'var(--border-light)', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600, color: 'var(--text-primary)' }}>Change Password</button>
                </div>
              </div>
            </div>

          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return <AuthGuard><ProfileContent /></AuthGuard>;
}
