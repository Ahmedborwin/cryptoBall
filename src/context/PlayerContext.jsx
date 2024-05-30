// PlayersContext.js
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import useContractRead from '../hooks/useContractRead';
import useContractReadMultiple from '../hooks/useContractReadMultiple';
import NFT_AddressList from '../config/NFT_AddressList.json';
import CBNFT_ABI from '../config/NFTAbi.json';
import useGetIPFSData from '../hooks/useGetIPFSData';
import useWalletConnect from '../hooks/useWalletConnect';
import useContractReadIsOwner from '../hooks/useContractReadIsOwner';

const PlayersContext = createContext();

export const PlayersProvider = ({ children }) => {
  const [playersMetadata, setPlayersMetadata] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const ipfsData = useGetIPFSData();
  const { chainId } = useWalletConnect();

  const {
    data: tokenCounter,
    loading: loadingTokenCounter,
    error: errorTokenCounter,
  } = useContractRead(NFT_AddressList[chainId], CBNFT_ABI, 's_tokenCounter');

  const tokenIds = useMemo(() => {
    return Array.from({ length: tokenCounter ? tokenCounter.toNumber() : 0 }, (_, i) => i);
  }, [tokenCounter]);

  const {
    data: ownedTokenIds,
    loading: loadingOwners,
    error: errorOwners,
  } = useContractReadIsOwner(NFT_AddressList[chainId], CBNFT_ABI, 'isNFTOwner', tokenIds, [
    '0x5f2AF68dF96F3e58e1a243F4f83aD4f5D0Ca6029',
  ]);

  const {
    data: playerIndices,
    loading: loadingPlayerIndices,
    error: errorPlayerIndices,
  } = useContractReadMultiple(NFT_AddressList[chainId], CBNFT_ABI, 'getBasePlayerIndexFromId', ownedTokenIds);

  useEffect(() => {
    if (playerIndices.length && ownedTokenIds.length && Object.keys(ipfsData).length) {
      const newPlayersMetadata = playerIndices.map((player, index) => {
        const playerIndex = player.toString();
        return { id: ownedTokenIds[index], ...ipfsData[playerIndex] };
      });
      setPlayersMetadata(newPlayersMetadata);
      setLoading(false);
    }
  }, [playerIndices, ipfsData, ownedTokenIds]);

  return (
    <PlayersContext.Provider value={{ playersMetadata, loading, error }}>
      {children}
    </PlayersContext.Provider>
  );
};

export const usePlayers = () => {
  return useContext(PlayersContext);
};
