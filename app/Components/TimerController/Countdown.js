'use client';

import React, { useState, useEffect, useCallback } from 'react';

export default function Countdown({ ipAddress, useAwsProxy }) {
  const [countdown, setCountdown] = useState('Loading...');

  const DEFAULT_AWS_PROXY_URL = 'https://awsvmixcontroller.tailabbf6c.ts.net/vmix';

  // ✅ Ensure API endpoint is valid before making requests
  const baseUrl = useAwsProxy ? DEFAULT_AWS_PROXY_URL : ipAddress ? `http://${ipAddress}:8088/api/` : null; // Prevents invalid requests

  const fetchCountdown = useCallback(async () => {
    if (!baseUrl) {
      console.warn('Countdown API URL is missing.');
      return;
    }

    try {
      const response = await fetch(baseUrl);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const text = await response.text();
      const parser = new DOMParser();
      const xml = parser.parseFromString(text, 'text/xml');

      // Find input with number="15"
      const input = Array.from(xml.querySelectorAll('input')).find((el) => el.getAttribute('number') === '15');

      if (!input) {
        throw new Error('Input 15 not found');
      }

      // Find the "Headline.Text" value in the input
      const headlineText = input.querySelector('text[name="Headline.Text"]');

      setCountdown(headlineText ? headlineText.textContent : 'N/A');
    } catch (error) {
      console.error('Error fetching countdown:', error);
      setCountdown('Error');
    }
  }, [baseUrl]);

  useEffect(() => {
    if (baseUrl) {
      fetchCountdown(); // Initial fetch
      const interval = setInterval(fetchCountdown, 1000); // Refresh every second

      return () => clearInterval(interval); // Cleanup interval
    }
  }, [fetchCountdown, baseUrl]);

  return (
    <div>
      <span className="countdown-display text-7xl">{baseUrl ? countdown : 'Waiting for connection...'}</span>
    </div>
  );
}
