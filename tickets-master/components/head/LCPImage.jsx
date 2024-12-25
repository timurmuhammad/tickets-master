// Largest Contentful Paint image

const LCPImage = ({ src }) => {
  return (
    <link
      rel="preload"
      href={src}
      as="image"
      importance="high"
    />
  );
};

export default LCPImage;
