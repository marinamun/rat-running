import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./auth/AuthProvider";
import LandingPage from "./pages/LandingPage";
import FinishSignIn from "./pages/FinishSignIn";
import SignIn from "./pages/SignIn";
import StudyResources from "./pages/StudyResources";

// The library is open to everyone; only study notes ask for sign-in
const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/library" element={<StudyResources />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/finish-signin" element={<FinishSignIn />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

export default App;
