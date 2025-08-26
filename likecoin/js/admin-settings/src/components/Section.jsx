import PropTypes from 'prop-types';

function Section({ title }) {
  return (
    <h2 className="title">{title}</h2>
  );
}

Section.propTypes = {
  title: PropTypes.string.isRequired,
};

export default Section;
