import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { GoogleOAuthProvider } from '@react-oauth/google';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

  <BrowserRouter>
    <Provider store={store}>

      {/* <StrictMode> */}
      <GoogleOAuthProvider clientId={process.env.REACT_APP_CLIENT_ID}>
        <App />
      </GoogleOAuthProvider>
      {/* </StrictMode> */}
    </Provider>
  </BrowserRouter>

);

reportWebVitals();
