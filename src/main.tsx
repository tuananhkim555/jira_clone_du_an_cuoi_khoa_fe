import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from "./redux/store.ts";
import App from "./pages/App.tsx";
import "./index.css";
import { GoogleOAuthProvider } from '@react-oauth/google';



ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>  
      <Provider store={store}>
        <GoogleOAuthProvider clientId="301176076124-askkdam3lrg5010vj84dtvv21olak92g.apps.googleusercontent.com">
          <PersistGate loading={null} persistor={persistor}>
            <App />
          </PersistGate>
        </GoogleOAuthProvider>
      </Provider>
  </React.StrictMode>,
);
