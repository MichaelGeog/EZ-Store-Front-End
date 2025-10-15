function SignUpLabel(props) {
  return (
    <>
      <label htmlFor={props.value}>{props.text}</label>
      <input type={props.type} id={props.value} name={props.value} required />
    </>
  );
}

export default SignUpLabel;