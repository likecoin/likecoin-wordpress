import { __ } from '@wordpress/i18n';
import SideBarStatusRow from './SideBarStatusRow';

function PublishStatus(props) {
  return (
    <SideBarStatusRow
      title={__('State', 'likecoin')}
      status={
        <div className='flexBoxRow'>
          {!props.isCurrentPostPublished && (
            <>
              <div className='greyDot'></div>{' '}
              <div className='postStatusDiv'>
                {`${__('Not Ready', 'likecoin')}`}
              </div>
            </>
          )}
          {props.isCurrentPostPublished && !props.ISCNId && (
            <>
              <div className='redDot'></div>{' '}
              <div className='postStatusDiv'>{`${__(
                'Ready',
                'likecoin',
              )}`}</div>
            </>
          )}
          {props.isCurrentPostPublished && props.ISCNId && (
            <>
              <div className='greenDot'></div>{' '}
              <div className='postStatusDiv'>
                {`${__('Published', 'likecoin')}`}
              </div>
            </>
          )}
        </div>
      }
    />
  );
}

export default PublishStatus;
