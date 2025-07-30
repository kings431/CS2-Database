'use client';

import React, { useState, useEffect } from 'react';
import SkinViewerFallback from './SkinViewerFallback';

interface SkinViewerProps {
  model?: string;
  skin?: string;
  float?: number;
  stickers?: (string | null)[];
  className?: string;
  // New props for screenshot integration
  itemName?: string;
  category?: string;
  wear?: string;
  pattern?: number;
}

// Client-only wrapper component
const ClientOnlySkinViewer: React.FC<SkinViewerProps> = (props) => {
  const [isClient, setIsClient] = useState(false);
  const [SkinViewerComponent, setSkinViewerComponent] = useState<React.ComponentType<SkinViewerProps> | null>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Dynamically import the actual SkinViewer component only on client
    const loadSkinViewer = async () => {
      try {
        const { default: ActualSkinViewer } = await import('./SkinViewerClient');
        setSkinViewerComponent(() => ActualSkinViewer);
      } catch (error) {
        console.error('Failed to load SkinViewer:', error);
        setHasError(true);
      }
    };

    loadSkinViewer();
  }, []);

  // Show fallback while loading or if there's an error
  if (!isClient || !SkinViewerComponent || hasError) {
    return (
      <SkinViewerFallback
        model={props.model || 'ak47'}
        skin={props.skin || 'redline'}
        float={props.float || 0.0}
        stickers={props.stickers || [null, null, null, null]}
        itemName={props.itemName}
        category={props.category}
        wear={props.wear}
        pattern={props.pattern}
      />
    );
  }

  return <SkinViewerComponent {...props} />;
};

export default ClientOnlySkinViewer; 