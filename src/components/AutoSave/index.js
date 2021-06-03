import { Button } from 'antd'
import { useState } from 'react'

export default AutoSave = () => {
  const [time, setTime] = useState(60)

  let timer = setInterval(() => {
    if (time > 1) {
      setTime(time--)
    } else {
      setTime(60)
    }
  })
  return(
    <div>
      <Button type="dashed" loading={loading} size="small" onClick={() => setVisible(true)}>保存{time}S</Button>
    </div>
  )
}