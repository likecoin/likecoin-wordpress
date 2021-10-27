function Link(props) {
  return (
    <a rel="noopener noreferrer" target="_blank" href={props.linkAddress}>
      {props.text}
    </a>
  );
}

export default Link;
