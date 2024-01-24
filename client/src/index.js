import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { store,persistor } from "./redux/store.js";
import { Provider } from "react-redux";
import {PersistGate} from 'redux-persist/integration/react'
import AOS from 'aos';
import 'aos/dist/aos.css';


AOS.init();
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
    <App />
    </PersistGate>
  </Provider>
);
