function SignUpParagraph({ toggleForm }) {
  return (
    <p>
      Already have an account?{" "}
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          toggleForm();
        }}
      >
        Login
      </a>
    </p>
  );
}
export default SignUpParagraph;
