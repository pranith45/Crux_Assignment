// import logo from './logo.svg';
import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;
import React, { useState } from 'react';
import axios from 'axios';
import Visualization from './components/Visualization';

function App() {
  const [googleSheetsUrl, setGoogleSheetsUrl] = useState('');
  const [messages, setMessages] = useState([]);
  const [sqlResponse, setSqlResponse] = useState('');
  const [visualizationData, setVisualizationData] = useState([
    { name: 'Category A', value: 30 },
    { name: 'Category B', value: 50 },
    { name: 'Category C', value: 20 },
  ]);


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
            <p>There was an error rendering the chart.</p>
            <p>Data: {JSON.stringify(this.props.data)}</p>
            <p>Options: {JSON.stringify(this.props.options)}</p>
          </div>
        );
      }

      return this.props.children;
    }
  }

  // Wrap your Visualization component with the ErrorBoundary
  // <ErrorBoundary>
  //   <Visualization data={visualizationData} />
  // </ErrorBoundary>
  return (
    <div>
      <h1>Crux Application</h1>
      <form onSubmit={handleGoogleSheetsSubmit}>
        <input
          type="text"
          value={googleSheetsUrl}
          onChange={(e) => setGoogleSheetsUrl(e.target.value)}
          placeholder="Enter Google Sheets URL"
        />
        <button type="submit">Import Data</button>
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

  );
}

export default App;
