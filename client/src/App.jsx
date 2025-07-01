import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import Login from "./components/Login";
import Tasks from "./components/Tasks";

const App = () => {
  const [login, setLogin] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(import.meta.env.VITE_API_URL+"/api/auth/user", {
          withCredentials: true,
        });
        console.log("User authenticated:", res.data);
        setLogin(true);
      } catch (error) {
        console.error("Not logged in:", error.message);
        setLogin(false);
      }
    };
    checkAuth();
  }, []);

  if (login === null) {
    return <div>Checking login status...</div>; 
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={login ? <Tasks /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={login ? <Navigate to="/" /> : <Login />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
