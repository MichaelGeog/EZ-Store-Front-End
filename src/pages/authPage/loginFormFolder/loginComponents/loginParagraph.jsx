function LoginParagraph({ toggleForm }) {
  return (
    <p>
      Don't have an account?{" "}
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          toggleForm();
        }}
      >
        Sign Up
      </a>
    </p>
  );
}

export default LoginParagraph;
