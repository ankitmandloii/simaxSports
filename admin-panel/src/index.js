import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import '../src/admin/globalPolaris.css'; // Ensure Polaris styles are imported
import App from './App';
import reportWebVitals from './reportWebVitals';
import '@shopify/polaris/build/esm/styles.css';
import { store } from '../src/redux/store';
import { Provider } from 'react-redux';
import { AppProvider } from '@shopify/polaris';



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(


  <Provider store={store}>
    <AppProvider i18n={{}}>
      <StrictMode>
        <App />
      </StrictMode>
    </AppProvider>
  </Provider>


);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
