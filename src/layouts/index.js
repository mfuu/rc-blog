import Header from '../components/Header/index.js'
import Oprate from '../components/Oprate/index.js'
import 'highlight.js/styles/atom-one-dark.css'

function BasicLayout(props) {
  return (
    <>
      <Header />
      <Oprate />
      <div className="container">
        {props.children}
      </div>
    </>
  );
}

export default BasicLayout
