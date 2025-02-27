'use client';
import React, { useState, useEffect } from 'react';
import Countdown from './Countdown';

export default function TimerController({ ipAddress, useAwsProxy }) {
  const DEFAULT_AWS_PROXY_URL = 'https://awsvmixcontroller.tailabbf6c.ts.net/vmix';

  const [inputKey, setInputKey] = useState(null);

  // Determine API endpoint
  const baseUrl = useAwsProxy ? DEFAULT_AWS_PROXY_URL : `http://${ipAddress}:8088/api/`;

  // ✅ Function to fetch the correct input "Key" for Input #15
  const fetchInputKey = async () => {
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

  // Fetch input key on component mount
  useEffect(() => {
    fetchInputKey();
  }, [ipAddress, useAwsProxy]);

  // ✅ Function to pause the countdown
  const pauseTimer = async () => {
    if (!inputKey) {
      alert('Input key not found yet. Please wait.');
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
        disabled={!inputKey} // Disable button until key is loaded
      >
        {inputKey ? 'Pause Timer on Input 15' : 'Loading...'}
      </button>
    </div>
  );
}
