import '../assets/css/article_detail.less'
import { get_detail_article } from '../services/api/article'
import { useEffect, useState } from "react"

function DetailArticle() {
  const [data, setData] = useState({tag: []})

  useEffect(() => {
    get_detail_article().then(res => {
      console.log(res)
      setData(res.data)
      document.title = res.data.title
    })
  }, [])

  return(
    <div className="article-detail">
      <div className="content">
        <div className="card">
          <div className="header">
            <div className="tags">
              {data.tag.map(item => {
                return <span key={item} className="article-tag">{item}</span>
              })}
            </div>
          </div>
          <div className="body">
            <div className="title">
              {data.title}
            </div>
            <div className="inner">
              {data.content}
            </div>
          </div>
        </div>
        <div className="catalog">
          
        </div>
      </div>
      
    </div>
  )
}
export default DetailArticle