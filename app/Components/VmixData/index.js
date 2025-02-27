'use client';
import React, { useState, useEffect } from 'react';

export default function VmixData() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('https://awsvmixcontroller.tailabbf6c.ts.net/vmix')
      .then((response) => response.text())
      .then((str) => new window.DOMParser().parseFromString(str, 'text/xml'))
      .then((xml) => {
        const inputs = Array.from(xml.querySelectorAll('input')).map((input) => ({
          title: input.getAttribute('title'),
          key: input.getAttribute('key'),
          number: input.getAttribute('number'),
        }));
        setData(inputs);
      })
      .catch((error) => console.error('Error fetching vMix data:', error));
  }, []);

  return (
    <div>
      <h1>vMix Inputs</h1>
      {data ? (
        <ul>
          {data.map((input, index) => (
            <li key={index}>
              <strong>{input.title}</strong> (Input #{input.number}, Key: {input.key})
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
