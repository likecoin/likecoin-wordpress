import StatusTitle from './StatusTitle';

function PostStatusRow(props) {
  return (
    <div className='flexBoxRow'>
      <StatusTitle title={props.title} />
      <div className='postStatusRow'>{props.status}</div>
    </div>
  );
}

export default PostStatusRow;
