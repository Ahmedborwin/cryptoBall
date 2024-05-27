import React from "react"
import TabContainer from "../components/common/Container/Tab/TabContainer"
import useContractRead from "../hooks/useContractRead"
import useContractReadMultiple from "../hooks/useContractReadMultiple"
import useTokenIds from "../hooks/useTokenIds"
import NFT_AddressList from "../config/NFT_AddressList.json"
import CBNFT_ABI from "../config/NFTAbi.json"
import Manager_AddressList from "../config/Manager_AddressList.json"
import MM_ABI from "../config/managerAbi.json"

const IPFS_HASH = "https://gateway.pinata.cloud/ipfs/QmY59zJCpS9ChBWxBau85XpGYSi5zcpixczARXnfrLFm6k"
const CBNFT_ADDRESS = NFT_AddressList[1337]
const MM_ADDRESS = Manager_AddressList[1337]
const address = ""

const TeamStatsPage = () => {
  const { 
    data: manager,
    loading: loadingManager,
    error: errorManager
  } = useContractRead(MM_ADDRESS, MM_ABI, "ManagerStats")

  const {
    data: tokenCounter,
    loading: loadingTokenCounter,
    error: errorTokenCounter,
  } = useContractRead(CBNFT_ADDRESS, CBNFT_ABI, "s_tokenCounter")

  console.log(CBNFT_ADDRESS, "@@@@address")
  console.log(tokenCounter, "@@@@tokenCounter")
  console.log(errorTokenCounter, "@@@@error")

  const tokenIds = useTokenIds(tokenCounter)
  
  const {
    data: owners,
    loading: loadingOwners,
    error: errorOwners,
  } = useContractReadMultiple(CBNFT_ADDRESS, CBNFT_ABI, "OwnerOf", tokenIds)
  
  const {
    data: playerIndices,
    loading: loadingPlayerIndices,
    error: errorPlayerIndices,
  } = useContractReadMultiple(CBNFT_ADDRESS, CBNFT_ABI, "getBasePlayerIndexFromId", tokenIds)

  const {
    data: tokensAmount,
    loading: loadingTokensAmount,
    error: errorTokensAmount,
  } = useContractReadMultiple(CBNFT_ADDRESS, CBNFT_ABI, "balanceOf", address)

  if (loadingTokenCounter || loadingOwners || loadingPlayerIndices) {
    return <div>Loading...</div>;
  }

  if (errorTokenCounter || errorOwners || errorPlayerIndices) {
    return <div>Error: {errorTokenCounter || errorOwners || errorPlayerIndices}</div>;
  }

  return (
    <TabContainer>
      <div>Player NFTs number: (getURI(manager address) function -- NFT contract [playersTokens])</div>
      <div className="flex flex-col">
        Manager NFT/struct profile: getTokenURI(manager address)
        <span>Games played</span>
        <span>Games won</span>
        <span>*Games tied*</span>
        <span>Games lost</span>
        <span>Goals scored</span>
        <span>*Goals conceded*</span>
      </div>
    </TabContainer>
  )
}

export default TeamStatsPage
