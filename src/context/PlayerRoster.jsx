import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Manager_AddressList from '../config/Manager_AddressList.json';
import MM_ABI from '../config/managerAbi.json';
import useWalletConnect from '../hooks/useWalletConnect';

const PlayerRosterContext = createContext();

export const usePlayerRoster = () => useContext(PlayerRosterContext);

export const PlayerRosterProvider = ({ children }) => {
  const { chainId, account } = useWalletConnect();
  const [playerRoster, setPlayerRoster] = useState([]);
  const [loadingPlayerRoster, setLoadingPlayerRoster] = useState(true);
  const [errorPlayerRoster, setErrorPlayerRoster] = useState(null);

  useEffect(() => {
    const fetchPlayerRoster = async () => {
      setLoadingPlayerRoster(true);
      setErrorPlayerRoster(null);

      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(Manager_AddressList[chainId], MM_ABI, provider);
        const data = await contract.getRosterForPlayer(account);

        setPlayerRoster(data);
      } catch (error) {
        setErrorPlayerRoster(error.message);
      } finally {
        setLoadingPlayerRoster(false);
      }
    };

    if (account && chainId) {
      fetchPlayerRoster();
    }
  }, [account, chainId]);

  return (
    <PlayerRosterContext.Provider value={{ playerRoster, loadingPlayerRoster, errorPlayerRoster }}>
      {children}
    </PlayerRosterContext.Provider>
  );
};
