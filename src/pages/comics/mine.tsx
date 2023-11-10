import CaveartLayout from '../../app/user_interface/CaveartLayout'
import {useEffect, useState} from 'react';
import {Link} from '../../../component_library';
import ComicProfile from '../../app/user_interface/comic/ComicProfile';
import axios from 'axios';

console.log(ComicProfile)

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
    <Link href="new">Create a comic</Link>
   
    {comics.map((comic) => {
      return (
        <ComicProfile
          title={comic.title}
          thumbnail={comic.thumbnail}
          subdomain={comic.subdomain}
        />
      )
    })}
     </CaveartLayout>
  )
}

export default MyComics;