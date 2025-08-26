import PropTypes from 'prop-types';
import StatusTitle from './StatusTitle';

function SideBarStatusRow({ title, status, link }) {
  return (
    <div className="sidebarStatusTitleOuterDiv">
      <StatusTitle title={title} />
      {status && (
        <div className="SideBarStatusRowDetails">
          {' '}
          {link && (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="longLink"
            >
              {status}
            </a>
          )}
          {' '}
          {!link && status}
        </div>
      )}
    </div>
  );
}

SideBarStatusRow.propTypes = {
  title: PropTypes.string.isRequired,
  status: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  link: PropTypes.string,
};

SideBarStatusRow.defaultProps = {
  status: null,
  link: null,
};

export default SideBarStatusRow;
