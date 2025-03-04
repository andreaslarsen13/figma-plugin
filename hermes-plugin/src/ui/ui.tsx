import * as React from 'react';
import { useState, useEffect } from 'react';
import * as ReactDOM from 'react-dom';
import './ui.css';

const App: React.FC = () => {
  // State for export options
  const [options, setOptions] = useState({
    includeScreenshot: true,
    includeHierarchy: true,
    includeMeasurements: true,
    includeStyles: true,
    includeStructure: true,
    outputFormat: 'claude'
  });
  
  // State for UI
  const [isExporting, setIsExporting] = useState(false);
  const [exportResult, setExportResult] = useState('');
  const [error, setError] = useState('');
  
  // Listen for messages from the plugin
  useEffect(() => {
    window.onmessage = (event) => {
      const message = event.data.pluginMessage;
      
      if (message.type === 'exportComplete') {
        setIsExporting(false);
        setExportResult(message.data);
      } else if (message.type === 'error') {
        setIsExporting(false);
        setError(message.message);
      }
    };
  }, []);
  
  // Handle export button click
  const handleExport = () => {
    setIsExporting(true);
    setExportResult('');
    setError('');
    
    parent.postMessage({
      pluginMessage: {
        type: 'export',
        options
      }
    }, '*');
  };
  
  // Handle option changes
  const handleOptionChange = (option: string, value: boolean | string) => {
    setOptions({
      ...options,
      [option]: value
    });
  };
  
  // Handle checkbox changes
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    handleOptionChange(name, checked);
  };
  
  // Handle format selection
  const handleFormatChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    handleOptionChange('outputFormat', e.target.value);
  };
  
  // Handle copy to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(exportResult).then(() => {
      alert('Copied to clipboard!');
    });
  };
  
  return (
    <div className="wrapper">
      <h1>Hermes: Design-to-Claude Exporter</h1>
      <div className="spacer"></div>
      
      <h3>Export Options</h3>
      <div className="spacer-small"></div>
      
      <div className="checkbox-group">
        <label>
          <input
            type="checkbox"
            name="includeScreenshot"
            checked={options.includeScreenshot}
            onChange={handleCheckboxChange}
          />
          Include Screenshots
        </label>
        
        <label>
          <input
            type="checkbox"
            name="includeHierarchy"
            checked={options.includeHierarchy}
            onChange={handleCheckboxChange}
          />
          Include Hierarchy
        </label>
        
        <label>
          <input
            type="checkbox"
            name="includeMeasurements"
            checked={options.includeMeasurements}
            onChange={handleCheckboxChange}
          />
          Include Measurements
        </label>
        
        <label>
          <input
            type="checkbox"
            name="includeStyles"
            checked={options.includeStyles}
            onChange={handleCheckboxChange}
          />
          Include Styles
        </label>
        
        <label>
          <input
            type="checkbox"
            name="includeStructure"
            checked={options.includeStructure}
            onChange={handleCheckboxChange}
          />
          Include Structure
        </label>
      </div>
      
      <div className="spacer-small"></div>
      <h3>Output Format</h3>
      <div className="spacer-small"></div>
      
      <select
        value={options.outputFormat}
        onChange={handleFormatChange}
        className="select"
      >
        <option value="json">JSON</option>
        <option value="markdown">Markdown</option>
        <option value="claude">Claude</option>
      </select>
      
      <div className="spacer"></div>
      
      <button
        onClick={handleExport}
        disabled={isExporting}
        className="button primary"
      >
        {isExporting ? 'Exporting...' : 'Export Design'}
      </button>
      
      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}
      
      {exportResult && (
        <div className="success-message">
          <h3>Export Complete!</h3>
          <div className="spacer-small"></div>
          <textarea
            readOnly
            value={exportResult}
            rows={10}
            className="textarea"
          />
          <div className="spacer-small"></div>
          <button onClick={handleCopy} className="button secondary">
            Copy to Clipboard
          </button>
        </div>
      )}
    </div>
  );
};

// Render the app
ReactDOM.render(<App />, document.getElementById('root'));

// Export for bundling
export const __html__ = '<div id="root"></div>'; 