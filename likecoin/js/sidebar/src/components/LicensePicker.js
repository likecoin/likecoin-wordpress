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

function LicensePicker(props) {
  const onSelect = (e) => {
    props.onSelect(e.target.value);
  };
  return (
    <><StatusTitle title={__('License:', 'likecoin')} /><select name="license" onChange={onSelect}>
      {OPTIONS.map((o) => <option
        selected={o.value === props.defaultLicense ? true : null}
        value={o.value}>
        {o.name}
      </option>)}
    </select></>
  );
}
export default LicensePicker;
