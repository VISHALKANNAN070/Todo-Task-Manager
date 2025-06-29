import "../styles/login.css";

const Login = () => {
  const googleLogin = () => {
    window.location.href = "https://todo-task-manager-10c3.onrender.com/api/auth/google";
  };

  return (
    <div className="login-container">
      <h1 className="login-title">Welcome to Task Manager</h1>
      <button className="login-button" onClick={googleLogin}>
        Login with Google
      </button>
    </div>
  );
};

export default Login;
