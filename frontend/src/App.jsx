import { useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import './App.css'; 

function App() {
  const [authToken, setAuthToken] = useState(localStorage.getItem("authToken"));

  return (
    <div className="container">
      {!authToken ? (
        <>
          <Login setAuthToken={setAuthToken} />
          <Register />
        </>
      ) : (
        <h2>Welcome! You are logged in.</h2>
      )}
    </div>
  );
}

export default App;
