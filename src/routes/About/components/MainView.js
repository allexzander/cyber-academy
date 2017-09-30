import React, { Component } from 'react'
import './about.scss'
import firebase from 'firebase'
import LocalizedStrings from 'react-localization'

class MainView extends Component {
  constructor (props) {
    super(props)

    this.state = {
      courses: [],
      coursesFetched: false,
      siteInfoLoaded: false,
      words: ['aboutText', 'aboutTextWelcome'],
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
    console.log('set ', language)
    localizedStrings.setLanguage(language.language)
    this.setState({ localizedStrings })
  }

  componentWillReceiveProps (nextProps) {
    console.log("HomeView componentWillReceiveProps");
    this.props.language !== nextProps.language && this.setLanguage(nextProps.language)
  }

  componentDidMount () {
    this.fetchText('homepage')
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

  render () {
    const { localizedStrings } = this.state;
    return (
      <div className='row'>
        <div className='col-sm-12 col-md-12 container'>
          <h4 className='about'>
            {/* {about} */}
    <p>
      {localizedStrings.aboutText}
</p>
<p>
{localizedStrings.aboutTextWelcome}</p>
</h4>
        </div>
      </div>
    )
  }
}

export default MainView
