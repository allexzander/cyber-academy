import { connect } from 'react-redux'
import Footer from '../components/Footer/Footer'

const mapStateToProps = state => ({
  language: state.language
})

export default connect(mapStateToProps)(Footer)