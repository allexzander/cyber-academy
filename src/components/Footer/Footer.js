import React, { Component, PropTypes } from 'react'
import { IndexLink, Link, browserHistory } from 'react-router'
import firebase from 'firebase'
import LocalizedStrings from 'react-localization'
import './FooterNew.scss'

class Footer extends Component {
    constructor (props) {
      super(props)
      this.state = {
        siteInfoLoaded: false,
        words: ['about', 'coaches', 'becomeACoach', 'support', 'terms', 'vipStandartAccount', 'vipVipAccount'],
        wordsEng: {},
        wordsRu: {},
        localizedStrings: {},
        language: "RU"
      }
    }

    /*TODO: move localization code to one single place*/
  makeStrings () {
    const { words, wordsEng = {}, wordsRu = {} } = this.state
    let rus = {}
    let eng = {}
    words.forEach(item => {
      eng[`${item}`] = wordsEng !== {} ? wordsEng[`${item}Eng`] : 'no data'
      rus[`${item}`] = wordsRu !== {} ? wordsRu[`${item}Ru`] : 'no data'
    })
    let localizedStrings = new LocalizedStrings({
      rus: rus,
      eng: eng
    })
    this.setState({ localizedStrings })
  }

  saveInfo (language, suff, object) {
    const { words } = this.state
    if (suff === 'Ru') {
      let wordsRu = {}
      words.forEach(item => {
        wordsRu[`${item}${suff}`] = object[`${language}`][`${item}${suff}`]
      })
      this.setState({ wordsRu, siteInfoLoaded: true })
    } else if (suff === 'Eng') {
      let wordsEng = {}
      words.forEach(item => {
        wordsEng[`${item}${suff}`] = object[`${language}`][`${item}${suff}`]
      })
      this.setState({ wordsEng, siteInfoLoaded: true })
    }
  }

  setLanguage (language) {
    const { localizedStrings } = this.state
    console.log('Footer set ', language)
    localizedStrings.setLanguage(language.language)
    this.setState({ localizedStrings })
  }

  componentWillReceiveProps (nextProps) {
    console.log("Footer componentWillReceiveProps: " + nextProps);
    this.props.language !== nextProps.language && this.setLanguage(nextProps.language)
  }

  componentDidMount () {
    this.fetchText('footer')
  }

  fetchText (page) {
    firebase.database().ref('siteInfo/' + `${page}/`)
    .once('value')
    .then(snapshot => {
      const object = snapshot.val()
      if (object !== null) {
        this.saveInfo('russian', 'Ru', object)
        this.saveInfo('english', 'Eng', object)
        this.makeStrings()
      } else {
        this.setState({ siteInfoLoaded: true })
      }
    })
  }
  /*-------------------------------------------------------*/

    render() {
        const { localizedStrings } = this.state;

        return (<div className='container'>
        <div className='row'>
        <div className="col-sm-12">
        <div id="footer">
            <nav className="navbar navbar-default" id="nav_bottom">
                    <div className="navbar-header">
                        <a className="navbar-brand" href="#"></a>
                    </div>
                    <ul className="nav navbar-nav nav_center_li text-uppercase">
                        <li><a href="/about">{localizedStrings.about}</a></li>
                        <li><a href="/becomeacoach">{localizedStrings.becomeACoach}</a></li>
                        <li><a href="/vip">{localizedStrings.vipStandartAccount}</a></li>
                        <li><a href="/support">{localizedStrings.support}</a></li>
                        <li><a href="/terms">{localizedStrings.terms}</a></li>
                        <li><a href="/coaches">{localizedStrings.coaches}</a></li>
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
        </div>);
    }
}

Footer.propTypes = {
  user: PropTypes.object
}

export default Footer
