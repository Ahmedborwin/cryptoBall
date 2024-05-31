import React, { createContext, useContext, useState } from 'react';
import Manager_AddressList from '../config/Manager_AddressList.json';
import MM_ABI from '../config/managerAbi.json';
import { useAccount, useChainId, useReadContract } from 'wagmi';

const PlayerRosterContext = createContext();

export const usePlayerRoster = () => useContext(PlayerRosterContext);

export const PlayerRosterProvider = ({ children }) => {
  const chainId = useChainId()
  const account = useAccount()

  const { data: playerRoster, loading: loadingPlayerRoster, error: errorPlayerRoster } = useReadContract({
    address: Manager_AddressList[chainId],
    abi: MM_ABI,
    functionName: 'getRosterForPlayer',
    args: [account.address]
  });

  return (
    <PlayerRosterContext.Provider value={{ playerRoster, loadingPlayerRoster, errorPlayerRoster }}>
      {children}
    </PlayerRosterContext.Provider>
  );
};
