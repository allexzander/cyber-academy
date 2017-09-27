import React from 'react'
import Header from '../../containers/Header'
import AdminHeader from '../../components/Header/AdminHeader'
import './CoreLayout.scss'
import '../../styles/core.scss'
import Footer from '../../components/Footer/Footer'

const renderHeader = location => {
  const isAdmin = location.pathname.split('/')[1] === 'admin'

  if (isAdmin) {
    return <AdminHeader />
  }
  return <Header />
}

export const CoreLayout = ({ children, location }) => (
  <div className= 'container'>
    {renderHeader(location)}
    <div>
      {children}
    </div>
    <div>
      <Footer />
    </div>
  </div>
)

CoreLayout.propTypes = {
  children : React.PropTypes.element.isRequired,
  location: React.PropTypes.object.isRequired
}

export default CoreLayout
