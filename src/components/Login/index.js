import './index.less'
import { login_user } from '@/services/api/user.js'
import { Input, Button, message } from 'antd'
import { useState } from 'react'

function Login() {
  const [username, setUsername] = useState(null)
  const [password, setPassword] = useState(null)

  const login = () => {
    login_user({username: username, password: password}).then(res => {
      if (res.code === 0) {

      } else {
        message.error(res.msg)
      }
    })
  }
  const register = () => {}

  return(
    <div className="login">
      <div className="row">
        <span className="title">用户名：</span>
        <div className="content">
          <Input placeholder="请输入用户名" onChange={ (e) => setUsername(e.target.value) }></Input>
        </div>
      </div>
      <div className="row">
        <span className="title">密码：</span>
        <div className="content">
          <Input placeholder="请输入密码" onChange={ (e) => setPassword(e.target.value) }></Input>
        </div>
      </div>
      <div className="btns">
        <Button type="link" onClick={ login }>登录</Button>
        <Button type="link" onClick={ register }>注册</Button>
      </div>
    </div>
  )
}

export default Login