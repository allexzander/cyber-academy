import React, { PropTypes } from 'react'
import { IndexLink, Link, browserHistory } from 'react-router'
import './Footer.scss'
import './FooterNew.scss'

export const Footer = ({ user }) =>
<div className='container'>
<div className='row'>
<div className="col-sm-12">
<div id="footer">
    <nav className="navbar navbar-default" id="nav_bottom">
            <div className="navbar-header">
                <a className="navbar-brand" href="#"></a>
            </div>
            <ul className="nav navbar-nav nav_center_li text-uppercase">
                <li><a href="/about">about</a></li>
                <li><a href="/becomeacoach">become a coach</a></li>
                <li><a href="/vip">vip</a></li>
                <li><a href="/support">support</a></li>
                <li><a href="/terms">terms</a></li>
                <li><a href="/coaches">coaches</a></li>
            </ul>
            <ul className="nav navbar-nav nav_always_horizontal nav_social pull-right-lg">
                <li><a href="http://facebook.com" target="_blank"><img src="https://firebasestorage.googleapis.com/v0/b/cyber-academy.appspot.com/o/social_fb.png?alt=media&token=ec34fac1-e467-40db-9e00-ec5c1d6aaed2" alt="icon_social_fb"/></a></li>
                <li><a href="http://viber.com" target="_blank"><img src="https://firebasestorage.googleapis.com/v0/b/cyber-academy.appspot.com/o/social_whatsup.png?alt=media&token=91ce93c2-2d6f-4594-bd28-b65e88d8efd5" alt="icon_social_whatsup"/></a></li>
                <li><a href="http://twitter.com" target="_blank"><img src="https://firebasestorage.googleapis.com/v0/b/cyber-academy.appspot.com/o/social_twitter.png?alt=media&token=8bb53b57-c773-4f26-9f70-67ef68459c26" alt="icon_social_twitter"/></a></li>
                <li><a href="http://vk.com" target="_blank"><img src="https://firebasestorage.googleapis.com/v0/b/cyber-academy.appspot.com/o/social_vk.png?alt=media&token=3c126eec-b929-4cd2-bd63-6eb2b38036ae" alt="icon_social_vk"/></a></li>
            </ul>
    </nav>
</div>
</div>
</div>
</div>
Footer.propTypes = {
  user: PropTypes.object
}

export default Footer
