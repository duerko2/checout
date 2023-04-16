import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <div className="container">
        <div className="loader-container">
            <div className="spinner"></div>
        </div>
  <React.StrictMode>
    <App />
  </React.StrictMode>
</div>
)
