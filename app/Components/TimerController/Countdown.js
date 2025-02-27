'use client';

import React, { useState, useEffect, useCallback } from 'react';

export default function Countdown() {
  const [countdown, setCountdown] = useState('Loading...');

  const fetchCountdown = useCallback(async () => {
    try {
      const response = await fetch('http://192.168.0.45:8088/api/');

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
  }, []);

  useEffect(() => {
    fetchCountdown(); // Initial fetch
    const interval = setInterval(fetchCountdown, 1000); // Refresh every second

    return () => clearInterval(interval); // Cleanup interval
  }, [fetchCountdown]);

  return (
    <div>
      <span className="countdown-display text-7xl">{countdown}</span>
    </div>
  );
}
