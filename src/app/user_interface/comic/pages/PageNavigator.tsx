import { Link, Icon, DropdownSelect} from '@components'
import classNames from 'classnames'
import './Navigator.css'
const PageNavigator = ({last, current, options}) => {
  
  let previous = Math.max(1,current -1);
  let next = Math.min(last,current +1);

  console.log(current)

  return (
    <div className="comic-navigator tile">
      <Link href="1" disabled={current == 1 }>
        <Icon width={32} height={32} name="doubleLeft"/>
      </Link>
      <Link href={previous} disabled={current==1}>
        <Icon width={32} height={32} name="caratLeft"/>
      </Link>
      {options ? 
        (<DropdownSelect
          labelText="Page Selection" 
          value={"2"}
          options={options}
        />)
        : null}
      <Link href={next} disabled={current==next}>
        <Icon width={32} height={32} name="caratRight"/>
      </Link>
      <Link href={last} disabled={current==last}>
        <Icon width={32} height={32} name="doubleRight"/>
      </Link>
    </div>
  )
}

export default PageNavigator