import SignUpLabel from "./signUpLabel";
import SignUpParagraph from "./signUpParagraph";

function SignUpForm({toggleForm}) {
  return (
    <form>
      <h1>Sign Up</h1>
      <SignUpLabel text="First Name" value="firstName" type="text" />
      <SignUpLabel text="Last Name" value="lastName" type="text" />
      <SignUpLabel text="Email" value="email" type="email" />
      <SignUpLabel text="Business Name" value="businessName" type="text" />
      <SignUpLabel text="Password" value="password" type="password" />
      <SignUpLabel
        text="Confirm Password"
        value="confirmPassword"
        type="password"
      />
      <button type="submit">Create Account</button>
      <SignUpParagraph toggleForm={toggleForm}/>
    </form>
  );
}
export default SignUpForm;
