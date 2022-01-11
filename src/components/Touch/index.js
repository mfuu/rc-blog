import styles from './index.less'
import { useEffect, useState } from 'react'

function Oprate() {
  const [hover, setHover] = useState(false)
  const [showBackTop, setShowBackTop] = useState(false)
  const [opList, setOpList] = useState([
    { name: '仓库地址', value: 'git', show: true  }
  ])

  const backTop = () => {
    document.getElementsByClassName('container')[0].scrollTo({ top: 0, behavior: 'smooth' })
  }
  const goGithub = () => {
    window.open('https://github.com/m-f-home/blog')
  }
  const mouseover = (item) => {
    let list = [...opList]
    setOpList(list.map(el => el.name === item.name ? { ...el, show: false } : el))
  }
  const mouseleave = (item) => {
    let list = [...opList]
    setOpList(list.map(el => el.name === item.name ? { ...el, show: true } : el))
  }
  useEffect(() => {
    let dom = document.getElementsByClassName('container')[0]
    dom.addEventListener('scroll', () => {
      let top = dom.scrollTop
      setShowBackTop(top > 300 ? true : false)
    })
  })

  return(
    <div className={styles['oprate']}>
      {opList.map(item => 
        <div
          key={item.name}
          className={[styles['item'], 'flex'].join(' ')}
          onMouseOver={() => mouseover(item)}
          onMouseLeave={() => mouseleave(item)}
        >
          <span
            className={ item.show ? styles['slip-out'] : styles['slip-in'] }
            style={{ width: '44px' }}
          >
            { item.name }
          </span>
          <span
            className={ item.show ? styles['slip-out'] : styles['slip-in'] }
            style={{ padding: 0, left: '-44px' }}
            onClick={goGithub}
          >
            <span className="sprite-git-icon" />
          </span>
        </div>
      )}
      <div className={[styles['back-top'],
        hover ? 'sprite-top-hover' : 'sprite-top',
        showBackTop ? '' : styles['hide']].join(' ')}
        onClick={backTop}
        onMouseOver={() => setHover(true)}
        onMouseOut={() => setHover(false)}
       />
    </div>
  )
}

export default Oprate