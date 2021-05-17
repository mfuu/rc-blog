import { useEffect, useState } from 'react'
import './index.less'

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
    <div className="common-oprate">
      <div className="nav">
        {opList.map(item => 
          <div
            className="nav-items flex"
            key="item.name"
            onMouseOver={() => mouseover(item)}
            onMouseLeave={() => mouseleave(item)}
          >
            <div className="block">
              <span
                className={ item.show ? 'slip-out' : 'slip-in' }
                style={{ width: '44px' }}
              >
                { item.name }
              </span>
              <span
                className={ item.show ? 'slip-out' : 'slip-in' }
                style={{ padding: 0, left: '-44px' }}
                onClick={goGithub}
              >
                <span className="sprite-git-icon"></span>
              </span>
            </div>
          </div>
        )}
        <div className={['back-top',
          hover ? 'sprite-top-hover' : 'sprite-top',
          showBackTop ? '' : 'hide'].join(' ')}
          onClick={backTop}
          onMouseOver={() => setHover(true)}
          onMouseOut={() => setHover(false)}
        ></div>
      </div>
    </div>
  )
}

export default Oprate