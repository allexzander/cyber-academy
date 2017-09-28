import React, { Component } from 'react'
import { Link, browserHistory } from 'react-router'
import './HomeViewNew.scss'
import Slider from 'react-slick'
import VideoPlayer from './VideoPlayer'
import firebase from 'firebase'

class HomeView extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showVideo: false,
      transactionToChange: {},
      stopVideo:false,
      siteInfoLoaded: false,
      quaterText1Ru: '',
      quaterText2Ru: '',
      quaterText3Ru: '',
      quaterText4Ru: '',
      linkVideoToParentsRu: '',
      buttonTextRu: '',
      videoButtonVideoToParentsRu: '',
      videoButtonCoverVideoRu: ''
    }
  }

  componentWillMount () {
    firebase.database().ref('siteInfo/' + 'russian/' + 'homepage')
    .once('value')
    .then(snapshot => {
      const object = snapshot.val()
      if (object !== null) {
        const {
          quaterText1Ru,
          quaterText2Ru,
          quaterText3Ru,
          quaterText4Ru,
          linkVideoToParentsRu,
          buttonTextRu,
          videoButtonVideoToParentsRu,
          videoButtonCoverVideoRu
        } = object
        this.setState({
          quaterText1Ru,
          quaterText2Ru,
          quaterText3Ru,
          quaterText4Ru,
          linkVideoToParentsRu,
          buttonTextRu,
          videoButtonVideoToParentsRu,
          videoButtonCoverVideoRu,
          siteInfoLoaded: true })
      } else {
        this.setState({ siteInfoLoaded: true })
      }
    })
  }

  render () {
    let videoUrl = ""; //linkVideoToParentsRu
    const { showVideo, stopVideo } = this.state
    console.log(this.props)
    const settings = {
      accessibility: false,
      autoplay: true,
      autoplaySpeed: 3000,
      centerMode: false,
      useCSS: true,
      fade:true,
      arrows: false,
      dots: false,
      infinite: true,
      slidesToShow: 1,
      slidesToScroll: 1
    }
    const {
      quaterText1Ru,
      quaterText2Ru,
      quaterText3Ru,
      quaterText4Ru,
      linkVideoToParentsRu,
      buttonTextRu,
      videoButtonVideoToParentsRu,
      videoButtonCoverVideoRu
    } = this.state
    const classNameButtonPause = stopVideo && showVideo ? 'pauseVideoToParents-home' : 'playVideoToParents-home'
    const videoButtonName = showVideo ? videoButtonCoverVideoRu : videoButtonVideoToParentsRu
    return (
      <span className>
        <div className="row">
        <div className="col-sm-12">
            <div id="banner"><img src="https://firebasestorage.googleapis.com/v0/b/cyber-academy.appspot.com/o/banner_cs_go.jpg?alt=media&token=e8d26650-a125-48d7-8bf0-94ed347cddbd" alt="banner"/></div>
            <div id="banner_mobile">CS GO</div>
        </div>
    </div>
    {!showVideo &&
    <div className="row" id="content">
        <div className="col-sm-6 col-md-4 col-lg-3">
            <div className="section"><img src="https://firebasestorage.googleapis.com/v0/b/cyber-academy.appspot.com/o/circle_inner_ornament.png?alt=media&token=e1ccd349-0525-486a-b311-9e90448f89aa" alt="circle_ornament"/>
                <div className="description text-uppercase">{quaterText1Ru}</div>
                <div className="circle"><img src="https://firebasestorage.googleapis.com/v0/b/cyber-academy.appspot.com/o/gears.png?alt=media&token=d6509832-ff0d-4eec-8267-46cf02344579" alt="icon_gears"/></div></div>
            </div>
            <div className="col-sm-6 col-md-4 col-lg-3">
                <div className="section"><img src="https://firebasestorage.googleapis.com/v0/b/cyber-academy.appspot.com/o/circle_inner_ornament.png?alt=media&token=e1ccd349-0525-486a-b311-9e90448f89aa" alt="circle_ornament"/>
                    <div className="description text-uppercase">{quaterText2Ru}</div>
                    <div className="circle"><img src="https://firebasestorage.googleapis.com/v0/b/cyber-academy.appspot.com/o/book.png?alt=media&token=c5aaa8b8-1172-40cc-9369-5446700ae174" alt="icon_book"/></div></div>
            </div>
			<div className="clearfix visible-sm-block"></div>
            <div className="col-sm-6 col-md-4 col-lg-3">
                <div className="section"><img src="https://firebasestorage.googleapis.com/v0/b/cyber-academy.appspot.com/o/circle_inner_ornament.png?alt=media&token=e1ccd349-0525-486a-b311-9e90448f89aa" alt="circle_ornament"/>
                    <div className="description text-uppercase">{quaterText3Ru}</div>
                    <div className="circle"><img src="https://firebasestorage.googleapis.com/v0/b/cyber-academy.appspot.com/o/hat.png?alt=media&token=e106cf0e-3dff-4276-9fc6-bb30c5584a92" alt="icon_hat"/></div></div>
            </div>
            <div className="col-sm-6 col-md-12 col-lg-3">
                <div className="section"><img src="https://firebasestorage.googleapis.com/v0/b/cyber-academy.appspot.com/o/circle_inner_ornament.png?alt=media&token=e1ccd349-0525-486a-b311-9e90448f89aa" alt="circle_ornament"/>
                    <div className="description text-uppercase">{quaterText4Ru}</div>
                    <div className="circle"><img src="https://firebasestorage.googleapis.com/v0/b/cyber-academy.appspot.com/o/trophy.png?alt=media&token=4e251814-85d7-4674-b19d-72ecbc8e30d3" alt="icon_trophy"/></div></div>
            </div>
        </div>
    }
        <div className="row">
            <div className="col-sm-12">
                <div className="text-center" id="start_course">
                  <button type="button" className="btn btn-default button_shadow-golden button-golden" onClick={() => { browserHistory.push({ pathname: '/faculties' }) }}>
                    {buttonTextRu}</button></div>
            </div>
        </div>
        <div className="row">
            <div className="col-sm-12">
              {!!showVideo && <div>
                  <div>
                    <VideoPlayer
                      url={videoUrl}
                      stopVideo={stopVideo && showVideo}
                    />
                  </div>
                </div>}
            </div>
        </div>
        <div className="row">
            <div className="col-sm-12">
                <div id="player">
                    <div id="play_button">
                        <a href="#" onClick={() => { this.setState({ showVideo: !showVideo, stopVideo: !showVideo  }) }}>
                          <img src="https://firebasestorage.googleapis.com/v0/b/cyber-academy.appspot.com/o/player_play_button.png?alt=media&token=164da85f-0e16-42a1-a020-96883d41161a" alt="player_play_button"/></a>
                        <span id="video_message">{videoButtonName}</span>
                    </div>
                </div>
            </div>
        </div>
        </span>
        )
      }
    }
export default HomeView
