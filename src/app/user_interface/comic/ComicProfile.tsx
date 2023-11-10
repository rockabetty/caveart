import { ImageUpload, Link } from '../../../../component_library'
import './ComicProfile.css';

function ComicProfile(props) {
  const {
    thumbnail,
    title,
    subdomain
  } = props;
 
  return (
    <div className="comic-profile">
      <a href={`/read/${subdomain}`}>
        <ImageUpload src={thumbnail ? thumbnail : '/img/brand/kraugak.png'} />
      </a>
      <div>
        <h1>
        {title}
        </h1>
        <Link href={`pages/new`}>Add pages</Link>
        <Link href={`profile/${subdomain}`}>Edit profile</Link>
        
      </div>
    </div>
  )
}

export default ComicProfile;