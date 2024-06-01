import FormBox from "../common/Form/FormBox"
const PlayerCard = ({ player, index = 0, isStaked = false }) => {
  const getColorForValue = (value) => {
    if (value > 80) return "text-dark-green"
    if (value >= 71) return "text-green"
    if (value > 61) return "text-yellow"
    return "text-gray-400"
  }

  return (
    <div
      key={index}
      className={`w-full max-w-xs mx-auto overflow-hidden max-h-[40vh] p-1 ${
        isStaked ? "bg-blue-500" : "bg-[#00000073]"
      }  rounded-xl shadow-xl relative group`}
    >
      <div className="absolute inset-0 flex items-center justify-center text-center text-white font-bold text-lg group-hover:flex group-hover:opacity-0 transition-opacity duration-300">
        {player.name}
      </div>
      <FormBox>
        <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
          {player &&
            player?.attributes &&
            player.attributes.map((attribute, attrIndex) => (
              <div key={attrIndex} className="flex justify-between text-xs">
                <span className="text-gray-400">{attribute.name}: &nbsp;</span>
                <span className={getColorForValue(attribute.value)}>{attribute.value}</span>
              </div>
            ))}
        </div>
      </FormBox>
    </div>
  )
}

export default PlayerCard
