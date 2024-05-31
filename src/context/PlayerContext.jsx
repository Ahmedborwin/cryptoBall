import React, { createContext, useContext, useState, useEffect, useMemo } from "react"
import { useChainId, useReadContract, useReadContracts } from "wagmi"
import NFT_AddressList from "../config/NFT_AddressList.json"
import CBNFT_ABI from "../config/NFTAbi.json"
import useGetIPFSData from "../hooks/useGetIPFSData"

const PlayersContext = createContext()

const useFetchPlayersData = () => {
  const [playersMetadata, setPlayersMetadata] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const ipfsData = useGetIPFSData()
  const chainId = useChainId()

  const {
    data: tokenCounter,
    isLoading: loadingTokenCounter,
    error: errorTokenCounter,
  } = useReadContract({
    address: NFT_AddressList[chainId],
    abi: CBNFT_ABI,
    functionName: "s_tokenCounter",
    enabled: !!chainId, // only run if chainId is defined
  })

  const tokenIds = useMemo(() => {
    return Array.from({ length: tokenCounter ? parseInt(tokenCounter.toString()) : 0 }, (_, i) => i).filter(
      (id) => id !== 0
    )
  }, [tokenCounter])

  const {
    data: ownedTokenIds,
    isLoading: loadingOwners,
    error: errorOwners,
  } = useReadContracts({
    contracts: tokenIds.map((id) => ({
      address: NFT_AddressList[chainId],
      abi: CBNFT_ABI,
      functionName: "isNFTOwner",
      args: ["0x5f2AF68dF96F3e58e1a243F4f83aD4f5D0Ca6029", id],
    })),
    enabled: tokenIds.length > 0,
  })

  const filteredOwnedTokenIds = useMemo(() => {
    if (!ownedTokenIds) return []
    return ownedTokenIds.map((id, index) => id.result === true && tokenIds[index]).filter((id) => id !== false)
  }, [ownedTokenIds, tokenIds])

  const {
    data: playerIndices,
    isLoading: loadingPlayerIndices,
    error: errorPlayerIndices,
  } = useReadContracts({
    contracts: filteredOwnedTokenIds.map((id) => ({
      address: NFT_AddressList[chainId],
      abi: CBNFT_ABI,
      functionName: "getBasePlayerIndexFromId",
      args: [id],
    })),
    enabled: filteredOwnedTokenIds.length > 0,
  })

  useEffect(() => {
    if (playerIndices && filteredOwnedTokenIds.length && Object.keys(ipfsData).length) {
      const newPlayersMetadata = playerIndices.map((player, index) => {
        const playerIndex = player.result.toString()
        return { id: filteredOwnedTokenIds[index], ...ipfsData[playerIndex] }
      })
      setPlayersMetadata(newPlayersMetadata)
      setLoading(false)
    }
  }, [playerIndices, ipfsData, filteredOwnedTokenIds])

  return {
    playersMetadata,
    loading: loadingTokenCounter || loadingOwners || loadingPlayerIndices,
    error: errorTokenCounter || errorOwners || errorPlayerIndices,
  }
}

export const PlayersProvider = ({ children }) => {
  const playersData = useFetchPlayersData()

  return <PlayersContext.Provider value={playersData}>{children}</PlayersContext.Provider>
}

export const usePlayers = () => {
  return useContext(PlayersContext)
}
