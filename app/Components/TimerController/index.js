'use client';
import React from 'react';
import Countdown from './Countdown';

export default function TimerController() {
  const pauseTimer = async () => {
    try {
      const response = await fetch('http://192.168.0.45:8088/api/?Function=PauseCountdown&Input=15&SelectedName=Headline.Text', {
        method: 'GET',
      });

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
