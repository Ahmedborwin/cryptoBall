import { useEffect, useState, useMemo } from "react"
import useContractRead from "../hooks/useContractRead"
import useContractReadMultiple from "../hooks/useContractReadMultiple"
import NFT_AddressList from "../config/NFT_AddressList.json"
import CBNFT_ABI from "../config/NFTAbi.json"
import Manager_AddressList from "../config/Manager_AddressList.json"
import MM_ABI from "../config/managerAbi.json"
import useGetIPFSData from "../hooks/useGetIPFSData"

const CBNFT_ADDRESS = NFT_AddressList[421614]
const address = ""

const useGetManagerPlayers = () => {
  const [playersMetadata, setPlayersMetadata] = useState([])

  const ipfsData = useGetIPFSData()

  const {
    data: tokenCounter,
    loading: loadingTokenCounter,
    error: errorTokenCounter,
  } = useContractRead(CBNFT_ADDRESS, CBNFT_ABI, "s_tokenCounter")

  const tokenIds = useMemo(() => {
    return Array.from({ length: tokenCounter ? tokenCounter.toNumber() : 0 }, (_, i) => i)
  }, [tokenCounter])

  const {
    data: playerIndices,
    loading: loadingPlayerIndices,
    error: errorPlayerIndices,
  } = useContractReadMultiple(CBNFT_ADDRESS, CBNFT_ABI, "getBasePlayerIndexFromId", tokenIds)

  useEffect(() => {
    if (playerIndices) {
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