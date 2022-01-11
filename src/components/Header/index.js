import styles from './index.less'
import Search from '../Search/index.js'
import { Avatar, message, Popover } from 'antd'
import { useEffect, useRef, useState } from 'react'
import { useHistory } from 'umi'
import Login from '../Login'

function Header() {

  const history = useHistory()
  const [move, setmove] = useState(0)
  const [active, setActive] = useState('')
  const navList = [
    { name: '首页', path: '/' },
    { name: '时间轴', path: '/time' }
  ]

  useEffect(() => {
    try {
      navList.forEach(item => {
        if (history.location.pathname.indexOf(item.path) > -1) {
          setActive(item.name)
          throw new Error()
        }
      })
    } catch(e) {}
  }, [])

  const onMouseMove = (e) => {
    setmove(move + (-e.movementX * 0.8))
  }
  const onMouseLeave = () => {
    setmove(0)
  }
  const navClick = (item) => {
    setActive(item.name)
    history.push(item.path)
  }

  return (
    <div className={styles['header']}>
      <div className={styles['logo']} onClick={() => history.push('/')}>
        <span>logo</span>
      </div>
      <div className={styles['navigate']}>
        {
          navList.map((item) => {
            return <span 
              key={item.name}
              className={`${styles['item']} ${active == item.name ? styles['active'] : ''}`}
              onClick={() => navClick(item)}
            >{item.name}</span>
          })
        }
        <Search className="rt" />
      </div>
      <div className={styles['avatar']}>
        <Popover
          trigger="click"
          placement="bottomRight"
          content={
            <Login />
          }
        >
          <Avatar src={ require('@/assets/img/avator.jpg') } size={36} />
        </Popover>
      </div>
      {/* <>
      <div className="banner">
        <div className="animated-banner" onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>
          <div className="layer">
            <img src={ require('@/assets/img/bg1.png') } data-height="360" data-width="9666" height="209" width="5612" style={{transform: `scale(1) translate(${move + 0}px, -17.4194px) rotate(0deg)`, opacity: 1}} />
          </div>
          <div className="layer">
            <img src={ require('@/assets/img/bg2.png') } data-height="360" data-width="9666" height="209" width="5612" style={{transform: `scale(1) translate(${move + 1277.42}px, 0px) rotate(0deg)`, opacity: 1}} />
          </div>
          <div className="layer">
            <img src={ require('@/assets/img/bg3.png') } data-height="360" data-width="3523" height="188" width="1841" style={{transform: `scale(1) translate(${move + 783.871}px, 0px) rotate(0deg)`, opacity: 1}} />
          </div>
          <div className="layer">
            <img src={ require('@/assets/img/bg4.png') } data-height="360" data-width="2938" height="204" width="1671" style={{transform: `scale(1) translate(${move + -739.742}px, 0px) rotate(0deg)`, opacity: 1}} />
          </div>
          <div className="layer">
            <img src={ require('@/assets/img/bg5.png') } data-height="139" data-width="556" height="72" width="290" style={{transform: `scale(1) translate(${move + 705.484}px, 52.2581px) rotate(0deg)`, opacity: 1}} />
          </div>
          <div className="layer">
            <img src={ require('@/assets/img/bg6.png') } data-height="302" data-width="734" height="98" width="238" style={{transform: `scale(1) translate(${move + 292.645}px, 42.271px) rotate(0deg)`, opacity: 0}} />
          </div>
          <div className="layer">
            <img src={ require('@/assets/img/bg7.png') } data-height="180" data-width="1757" height="146" width="1428" style={{transform: `scale(1) translate(${move + 130.065}px, 16.2581px) rotate(0deg)`, opacity: 1}} />
          </div>
          <div className="layer">
            <img src={ require('@/assets/img/bg8.png') } data-height="116" data-width="1757" height="94" width="1428" style={{transform: `scale(1) translate(${move + -406.452}px, 56.9032px) rotate(0deg)`, opacity: 1}} />
          </div>
          <div className="layer">
            <img src={ require('@/assets/img/bg9.png') } data-height="346" data-width="497" height="160" width="230" style={{transform: `scale(1) translate(${move + -278.71}px, 18.5806px) rotate(0deg)`, opacity: 0}} />
          </div>
          <div className="layer">
            <img src={ require('@/assets/img/bg10.png') } data-height="256" data-width="146" height="118" width="67" style={{transform: `scale(1) translate(${move + -394.839}px, 37.1613px) rotate(0deg)`, opacity: 0}} />
          </div>
          <div className="layer">
            <img src={ require('@/assets/img/bg11.png') } data-height="254" data-width="602" height="132" width="314" style={{transform: `scale(1) translate(${move + -104.516}px, 15.6774px) rotate(0deg)`, opacity: 1}} />
          </div>
          <div className="layer">
            <img src={ require('@/assets/img/bg12.png') } data-height="360" data-width="4277" height="209" width="2483" style={{transform: `scale(1) translate(${move + 116.129}px, 0px) rotate(0deg)`, opacity: 1}} />
          </div>
          <div className="layer">
            <img src={ require('@/assets/img/bg13.png') } data-height="327" data-width="933" height="170" width="487" style={{transform: `scale(1) translate(${move + 250.839}px, 15.6774px) rotate(0deg)`, opacity: 1}} />
          </div>
          <div className="layer">
            <img src={ require('@/assets/img/bg14.png') } data-height="353" data-width="740" height="245" width="515" style={{transform: `scale(1) translate(${move + 2438.71}px, 0px) rotate(0deg)`, filter: 'blur(2px)', opacity: 1}} />
          </div>
          <div className="layer">
            <img src={ require('@/assets/img/bg15.png') } data-height="360" data-width="1916" height="209" width="1112" style={{transform: `scale(1) translate(${move + -1161.29}px, 0px) rotate(0deg)`, filter: 'blur(1px)', opacity: 1}} />
          </div>
          <canvas width="1902" height="179" style={{position: 'absolute', top: '0px', left: '0px'}}></canvas>
        </div>
      </div>
      </> */}
    </div>
  )
}

export default Header