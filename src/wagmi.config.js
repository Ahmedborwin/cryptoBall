import "@rainbow-me/rainbowkit/styles.css"
import { arbitrumSepolia } from "wagmi/chains"
import { getDefaultConfig } from "@rainbow-me/rainbowkit"
import { createConfig, http } from "wagmi"

const config = createConfig({
  chains: [arbitrumSepolia],
  transports: {
    [arbitrumSepolia.id]: http("https://arb-sepolia.g.alchemy.com/v2/QwJEwuI9QIfZwIciL4cTdX9nsG3pJbgG"),
  }, // If your dApp uses server side rendering (SSR)
})

export { config }
