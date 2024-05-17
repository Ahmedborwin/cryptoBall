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
import TeamStatisticsPage from "../pages/TeamStatisticsPage"
import TeamTacticsPage from "../pages/TeamTacticsPage"

const PageRoutes = () => (
  <HashRouter>
    <Navigation />
    <Routes>
      <Route exact path="/" element={<LoginPage />} />
      <Route path="team-create" element={<TeamCreationPage />} />
      <Route path="/team-tactics" element={<TeamTacticsPage />} />
      <Route path="/team-statistics" element={<TeamStatisticsPage />} />
      <Route path="/loot-open" element={<LootBoxOpenPage />} />
      <Route path="/loot-view" element={<LootBoxViewPage />} />
      <Route path="/season" element={<SeasonPage />} />
    </Routes>
  </HashRouter>
)

export default PageRoutes
