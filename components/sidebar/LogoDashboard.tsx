import React from 'react';

const SpaceDashboardIcon = ({ width = "24px", height = "24px", fill = "#e8eaed" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    enableBackground="new 0 0 24 24"
    height={height}
    viewBox="0 0 24 24"
    width={width}
    fill={fill}
  >
    <rect fill="none" height="24" width="24"/>
    <path d="M11,21H5c-1.1,0-2-0.9-2-2V5c0-1.1,0.9-2,2-2h6V21z M13,21h6c1.1,0,2-0.9,2-2v-7h-8V21z M21,10V5c0-1.1-0.9-2-2-2h-6v7H21z"/>
  </svg>
);

export default SpaceDashboardIcon;
