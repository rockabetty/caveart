import CaveartLayout from '../../app/user_interface/CaveartLayout'
import {useEffect, useState} from 'react';
import {Link} from '../../../component_library';
import ComicProfile from '../../app/user_interface/comic/ComicProfile';
import axios from 'axios';

interface Comic {
  title: string;
  thumbnail: string;
  subdomain: string;
}

function MyComics() {

  const [comics, setComics] = useState<Comic[]>([]);

  useEffect(() => {
    axios.get('/api/comics/mine')
      .then((response) => {
       setComics(response.data)
      })
  }, [])

 
  return (
    <CaveartLayout requireLogin={true}>
    <h1>My Comics</h1>
    <Link id="link-create_comic" href="new">Create a comic</Link>
   
    {comics
      ? comics.map((comic) => {
        return (
          <ComicProfile
            key={comic.subdomain}
            title={comic.title}
            thumbnail={comic.thumbnail}
            subdomain={comic.subdomain}
          />
        )
      })
      : null
    }
     </CaveartLayout>
  )
}

export default MyComics;