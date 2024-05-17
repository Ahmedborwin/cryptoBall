import { mainnet, polygon, hardhat, sepolia, scrollSepolia, scrollTestnet, polygonMumbai } from "wagmi/chains"
import { configureChains, createConfig } from "wagmi"
import { publicProvider } from "wagmi/providers/public"
import { alchemyProvider } from "wagmi/providers/alchemy"
import { getParticleNetwork, getPopularWallets } from "../../../particle.config"
import { connectorsForWallets } from "@rainbow-me/rainbowkit"

const createConnectors = (wallets) => {
  return connectorsForWallets(wallets)
}

export const configureApp = () => {
  const chainsConfig = [mainnet, polygon, polygonMumbai, hardhat, sepolia, scrollSepolia, scrollTestnet]
  const { chains, publicClient, webSocketPublicClient } = configureChains(chainsConfig, [
    alchemyProvider({ apiKey: "zTPogX-iVpVC1-IGvBRCJYI6hX6DLNKP" }),
    publicProvider(),
  ])

  const particleNetwork = getParticleNetwork()
  const popularWallets = getPopularWallets(chains, particleNetwork)
  const connectors = createConnectors(popularWallets)

  const wagmiClient = createConfig({
    autoConnect: true,
    connectors,
    publicClient,
    webSocketPublicClient,
  })

  return { chains, wagmiClient }
}
