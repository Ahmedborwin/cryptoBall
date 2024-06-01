import { http, createConfig } from "wagmi"
import { arbitrumSepolia, mainnet, sepolia } from "wagmi/chains"

export const configureApp = createConfig({
  chains: [arbitrumSepolia, sepolia],
  transports: {
    [arbitrumSepolia]: http(`https://arb-sepolia.g.alchemy.com/v2/vD6QwCUWLfCBxRT2A6CwgATSQpqc9w8G`),
    [sepolia.id]: http(),
  },
})
