import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./auth/AuthProvider";
import LandingPage from "./pages/LandingPage";
import FinishSignIn from "./pages/FinishSignIn";
import SignIn from "./pages/SignIn";
import StudyResources from "./pages/StudyResources";
import WildlifeMap from "./pages/WildlifeMap";
import WildlifeCollection from "./pages/WildlifeCollection";
import WildlifePhotos from "./pages/WildlifePhotos";
import SiteFooter from "./components/SiteFooter";
import Causes from "./pages/Causes";
import Navbar from "./components/Navbar";
// The library is open to everyone; only study notes ask for sign-in
const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/library" element={<StudyResources />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/finish-signin" element={<FinishSignIn />} />
        <Route path="/wildlife" element={<WildlifeMap />} />
        <Route
          path="/wildlife/:collectionId"
          element={<WildlifeCollection />}
        />
        <Route path="/wildlife/photos" element={<WildlifePhotos />} />
        <Route path="/causes" element={<Causes />} />
      </Routes>
      <SiteFooter />
    </BrowserRouter>
  </AuthProvider>
);

export default App;
