import Header from '@/components/Header/index.js'
import Touch from '@/components/Touch/index.js'
import Loading from '@/components/Loading/index.js'
import 'highlight.js/styles/vs2015.css'
import '../assets/css/icons.css'

function BasicLayout(props) {
  return (
    <>
      <Header />
      <Touch />
      <Loading />
      <div className="container">
        {props.children}
      </div>
    </>
  );
}

export default BasicLayout
