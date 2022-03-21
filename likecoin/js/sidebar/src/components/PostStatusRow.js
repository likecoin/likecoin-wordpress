import StatusTitle from './StatusTitle';

function PostStatusRow(props) {
  return (
    <div className='flexBoxRow'>
      <StatusTitle title={props.title} />
      <div>{props.status}</div>
    </div>
  );
}

export default PostStatusRow;
