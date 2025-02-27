'use client';
import React, { useState, useEffect } from 'react';
import Countdown from './Countdown';

export default function TimerController({ ipAddress, useAwsProxy }) {
  const DEFAULT_AWS_PROXY_URL = 'https://awsvmixcontroller.tailabbf6c.ts.net/vmix';

  // Use AWS Proxy or manual IP
  const targetUrl = useAwsProxy
    ? `${DEFAULT_AWS_PROXY_URL}?Function=PauseCountdown&Input=15&SelectedName=Headline.Text`
    : `http://${ipAddress}:8088/api/?Function=PauseCountdown&Input=15&SelectedName=Headline.Text`;

  const pauseTimer = async () => {
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
      <Countdown />
      <button className="p-4 bg-white text-zinc-700 whitespace-nowrap" onClick={pauseTimer}>
        Pause Timer on Input 15
      </button>
    </div>
  );
}
