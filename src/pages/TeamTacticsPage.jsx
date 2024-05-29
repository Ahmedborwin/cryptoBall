import React, { useState } from "react";
import Manager_AddressList from "../config/Manager_AddressList.json";
import MM_ABI from "../config/managerAbi.json";

// components
import PlayerCard from "../components/PlayerCard";
import TabContainer from "../components/common/Container/Tab/TabContainer";
import TeamFormations from "../components/TeamFormations";
import TeamSquad from "../components/TeamSquad";
import StakeModal from "../components/StakeModal";

// hooks
import useGetManagerPlayers from "../hooks/useGetManagerPlayers";
import useContractRead from "../hooks/useContractRead";
import useContractWrite from "../hooks/useContractWrite";
import useWalletConnect from "../hooks/useWalletConnect";

// utils
import { formations } from "../utils/constants/squad";
import Loading from "../components/Loading";

const TeamTacticsPage = () => {
  const [selectedFormation, setSelectedFormation] = useState("4-4-2");
  const [openStakeDialog, setOpenStakeDialog] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  const { chainId } = useWalletConnect();

  const {
    data: playerRoster,
    loading: loadingPlayerRoster,
    error: errorPlayerRoster,
  } = useContractRead(Manager_AddressList[chainId], MM_ABI, "getRosterForPlayer", [
    "0x5f2AF68dF96F3e58e1a243F4f83aD4f5D0Ca6029",
  ]);

  const { playersMetadata, loadingPlayersMetadata, errorPlayerMetadata } = useGetManagerPlayers();

  const {
    write: setRosterPosition,
    loading: loadingSetRosterPosition,
    errorSetRosterPosition,
  } = useContractWrite(Manager_AddressList[chainId], MM_ABI, "setRosterPosition");

  const handleStakePlayer = (player) => {
    setSelectedPlayer(player);
    setOpenStakeDialog(true);
  };

  const handleStakeConfirm = (position) => {
    console.log("Staking player", selectedPlayer, "at position", position);
    setRosterPosition("0x5f2AF68dF96F3e58e1a243F4f83aD4f5D0Ca6029", "0", selectedPlayer.id, position);
  };

  const isPlayerStaked = (playerId) => {
    return playerRoster?.some((player) => parseInt(player.tokenID) === parseInt(playerId));
  };

  if (loadingPlayerRoster || loadingPlayersMetadata || loadingSetRosterPosition) return <Loading />;

  return (
    <TabContainer>
      <div className="flex flex-col md:flex-row justify-between items-start w-full">
        <div className="flex flex-col w-full md:w-1/2 p-4">
          <TeamFormations {...{ formations, selectedFormation, setSelectedFormation }} />
          <div className="mt-4">
            <TeamSquad {...{ selectedFormation, formations, playerRoster }} />
          </div>
        </div>

        <div className="flex flex-col w-full md:w-1/2 p-4">
          <div className="text-lg text-center">Click a player to add it to the team squad</div>

          <div className="mt-6 overflow-x-auto">
            <div className="flex flex-nowrap gap-4 h-96">
              <div className="grid grid-flow-col auto-cols-max gap-4">
                {playersMetadata.map((player, index) => (
                  <button key={index} onClick={() => handleStakePlayer(player)} className="w-full">
                    <PlayerCard player={player} index={index} isStaked={isPlayerStaked(player.id)} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <StakeModal
        isOpen={openStakeDialog}
        onClose={() => setOpenStakeDialog(false)}
        onStake={handleStakeConfirm}
      />
    </TabContainer>
  );
};

export default TeamTacticsPage;
