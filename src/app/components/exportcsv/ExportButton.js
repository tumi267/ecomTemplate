'use client';

import React from 'react';

const ExportButton = ({ api, name }) => {
  const handleExport = async () => {
    try {
      const response = await fetch(`/api/${api}`);
      if (!response.ok) {
        alert('Failed to export data');
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `${name || 'export'}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
      alert('An error occurred while exporting.');
    }
  };

  return (
    <button
      onClick={handleExport}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      Export {name || 'Data'} CSV
    </button>
  );
};

export default ExportButton;