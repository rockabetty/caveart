import CaveartLayout from '../../app/user_interface/CaveartLayout'
import {useEffect, useState} from 'react';
import axios from 'axios';

function MyComics() {

  const [comics, setComics] = useState([]);

  useEffect(() => {
    const comicList = axios.get('/api/comics/mine')
      .then((response) => {
        console.log(response);
        setComics(response.data)
      })
  }, [])

 
  return (
    <CaveartLayout requireLogin={true}>
    <h1>My Comics</h1>
    {comics.map((comic) => {
      return <div>{comic.title}</div>
    })}
    </CaveartLayout>
  )
}

export default MyComics;