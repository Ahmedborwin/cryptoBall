import React from "react"
import NavLink from "./_components/NavLink"
import useWalletConnect from "../../hooks/useWalletConnect"

const Navigation = () => {
  const { account, error, handleWalletConnect, handleWalletDisconnect } = useWalletConnect()

  return (
    <div
      className="flex max-w-[1240px] justify-between max-sm:justify-center items-center
    bg-[#00000073] mx-auto px-8 py-4 max-lg:mx-2 rounded-[9px] mt-6"
    >
      <div className="flex justify-start items-center gap-x-8 gap-y-8 max-md:gap-3 max-sm:hidden">
        <NavLink to="/team-stats">Team Stats</NavLink>
        <NavLink to="/team-tactics">Team Tactics</NavLink>
        <NavLink to="/loot-open">Open loot</NavLink>
        <NavLink to="/season">Season</NavLink>
      </div>

      <div className="flex items-center">
        {account ? (
          <>
            <div className="bg-white text-black px-4 py-2 rounded-full">
              {account.substring(0, 6)}...{account.substring(account.length - 4)}
            </div>
            <button onClick={handleWalletDisconnect} className="bg-red-500 text-white px-4 py-2 ml-4 rounded-full">
              Disconnect
            </button>
          </>
        ) : (
          <button onClick={handleWalletConnect} className="bg-blue-500 text-white px-4 py-2 rounded-full">
            Connect Wallet
          </button>
        )}
        {error && <div className="ml-4 text-red-500">{error}</div>}
      </div>
    </div>
  )
}

export default Navigation
