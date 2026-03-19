'use client';
import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import AuthGuard from '@/components/AuthGuard';

function SettingsContent() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = theme === 'dark';

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <TopBar title="Settings" />
        <div className="page-container" style={{ padding: '30px', maxWidth: 800, margin: '0 auto' }}>
          
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Account Settings</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 32 }}>Manage your school profile, billing, and API connections.</p>
            
            <div style={{ background: 'var(--bg-surface)', padding: 32, borderRadius: 16, border: '1px solid var(--border-light)', marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 30 }}>
                <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Teacher" style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--bg-main)' }} />
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Delhi Public School</h3>
                  <button style={{ padding: '6px 12px', background: 'var(--bg-main)', color: 'var(--text-primary)', borderRadius: 8, fontSize: 12, border: 'none', cursor: 'pointer', fontWeight: 600 }}>Change Avatar</button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
                <div className="form-group">
                  <label className="form-label">School Name</label>
                  <input type="text" className="form-input" defaultValue="Delhi Public School" />
                </div>
                <div className="form-group">
                  <label className="form-label">Location</label>
                  <input type="text" className="form-input" defaultValue="Bokaro Steel City" />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Contact Email</label>
                <input type="email" className="form-input" defaultValue="admin@dpsbokaro.edu.in" />
              </div>
            </div>

            <div style={{ background: 'var(--bg-surface)', padding: 32, borderRadius: 16, border: '1px solid var(--border-light)' }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Preferences</h3>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid var(--border-light)' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>Enable Email Notifications</div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Get notified when large jobs complete</div>
                </div>
                <motion.div style={{ width: 44, height: 24, borderRadius: 20, background: 'var(--brand-orange)', position: 'relative', cursor: 'pointer' }}>
                  <motion.div initial={{ x: 22 }} style={{ width: 20, height: 20, borderRadius: 10, background: 'white', position: 'absolute', top: 2, left: 2 }} />
                </motion.div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>Dark Mode</div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Toggle dark/light theme</div>
                </div>
                {mounted && (
                  <motion.div 
                    onClick={() => setTheme(isDark ? 'light' : 'dark')}
                    style={{ width: 44, height: 24, borderRadius: 20, background: isDark ? 'var(--brand-orange)' : '#D1D5DB', position: 'relative', cursor: 'pointer', transition: 'background 0.3s' }}
                  >
                    <motion.div 
                      animate={{ x: isDark ? 22 : 0 }} 
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      style={{ width: 20, height: 20, borderRadius: 10, background: 'white', position: 'absolute', top: 2, left: 2 }} 
                    />
                  </motion.div>
                )}
              </div>
            </div>

            <div style={{ marginTop: 32, display: 'flex', justifyContent: 'flex-end' }}>
              <motion.button whileHover={{ scale: 1.05 }} className="btn-create-assignment" style={{ margin: 0, padding: '10px 30px' }}>Save Changes</motion.button>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return <AuthGuard><SettingsContent /></AuthGuard>;
}
