import Header from '../components/common_header'
import Oprate from '../components/common_oprate'

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
