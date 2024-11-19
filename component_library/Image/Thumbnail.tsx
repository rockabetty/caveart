import React from "react";
import "./Thumbnail.css";
import { Badge } from "../Button";
import { Modal } from "../Modal";
type ThumbnailProps = {
  imageUrl: string;
  title: string;
  altText: string;
  link: string;
};

const Thumbnail: React.FC<ThumbnailProps> = ({ imageUrl, title, altText, link }) => {

  const thumbnail = (
    <div className="thumbnail gallery_tile">
      <img src={imageUrl} alt={altText} loading="lazy" />
      {title ? <div className="thumbnail_info">{title}</div> : null}
      <div className="gallery_buttons"></div>
    </div>
  )

  if (link) {
    return (
      <a href={link}>
        {thumbnail}
      </a>
    )
  }

  return thumbnail;
};

export default Thumbnail;
