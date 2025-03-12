'use client';

import React from 'react';
import Countdown from './Countdown';

export default function TimerController({ baseUrl, ipAddress, useAwsProxy }) {
  const isAwsProxy = useAwsProxy !== undefined ? useAwsProxy : true;

  console.debug({ baseUrl, isAwsProxy });

  // Function to Fetch Input Key for Input #15
  const fetchInputKey = async () => {
    if (!baseUrl) {
      console.debug('Skipping fetchInputKey: No valid API URL');
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

      if (input) {
        return input.getAttribute('key');
      } else {
        console.error('Input 15 not found');
        return null;
      }
    } catch (error) {
      console.error('Error fetching input key:', error);
      return null;
    }
  };

  //  Function to Pause Timer (Now Calls `fetchInputKey` on Click)
  const pauseTimer = async () => {
    const key = await fetchInputKey();
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
      <button className="p-4 bg-white text-zinc-700 whitespace-nowrap" onClick={pauseTimer} disabled={!baseUrl}>
        Pause Timer
      </button>
    </div>
  );
}
