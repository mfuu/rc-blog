import Header from '../components/common_header'
import Oprate from '../components/common_oprate'
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
