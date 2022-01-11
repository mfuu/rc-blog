import styles from './index.less'
import { Input } from 'antd'

function Search(props) {
  const { Search } = Input

  const search = () => {

  }

  return(
    <div className={`${props.className}`} style={ props.style }>
      <Search placeholder="Search" onSearch={ search } style={{ width: 200 }} />
    </div>
  )
}

export default Search