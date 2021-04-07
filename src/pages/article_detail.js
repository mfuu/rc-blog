import '../assets/css/article_detail.less'
import Comment from '../components/common_comment'
import ReactMarkdown from 'react-markdown'
import { get_detail_article } from '../services/api/article'
import { useEffect, useState } from "react"

function DetailArticle() {
  const [data, setData] = useState({tag: []})

  useEffect(() => {
    get_detail_article().then(res => {
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
              <ReactMarkdown children={data.content} />
            </div>
          </div>
        </div>
        <div className="catalog">
          
        </div>
      </div>
      <div className="comment">
        <div className="comment-wrap">
          <Comment />
        </div>
        <div className="character"></div>
      </div>
    </div>
  )
}
export default DetailArticle