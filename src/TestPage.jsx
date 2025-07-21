import React from 'react';

const TestPage = () => {
  return (
    <div style={{ padding: '20px', backgroundColor: 'white', color: 'black' }}>
      <h1>Test Page</h1>
      <p>This is a simple test page to check if React is working.</p>
      <button onClick={() => alert('Button clicked!')}>Test Button</button>
    </div>
  );
};

export default TestPage;

