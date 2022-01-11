import styles from './index.less'
import '@/assets/css/tocbot.css'

import * as tocbot from 'tocbot'
import { useEffect } from 'react'

const tocHeading = 'toc-heading-'
const headingSelector = 'h1, h2, h3, h4'

function Catalog(props) {
  
  const setTocbotId = () => {
    let i = 0
    const parentNode = document.getElementById(`${props.contentId}`)
    const tocbotNodes = Array.from(document.getElementById('tocbotContent').getElementsByTagName('a'))
    parentNode && Array.from(parentNode.children).forEach((dom) => {
      const tag = dom.tagName.toLowerCase()
      if (headingSelector.includes(tag)) {
        // idMap[tag] ? idMap[tag]++ : idMap[tag] = 1
        dom.setAttribute('id', `${tocHeading}${++i}`)
        // dom.setAttribute('href', `#${tocHeading}${idMap[tag]}`)
        // console.log(dom)
      }
    })
    i = 0
    tocbotNodes.forEach((dom) => {
      console.log(dom)
      dom.setAttribute('href', `#${tocHeading}${++i}`)
    })
  }

  useEffect(() => {
    tocbot.init({
      tocSelector: '#tocbotContent',
      contentSelector: `#${props.contentId}`,
      // collapseDepth: Number('0'),
      headingSelector,
      hasInnerContainers: true
    })
    // setTocbotId()
  }, [props.contentId])

  return(
    <div className={styles['catalog']}>
      <div className={styles['fixed']}>
        <div className={styles['title']}>
          <i className={styles['far']} />&nbsp;&nbsp;目录
        </div>
        <div id="tocbotContent" />
      </div>
    </div>
  )
}

export default Catalog