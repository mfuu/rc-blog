import { get_article_list } from '@/services/api/article.js'
import { useEffect, useState } from 'react'
import './index.less'

function Management() {
  const [list, setList] = useState([])

  useEffect(() => {
    get_article_list().then(res => {
      if (res.code === 0) {
        setList(res.data)
      }
      console.log(res)
    })
  }, [])

  return (
    <div className="management">

    </div>
  )
}

export default Management