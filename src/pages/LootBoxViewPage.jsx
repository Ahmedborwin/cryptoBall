import React from "react"

const LootBoxViewPage = () => {
  // Create an array with 11 elements, each representing a card
  const cards = Array.from({ length: 5 }, (_, i) => ({
    id: i + 1,
    name: `Player ${i + 1}`,
    pos: "GK",
    ovr: 0,
    atk: 0,
    def: 0,
  }))

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 p-6 h-screen items-center justify-center">
      {cards.map((card) => (
        <div
          key={card.id}
          className="bg-white h-48 w-36 shadow-md rounded-lg flex flex-col items-center justify-center p-2"
        >
          <div className="text-center">
            <h4 className="text-lg font-bold text-gray-800">{card.name}</h4>
            <p className="text-sm text-gray-600">{card.pos}</p>
            <p className="text-sm text-gray-600">OVR: {card.ovr}</p>
            <p className="text-sm text-gray-600">ATK: {card.atk}</p>
            <p className="text-sm text-gray-600">DEF: {card.def}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default LootBoxViewPage
