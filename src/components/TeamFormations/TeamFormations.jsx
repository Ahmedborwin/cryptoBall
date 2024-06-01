const TeamFormations = ({ formations, selectedFormation, setSelectedFormation }) => {
  return (
    <>
      <label htmlFor="formation-select" className="block text-lg font-medium text-white">
        Select Formation
      </label>
      <select
        id="formation-select"
        value={selectedFormation}
        onChange={(e) => setSelectedFormation(e.target.value)}
        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none
          focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md text-gray-600"
      >
        {Object.keys(formations).map((formation) => (
          <option key={formation} value={formation}>
            {formation}
          </option>
        ))}
      </select>
    </>
  )
}

export default TeamFormations
