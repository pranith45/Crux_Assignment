// import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';
import axios from 'axios';
import Visualization from './components/Visualization';

function App() {
  const [googleSheetsUrl, setGoogleSheetsUrl] = useState('');
  const [messages, setMessages] = useState([]);
  const [sqlResponse, setSqlResponse] = useState('');
  const [visualizationData, setVisualizationData] = useState([]);


  const handleGoogleSheetsSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:8000/google-sheets-to-db/', { google_sheets_url: googleSheetsUrl });
      setMessages([...messages, 'Data imported from Google Sheets to the database.']);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUserQuery = async (userQuery) => {
    try {
      // visualizationData = 

      const response = await axios.post('http://localhost:8000/chat-interface/', { user_query: userQuery });
      setSqlResponse(response.data.response);
      setVisualizationData(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
      return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
      // Log the error to an error reporting service
      console.error(error, errorInfo);
    }

    render() {
      if (this.state.hasError) {
        return (
          <div>
            <p>{this.state.hasError}</p>
            <p>There was an error rendering the chart.</p>
            <p>Data: {JSON.stringify(this.props.data)}</p>
            <p>Options: {JSON.stringify(this.props.options)}</p>
          </div>
        );
      }

      return this.props.children;
    }
  }

  return (
    <div className='center-container'>
      <div className='container'>
        <h1>Crux Application</h1>
        <form onSubmit={handleGoogleSheetsSubmit}>
          <input
            type="text"
            value={googleSheetsUrl}
            onChange={(e) => setGoogleSheetsUrl(e.target.value)}
            placeholder="Enter Google Sheets URL"
          />
          <div className='container_2'><button type="submit">Import Data</button></div>

        </form>
        <div>
          {messages.map((message, index) => (
            <div key={index}>{message}</div>
          ))}
        </div>
        <div>
          <input
            type="text"
            placeholder="Enter a data query..."
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const userQuery = e.target.value;
                setMessages([...messages, userQuery]);
                handleUserQuery(userQuery);
                e.target.value = '';
              }
            }}
          />
        </div>
        <div>
          <div>{sqlResponse}</div>
          {visualizationData.length > 0 ? (
            <ErrorBoundary>
              <Visualization data={visualizationData} />
            </ErrorBoundary>

          ) : (
            <p>No data available for visualization.</p>
          )}
        </div>
      </div>
    </div>

  );
}

export default App;
