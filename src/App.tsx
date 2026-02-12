import { Routes, Route } from "react-router-dom";
import { GamePage } from "./pages/GamePage";

/** Root application component with routing */
const App = () => {
  return (
    <Routes>
      <Route path="/" element={<GamePage />} />
    </Routes>
  );
};

export default App;
