import '../assets/css/article_detail.less'
import '../assets/css/markedown.less'
import Comment from '../components/common_comment'
import utils from '../utils'
import marked from 'marked'
import hljs from 'highlight.js'
import MarkdownNav from 'markdown-navbar'
import { get_detail_article } from '../services/api/article'
import { useEffect, useState } from "react"
import { useHistory } from 'react-router'
import { Skeleton } from 'antd'

function DetailArticle() {
  const history = useHistory()
  const [data, setData] = useState({tag: []})
  const [html, setHtml] = useState()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    get_detail_article({id: history.location.query.id}).then(res => {
      setData(res.data)
      document.title = res.data.title
      marked.setOptions({
        renderer: new marked.Renderer(),
        gfm: true,
        tables: true,
        breaks: true,
        pedantic: false,
        sanitize: true,
        smartLists: true,
        smartypants: false,
        highlight(code) {
          return utils.beforNumber(hljs.highlightAuto(code).value)
        }
      })
      setHtml(res.data.content ? marked(res.data.content) : null)
      setLoading(false)
    })
  }, [])

  return(
    <div className="article-detail">
      <div className="content">
        <div className="card">
          <div className="header">
            <div className="tags">
              {data.tag && data.tag.map(item => {
                return <span key={item} className="article-tag">{item}</span>
              })}
            </div>
          </div>
          <div className="body">
            {
              loading ? <Skeleton active /> :
              <>
                <div className="title">
                  <h1>{data.title}</h1>
                </div>
                <div className="inner" id="content" dangerouslySetInnerHTML={{ __html: html }}></div>
              </>
            }
          </div>
        </div>
        <div className="catalog">
          <div className="catalog-fixed">
            <div className="catalog-title">
              <i className="far"></i>
              &nbsp;&nbsp;目录
            </div>
            <MarkdownNav
              className="article-menu"
              source={data.content}
            />
          </div>
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