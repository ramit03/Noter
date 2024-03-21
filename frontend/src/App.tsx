import { Container } from "react-bootstrap";
import LoginModal from "./components/LoginModal";
import NavBar from "./components/NavBar";
import SignUpModal from "./components/SignUpModal";
import { useEffect, useState } from "react";
import { User } from "./models/users";
import * as NotesApi from "./network/notes_api";
import NotesPageLoggedInView from "./components/NotesPageLoggedInView";
import NotesPageLoggedOutView from "./components/NotesPageLoggedOutView";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import NotesPage from "./pages/NotesPage";
import PrivacyPage from "./pages/PrivacyPage";
import NotFoundPage from "./pages/NotFoundPage";
import styles from "./styles/App.module.css"
function App() {
  const [ loggedInUser,setLoggedInUser] = useState<User|null>(null);
  const [showSignUpModal,setShowSignUpModal] = useState(false);
  const [showLoginModal,setShowLoginModal] = useState(false);

  useEffect(()=>{
    async function fetchLoggedInUser() {
        try {
          const user = await NotesApi.getLoggedInUser();
          setLoggedInUser(user);
        } catch (error) {
          console.error(error);        
        }
    }
    fetchLoggedInUser();
  },[])
  return (
    <BrowserRouter>
    <div>
      <NavBar
        loggedInUser={loggedInUser}
        onLoginClicked={() => setShowLoginModal(true)}
        onSignUpClicked={() => setShowSignUpModal(true)}
        onLogOutSuccessful={() => setLoggedInUser(null)}
      />
      <Container className={styles.pageContainer}>
        <Routes>
          <Route 
            path="/"
            element={<NotesPage loggedInUser={loggedInUser}/>}
          />
           <Route 
            path="/privacy"
            element={<PrivacyPage/>}
          />
           <Route 
            path="/*"
            element={<NotFoundPage/>}
          />
        </Routes>
      </Container>
      {showSignUpModal && (
          <SignUpModal 
          onDismiss={() => setShowSignUpModal(false)} 
          onSignUpSucessful={(user) => {
            setLoggedInUser(user);
            setShowSignUpModal(false);
          }} />
        )}
        {showLoginModal && (
          <LoginModal 
          onDismiss={() => setShowLoginModal(false)}
          onLoginSuccessful={(user) => {
            setLoggedInUser(user);
            setShowLoginModal(false);
          }} 
          />
        )}
    </div>
    </BrowserRouter>
  );
}

export default App;
