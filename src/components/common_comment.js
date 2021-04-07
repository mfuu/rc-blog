import utils from '../utils'
import '../assets/css/common_comment.less'
import { Comment, Input, List, Form, Button, Avatar, Icon, Popover, Tooltip } from 'antd'
import { useState } from 'react'
const { TextArea } = Input

const CommentList = ({ comments }) => (
  <List
    dataSource={comments}
    header={`${comments.length}条评论`}
    itemLayout="horizontal"
    renderItem={props => <Comment {...props} />}
  />
)

function CommonComment() {
  const [comments, setComments] = useState([])
  const [value, setValue] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [showEmoji, setShowEmoji] = useState(false)
  const [action, setAction] = useState('')
  const [likes, setLikes] = useState(0)
  const [dislikes, setDislikes] = useState(0)

  const Actions = [
    <span>
      <Tooltip title="Like">
        <Icon
          type="like"
          theme={action === 'liked' ? 'filled' : 'outlined'}
          onClick={() => like()}
        />
      </Tooltip>
      <span style={{ paddingLeft: 8, cursor: 'auto' }}>{likes}</span>
    </span>,
    <span key=' key="comment-basic-dislike"'>
      <Tooltip title="Dislike">
        <Icon
          type="dislike"
          theme={action === 'disliked' ? 'filled' : 'outlined'}
          onClick={() => dislike()}
        />
      </Tooltip>
      <span style={{ paddingLeft: 8, cursor: 'auto' }}>{dislikes}</span>
    </span>,
    <span key="comment-basic-reply-to">Reply to</span>
  ]

  const like = () => {
    setAction('liked')
    setLikes(1)
    setDislikes(0)
  }
  const dislike = () => {
    setAction('disliked')
    setLikes(0)
    setDislikes(1)
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
          actions: Actions,
          author: '游客',
          avatar: 'https://i2.hdslb.com/bfs/face/9131ad538abb79b77e60bbf4d545939c7eb81d81.jpg@72w_72h_1c.webp',
          content: <p>{value}</p>,
          datetime: utils.formatDate(new Date().getTime())
        },
        ...comments
      ])
    }, 800)
  }

  return(
    <div className="common-comment">
      <Comment
        avatar={<Avatar src="https://i2.hdslb.com/bfs/face/9131ad538abb79b77e60bbf4d545939c7eb81d81.jpg@72w_72h_1c.webp" />}
        content={
          <>
            <Form.Item style={{position: 'relative'}}>
              <div className="comment-content">
                <TextArea
                  rows={4}
                  value={value}
                  onChange={handleChange}
                  className="textarea"
                  placeholder="just go go"
                />
                <div className="icon">
                  <span className="text" onClick={() => setShowEmoji(!showEmoji)}>表情</span> | <span className="text">预览</span>
                </div>
                <div className="emoji" style={{ display: showEmoji ? 'block' : 'none' }}>
                  {utils.emoji.map(item => {
                    return <i className="emojis" key={item} onClick={() => setValue(value + item)}>{item}</i>
                  })}
                </div>
              </div>
            </Form.Item>
            <Form.Item>
              <Button
                htmlType="submit"
                loading={submitting}
                onClick={() => handleSubmit()}
                type="primary"
              >评论</Button>
            </Form.Item>
          </>
        }
      />
      {comments.length > 0 && <CommentList comments={comments} />}
    </div>
  )
}

export default CommonComment