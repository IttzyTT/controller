'use client';

import React, { useState, useEffect } from 'react';
import Countdown from './Countdown';

export default function TimerController({ ipAddress, useAwsProxy }) {
  const DEFAULT_AWS_PROXY_URL = 'https://awsvmixcontroller.tailabbf6c.ts.net/vmix';

  const [inputKey, setInputKey] = useState(null);

  // ✅ Ensure `useAwsProxy` is always defined
  const isAwsProxy = useAwsProxy !== undefined ? useAwsProxy : true;

  // ✅ Prevents invalid API calls
  const baseUrl = isAwsProxy ? DEFAULT_AWS_PROXY_URL : ipAddress ? `http://${ipAddress}:8088/api/` : null;

  console.debug({ baseUrl });

  // ✅ Function to Fetch Input Key for Input #15
  const fetchInputKey = async () => {
    if (!baseUrl) {
      console.warn('Skipping fetchInputKey: No valid API URL');
      return null;
    }

    try {
      const response = await fetch(baseUrl);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const text = await response.text();
      const parser = new DOMParser();
      const xml = parser.parseFromString(text, 'text/xml');

      // Find input with number="15"
      const input = Array.from(xml.querySelectorAll('input')).find((el) => el.getAttribute('number') === '15');

      console.debug('KLICKAR');
      console.debug({ input });

      if (input) {
        return input.getAttribute('key'); // ✅ Return key instead of setting state
      } else {
        console.error('Input 15 not found');
        return null;
      }
    } catch (error) {
      console.error('Error fetching input key:', error);
      return null;
    }
  };

  // ✅ Function to Pause Timer (Now Calls `fetchInputKey` on Click)
  const pauseTimer = async () => {
    const key = await fetchInputKey(); // ✅ Fetch key before making API request
    if (!key || !baseUrl) {
      alert('Input key not found or connection issue. Please wait.');
      return;
    }

    const targetUrl = `${baseUrl}?Function=PauseCountdown&Input=${key}&SelectedName=Headline.Text`;

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
      <Countdown ipAddress={ipAddress} useAwsProxy={isAwsProxy} />
      <button
        className="p-4 bg-white text-zinc-700 whitespace-nowrap"
        onClick={pauseTimer} // ✅ Now fetches key onClick before API request
        disabled={!baseUrl} // Prevents clicks if connection is not ready
      >
        Pause Timer on Input 15
      </button>
    </div>
  );
}
