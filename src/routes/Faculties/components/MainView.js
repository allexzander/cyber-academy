import React, {Component} from 'react'
import firebase from 'firebase'
import LocalizedStrings from 'react-localization'
import {browserHistory} from 'react-router'
import './faculties.scss'
class MainView extends Component {
  constructor(props) {
    super(props)

    this.state = {
      courses: [],
      coursesFetched: false,
      siteInfoLoaded: false,
      words: ['CSGOButton', 'CSGODescription', 'DotaButton', 'DotaDescription', 'LoLButton', 'LoLDescription'],
      wordsEng: {},
      wordsRu: {},
      localizedStrings: {},
      language: "RU",
      DotaButton: '',
      LoLButton: '',
      CSGOButton: '',
      DotaDescription: '',
      LoLDescription: '',
      CSGODescription: '',
      DotaImg: '',
      LoLImg: '',
      CSGOImg: ''
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
    console.log('set ', language)
    localizedStrings.setLanguage(language.language)
    this.setState({ localizedStrings })
  }

  componentWillReceiveProps (nextProps) {
    console.log("HomeView componentWillReceiveProps");
    this.props.language !== nextProps.language && this.setLanguage(nextProps.language)
  }

  componentDidMount () {
    this.fetchText('faculties')
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
  /*-----------------------------------------------------------------*/

  componentWillMount() {}

  render() {
    const { localizedStrings } = this.state;

    return (
      <div className='container'>
        <div className='content-faculties'>
          <div className='row'>
            <div className='col-sm-4 col-md-4'>
              <div className='third1-faculties' onClick={() => {
                browserHistory.push({pathname: '/faculty/CS:GO'})
              }}></div>
              <div className='btnEnterFacult-faculties' style={{
                backgroundImage: 'url(https://firebasestorage.googleapis.com/v0/b/cyber-academy.appspot.com/o/btnEnterFacult.png?alt=media&token=fd547211-281b-49a0-97c4-37b45691a719)'
              }} onClick={() => {
                browserHistory.push({pathname: '/faculty/CS:GO'})
              }}>
                {localizedStrings.CSGOButton}
              </div>
              <div className='textFrame-faculties' style={{
                backgroundImage: 'url(https://firebasestorage.googleapis.com/v0/b/cyber-academy.appspot.com/o/textFrame.jpg?alt=media&token=fc8f06c4-b584-4303-9a81-e3ded24b2a10)'
              }}>
              {localizedStrings.CSGODescription}
              </div>
            </div>
            <div className='col-sm-4 col-md-4'>
              <div className='third2-faculties' onClick={() => {
                browserHistory.push({pathname: '/faculty/Dota2'})
              }}></div>
              <div className='btnEnterFacult-faculties' style={{
                backgroundImage: 'url(https://firebasestorage.googleapis.com/v0/b/cyber-academy.appspot.com/o/btnEnterFacult.png?alt=media&token=fd547211-281b-49a0-97c4-37b45691a719)'
              }} onClick={() => {
                browserHistory.push({pathname: '/faculty/Dota2'})
              }}>
                {localizedStrings.DotaButton}
              </div>
              <div className='textFrame-faculties' style={{
                backgroundImage: 'url(https://firebasestorage.googleapis.com/v0/b/cyber-academy.appspot.com/o/textFrame.jpg?alt=media&token=fc8f06c4-b584-4303-9a81-e3ded24b2a10)'
              }}>
                {localizedStrings.DotaDescription}
              </div>
            </div>
            <div className='col-sm-4 col-md-4'>
              <div className='third3-faculties' onClick={() => {
                browserHistory.push({pathname: '/faculty/LoL'})
              }}></div>
              <div className='btnEnterFacult-faculties' style={{
                backgroundImage: 'url(https://firebasestorage.googleapis.com/v0/b/cyber-academy.appspot.com/o/btnEnterFacult.png?alt=media&token=fd547211-281b-49a0-97c4-37b45691a719)'
              }} onClick={() => {
                browserHistory.push({pathname: '/faculty/LoL'})
              }}>
                {localizedStrings.LoLButton}
              </div>
              <div className='textFrame-faculties' style={{
                backgroundImage: 'url(https://firebasestorage.googleapis.com/v0/b/cyber-academy.appspot.com/o/textFrame.jpg?alt=media&token=fc8f06c4-b584-4303-9a81-e3ded24b2a10)'
              }}>
                {localizedStrings.LoLDescription}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
MainView.propTypes = {
  params: React.PropTypes.object,
  discipline: React.PropTypes.string
}

export default MainView
