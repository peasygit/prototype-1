'use client';

import { useEffect, useState } from 'react';
import { api } from '@/utils/api';

export default function DebugInfo() {
  const [status, setStatus] = useState<'checking' | 'ok' | 'error'>('checking');
  const [apiUrl, setApiUrl] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Get the API URL from environment or default
    const url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
    setApiUrl(url);

    const checkHealth = async () => {
      try {
        // Try to hit the health endpoint
        // Note: We need to use fetch directly to avoid our api wrapper's error handling for this test
        // or just use a simple endpoint
        await fetch(`${url}/health`, { method: 'GET' })
            .then(res => {
                if (res.ok) setStatus('ok');
                else throw new Error(`Status: ${res.status}`);
            });
      } catch (err: any) {
        setStatus('error');
        setError(err.message || 'Connection failed');
      }
    };

    checkHealth();
  }, []);

  // Only show in development or if explicitly enabled, but for this troubleshooting session, always show it.
  // We can make it small and unobtrusive.
  return (
    <div className="fixed bottom-4 right-4 p-4 bg-gray-800 text-white text-xs rounded-lg shadow-lg opacity-90 z-50 max-w-sm break-all">
      <h3 className="font-bold mb-1 border-b border-gray-600 pb-1">Debug Info</h3>
      <div className="space-y-1">
        <p><span className="text-gray-400">API URL:</span> <span className="font-mono">{apiUrl}</span></p>
        <div className="flex items-center gap-2">
            <span className="text-gray-400">Status:</span> 
            {status === 'checking' && <span className="text-yellow-400">Checking...</span>}
            {status === 'ok' && <span className="text-green-400 font-bold">Connected ✅</span>}
            {status === 'error' && <span className="text-red-400 font-bold">Failed ❌ ({error})</span>}
        </div>
        {status === 'error' && (
            <p className="text-red-300 mt-2 border-t border-gray-600 pt-1">
                ⚠️ Backend not reachable. <br/>
                1. Check if backend is running.<br/>
                2. Check if NEXT_PUBLIC_API_URL is set correctly in deployment.<br/>
                3. Ensure HTTPS is used.
            </p>
        )}
      </div>
    </div>
  );
}
