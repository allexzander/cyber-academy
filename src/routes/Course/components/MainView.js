import React, {Component, PropTypes} from 'react'
import firebase from 'firebase'
import CommentList from '../containers/CommentListContainer'
import {connect} from 'react-redux'
import {browserHistory} from 'react-router'
import backend from '../../../apis'
import VideoPlayer from './VideoPlayer'
import Slider from 'react-slick'
import './course.scss'

class MainView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      course: {},
      courseLoaded: false,
      lessons: [],
      lessonsLoaded: false,
      sections: [],
      courseLessons: [],
      showComments: false,
      buttonName: 'Show Comments',
      lessonDescription: '',
      stopVideo: false
    }
    this.renderSectionsList = this.renderSectionsList.bind(this)
    this.next = this.next.bind(this)
    this.previous = this.previous.bind(this)
  }

  componentWillMount() {
    const {params} = this.props
    this.setState()
    this.fetchItem(params.courseId)
  }

  fetchItem(id) {
    this.setState({course: {}, courseLoaded: false, lessons: [], lessonsLoaded: false, newLessons: []})

    firebase.database().ref('courses/' + id).once('value').then(snapshot => {
      const object = snapshot.val()
      if (object !== null) {
        const course = {
          ...snapshot.val(),
          id
        }
        const {sections} = course
        const newSections = sections.map(section => {
          const promises = section.lessonsIds.map(id => firebase.database().ref('lessons/' + id).once('value').then(snapshot2 => ({
            ...snapshot2.val(),
            id
          })))
          return Promise.all(promises).then(lessons => {
            section = {
              ...section,
              lessons
            }
            return (section)
          })
        })
        Promise.all(newSections).then(result => {
          let newLessons = []
          result.forEach(section => section.lessons.forEach(item => newLessons.push(item)))
          this.setState({
            sections: result,
            course,
            comments: course.comments,
            lessonDescription: result[0].lessons[0].description,
            courseLoaded: true,
            lessonsLoaded: true,
            newLessons
          })
        })
      } else {
        this.setState({courseLoaded: true})
      }
    })
  }

  next() {
    this.slider.slickNext()
  }
  previous() {
    this.slider.slickPrev()
  }
  renderSectionsList() {
    const {
      sections = [],
      newLessons = [],
      courseLoaded
    } = this.state
    const settings = {
      accessibility: false,
      autoplay: false,
      centerMode: false,
      useCSS: true,
      arrows: false,
      dots: false,
      infinite: false,
      slidesToShow: 6,
      slidesToScroll: 3,
      vertical: true
    }

    return (
      <div className='content-slider'>
        <div className='sliderButtonPrev-course' onClick={() => {
          this.previous()
        }}></div>
        <Slider ref={c => this.slider = c} {...settings}>
          {newLessons.map((item, i) => <div key={i} className='lessonButton-course' onClick={() => {
            this.setState({lessonDescription: item.description})
          }}>{item.name}
          </div>)}
        </Slider>
        <div className='sliderButtonNext-course' onClick={() => {
          this.next()
        }}></div>
      </div>
    )
  }

  renderDescripton() {
    const {lessonDescription} = this.state
    return (
      <div>
        {lessonDescription}
      </div>
    )
  }

  buttonClick() {
    const {showComments, buttonName} = this.state
    const newButtonName = (buttonName === 'Show Comments')
      ? 'Hide Comments'
      : 'Show Comments'
    this.setState({
      showComments: !showComments,
      buttonName: newButtonName
    })
  }

  renderBuyButton() {
    const {course, courseLoaded} = this.state
    const {user} = this.props
    if (!Object.keys(user).length) {
      return (
        <div className='buttonBuy-course' onClick={() => {
          browserHistory.push({pathname: `${backend}/auth/steam`})
        }}>
          <a href={`${backend}/auth/steam`}>Login to Apply</a>
        </div>
      )
    }
    if (courseLoaded && course.name) {
      return (
        <div className='buttonBuy-course' onClick={() => {
          browserHistory.push({pathname: `/accounts/${course.id}`})
        }}>
          Начать обучение {course.price}$
        </div>
      )
    }
    return false
  }

  renderBuyVipButton() {
    const {course, courseLoaded} = this.state
    const {user} = this.props

    if (!Object.keys(user).length) {
      return (
        <div className='buttonBuy-course' onClick={() => {
          browserHistory.push({pathname: `vip`})
        }}>
          Accounts
        </div>
      )
    }

    if (courseLoaded && course.name) {
      return (
        <div className='buttonBuy-course' onClick={() => {
          browserHistory.push({pathname: `/accounts/${course.id}`})
        }}>
          Vip обучение {course.vipPrice}$
        </div>
      )
    }

    return false
  }

  render() {
    const {course, showComments, sections, courseLoaded, stopVideo} = this.state
    const {params, user} = this.props
    const isBuyButtonShow = () => {
      if (user.userCourses) {
        const index = user.userCourses.findIndex(course => course.courseId === params.courseId)
        return (index !== -1)
      } else {
        return false
      }
    }
    const isBuyVipButtonShow = () => {
      if (user.userVipCourses) {
        const index = user.userVipCourses.findIndex(course => course.courseId === params.courseId)
        return (index !== -1)
      } else {
        return false
      }
    }
    if (!courseLoaded) {
      return (
        <div>Loading...</div>
      )
    }
    const classNameButtonPause = stopVideo
      ? 'pauseVideoToParents-course'
      : 'playVideoToParents-course'
    return (
      <div className='container'>
        <div className='container-course text-center'>
          <div className='row'>
            <div className='content-course'>
              <div className='col-xs-12 col-md-12 course-name-course'>
                {course.name}</div>
              <div className='col-xs-12 col-md-12 course-duration-course'>(длительность курса {course.duration}
                {/* {duration} */}
                )</div>
              <div className='col-xs-12 col-md-12'>
                {courseLoaded && <div>
                  <VideoPlayer url={sections[0].lessons[0].videoUrl} stopVideo={stopVideo}/>
                  <div className='videoButton-course' onClick={() => {
                    this.setState({
                      stopVideo: !stopVideo
                    })
                  }}>
                    <div className={classNameButtonPause} onClick={() => {
                      this.setState({
                        stopVideo: !stopVideo
                      })
                    }}></div>
                  </div>
                </div>
}
              </div>
              <div className='col-xs-6 col-md-6'>{!isBuyButtonShow() && !isBuyVipButtonShow() && this.renderBuyButton()}</div>
              <div className='col-xs-6 col-md-6'>{!isBuyVipButtonShow() && this.renderBuyVipButton()}</div>
              <div className='col-xs-5 col-md-5'>
                {this.renderSectionsList()}
              </div>

              <div className='col-xs-7 col-md-7'>
                <ul className='descriptionBlock-course'>
                  {this.renderDescripton()}
                </ul>
              </div>

              <div className='col-xs-12 col-md-12 comments-course'>
                <CommentList courseId={params.courseId}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

MainView.propTypes = {
  params: PropTypes.object,
  user: PropTypes.object,
  location: PropTypes.object
}

const mapStateToProps = state => ({user: state.auth.user})

export default connect(mapStateToProps)(MainView)
