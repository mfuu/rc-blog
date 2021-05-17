import { Input } from 'antd'

function CommonSearch() {
  const { Search } = Input

  const search = () => {

  }

  return(
    <div className="common-search">
      <Search onSearch={ search } style={{ width: 200 }} />
    </div>
  )
}

export default CommonSearch