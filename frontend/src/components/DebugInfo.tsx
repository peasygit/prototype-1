'use client';

import { useEffect, useState } from 'react';
import { api } from '@/utils/api';

export default function DebugInfo() {
  const [status, setStatus] = useState<'checking' | 'ok' | 'error'>('checking');
  const [apiUrl, setApiUrl] = useState(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api');
  const [error, setError] = useState('');

  useEffect(() => {
    console.log('DebugInfo mounted'); // Verify mounting
    
    const checkHealth = async () => {
      try {
        // Try to hit the health endpoint
        // Note: We need to use fetch directly to avoid our api wrapper's error handling for this test
        // or just use a simple endpoint
        await fetch(`${apiUrl}/health`, { method: 'GET' })
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

  const isLocalhost = apiUrl.includes('localhost') || apiUrl.includes('127.0.0.1');
  const isDeployed = typeof window !== 'undefined' && !window.location.hostname.includes('localhost');
  const isMisconfigured = isDeployed && isLocalhost;

  // Only show in development or if explicitly enabled, but for this troubleshooting session, always show it.
  // We can make it small and unobtrusive.
  return (
    <div className="fixed bottom-4 right-4 p-4 bg-gray-900 text-white text-xs rounded-lg shadow-2xl opacity-95 z-[9999] max-w-sm break-all border-2 border-white/20">
      <h3 className="font-bold mb-2 border-b border-gray-700 pb-1 flex justify-between items-center">
        <span>Debug Info</span>
        {status === 'ok' ? <span className="text-green-400">●</span> : <span className="text-red-400">●</span>}
      </h3>
      
      <div className="space-y-2">
        <div>
            <p className="text-gray-400 text-[10px] uppercase tracking-wider mb-1">Current API URL</p>
            <p className={`font-mono bg-gray-800 p-1.5 rounded ${isMisconfigured ? 'text-red-300 border border-red-500/50' : 'text-blue-300'}`}>
                {apiUrl}
            </p>
        </div>

        {isMisconfigured && (
             <div className="bg-red-900/30 border border-red-500/50 p-2 rounded text-red-200">
                <p className="font-bold mb-1">⚠️ Configuration Error</p>
                <p>You are on a deployed site but the API is pointing to <strong>localhost</strong>.</p>
                <p className="mt-1">Please set <code>NEXT_PUBLIC_API_URL</code> in your deployment settings and <strong>redeploy</strong>.</p>
             </div>
        )}

        <div className="flex items-center gap-2 pt-1">
            <span className="text-gray-400">Connection:</span> 
            {status === 'checking' && <span className="text-yellow-400">Checking...</span>}
            {status === 'ok' && <span className="text-green-400 font-bold">Connected ✅</span>}
            {status === 'error' && <span className="text-red-400 font-bold">Failed ❌</span>}
        </div>
        
        {status === 'error' && !isMisconfigured && (
            <p className="text-red-300 mt-1 text-[10px]">
                Error: {error}
            </p>
        )}
      </div>
    </div>
  );
}
