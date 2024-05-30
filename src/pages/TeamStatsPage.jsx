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

  if (!managerStats || !managerStats.length || !playersMetadata || !playersMetadata.length) return <Loading />

  return (
    <TabContainer>
      <div className="mt-20 w-full max-w-md mx-auto overflow-auto max-h-[55vh] p-8 bg-[#00000073] rounded-xl shadow-xl">
        <FormField value={(playersMetadata && playersMetadata.length) || 0}>Number of players</FormField>
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

      <div className="mt-6 ml-6">
        <h2 className="text-xl font-bold mb-4">Player List</h2>
        <div className="bg-[#00000073] p-4 rounded-xl shadow-xl max-h-[100vh] overflow-auto">
          <ul className="columns-2 md:columns-3 lg:columns-4 space-y-2">
            {playersMetadata.map((player, index) => (
              <li key={`player-${index}`} className="break-inside-avoid mb-2">
                {player.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </TabContainer>
  )
}

export default TeamStatsPage
