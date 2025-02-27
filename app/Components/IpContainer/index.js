'use client';
import React, { useState, useEffect } from 'react';

export default function IpContainer() {
  const [connected, setConnected] = useState(false);
  const [ipAddress, setIpAddress] = useState('127.0.0.1');

  useEffect(() => {
    const savedIpAddress = localStorage.getItem('ipAddress');
    const savedConnected = localStorage.getItem('connected') === 'true';
    if (savedIpAddress) {
      setIpAddress(savedIpAddress);
    }
    setConnected(savedConnected);
  }, []);

  useEffect(() => {
    localStorage.setItem('ipAddress', ipAddress);
  }, [ipAddress]);

  useEffect(() => {
    localStorage.setItem('connected', connected);
  }, [connected]);

  const handleConnect = async () => {
    if (connected) {
      // Handle disconnect logic here
      setConnected(false);
      return;
    }

    try {
      const response = await fetch(`http://${ipAddress}:8088/api`, {
        method: 'GET',
      });

      if (response.ok) {
        setConnected(true);
      } else {
        alert('Failed to connect to vMix server');
      }
    } catch (error) {
      alert('Error connecting to vMix server');
    }
  };

  return (
    <div className="flex space-x-2 items-center">
      <div className={`${connected ? 'bg-green-600' : 'bg-red-600'} rounded-full h-3 w-3 transform animate-pulse`} />
      <div>Vmix:</div>
      <input
        className="rounded px-2 text-zinc-800"
        type="text"
        placeholder="127.0.0.1"
        value={ipAddress}
        onChange={(e) => setIpAddress(e.target.value)}
      />
      <button className="bg-zinc-200 text-zinc-900 rounded px-2" onClick={handleConnect}>
        {connected ? 'Disconnect' : 'Connect'}
      </button>
    </div>
  );
}
