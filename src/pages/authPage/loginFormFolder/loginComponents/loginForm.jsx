import LoginLabel from "./loginLabel";
import LoginParagraph from "./loginParagraph";
function LoginForm({toggleForm}) {
  return (
    <form className="login-form">
      <h1>Login</h1>
      <LoginLabel text="Email" type="text" />
      <LoginLabel text="Password" type="password" />
      <button type="submit">Submit</button>
      <LoginParagraph toggleForm={toggleForm}/>
    </form>
  );
}

export default LoginForm;
