import { ImageUpload, Link } from '../../../../component_library'
import './ComicProfile.css';

interface ComicProfileProps {
  thumbnail: string | null;
  title: string;
  subdomain: string;
}

const ComicProfile: React.FC<ComicProfileProps> = (props) => {
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
        <Link id="link-add_pages" href={`pages/new`}>Add pages</Link>
        <Link id="link-edit" href={`edit/${subdomain}`}>Edit</Link>
      </div>
    </div>
  )
}

export default ComicProfile;