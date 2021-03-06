import React, { Component } from 'react'
import StripeComponent from '../../../components/StripeComponent'
import firebase from 'firebase'
import { connect } from 'react-redux'
import './account.scss'

class MainView extends Component {
  constructor (props) {
    super(props)
    this.state = {
      courses: [],
      coursesFetched: false
    }
  }
  componentWillMount () {
    const { params } = this.props
    this.setState()
    this.fetchItem(params.courseId)
  }

  fetchItem (id) {
    this.setState({
      course: {},
      courseLoaded: false
    })

    firebase.database().ref('courses/' + id)
    .once('value')
    .then(snapshot => {
      const object = snapshot.val()
      if (object !== null) {
        const course = { ...snapshot.val(), id }
        this.setState({
          course,
          courseLoaded: true
        })
      } else {
        this.setState({ courseLoaded: true })
      }
    })
  }

  render () {
    const { course, courseLoaded } = this.state
    const { user, params } = this.props
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
    return (
      <div className='container'>
        <div className='row'>
          <div className='col-sm-12 col-md-12 vip-header-account'
               style={{ backgroundImage: 'url(https://firebasestorage.googleapis.com/v0/b/cyber-academy.appspot.com/o/vipHeader.jpg?alt=media&token=91e2257d-cdd1-47b5-9929-84d717acb420)'}}
        ></div>
          <div className='col-sm-6 col-md-6 frame-account'
               style={{ backgroundImage: 'url(https://firebasestorage.googleapis.com/v0/b/cyber-academy.appspot.com/o/frame.jpg?alt=media&token=42025016-fdda-4f26-9567-59d53188d18f)'}}
          >
            <div className='frame-text-account '>
              <p style={{ paddingBottom: '10px' }}>СТАНДАРТНЫЙ АККАУНТ</p>
              <p>- ВИДЕО УРОКИ</p>
              <p>- ПРАКТИЧЕСКИЕ ЗАДАНИЯ</p>
              <p>- ТЕСТОВЫЕ ЗАДАНИЯ</p>
              <p>- ОБЩЕНИЕ С ТРЕНЕРАМИ ЧЕРЕЗ ФОРУМ</p>
              <p>- СТАТИСТИКА</p>
              <p>- СОВЕТЫ НА ОСНОВЕ СТАТИСТИКИ</p>
            </div>
            <p style={{ fontSize: '15px', paddingLeft: '80px' }}>ЦЕНА:
              <span style={{ fontSize: '18px' }}> {course.price}$</span>
            </p>
          </div>
          <div className='col-sm-6 col-md-6 vip-frame-account'
               style={{ backgroundImage: 'url(https://firebasestorage.googleapis.com/v0/b/cyber-academy.appspot.com/o/vipFrame.jpg?alt=media&token=041c2a70-79c9-4810-a829-a8c772fd9880)'}}
          >
            <div className='frame-text-account '>
              <p style={{ paddingBottom: '10px' }}>VIP АККАУНТ</p>
              <p>- ВИДЕО УРОКИ</p>
              <p>- ПРАКТИЧЕСКИЕ ЗАДАНИЯ</p>
              <p>- ТЕСТОВЫЕ ЗАДАНИЯ</p>
              <p>- ОБЩЕНИЕ С ТРЕНЕРАМИ ЧЕРЕЗ ФОРУМ</p>
              <p>- СТАТИСТИКА</p>
              <p style={{ paddingBottom: '10px' }}>- СОВЕТЫ НА ОСНОВЕ СТАТИСТИКИ</p>
              <h1></h1>
              <p>- ПЕРСОНАЛЬНОЕ ОБЩЕНИЕ С ТРЕНЕРОМ ЧЕРЕЗ ЛИЧНЫЕ СООБЩЕНИЯ</p>
              <p>- ПЕРСОНАЛЬНЫЙ ПОДХОД К ВАШИМ ТРЕНИРОВКАМ</p>
              <p>- СОВЕТЫ НА ОСНОВЕ ПРОАНАЛИЗИРОВАННЫХ РЕПЛЕЕВ</p>
            </div>
            <p style={{ fontSize: '15px', paddingLeft: '320px' }}>ЦЕНА:
              <span style={{ fontSize: '18px' }}> {course.vipPrice}$ </span>
            </p>
          </div>
          <div className='col-sm-6 col-md-6 ' style={{ paddingLeft: '50px' }}>
            {courseLoaded && course.name && !isBuyButtonShow() && !isBuyVipButtonShow() &&
            <div className='standart-button-account '>
              <StripeComponent
                price={course.price}
                amount={course.price * 100}
                buttonText='Купить'
                courseId={course.id}
                description={course.name}
                userId={user.uid}
                isVip={false} /> </div>}
          </div>
          <div className='col-sm-6 col-md-6' style={{ paddingLeft: '280px' }}>
            {courseLoaded && course.name && !isBuyVipButtonShow() &&
              <div className='vip-button-account '>
                <StripeComponent
                  price={course.vipPrice}
                  amount={course.vipPrice * 100}
                  courseId={course.id}
                  buttonText='Купить'
                  description={`VIP ${course.name}`}
                  userId={user.uid}
                  isVip={true} />
                </div>}
          </div>
        </div>
      </div>
    )
  }
}
MainView.propTypes = {
  user: React.PropTypes.object
}
const mapStateToProps = state => ({
  user: state.auth.user
})

export default connect(mapStateToProps)(MainView)
