import "../styles/login.css";

const Login = () => {
  const handleGoogleLogin = () => {
    try{
      window.location.href = import.meta.env.VITE_API_URL + "/api/auth/google";
    }
    catch(error){
      console.error("Google Login Failed",error.message);
      
    }
  };

  const handleGitHubLogin = () => {
    try{
      window.location.href = import.meta.env.VITE_API_URL + "/api/auth/github";
    }
    catch(error){
      console.error("Github Login Failed",error.message);
      
    }  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">Welcome to Task Manager</h1>

        <button className="login-button" onClick={handleGoogleLogin}>
          <img src="/google-logo.png" alt="Google" className="login-logo" />
          Login with Google
        </button>

        <button className="login-button github-button" onClick={handleGitHubLogin}>
          <img src="/github-logo.png" alt="GitHub" className="login-logo" />
          Login with GitHub
        </button>
      </div>
    </div>
  );
};

export default Login;
