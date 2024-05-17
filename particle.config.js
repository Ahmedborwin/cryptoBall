// config/particleConfig.js
import { particleWallet } from "@particle-network/rainbowkit-ext"
import { ParticleNetwork } from "@particle-network/auth"
import {
  injectedWallet,
  rainbowWallet,
  coinbaseWallet,
  metaMaskWallet,
  walletConnectWallet,
  argentWallet,
  trustWallet,
  omniWallet,
  imTokenWallet,
  ledgerWallet,
} from "@rainbow-me/rainbowkit/wallets"

export function getParticleNetwork() {
  return new ParticleNetwork({
    projectId: "226e7537-6d6f-40fd-9bfa-f5b8c7c625af",
    clientKey: "chnzdpBCF5h1s3bZCFmO2P1uW60dZx7BdHghvIVr",
    appId: "767329ee-4b6f-49d6-b23b-f09cb2dbe964",
    chainName: "Ethereum",
    chainId: 1,
    wallet: { displayWalletEntry: true },
  })
}

export function getPopularWallets(chains, particleNetwork) {
  const commonOptions = {
    chains,
    projectId: "fe868524d0ca3fd848aa01a3daefe26b",
  }

  return [
    {
      groupName: "Popular",
      wallets: [
        particleWallet({ chains, authType: "google" }, particleNetwork),
        particleWallet({ chains, authType: "facebook" }, particleNetwork),
        particleWallet({ chains, authType: "apple" }, particleNetwork),
        particleWallet({ chains }, particleNetwork),
        injectedWallet(commonOptions),
        rainbowWallet(commonOptions),
        coinbaseWallet({ appName: "RainbowKit demo", ...commonOptions }),
        metaMaskWallet(commonOptions),
        walletConnectWallet(commonOptions),
      ],
    },
    {
      groupName: "Other",
      wallets: [
        argentWallet(commonOptions),
        trustWallet(commonOptions),
        omniWallet(commonOptions),
        imTokenWallet(commonOptions),
        ledgerWallet(commonOptions),
      ],
    },
  ]
}
