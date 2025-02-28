'use client';

import React, { useState, useEffect } from 'react';
import Countdown from './Countdown';

export default function TimerController({ ipAddress, useAwsProxy }) {
  const DEFAULT_AWS_PROXY_URL = 'https://awsvmixcontroller.tailabbf6c.ts.net/vmix';

  const [inputKey, setInputKey] = useState(null);

  // ✅ Ensure the `ipAddress` is set correctly before making requests
  const baseUrl = useAwsProxy ? DEFAULT_AWS_PROXY_URL : ipAddress ? `http://${ipAddress}:8088/api/` : null; // Prevents errors when `ipAddress` is undefined

  // ✅ Fetch Input Key for Input #15
  const fetchInputKey = async () => {
    if (!baseUrl) return; // Prevents fetch if no valid URL

    try {
      const response = await fetch(baseUrl);
      const text = await response.text();
      const parser = new DOMParser();
      const xml = parser.parseFromString(text, 'text/xml');

      // Find input with number="15"
      const input = Array.from(xml.querySelectorAll('input')).find((el) => el.getAttribute('number') === '15');

      if (input) {
        setInputKey(input.getAttribute('key'));
      } else {
        console.error('Input 15 not found');
      }
    } catch (error) {
      console.error('Error fetching input key:', error);
    }
  };

  // ✅ Fetch input key when component mounts
  useEffect(() => {
    if (baseUrl) {
      fetchInputKey();
    }
  }, [ipAddress, useAwsProxy]);

  // ✅ Function to Pause Timer
  const pauseTimer = async () => {
    if (!inputKey || !baseUrl) {
      alert('Input key not found or connection issue. Please wait.');
      return;
    }

    const targetUrl = `${baseUrl}?Function=PauseCountdown&Input=${inputKey}&SelectedName=Headline.Text`;

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
      <button
        className="p-4 bg-white text-zinc-700 whitespace-nowrap"
        onClick={pauseTimer}
        disabled={!inputKey || !baseUrl} // Prevents clicks if connection is not ready
      >
        {inputKey ? 'Pause Timer on Input 15' : 'Loading...'}
      </button>
    </div>
  );
}
