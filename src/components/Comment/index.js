import utils from '@/utils'
import './index.less'
import styles from './index.less'
import { Comment, Input, List, Form, Button, Avatar, Icon, Popover, Tooltip } from 'antd'
import { useState } from 'react'

const { TextArea } = Input

const CommentList = ({ comments, like, dislike }) => (
  <List
    dataSource={comments}
    header={`${comments.length}条评论`}
    itemLayout="horizontal"
    renderItem={(item, index) => (
      <Comment
        {...item}
        actions={
          [
            <span key="comment-basic-like">
              <Icon
                type="like"
                theme={item.data.action === 'liked' ? 'filled' : 'outlined'}
                onClick={() => like(item, index)}
              />
              <span style={{ paddingLeft: 8, cursor: 'auto' }}>{item.data.likes}</span>
            </span>,
            <span key="comment-basic-dislike">
              <Icon
                type="dislike"
                theme={item.data.action === 'disliked' ? 'filled' : 'outlined'}
                onClick={() => dislike(item, index)}
              />
              <span style={{ paddingLeft: 8, cursor: 'auto' }}>{item.data.dislikes}</span>
            </span>,
            <span key="comment-basic-reply-to">回复</span>
          ]
        }
      />
    )}
  />
)

const UserInfo = () => (
  <div className={styles['userinfo']}>
    <input placeholder="昵称" className="vnick vinput" type="text" />
    <input placeholder="邮箱" className="vemail vinput" type="email" />
    <input placeholder="网址(http://)" className="vlink vinput" type="text" />
  </div>
)

function Comments(props) {
  const [comments, setComments] = useState([])
  const [value, setValue] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [showEmoji, setShowEmoji] = useState(false)

  const like = (item, index) => {
    let list = [...comments]
    list.map((el, _index) => {
      if (index === _index) {
        if (el.data.action === 'liked') return
        if (el.data.action !== '') el.data.dislikes--
        el.data.likes++
        el.data.action = 'liked'
      }
    })
    setComments(list)
  }
  const dislike = (item, index) => {
    let list = [...comments]
    list.map((el, _index) => {
      if (index === _index) {
        if (el.data.action === 'disliked') return
        if (el.data.action !== '') el.data.likes--
        el.data.dislikes++
        el.data.action = 'disliked'
      }
    })
    setComments(list)
  }
  const handleChange = e => {
    setValue(e.target.value)
  }
  const handleSubmit = () => {
    if (!value) return
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      setValue('')
      setComments([
        {
          author: '游客',
          avatar: 'https://i2.hdslb.com/bfs/face/9131ad538abb79b77e60bbf4d545939c7eb81d81.jpg@72w_72h_1c.webp',
          content: <p>{value}</p>,
          datetime: utils.formatDate(new Date().getTime()),
          data: { likes: 0, dislikes: 0, action: '' },
          actions: []
        },
        ...comments
      ])
    }, 800)
  }

  return(
    <div className={props.className}>
      <Comment
        avatar={<Avatar src="https://i2.hdslb.com/bfs/face/9131ad538abb79b77e60bbf4d545939c7eb81d81.jpg@72w_72h_1c.webp" />}
        content={
          <>
            <Form.Item style={{position: 'relative'}}>
              <div className={styles['content']}>
                <UserInfo />
                <TextArea
                  rows={4}
                  value={value}
                  onChange={handleChange}
                  className={styles['textarea']}
                  placeholder="just go go"
                />
                <div className={styles['icon']}>
                  <span className={styles['text']} onClick={() => setShowEmoji(!showEmoji)}>表情</span> | <span className={styles['text']}>预览</span>
                </div>
                <div className={styles['emoji']} style={{ maxHeight: showEmoji ? '125px' : '0' }}>
                  {utils.emoji.map(item => {
                    return <li className={styles['emojis']} key={item} onClick={() => setValue(value + item)}><span>{item}</span></li>
                  })}
                </div>
              </div>
            </Form.Item>
            <Form.Item style={{ textAlign: 'center' }}>
              <Button
                className="rt"
                htmlType="submit"
                loading={submitting}
                onClick={() => handleSubmit()}
              >评论</Button>
              {comments.length === 0 && <span className="tips">快来做第一个评论的人吧~</span>}
            </Form.Item>
          </>
        }
      />
      { 
        comments && comments.length > 0 &&
        <CommentList
          comments={comments}
          like={(item, index) => like(item, index)}
          dislike={(item, index) => dislike(item, index)}
        />
      }
    </div>
  )
}

export default Comments