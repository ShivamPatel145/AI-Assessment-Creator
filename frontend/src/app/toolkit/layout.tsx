import React from 'react';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import BottomNav from '@/components/BottomNav';

export default function ToolkitLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <TopBar title="AI Teacher's Toolkit" />
        <div className="page-container">
          {children}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}