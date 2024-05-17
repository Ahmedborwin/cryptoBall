import React, { useState } from "react";

const formations = {
  "4-4-2": { defenders: 4, midfielders: 4, forwards: 2, goalkeeper: 1 },
  "4-3-3": { defenders: 4, midfielders: 3, forwards: 3, goalkeeper: 1 },
  "4-2-3-1": { defenders: 4, defensiveMid: 2, attackingMid: 3, forwards: 1, goalkeeper: 1 },
  "3-4-3": { defenders: 3, midfielders: 4, forwards: 3, goalkeeper: 1 },
};

const TeamTacticsPage = () => {
  const [selectedFormation, setSelectedFormation] = useState("4-4-2");

  const players = formations[selectedFormation];

  return (
    <div className="w-full h-screen flex justify-between p-10">
      <div className="w-full max-w-3xl h-128 bg-green-800 bg-opacity-50 rounded-lg flex flex-col justify-around py-4 px-10">
        {/* Forwards */}
        <div className="flex justify-evenly">
          {Array.from({ length: players.forwards || 0 }).map((_, index) => (
            <div key={`forward-${index}`} className="w-6 h-6 bg-white rounded-full" />
          ))}
        </div>
        {/* Attacking Midfielders (for 4-2-3-1 formation specifically) */}
        {selectedFormation === "4-2-3-1" && (
          <div className="flex justify-evenly">
            {Array.from({ length: players.attackingMid }).map((_, index) => (
              <div key={`attackingMid-${index}`} className="w-6 h-6 bg-white rounded-full" />
            ))}
          </div>
        )}
        {/* Midfielders or Defensive Midfielders */}
        <div className="flex justify-evenly">
          {Array.from({ length: players.midfielders || players.defensiveMid || 0 }).map((_, index) => (
            <div key={`midfielder-${index}`} className="w-6 h-6 bg-white rounded-full" />
          ))}
        </div>
        {/* Defenders */}
        <div className="flex justify-evenly">
          {Array.from({ length: players.defenders }).map((_, index) => (
            <div key={`defender-${index}`} className="w-6 h-6 bg-white rounded-full" />
          ))}
        </div>
        {/* Goalkeeper */}
        <div className="flex justify-center">
          {Array.from({ length: players.goalkeeper }).map((_, index) => (
            <div key={`goalkeeper-${index}`} className="w-6 h-6 bg-white rounded-full" />
          ))}
        </div>
      </div>

      {/* Dropdown for selecting formation */}
      <div className="ml-4">
        <label htmlFor="formation-select" className="block text-lg font-medium text-white">Select Formation</label>
        <select
          id="formation-select"
          value={selectedFormation}
          onChange={e => setSelectedFormation(e.target.value)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          {Object.keys(formations).map(formation => (
            <option key={formation} value={formation}>
              {formation}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default TeamTacticsPage;
