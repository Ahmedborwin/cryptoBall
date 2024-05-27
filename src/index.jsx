import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"

// Config
import { configureApp } from "./utils/helpers/configureApp"

import { WagmiProvider } from "wagmi"
// css
import "./index.css"

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <WagmiProvider config={configureApp}>
      <App />
    </WagmiProvider>
  </React.StrictMode>
)
