import { useEffect, useState, useMemo } from "react"
import useContractRead from "../hooks/useContractRead"
import useContractReadMultiple from "../hooks/useContractReadMultiple"
import NFT_AddressList from "../config/NFT_AddressList.json"
import CBNFT_ABI from "../config/NFTAbi.json"
import Manager_AddressList from "../config/Manager_AddressList.json"
import MM_ABI from "../config/managerAbi.json"
import useGetIPFSData from "../hooks/useGetIPFSData"
import useWalletConnect from "./useWalletConnect"

const useGetManagerPlayers = () => {
  const [playersMetadata, setPlayersMetadata] = useState([])

  const ipfsData = useGetIPFSData()

  const { chainId } = useWalletConnect()

  const {
    data: tokenCounter,
    loading: loadingTokenCounter,
    error: errorTokenCounter,
  } = useContractRead(NFT_AddressList[chainId], CBNFT_ABI, "s_tokenCounter")

  const tokenIds = useMemo(() => {
    return Array.from({ length: tokenCounter ? tokenCounter.toNumber() : 0 }, (_, i) => i)
  }, [tokenCounter])

  //   const {
  //     data: owners,
  //     loading: loadingOwners,
  //     error: errorOwners,
  //   } = useContractReadMultiple(NFT_AddressList[chainId], CBNFT_ABI, "isNFTOwner", tokenIds, [
  //     "0x5f2AF68dF96F3e58e1a243F4f83aD4f5D0Ca6029",
  //   ])
  //   console.log(owners, "@@@@owners")

  const {
    data: playerIndices,
    loading: loadingPlayerIndices,
    error: errorPlayerIndices,
  } = useContractReadMultiple(NFT_AddressList[chainId], CBNFT_ABI, "getBasePlayerIndexFromId", tokenIds)

  useEffect(() => {
    if (playerIndices.length && tokenIds.length && Object.keys(ipfsData).length) {
      const newPlayersMetadata = playerIndices.map((player, index) => {
        const playerIndex = player.toString()
        return { id: tokenIds[index], ...ipfsData[playerIndex] }
      })
      setPlayersMetadata(newPlayersMetadata)
    }
  }, [playerIndices, ipfsData, tokenIds])

  return { playersMetadata, loadingPlayersMetadata: loadingPlayerIndices, errorPlayerMetadata: errorPlayerIndices }
}

export default useGetManagerPlayers
