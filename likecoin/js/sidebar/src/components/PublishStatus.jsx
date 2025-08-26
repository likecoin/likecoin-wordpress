import PropTypes from 'prop-types';
import { __ } from '@wordpress/i18n';
import SideBarStatusRow from './SideBarStatusRow';

function PublishStatus({ isCurrentPostPublished, ISCNId }) {
  return (
    <SideBarStatusRow
      title={__('State', 'likecoin')}
      status={(
        <div className="flexBoxRow">
          {!isCurrentPostPublished && (
            <>
              <div className="greyDot" />
              {' '}
              <div className="postStatusDiv">
                {`${__('Not Ready', 'likecoin')}`}
              </div>
            </>
          )}
          {isCurrentPostPublished && !ISCNId && (
            <>
              <div className="redDot" />
              {' '}
              <div className="postStatusDiv">
                {`${__(
                  'Ready',
                  'likecoin',
                )}`}
              </div>
            </>
          )}
          {isCurrentPostPublished && ISCNId && (
            <>
              <div className="greenDot" />
              {' '}
              <div className="postStatusDiv">
                {`${__('Published', 'likecoin')}`}
              </div>
            </>
          )}
        </div>
      )}
    />
  );
}

PublishStatus.propTypes = {
  isCurrentPostPublished: PropTypes.bool.isRequired,
  ISCNId: PropTypes.string,
};

PublishStatus.defaultProps = {
  ISCNId: null,
};

export default PublishStatus;
