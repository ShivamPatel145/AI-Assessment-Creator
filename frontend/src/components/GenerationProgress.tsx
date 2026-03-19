'use client';

import React from 'react';

interface Props {
  progress: number;
  status: string;
}

export default function GenerationProgress({ progress, status }: Props) {
  const getStatusMessage = () => {
    if (progress < 10) return 'Preparing your assignment...';
    if (progress < 20) return 'Initializing AI engine...';
    if (progress < 30) return 'Building the prompt...';
    if (progress < 50) return 'AI is generating questions...';
    if (progress < 70) return 'Creating sections & formatting...';
    if (progress < 80) return 'Parsing AI response...';
    if (progress < 90) return 'Validating question structure...';
    if (progress < 100) return 'Almost there! Finalizing paper...';
    return 'Complete!';
  };

  if (status === 'completed') {
    return null;
  }

  return (
    <div className="generation-screen fade-in">
      <div className="generation-animation">
        <div className="generation-icon">🧠</div>
      </div>

      <div>
        <h2 className="generation-title">
          {status === 'failed' ? 'Generation Failed' : 'Generating Your Question Paper'}
        </h2>
        <p className="generation-subtitle">
          {status === 'failed'
            ? 'Something went wrong. Please try regenerating.'
            : getStatusMessage()}
        </p>
      </div>

      {status !== 'failed' && (
        <div className="progress-container" style={{ maxWidth: 400 }}>
          <div className="progress-bar-bg">
            <div
              className="progress-bar-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="progress-text">
            <span>{getStatusMessage()}</span>
            <span style={{ fontWeight: 700, color: 'var(--primary-400)' }}>
              {progress}%
            </span>
          </div>
        </div>
      )}

      {status === 'failed' && (
        <p style={{ color: 'var(--danger)', fontSize: 14 }}>
          The AI encountered an error. Please check your API key configuration and try again.
        </p>
      )}
    </div>
  );
}
