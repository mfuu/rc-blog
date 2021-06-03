import './index.less'
import { write_article } from '@/services/api/article.js'
import MdEditor from 'for-editor'
import { useEffect, useRef, useState } from 'react'
import { Button, Modal, Input, Select } from 'antd'

const { Option } = Select

function Write() {

  const $vm = useRef()
  const [value, setValue] = useState('')
  const [time, setTime] = useState(60)
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)
  const [tags, setTags] = useState([])
  const [title, setTitle] = useState()
  const [author, setAuthor] = useState()
  const [description, setDescription] = useState()
  const tagList = ['vue', 'react', 'SQL']

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

  const handleOk = () => {
    write_article({
      title: title,
      content: value,
      author: author,
      description: description,
      time: new Date().getTime()
    }).then(res => {
      console.log(res)
    })
    setVisible(false)
  }

  const handleChange = (value) => {
    setTags(value)
  }
  const handleTitleChange = (e) => {
    setTitle(e.target.value)
  }
  const handleAuthorChange = (e) => {
    setAuthor(e.target.value)
  }
  const handleDescripteChange = (e) => {
    setDescription(e.target.value)
  }

  return(
    <div className="admin">
      <div className="header">
        <Button type="dashed" loading={loading} size="small" onClick={() => setVisible(true)}>保存{time}S</Button>
      </div>
      <MdEditor
        ref={$vm}
        value={value}
        onChange={(value) => setValue(value)}
        addImg={($file) => addImg($file)}
      />
      <Modal
        title="更多信息"
        visible={visible}
        onOk={() => handleOk()}
        onCancel={() => setVisible(false)}
      >
        <Input value={title} onChange={handleTitleChange} addonBefore="标题：" style={{ marginBottom: '10px' }} />
        <Input value={author} onChange={handleAuthorChange} addonBefore="作者：" style={{ marginBottom: '10px' }} />
        <Input value={description} onChange={handleDescripteChange} addonBefore="描述：" style={{ marginBottom: '10px' }} />
        <Select mode="tags" onChange={handleChange} style={{ width: '100%', marginBottom: '10px' }} placeholder="请选择或手动输入标签">
          {tagList.map(item => {
            return <Option key={item}>{item}</Option>
          })}
        </Select>
      </Modal>
    </div>
  )
}
export default Write