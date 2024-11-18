import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { Gallery, Thumbnail } from "@components";

const ThumbnailGallery = (props) => {
    const {
        tenant
    } = props;

    const [images, setImages] = useState([]);
    const [limit, setLimit] = useState(20);

    const getImages = async() => {
        const thumbnails = await axios.get(`/api/comic/${tenant}/thumbnails?limit=${limit}`); 
        const {pages} = thumbnails.data
        setImages(pages);
    }

    useEffect(() =>{
      getImages()
    }
    , []);

    return (
        <Gallery editable thumbnails={images} />
    )
} 

export default ThumbnailGallery;