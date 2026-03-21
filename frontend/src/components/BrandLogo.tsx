'use client';

import React from 'react';

type BrandLogoProps = {
  compact?: boolean;
};

export default function BrandLogo({ compact = false }: BrandLogoProps) {
  return (
    <>
      <div className={`brand-mark ${compact ? 'compact' : ''}`} aria-hidden="true">
        <img src="/veda-logo.svg" alt="VedaAI logo" className="brand-mark-image" />
      </div>
      <div className={`brand-wordmark ${compact ? 'compact' : ''}`}>VedaAI</div>
    </>
  );
}
