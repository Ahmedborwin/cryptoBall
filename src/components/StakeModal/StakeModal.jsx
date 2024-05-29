import React, { useState } from "react"

const StakeModal = ({ isOpen, onClose, onStake }) => {
  const [selectedPosition, setSelectedPosition] = useState("1")

  if (!isOpen) return null

  const handleStake = () => {
    onStake(selectedPosition)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-[#00000073] p-6 rounded-lg shadow-lg">
        <h2 className="text-lg mb-4">Select a position to stake the player</h2>
        <div className="mb-4">
          <label htmlFor="position" className="block mb-2">
            Position:
          </label>
          <select
            id="position"
            value={selectedPosition}
            onChange={(e) => setSelectedPosition(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none
          focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md text-gray-600"
          >
            {Array.from({ length: 11 }, (_, i) => i + 1).map((position) => (
              <option key={position} value={position}>
                {position}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-center">
          <button onClick={handleStake} className="bg-blue-500 text-white px-4 py-2 rounded mr-2">
            Stake
          </button>
          <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded">
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default StakeModal
