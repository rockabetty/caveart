import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { Gallery, Thumbnail, TextInput } from "@components";

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

    console.log(images)

  
    useEffect(() =>{
      getImages()
    }
    , []);

    return (
        <div>
          <Gallery mode="navigation" thumbnails={images} />
          <TextInput type="number" min="1" max="100" labelText="Results" value={limit} />
        </div>
    )
} 

export default ThumbnailGallery;