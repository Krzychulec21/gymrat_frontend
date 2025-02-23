import React from 'react';
import {createRoot} from 'react-dom/client';
import App from './App';
import './index.css';
import {AuthProvider} from "./context/AuthContext";
import './i18n';

if (window.TrustedTypes) {
    window.TrustedTypes.createPolicy('default', {
        createHTML: (string) => string,
        createScript: (string) => string,
        createScriptURL: (string) => string,
    });
}

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
    <React.StrictMode>
        <AuthProvider>
            <App/>
        </AuthProvider>
    </React.StrictMode>,
);
