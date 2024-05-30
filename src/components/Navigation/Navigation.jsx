import React from "react"
import NavLink from "./_components/NavLink"
import { ConnectButton } from "@rainbow-me/rainbowkit"

const Navigation = () => {
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
        <ConnectButton />
      </div>
    </div>
  )
}

export default Navigation
