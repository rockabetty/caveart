import React from 'react';
import Thumbnail from './Thumbnail';
import './Gallery.css';
import {Badge, Button} from '../Button';

console.log(Badge)

type GalleryProps = {
  thumbnails: { id: number; imageUrl: string; pageNumber: number }[];
  editable?: boolean;
  reorderable?: boolean;
};

const Gallery: React.FC<GalleryProps> = ({ thumbnails, editable, reorderable }) => {
  return (
    <div className="gallery">
      {thumbnails?.map((thumbnail) => (
        <div className="gallery_tile">
          <Thumbnail
            key={thumbnail.id}
            imageUrl={thumbnail.imageUrl}
            pageNumber={thumbnail.pageNumber}
            id={thumbnail.id}
          />
          <div className="gallery_buttons">
            { editable ? <Badge look="primary" label="Edit" showLabel icon="edit" /> : null}
            { reorderable ? <Badge look="primary" label="Reorder" showLabel icon="move" /> : null}
            { editable ? <Badge look="primary" label="Delete" look="warning" showLabel icon="close" /> : null}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Gallery;