import React from 'react'
import ReactDOM from 'react-dom/client'
import 'antd/dist/antd.css';
import 'react-toastify/dist/ReactToastify.css'
import App from './App'
import './index.scss'
import { initializeSocket } from './hooks/useSocket';
import { API_SOCKET } from './utils/constants';

initializeSocket(API_SOCKET);

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
