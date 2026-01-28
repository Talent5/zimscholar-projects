import React, { useMemo, useState } from 'react';

interface LogoProps {
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
  width?: number | string;
  height?: number | string;
}

const FALLBACK_LOGO =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">' +
      '<defs>' +
        '<linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
          '<stop offset="0%" stop-color="#667eea" />' +
          '<stop offset="100%" stop-color="#764ba2" />' +
        '</linearGradient>' +
      '</defs>' +
      '<rect width="256" height="256" rx="48" fill="url(#g)" />' +
      '<path d="M64 96h128v16H64zm0 32h96v16H64zm0 32h80v16H64z" fill="#fff" opacity="0.9" />' +
      '<circle cx="180" cy="144" r="20" fill="#fff" opacity="0.95" />' +
    '</svg>'
  );

const Logo: React.FC<LogoProps> = ({ alt = 'ZimScholar Logo', className, style, width, height }) => {
  const sources = useMemo(() => {
    const baseUrl = import.meta.env.BASE_URL || '/';
    const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
    return [
      `${normalizedBase}scholarxafrica-logo.png`,
      '/scholarxafrica-logo.png'
    ];
  }, []);
  const [srcIndex, setSrcIndex] = useState(0);
  const src = sources[srcIndex] || FALLBACK_LOGO;

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
      width={width}
      height={height}
      onError={() => {
        if (srcIndex < sources.length - 1) {
          setSrcIndex(srcIndex + 1);
        } else {
          setSrcIndex(sources.length);
        }
      }}
    />
  );
};

export default Logo;
