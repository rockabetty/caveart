import React from 'react';
import './Thumbnail.css';

type ThumbnailProps = {
  imageUrl: string;
  pageNumber: number;
};

const Thumbnail: React.FC<ThumbnailProps> = ({ imageUrl, pageNumber, mode }) => {

  return (
    <div className="thumbnail">
      <img src={imageUrl} alt={`Page ${pageNumber}`} loading="lazy" />
      <div className="thumbnail_info">Page {pageNumber}</div>
    </div>
  );
};

export default Thumbnail;