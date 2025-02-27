'use client';
import React, { useState } from 'react';

import IpContainer from './Components/IpContainer';
import TimerController from './Components/TimerController';
import VmixData from './Components/VmixData';

export default function Home() {
  const [ipAddress, setIpAddress] = useState('127.0.0.1');
  const [connected, setConnected] = useState(false);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] p-10 grid-cols-10 items-center justify-items-center min-h-screen gap-16 font-[family-name:var(--font-geist-sans)]">
      <div className="whitespace-nowrap col-start-3 row-start-1 col-span-2">
        <IpContainer ipAddress={ipAddress} setIpAddress={setIpAddress} connected={connected} setConnected={setConnected} />
      </div>
      <main className="col-start-6 row-start-2 items-center sm:items-start">
        {!connected ? (
          <div className="col-start-6 row-start-2 whitespace-nowrap text-center">
            <h1 className="text-4xl col-start-6 row-start-1">vMix Timer Controller</h1>
            <p>Connect to vMix server</p>
          </div>
        ) : (
          <TimerController ipAddress={ipAddress} />
        )}
      </main>
      <div>
        <VmixData />
      </div>
      <footer className="row-start-3 col-start-6 whitespace-nowrap">
        <p>
          ILJ STREAMING <span>{new Date().getFullYear()}</span>
        </p>
      </footer>
    </div>
  );
}
