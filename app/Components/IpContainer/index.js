'use client';
import React, { useState, useEffect } from 'react';

export default function IpContainer({ setIpAddress, ipAddress, setConnected, connected }) {
  const [useAwsProxy, setUseAwsProxy] = useState(true);

  const DEFAULT_AWS_PROXY_URL = 'https://awsvmixcontroller.tailabbf6c.ts.net/vmix';

  useEffect(() => {
    const savedIpAddress = localStorage.getItem('ipAddress');
    const savedConnected = localStorage.getItem('connected') === 'true';
    const savedUseAwsProxy = localStorage.getItem('useAwsProxy') === 'true';

    // hej

    if (savedUseAwsProxy) {
      setUseAwsProxy(true);
    } else if (savedIpAddress) {
      setIpAddress(savedIpAddress);
    }

    setConnected(savedConnected);
  }, []);

  useEffect(() => {
    if (!useAwsProxy) {
      localStorage.setItem('ipAddress', ipAddress);
    }
  }, [ipAddress, useAwsProxy]);

  useEffect(() => {
    localStorage.setItem('connected', connected);
  }, [connected]);

  useEffect(() => {
    localStorage.setItem('useAwsProxy', useAwsProxy);
  }, [useAwsProxy]);

  // ✅ Function to Check Connection Automatically Every 5 Sec
  const checkConnection = async () => {
    const targetUrl = useAwsProxy ? DEFAULT_AWS_PROXY_URL : ipAddress ? `http://${ipAddress}:8088/api/` : null;

    if (!targetUrl) return;

    try {
      const response = await fetch(targetUrl, { method: 'GET' });
      const text = await response.text();
      const xml = new window.DOMParser().parseFromString(text, 'text/xml');

      if (response.ok && xml.querySelector('vmix')) {
        if (!connected) setConnected(true); // ✅ Only update if status has changed

        // ✅ Fetch system details
        const version = xml.querySelector('version')?.textContent || 'Unknown';

        console.log(`vMix Version: ${version}, System is running`);
      } else {
        if (connected) setConnected(false); // ✅ Prevent unnecessary disconnects
      }
    } catch (error) {
      if (connected) setConnected(false);
      console.error('Error checking vMix connection:', error);
    }
  };

  // ✅ Run `checkConnection` every 5 seconds
  useEffect(() => {
    checkConnection(); // Run immediately on load
    const interval = setInterval(checkConnection, 5000);
    return () => clearInterval(interval);
  }, [ipAddress, useAwsProxy]);

  // ✅ Connect/Disconnect Manually
  const handleConnect = async () => {
    if (connected) {
      setConnected(false);
      return;
    }
    checkConnection();
  };

  return (
    <div className="flex flex-col space-y-2">
      {/* Connection Status Indicator */}
      <div className="flex space-x-2 items-center">
        <div className={`${connected ? 'bg-green-600' : 'bg-red-600'} rounded-full h-3 w-3 transform animate-pulse`} />
        <div>vMix:</div>
        <button className="bg-zinc-200 text-zinc-900 rounded px-2" onClick={handleConnect}>
          {connected ? 'Disconnect' : 'Connect'}
        </button>
      </div>

      {/* IP Address Input (Disabled if using AWS) */}
      {!useAwsProxy && (
        <input
          className="rounded px-2 text-zinc-800 w-full"
          type="text"
          placeholder="Enter vMix IP (e.g., 192.168.0.45)"
          value={ipAddress}
          onChange={(e) => setIpAddress(e.target.value)}
        />
      )}

      {/* Switch Between AWS Proxy and Manual IP */}
      <label className="flex items-center space-x-2">
        <input type="checkbox" checked={useAwsProxy} onChange={() => setUseAwsProxy(!useAwsProxy)} />
        <span>Use AWS Proxy</span>
      </label>
    </div>
  );
}
