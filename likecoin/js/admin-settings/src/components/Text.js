function Text(props) {
  return <p ref={props.testRef}>{props.text}</p>;
}

export default Text;
