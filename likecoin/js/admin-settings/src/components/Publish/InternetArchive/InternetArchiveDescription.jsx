import { __ } from '@wordpress/i18n';
import { createInterpolateElement, createElement } from '@wordpress/element';
import Link from '../../Link';

function InternetArchiveDescription() {
  const localizedInternetArchiveShortIntro = createInterpolateElement(
    __(
      '<InternetArchive/> is a non-profit digital library offering free universal access to books, movies & music, as well as 624 billion archived web pages.',
      'likecoin',
    ),
    {
      InternetArchive: createElement(Link, {
        text: __('Internet Archive (archive.org)', 'likecoin'),
        linkAddress: 'https://archive.org/',
      }),
    },
  );
  return (
    <p>{localizedInternetArchiveShortIntro}</p>
  );
}

export default InternetArchiveDescription;
