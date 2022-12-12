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
        text: __('Internet Archive', 'likecoin'),
        linkAddress: 'https://archive.org/',
      }),
    },
  );
  const localizedInternetSecretIntro = createInterpolateElement(
    __(
      'An <Register/> is needed for auto publishing your post to Internet Archive.',
      'likecoin',
    ),
    {
      Register: createElement(Link, {
        text: __('Internet Archive S3 API Key', 'likecoin'),
        linkAddress: 'https://archive.org/account/s3.php',
      }),
    },
  );
  return (
    <div>
      <h2>
        {__('What is Internet Archive (archive.org)?', 'likecoin')}
      </h2>
      <p>{localizedInternetArchiveShortIntro}</p>
      <p>{localizedInternetSecretIntro}</p>
    </div>
  );
}

export default InternetArchiveDescription;
