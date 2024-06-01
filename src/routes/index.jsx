import React from "react"
import { HashRouter, Route, Routes } from "react-router-dom"

// Components
import Navigation from "../components/Navigation"

// Pages
import LoginPage from "../pages/LoginPage"
import LootBoxOpenPage from "../pages/LootBoxOpenPage"
import LootBoxViewPage from "../pages/LootBoxViewPage"
import SeasonPage from "../pages/SeasonPage"
import TeamCreationPage from "../pages/TeamCreationPage"
import TeamStatsPage from "../pages/TeamStatsPage"
import TeamTacticsPage from "../pages/TeamTacticsPage"
import MatchPage from "../pages/MatchPage"

const PageRoutes = () => (
  <HashRouter>
    <Navigation />
    <Routes>
      <Route exact path="/" element={<TeamCreationPage />} />
      <Route path="/team-create" element={<TeamCreationPage />} />
      <Route path="/team-tactics" element={<TeamTacticsPage />} />
      <Route path="/team-stats" element={<TeamStatsPage />} />
      <Route path="/loot-open" element={<LootBoxOpenPage />} />
      <Route path="/loot-view" element={<LootBoxViewPage />} />
      <Route path="/match" element={<MatchPage />} />
      <Route path="/season" element={<SeasonPage />} />
    </Routes>
  </HashRouter>
)

export default PageRoutes
