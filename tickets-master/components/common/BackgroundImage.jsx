// import BackgroundImage from '../components/BackgroundImage';
//     <BackgroundImage imageUrl="/path/to/your/image.jpg">
//       {/* Your content goes here */}
//     </BackgroundImage>

import React from 'react';

const BackgroundImage = ({ imageUrl, children }) => {
  const backgroundStyle = {
    backgroundImage: `url(${imageUrl})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    width: '100%',
    height: '100%',
  };

  return (
    <div style={backgroundStyle}>
      {children}
    </div>
  );
};

export default BackgroundImage;
