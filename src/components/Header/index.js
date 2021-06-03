import './index.less'
import Search from '../Search/index.js'
import { Avatar } from 'antd'
import { useEffect, useState } from 'react'
import { useHistory } from 'umi'

function CommonHeader() {

  let history = useHistory()
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
    <div className="common-header">
      <div className="navgator flex-center">
        <div className="logo" onClick={() => history.push('/')}>logo</div>
        <div className="wrap">
          <div className="navs">
            <div className="left-nav">
              {navList.map((item) => {
                return <span 
                  className={active === item.name ? 'active' : ''}
                  key={item.name}
                  onClick={() => navClick(item)}
                >{item.name}</span>
              })}
            </div>
            <div className="right-nav">
              <Search />
            </div>
          </div>
          <div className="avatar">
            <Avatar src="https://i2.hdslb.com/bfs/face/9131ad538abb79b77e60bbf4d545939c7eb81d81.jpg@72w_72h_1c.webp" size={36} />
          </div>
        </div>
      </div>
      <>
      {/* <div className="banner">
        <div className="animated-banner" onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>
          <div className="layer">
            <img src="https://i0.hdslb.com/bfs/vc/c12c6ceaa5f78de17cd94bb0ad325339b2386ee8.png" data-height="360" data-width="9666" height="209" width="5612" style={{transform: `scale(1) translate(${move + 0}px, -17.4194px) rotate(0deg)`, opacity: 1}} />
          </div>
          <div className="layer">
            <img src="https://i0.hdslb.com/bfs/vc/4d5ddb371f6d710cf0222a5d0cef46ea3ed5901c.png" data-height="360" data-width="9666" height="209" width="5612" style={{transform: `scale(1) translate(${move + 1277.42}px, 0px) rotate(0deg)`, opacity: 1}} />
          </div>
          <div className="layer">
            <img src="https://i0.hdslb.com/bfs/vc/c7a1dbf9bbc09c1f867b14a141c4e2f07c4b228d.png" data-height="360" data-width="3523" height="188" width="1841" style={{transform: `scale(1) translate(${move + 783.871}px, 0px) rotate(0deg)`, opacity: 1}} />
          </div>
          <div className="layer">
            <img src="https://i0.hdslb.com/bfs/vc/d605a7076d5fe89d0d7e3d6219bffe4000033a09.png" data-height="360" data-width="2938" height="204" width="1671" style={{transform: `scale(1) translate(${move + -739.742}px, 0px) rotate(0deg)`, opacity: 1}} />
          </div>
          <div className="layer">
            <img src="https://i0.hdslb.com/bfs/vc/8d947f22c6a67b8a5d2fbe1424ca2a946802e729.png" data-height="139" data-width="556" height="72" width="290" style={{transform: `scale(1) translate(${move + 705.484}px, 52.2581px) rotate(0deg)`, opacity: 1}} />
          </div>
          <div className="layer">
            <img src="https://i0.hdslb.com/bfs/vc/65a860abda015ed247d48b1bcc5cbb9ce725d050.png" data-height="302" data-width="734" height="98" width="238" style={{transform: `scale(1) translate(${move + 292.645}px, 42.271px) rotate(0deg)`, opacity: 0}} />
          </div>
          <div className="layer">
            <img src="https://i0.hdslb.com/bfs/vc/963685e7d82d27ba5e8187680814a2d548b5adbe.png" data-height="180" data-width="1757" height="146" width="1428" style={{transform: `scale(1) translate(${move + 130.065}px, 16.2581px) rotate(0deg)`, opacity: 1}} />
          </div>
          <div className="layer">
            <img src="https://i0.hdslb.com/bfs/vc/6a6e6e52a18a7731645aa1d93b1d74f2f628f77a.png" data-height="116" data-width="1757" height="94" width="1428" style={{transform: `scale(1) translate(${move + -406.452}px, 56.9032px) rotate(0deg)`, opacity: 1}} />
          </div>
          <div className="layer">
            <img src="https://i0.hdslb.com/bfs/vc/3969636231e7668ec91985bb147c89a6b69021c7.png" data-height="346" data-width="497" height="160" width="230" style={{transform: `scale(1) translate(${move + -278.71}px, 18.5806px) rotate(0deg)`, opacity: 0}} />
          </div>
          <div className="layer">
            <img src="https://i0.hdslb.com/bfs/vc/9af4cdc3c81e01522fc4df82a5b7cfa8b03b6b5b.png" data-height="256" data-width="146" height="118" width="67" style={{transform: `scale(1) translate(${move + -394.839}px, 37.1613px) rotate(0deg)`, opacity: 0}} />
          </div>
          <div className="layer">
            <img src="https://i0.hdslb.com/bfs/vc/4d8514308bd6673b215cdb1aadbf12891d784672.png" data-height="254" data-width="602" height="132" width="314" style={{transform: `scale(1) translate(${move + -104.516}px, 15.6774px) rotate(0deg)`, opacity: 1}} />
          </div>
          <div className="layer">
            <img src="https://i0.hdslb.com/bfs/vc/9b4f18f9f18c8dca17ba6c0b46a1dcedb649c82b.png" data-height="360" data-width="4277" height="209" width="2483" style={{transform: `scale(1) translate(${move + 116.129}px, 0px) rotate(0deg)`, opacity: 1}} />
          </div>
          <div className="layer">
            <img src="https://i0.hdslb.com/bfs/vc/b24c872ae1ef34ebe794d1631a50b57fbdb0a482.png" data-height="327" data-width="933" height="170" width="487" style={{transform: `scale(1) translate(${move + 250.839}px, 15.6774px) rotate(0deg)`, opacity: 1}} />
          </div>
          <div className="layer">
            <img src="https://i0.hdslb.com/bfs/vc/45031fa60ea6084886e80ca9e906803f9a3221b1.png" data-height="353" data-width="740" height="245" width="515" style={{transform: `scale(1) translate(${move + 2438.71}px, 0px) rotate(0deg)`, filter: 'blur(2px)', opacity: 1}} />
          </div>
          <div className="layer">
            <img src="https://i0.hdslb.com/bfs/vc/17a00335345ecb9f5439069ee2d069772a9cede3.png" data-height="360" data-width="1916" height="209" width="1112" style={{transform: `scale(1) translate(${move + -1161.29}px, 0px) rotate(0deg)`, filter: 'blur(1px)', opacity: 1}} />
          </div>
          <canvas width="1902" height="179" style={{position: 'absolute', top: '0px', left: '0px'}}></canvas>
        </div>
      </div> */}
      </>
    </div>
  )
}

export default CommonHeader