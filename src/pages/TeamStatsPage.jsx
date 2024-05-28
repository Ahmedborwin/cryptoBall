import React from "react"
import Manager_AddressList from "../config/Manager_AddressList.json"
import MM_ABI from "../config/managerAbi.json"

// components
import FormField from "../components/common/Form/FormField"
import TabContainer from "../components/common/Container/Tab/TabContainer"
import PlayerCard from "../components/PlayerCard"
import Loading from "../components/Loading"

// hooks
import useGetManagerPlayers from "../hooks/useGetManagerPlayers"
import useContractRead from "../hooks/useContractRead"
import useWalletConnect from "../hooks/useWalletConnect"

const TeamStatsPage = () => {
  const { chainId } = useWalletConnect()

  const { playersMetadata, loadingPlayersMetadata, errorPlayerMetadata } = useGetManagerPlayers()

  const {
    data: managerStats,
    loading: loadingManagerStats,
    error: errorManagerStats,
  } = useContractRead(Manager_AddressList[chainId], MM_ABI, "ManagerStats", ["0x5f2AF68dF96F3e58e1a243F4f83aD4f5D0Ca6029"])

  if (loadingManagerStats || loadingPlayersMetadata) return <Loading />

  return (
    <TabContainer>
      <div className="mt-20 w-full max-w-md mx-auto overflow-auto max-h-[55vh] p-8 bg-[#00000073] rounded-xl shadow-xl">
        <FormField value={playersMetadata.length || 0}>Number of players</FormField>
        <br />
        <FormField value={managerStats?.activeGames.toString() || 0}>Total Active Games</FormField>
        <br />
        <FormField value={managerStats?.wins || 0}>Games Won</FormField>
        <br />
        <FormField value={managerStats?.losses || 0}>Games Lost</FormField>
        <br />
        <FormField value={managerStats?.totalGoals}>Goals Scored</FormField>
        <br />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6 ml-6">
        {playersMetadata.map((player, index) => (
          <PlayerCard key={`player-${index}`} player={player} index={index} />
        ))}
      </div>
    </TabContainer>
  )
}

export default TeamStatsPage
