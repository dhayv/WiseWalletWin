import React from 'react';

const ErrorMessage = ({ messages = [] }) => (
  <div>
    {messages.map((message, index) => (
      <p key={index} className='has-text-weight-bold has-text-danger'>
        {message}
      </p>
    ))}
  </div>
);

export default ErrorMessage;
