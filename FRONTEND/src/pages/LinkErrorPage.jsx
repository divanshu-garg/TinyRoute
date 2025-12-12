import { useParams } from '@tanstack/react-router';
import React from 'react';

const LinkErrorPage = () => {
   const { reason } = useParams({ from: "/error/$reason" });
    let icon, title, message;

  if (reason === 'expired') {
    icon = '⏰';
    title = 'Link Expired';
    message = 'This shortened link has expired and is no longer available.';
  } else if (reason === 'max_clicks') {
    icon = '🚫';
    title = 'Link Limit Reached';
    message = 'This link has reached its maximum number of clicks.';
  } else if (reason === 'not_found') {
    icon = '❓';
    title = 'Link Not Found';
    message = 'The shortened link you requested does not exist.';
  } else {
    icon = '⚠️';
    title = 'Something Went Wrong';
    message = 'An error occurred while processing your request.';
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6">
      <div className="max-w-sm sm:max-w-md w-full bg-white rounded-lg shadow-sm border border-gray-200 p-5 sm:p-8 text-center mx-3">
        <div className="text-4xl sm:text-6xl mb-4 inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gray-100 text-gray-700 mx-auto">{icon}</div>
        <h1 className="text-lg sm:text-2xl font-semibold text-gray-900 mb-1">{title}</h1>
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
};

export default LinkErrorPage;