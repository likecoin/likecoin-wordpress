import PropTypes from 'prop-types';
import { __ } from '@wordpress/i18n';
import StatusTitle from './StatusTitle';

const OPTIONS = [
  {
    name: __('(Not set)', 'likecoin'),
    value: '',
  },
  {
    name: 'CC0',
    value: 'http://creativecommons.org/publicdomain/zero/1.0/',
  },
  {
    name: 'CC-BY',
    value: 'https://creativecommons.org/licenses/by/4.0/',
  },
  {
    name: 'CC-BY-SA',
    value: 'https://creativecommons.org/licenses/by-sa/4.0/',
  },
];

function LicensePicker({ onSelect, disabled, defaultLicense }) {
  const handleSelect = (e) => {
    onSelect(e.target.value);
  };
  return (
    <>
      <StatusTitle title={__('License:', 'likecoin')} />
      <select name="license" onChange={handleSelect} disabled={disabled ? true : null}>
        {OPTIONS.map((o) => (
          <option
            key={o.value}
            selected={o.value === defaultLicense ? true : null}
            value={o.value}
          >
            {o.name}
          </option>
        ))}
      </select>
    </>
  );
}

LicensePicker.propTypes = {
  onSelect: PropTypes.func,
  disabled: PropTypes.bool,
  defaultLicense: PropTypes.string,
};

LicensePicker.defaultProps = {
  onSelect: () => {},
  disabled: false,
  defaultLicense: '',
};

export default LicensePicker;
