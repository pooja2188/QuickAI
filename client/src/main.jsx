// import {ClerkProvider} from '@clerk/react';
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'
// import { BrowserRouter } from 'react-router-dom'

// createRoot(document.getElementById('root')).render(
//   <BrowserRouter>
//      <ClerkProvider afterSignOutUrl="/">
//       <App />
//     </ClerkProvider>
//   </BrowserRouter>,
// )

import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
// Import from @clerk/clerk-react instead of @clerk/react
import { ClerkProvider } from "@clerk/clerk-react";

// Fetch the publishable key from your .env.local file
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error(
    "Missing Publishable Key. Please check your .env.local file.",
  );
}

createRoot(document.getElementById("root")).render(
  <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ClerkProvider>,
);
