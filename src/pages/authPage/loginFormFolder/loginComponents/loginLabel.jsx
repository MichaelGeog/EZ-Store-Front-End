function LoginLabel(props) {
  return (
    <>
      <label htmlFor="inputs">{props.text}</label>
      <input id="inputs" type={props.type} />
    </>
  );
}

export default LoginLabel;