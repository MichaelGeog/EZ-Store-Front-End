import Logo from "../../components/Logo";
import SignUp from "./signUpFormFolder/signUp";
import Login from "./loginFormFolder/login";
import { useState } from "react";

function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
  };

  return (
    <div className={`main-container ${isSignUp ? "switch" : ""}`}>
      <Logo />
        {isSignUp ? (
          <SignUp toggleForm={toggleForm} />
        ) : (
          <Login toggleForm={toggleForm} />
        )}
      </div>
  );
}
export default Auth;
