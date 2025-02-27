'use client';
import React, { useState, useEffect } from 'react';

export default function IpContainer({ setIpAddress, ipAddress, setConnected, connected }) {
  const [useAwsProxy, setUseAwsProxy] = useState(true);

  const DEFAULT_AWS_PROXY_URL = 'https://awsvmixcontroller.tailabbf6c.ts.net/vmix';

  useEffect(() => {
    const savedIpAddress = localStorage.getItem('ipAddress');
    const savedConnected = localStorage.getItem('connected') === 'true';
    const savedUseAwsProxy = localStorage.getItem('useAwsProxy') === 'true';

    if (savedIpAddress) {
      setIpAddress(savedIpAddress);
    }
    setConnected(savedConnected);
    setUseAwsProxy(savedUseAwsProxy);
  }, []);

  useEffect(() => {
    localStorage.setItem('ipAddress', ipAddress);
  }, [ipAddress]);

  useEffect(() => {
    localStorage.setItem('connected', connected);
  }, [connected]);

  useEffect(() => {
    localStorage.setItem('useAwsProxy', useAwsProxy);
  }, [useAwsProxy]);

  // ✅ Function to Check Connection Automatically Every 5 Sec
  const checkConnection = async () => {
    const targetUrl = useAwsProxy ? DEFAULT_AWS_PROXY_URL : `http://${ipAddress}:8088/api`;

    try {
      const response = await fetch(targetUrl, { method: 'GET' });
      const text = await response.text();

      if (response.ok && text.includes('<vmix>')) {
        setConnected(true); // ✅ Only set to true if vMix XML is returned
      } else {
        setConnected(false);
      }
    } catch (error) {
      setConnected(false);
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
      <input
        className="rounded px-2 text-zinc-800 w-full"
        type="text"
        placeholder="Enter vMix IP (e.g., 192.168.0.45)"
        value={useAwsProxy ? DEFAULT_AWS_PROXY_URL : ipAddress}
        disabled={useAwsProxy} // Disable if AWS Proxy is selected
        onChange={(e) => setIpAddress(e.target.value)}
      />

      {/* Switch Between AWS Proxy and Manual IP */}
      <label className="flex items-center space-x-2">
        <input type="checkbox" checked={useAwsProxy} onChange={() => setUseAwsProxy(!useAwsProxy)} />
        <span>Use AWS Proxy</span>
      </label>
    </div>
  );
}
