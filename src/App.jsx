import "./App.css";
import PageRoutes from "./routes";

// Components
import FadeIn from "./components/common/Effects/FadeIn"
import Container from "./components/common/Container/Basic"

// Icons
import FootballFieldLogo from "./assets/football-stadium-logo.jpg"

const App = () => {
  const backgroundStyle = {
    backgroundImage: `url(${FootballFieldLogo})`,
    backgroundSize: 'cover', // Cover the entire container
    backgroundPosition: 'center', // Center the background image
    backgroundRepeat: 'no-repeat', // Do not repeat the image
    minHeight: '100vh', // Make sure it covers at least the whole viewport height
    width: '100%', // Cover the full width of the viewport
  };

  return (
    <Container style={backgroundStyle}>
      <FadeIn>
        <PageRoutes />
      </FadeIn>
    </Container>
  )
}

export default App;
