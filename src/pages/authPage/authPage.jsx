import Logo from "../../components/Logo";
import SignUpForm from "../../components/signUpForm";
import LoginForm from "../../components/loginForm";
import { useState } from "react";
import "./authPage.css";

function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
  };

  return (
    <div className={`main-container ${isSignUp ? "switch" : ""}`}>
      <Logo />
      {isSignUp ? (
        <SignUpForm toggleForm={toggleForm} />
      ) : (
        <LoginForm toggleForm={toggleForm} />
      )}
    </div>
  );
}
export default Auth;
