import { useEffect, useState } from "react"
import useContractRead from "../hooks/useContractRead"
import useContractReadMultiple from "../hooks/useContractReadMultiple"
import useTokenIds from "../hooks/useTokenIds"
import NFT_AddressList from "../config/NFT_AddressList.json"
import CBNFT_ABI from "../config/NFTAbi.json"
import Manager_AddressList from "../config/Manager_AddressList.json"
import MM_ABI from "../config/managerAbi.json"
import useWalletConnect from "../hooks/useWalletConnect"
import useGetIPFSData from "../hooks/useGetIPFSData"

const CBNFT_ADDRESS = NFT_AddressList[421614]
const MM_ADDRESS = Manager_AddressList[421614]
const address = ""

const useGetManagerPlayers = () => {
  const [playersMetadata, setPlayersMetadata] = useState([])

  const ipfsData = useGetIPFSData()

  // const {
  //   data: manager,
  //   loading: loadingManager,
  //   error: errorManager
  // } = useContractRead(MM_ADDRESS, MM_ABI, "ManagerStats")

  // const {
  //   data: tokenCounter,
  //   loading: loadingTokenCounter,
  //   error: errorTokenCounter,
  // } = useContractRead(CBNFT_ADDRESS, CBNFT_ABI, "s_tokenCounter")

  // const tokenIds = useTokenIds(tokenCounter)
  // console.log(tokenIds, "@@@@tokenIds")

  // const {
  //   data: owners,
  //   loading: loadingOwners,
  //   error: errorOwners,
  // } = useContractReadMultiple(
  //   CBNFT_ADDRESS,
  //   CBNFT_ABI,
  //   "isNFTOwner",
  //   [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  //   ["0x5f2AF68dF96F3e58e1a243F4f83aD4f5D0Ca6029"]
  // )

  const tokenIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]

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
  }, [playerIndices])

  return { playersMetadata, loadingPlayersMetadata: loadingPlayerIndices, errorPlayerMetadata: errorPlayerIndices }
}

export default useGetManagerPlayers
