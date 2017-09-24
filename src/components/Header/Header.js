import React, { Component, PropTypes } from 'react'
import { IndexLink, browserHistory } from 'react-router'
//import './Header.scss'
import './HeaderNew.scss'
import backend from '../../apis'
import firebase from 'firebase'
import LocalizedStrings from 'react-localization'

class Header extends Component {
  constructor (props) {
    super(props)
    this.state = {
      words: ['faculties', 'tournaments', 'forum', 'myCourses', 'statistics', 'logOut'],
      wordsEng: {},
      wordsRu: {},
      strings: {},
      language: "RU"
    }
  }

  handleChangeLanguage () {
    console.log("Language change")
  }

  componentDidMount () {
    this.fetchText('header')
  }

  componentWillReceiveProps (nextProps) {
    this.props.language !== nextProps.language && this.setLanguage(nextProps.language)
  }

  setLanguage (language) {
    const { strings } = this.state
    console.log('set ', language)
    strings.setLanguage(language.language)
    this.setState({ strings })
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

  makeStrings () {
    const { words, wordsEng = {}, wordsRu = {} } = this.state
    let rus = {}
    let eng = {}
    words.forEach(item => {
      eng[`${item}`] = wordsEng !== {} ? wordsEng[`${item}Eng`] : 'no data'
      rus[`${item}`] = wordsRu !== {} ? wordsRu[`${item}Ru`] : 'no data'
    })
    let strings = new LocalizedStrings({
      rus: rus,
      eng: eng
    })
    this.setState({ strings })
  }

  render () {
    const { user, language, onEngLang, onRusLang } = this.props
    const { strings } = this.state

    console.log(strings.logOut)
    const classNameFirstButton = Boolean(Object.keys(user).length) ?
    'dropdown firstButtonLogin' : 'dropdown firstButtonLogout'
    /*return (
      <div>
        <div className='col-xs-12 col-md-12'>
          <div
            style={{ float: 'right'}}
            onClick={() => {
              onEngLang()
            }
          }
          >  ENG
        </div>
        <div
          style={{ float: 'right'}}
          onClick={() => {
            onRusLang()
          }
        }
        >RUS|
      </div>
    </div>
    <div className='container'>
      <div>
        <a href='/' title='Return to the homepage'>
        <div className='logo'
          style={{ backgroundImage: 'url(https://firebasestorage.googleapis.com/v0/b/cyber-academy.appspot.com/o/logo.png?alt=media&token=338a7d4a-1e8a-4b6a-87a0-0d9e2e9353dc)'}}
          ></div>
        </a>
      </div>
      <div className={classNameFirstButton}>
        <div className='navbtn1'
          onClick={() => { browserHistory.push({ pathname: `/faculties` }) }}
          >{strings.faculties}</div>
          <div className='dropdown-content firstButton-dropdown'>
            <a href='/faculty/CS:GO'>CS:GO</a>
            <a href='/faculty/Dota2'>Dota2</a>
            <a href='/faculty/LoL'>LOL</a>
          </div>
        </div>
        <div
          className='navbtn2'
          onClick={() => { browserHistory.push({ pathname: `` }) }}
          >{strings.tournaments}
        </div>
        <div
          className='navbtn2'
          onClick={() => { browserHistory.push({ pathname: '/forum' }) }}
          >{strings.forum}
        </div>
        {!Object.keys(user).length &&
          <div
            className='navbtnLogin'>

            <a href={`${backend}/auth/steam`}> LOGIN </a>
          </div> }

          {Boolean(Object.keys(user).length) &&
            <div className='dropdown'>
              <div className='navbtn4'>{user.displayName}</div>
              <div className='dropdown-content'>
                <a href='/MyCourses'>{strings.myCourses}</a>
                <a href='/statistics'>{strings.statistics}</a>
                <a href='/'
                onClick={() => firebase.auth().signOut()}>
                Log out</a>
              </div>
            </div>
          }
        </div>
      </div>
    )*/
//<li><a className="btn btn-default button_shadow-golden button-golden" href={`${backend}/auth/steam`}> LOGIN </a></li>
    return (<div className="row">
    <div className="col-sm-12">
        <div id="header">
            <nav className="navbar navbar-default" id="main_nav">
                
                    <div className="navbar-header">
                        <a className="navbar-brand" href="/" title='Return to the homepage'><img src="https://firebasestorage.googleapis.com/v0/b/cyber-academy.appspot.com/o/logo.png?alt=media&token=338a7d4a-1e8a-4b6a-87a0-0d9e2e9353dc" alt="logo"/></a>
                    </div>
                    <ul className="nav navbar-nav nav_center_li pull-right-lg" id="main_nav_menu">
                        <li className="dropdown">
                            <button className="button-golden dropbtn button_shadow-golden" onClick={() => 
                              { browserHistory.push({ pathname: `/faculties` }) }}>{strings.faculties}</button>
                            <div className="dropdown-content text-uppercase">
                            <a href='/faculty/CS:GO'>cs:go</a>
                            <a href='/faculty/Dota2'>dota2</a>
                            <a href='/faculty/LoL'>lol</a>
                                <div><img src="https://firebasestorage.googleapis.com/v0/b/cyber-academy.appspot.com/o/dropdown_faculties_down.png?alt=media&token=17c819b5-e5d5-42b7-8896-df9354c2aa96" alt="dropdown_facs"/></div>
                            </div>
                    </li>
                    <li><button type="button" className="btn btn-default button_shadow-golden button-golden" onClick={() => 
                      { browserHistory.push({ pathname: `` }) }}>{strings.tournaments}</button></li>
                    <li><button type="button" className="btn btn-default button_shadow-golden button-golden"onClick={() => 
                      { browserHistory.push({ pathname: '/forum' }) }}>{strings.forum}</button></li>
                      {!Object.keys(user).length && 
                      <li><button type="button" className="btn btn-default button_shadow-golden  button-golden text-uppercase" id="login" onClick={() => 
                      { window.location.href = `${backend}/auth/steam`} }>
                      <img src="https://firebasestorage.googleapis.com/v0/b/cyber-academy.appspot.com/o/icon_steam_new.jpg?alt=media&token=45309ab7-ab34-489f-8184-b6eb84782fcc" alt="icon_steam"/>
                      login</button></li>}
                    <li id="language_menu">
                        <div className="dropdown">
                            <button className="button-golden dropbtn button_shadow-golden">Ru</button>
                            <div className="dropdown-content">
                                <a href="#" id="first_link" className="button-golden" onClick={() =>{ onEngLang()} }>En</a>
                                <a href="#" className="button-golden" onClick={() => { onRusLang()} }>Ru</a>
                                <a href="#" className="button-golden">De</a>
                            </div>
                        </div>
                    </li>
                    <li>
                      {Boolean(Object.keys(user).length) &&
                      <div className='dropdown'>
                        <div className='navbtn4'>{user.displayName}</div>
                        <div className='dropdown-content'>
                          <a href='/MyCourses'>{strings.myCourses}</a>
                          <a href='/statistics'>{strings.statistics}</a>
                          <a href='/' onClick={() => firebase.auth().signOut()}>
                          Log out</a>
                          </div>
                          </div>
                          }
                    </li>
                </ul>
        </nav>
    </div>
</div></div>)
  }
}
Header.propTypes = {
  user: PropTypes.object
}

export default Header
