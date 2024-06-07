import React from 'react';

const AttachMoneyIcon = ({ width = "24px", height = "24px", fill = "#000000" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height={height}
    viewBox="0 0 24 24"
    width={width}
    fill={fill}
  >
    <path d="M0 0h24v24H0z" fill="none"/>
    <path d="M11 15h2v2h-2zM10 7h4v4h-4z" opacity=".3"/>
    <path d="M15 7h-4v4h4v6h-2v-2h-2v4h2v2h-2c-1.1 0-2-.9-2-2v-2H7v2c0 1.1.9 2 2 2h4v2c1.1 0 2-.9 2-2v-4h2v-6h-2V7zM11 15h2v2h-2v-2zM10 7h4v4h-4V7z"/>
  </svg>
);

export default AttachMoneyIcon;
