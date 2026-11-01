import { useEffect, useState } from "react";

// A simple grey picture used when an image URL is empty or fails to load.
const placeholderSvg =
  '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">' +
  '<rect width="400" height="400" fill="#f3f4f6"/>' +
  '<text x="200" y="210" font-family="Arial" font-size="20" fill="#9ca3af" text-anchor="middle">No image</text>' +
  "</svg>";
const placeholderImage = "data:image/svg+xml;utf8," + encodeURIComponent(placeholderSvg);

function ProductImage({ src, alt, className }) {
  const [failed, setFailed] = useState(false);

  // If the src changes (e.g. admin edits the URL), try again
  useEffect(() => {
    setFailed(false);
  }, [src]);

  let imageToShow = src;
  if (failed || !src) {
    imageToShow = placeholderImage;
  }

  return (
    <img
      src={imageToShow}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

export default ProductImage;
