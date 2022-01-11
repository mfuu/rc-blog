import styles from './index.less'
import '@/assets/css/marked.css'

import utils from '@/utils'
import marked from 'marked'
import hljs from 'highlight.js'

import { get_detail_article } from '@/services/api/article'
import { useEffect, useState } from "react"
import { useHistory } from 'react-router'

import Catalog from '@/components/Catalog'
import Comment from '@/components/Comment'

function Detail() {
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
    !loading && 
    <div className={styles['article-detail']}>
      <div className={styles['content']}>
        <div className={styles['card']}>
          <div className={styles['header']}>
            <div className={styles['tags']}>
              {data.tag && data.tag.map(item => {
                return <span key={item} className={styles['article-tag']}>{item}</span>
              })}
            </div>
          </div>
          <div className={styles['body']}>
            <div className={styles['title']}>
              <h1>{data['title']}</h1>
            </div>
            <div className={styles['inner']} id="articleContent" dangerouslySetInnerHTML={{ __html: html }} />
          </div>
        </div>
        <Catalog contentId="articleContent" />
      </div>
      <div className={styles['comment']}>
        <Comment className={styles['comment-wrap']} />
        <div className={styles['character']} />
      </div>
    </div>
  )
}
export default Detail