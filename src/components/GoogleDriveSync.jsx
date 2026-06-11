import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { HardDrive, Check, X, Loader2 } from 'lucide-react';

const DRIVE_CONNECTOR_ID = '6a2a6df2e3b39da37f1f47cc';

export default function GoogleDriveSync({ onStatusChange }) {
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);

  const checkConnection = async () => {
    try {
      // Try a minimal Drive API call to verify connection
      await base44.functions.invoke('uploadPdfToDrive', {
        pdfBase64: null, fileName: null, _checkOnly: true
      });
      setConnected(true);
      if (onStatusChange) onStatusChange(true);
    } catch {
      // If it fails due to missing params but not auth, still connected
      // We'll detect "not connected" by specific error
      setConnected(false);
      if (onStatusChange) onStatusChange(false);
    }
  };

  useEffect(() => {
    base44.auth.isAuthenticated().then(async (authed) => {
      if (authed) {
        // Check if user has a Drive connection by trying to get status
        try {
          const url = await base44.connectors.connectAppUser(DRIVE_CONNECTOR_ID);
          // If we can get URL, check actual connection via a lightweight test
          setConnected(false);
        } catch {
          setConnected(false);
        }
      }
      setLoading(false);
    });
  }, []);

  const handleConnect = async () => {
    setConnecting(true);
    const url = await base44.connectors.connectAppUser(DRIVE_CONNECTOR_ID);
    const popup = window.open(url, '_blank');
    const timer = setInterval(async () => {
      if (!popup || popup.closed) {
        clearInterval(timer);
        // After OAuth, mark as connected
        setConnected(true);
        setConnecting(false);
        if (onStatusChange) onStatusChange(true);
      }
    }, 500);
  };

  const handleDisconnect = async () => {
    await base44.connectors.disconnectAppUser(DRIVE_CONNECTOR_ID);
    setConnected(false);
    if (onStatusChange) onStatusChange(false);
  };

  if (loading) return null;

  return (
    <div className="flex items-center gap-2">
      {connected ? (
        <>
          <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
            <Check className="w-3.5 h-3.5" />
            Google Drive verbunden
          </span>
          <button
            onClick={handleDisconnect}
            className="text-xs text-muted-foreground hover:text-destructive transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </>
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={handleConnect}
          disabled={connecting}
          className="gap-1.5 text-xs h-8"
        >
          {connecting ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <HardDrive className="w-3.5 h-3.5" />
          )}
          Google Drive verbinden
        </Button>
      )}
    </div>
  );
}