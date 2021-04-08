import '../../assets/css/write.less'
import MdEditor from 'for-editor'
import { useEffect, useRef, useState } from 'react'
import { Button } from 'antd'

function Write() {

  const $vm = useRef()
  const [value, setValue] = useState('')
  const [time, setTime] = useState(60)
  const [loading, setLoading] = useState(false)

  let timer = setInterval(() => {
    if (time > 0) {
      setTime(time - 1)
    } else {
      setLoading(true)
      setTimeout(() => {
        setTime(60)
        setLoading(false)
      }, 1000)
    }
    clearInterval(timer)
  }, 1000)

  const addImg = ($file) => {
    console.log($file)
  }
  return(
    <div className="admin">
      <div className="header">
        <span>{time}秒后自动</span>
        <Button type="dashed" loading={loading} size="small">保存</Button>
      </div>
      <MdEditor
        ref={$vm}
        value={value}
        onChange={(value) => setValue(value)}
        addImg={($file) => addImg($file)}
      />
    </div>
  )
}
export default Write