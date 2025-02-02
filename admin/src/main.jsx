import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import App from './App.jsx'
import { Provider } from 'react-redux';
import store from './Providers/store';
createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App/>
  </Provider>
)
