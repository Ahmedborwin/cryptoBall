const TeamStatisticsPage = () => {
  return (
    <>
      <div>Player NFTs number: (getURI(manager address) function -- NFT contract [playersTokens])</div>
      <div className="flex flex-col">
        Manager NFT/struct profile: getTokenURI(manager address)
        <span>Games played</span>
        <span>Games won</span>
        <span>*Games tied*</span>
        <span>Games lost</span>
        <span>Goals scored</span>
        <span>*Goals conceded*</span>
      </div>
    </>
  )
}

export default TeamStatisticsPage
