import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store.ts";
import App from "./App.tsx";
import "./index.css";
import { GoogleOAuthProvider } from '@react-oauth/google';


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
    <GoogleOAuthProvider clientId="301176076124-askkdam3lrg5010vj84dtvv21olak92g.apps.googleusercontent.com">
        <App />
    </GoogleOAuthProvider>
    </Provider>
  </React.StrictMode>,
);
