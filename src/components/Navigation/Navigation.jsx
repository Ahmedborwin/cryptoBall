import React from "react";
import NavLink from "./_components/NavLink";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useChainId } from 'wagmi';
import useTokenBalance from "../../hooks/useTokenBalance"; // Adjust the import path
import Token_AddressList from "../../config/token_AddressList"

const Navigation = () => {
  const { address: account } = useAccount();
  const chainId = useChainId()
  const { balance: tokenBalance, error: tokenBalanceError } = useTokenBalance(account, Token_AddressList[chainId]);

  return (
    <div
      className="flex max-w-[1240px] justify-between max-sm:justify-center items-center
    bg-[#00000073] mx-auto px-8 py-4 max-lg:mx-2 rounded-[9px] mt-6"
    >
      <div className="flex justify-start items-center gap-x-8 gap-y-8 max-md:gap-3 max-sm:hidden">
        <NavLink to="/team-stats">Team Stats</NavLink>
        <NavLink to="/team-tactics">Team Tactics</NavLink>
        <NavLink to="/loot-open">Open loot</NavLink>
        <NavLink to="/match">Match</NavLink>
        {/* <NavLink to="/season">Season</NavLink> */}
      </div>

      <div className="flex items-center">
        {account && (
          <div className="bg-white text-black px-4 py-2 rounded-full mr-4">
            {tokenBalance ? `${tokenBalance} CBT` : 'Loading...'}
          </div>
        )}
        <ConnectButton />
      </div>
      {tokenBalanceError && <div className="ml-4 text-red-500">{tokenBalanceError}</div>}
    </div>
  );
};

export default Navigation;
