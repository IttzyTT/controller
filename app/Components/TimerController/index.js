'use client';
import React from 'react';
import Countdown from './Countdown';

export default function TimerController({ ipAddress, useAwsProxy }) {
  const DEFAULT_AWS_PROXY_URL = 'https://awsvmixcontroller.tailabbf6c.ts.net/vmix';

  // ✅ Select API endpoint based on user choice
  const baseUrl = useAwsProxy ? DEFAULT_AWS_PROXY_URL : ipAddress ? `http://${ipAddress}:8088/api/` : null; // Prevents invalid fetches

  const pauseTimer = async () => {
    if (!baseUrl) {
      alert('Connection issue: No valid API URL.');
      return;
    }

    const targetUrl = `${baseUrl}?Function=PauseCountdown&Input=15&SelectedName=Headline.Text`;

    try {
      const response = await fetch(targetUrl, { method: 'GET' });

      if (response.ok) {
        alert('Timer paused successfully');
      } else {
        alert('Failed to pause the timer');
        console.error('Failed response:', response);
      }
    } catch (error) {
      alert('Error pausing the timer');
      console.error('Error:', error);
    }
  };

  return (
    <div className="space-y-3">
      <Countdown ipAddress={ipAddress} useAwsProxy={useAwsProxy} />
      <button
        className="p-4 bg-white text-zinc-700 whitespace-nowrap"
        onClick={pauseTimer}
        disabled={!baseUrl} // ✅ Prevents clicks if connection is not ready
      >
        Pause Timer on Input 15
      </button>
    </div>
  );
}
