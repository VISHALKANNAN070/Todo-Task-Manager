import "../styles/login.css";

const Login = () => {
  const handleGoogleLogin = () => {
    window.location.href =
      "https://todo-task-manager-10c3.onrender.com/api/auth/google";
  };

  const handleGitHubLogin = () => {
    window.location.href =
      "https://todo-task-manager-10c3.onrender.com/api/auth/github";
  };

  return (
    <div className="login-container">
      <h1 className="login-title">Welcome to Task Manager</h1>

      <button className="login-button" onClick={handleGoogleLogin}>
        Login with Google
      </button>

      <button className="login-button github-button" onClick={handleGitHubLogin}>
        Login with GitHub
      </button>
    </div>
  );
};

export default Login;
