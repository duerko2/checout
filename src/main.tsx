import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <div className="container">
  <React.StrictMode>
    <App />
  </React.StrictMode>
</div>
)
