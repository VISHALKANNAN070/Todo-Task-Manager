const Login = () => {
  const googleLogin = () => {
    window.location.href = "http://localhost:5000/api/auth/google";
  };

  return (
    <div className="login-container">
      <h1>Welcome to Task Manager</h1>
      <button onClick={googleLogin}>Login with Google</button>
    </div>
  );
};

export default Login;
