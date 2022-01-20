import StatusTitle from './StatusTitle';

function SideBarStatusRow(props) {
  return (
    <div className='sidebarStatusTitleOuterDiv'>
      <StatusTitle title={props.title} />
      {props.status && (
        <div className='SideBarStatusRowDetails'>
          {' '}
          {props.link && (
            <a
              href={props.link}
              target='_blank'
              rel='noopener noreferrer'
              className='longLink'
            >
              {props.status}
            </a>
          )}{' '}
          {!props.link && props.status}
        </div>
      )}
    </div>
  );
}

export default SideBarStatusRow;
