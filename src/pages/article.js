import '../assets/css/article.less'
import utils from '../utils'
import { get_article_list } from '../services/api/article'
import { useHistory } from 'umi'
import { Card, Icon } from 'antd'
import { useEffect, useState } from 'react'

function article() {
  let history = useHistory()
  const { Meta } = Card
  const [cardList, setCardList] = useState([])

  useEffect(() => {
    get_article_list().then(res => {
      setCardList(res.list)
    })
  }, [])

  useEffect(() => {
    getFiles()
  }, [])

  const getFiles = () => {
    let filenames = require.context('../assets/files', false, /.md$/).keys()
    let files = []
    filenames.forEach(name => {
      name = name.replace('./', '')
      files.push({
        name: name.split('.')[0],
        content: utils.getFile('../assets/files/' + name)
      })
    })
    console.log(files)
  }

  const goDetail = (item) => {
    history.push(`/detail/${item.id}`)
  }

  return(
    <div className="article">
      <div className="index-card">
        <div className="card-content">
          <div className="inner">
            <Icon type="smile" theme="twoTone" />
            广告位
          </div>
        </div>
      </div>
      <div className="list">
        {cardList.map(item => {
          return <div className="card" key={item.id}>
            <Card
              style={{ width: 300 }}
              cover={
                <img
                  src={item.img}
                  height="200"
                  style={{ cursor: 'pointer' }}
                  onClick={() => goDetail(item)}
                /> 
              }
            >
              <Meta
                title={item.title}
                description={ item.description }
              ></Meta>
            </Card>
            <span className="more" onClick={() => goDetail(item)}>More</span>
          </div>
        })}
      </div>
    </div>
  )
}

export default article