import React from 'react';

const ErrorMessage = ({ messages = [] }) => {
  if (messages.length === 0) return null;
  return (
    <div aria-live="polite">
      {messages.map((message, index) => (
        <p key={index} className='has-text-weight-bold has-text-danger'>
          {message}
        </p>
      ))}
    </div>
  );
};


export default ErrorMessage;
