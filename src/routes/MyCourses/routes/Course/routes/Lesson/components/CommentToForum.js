import React, { Component } from 'react'
import firebase from 'firebase'
import toastr from 'toastr'
import './lessonMyCourses.scss'

class CommentToForum extends Component {
  constructor (props) {
    super(props)

    this.state = {
      course: {},
      courseLoaded: false,
      lessons: [],
      topicId:'',
      comment: ''
    }
    this.saveComment = this.saveComment.bind(this)
    this.saveCommentClick = this.saveCommentClick.bind(this)
  }
  componentWillMount () {
    const { courseId } = this.props
    this.fetchItem(courseId)
  }

  fetchItem (courseId) {
    this.setState({
      forumSections: [],
      sectionsLoaded: false
    })
    firebase.database().ref('courses/' + courseId)
    .once('value')
    .then(snapshot => {
      const object = snapshot.val()
      if (object !== null) {
        const course = object
        this.setState({ course, courseLoaded: true })
        this.fetchLessons(course.sections)
      } else {
        this.setState({ courseLoaded: true })
      }
    })
  }

  fetchLessons (sections) {
    const newSections = sections.filter((item) => item.sectionNumber !== 0)
    this.setState({
      lessons: [],
      lessonsLoaded: false
    })
    let lessonsIds = []
    newSections.forEach(section => {
      section.lessonsIds.forEach(lessonId =>
        lessonsIds.push(lessonId))
    })
    const promises = lessonsIds.map(id => {
      return firebase.database().ref('lessons/' + id)
      .once('value')
      .then(snapshot => {
        const object = snapshot.val()
        const lessonFromId = object
        lessonFromId.id = id
        return (lessonFromId)
      })
    })
    Promise.all(promises).then(result => {
      this.setState({
        lessons: result,
        lessonsLoaded: true
      })
    })
  }

  saveComment = () => {
    const { user } = this.props.auth
    const { comment, lessonId } = this.state
    const { courseId } = this.props
    console.log(courseId, comment, lessonId, user)
    this.setState({
      comments: []
    })
    firebase.database().ref('forumSections/' + courseId)
    .once('value')
    .then(snapshot => {
      const object = snapshot.val()
      if (object !== null) {
        const subSections = object.subSections
        if (subSections) {
          const comments = object.subSections[`${lessonId}`] || []
          this.setState({ comments, subSections, lessonId })
        }
      }
    })
    .then(() => {
      const { comments = [] } = this.state
      const commentStructure = {
        text: comment,
        children:[],
        uid: user.uid,
        displayName: user.displayName,
        avatar: user.avatar
      }
      const newComments = [ ...comments, commentStructure ]
      this.setState({ comments: newComments })
    })
    .then(() => {
      const { comments, subSections, lessonId } = this.state
      const newSubSections = !!subSections ? subSections : {}
      newSubSections[`${lessonId}`] = comments
      this.setState({ subSection: comments, hasLessonComments: true, comment: '' })
      firebase.database().ref('forumSections/' + courseId).update({ subSections: newSubSections })
    })
    .then(() => {
      toastr.success('Your comment saved!')
    })
  }

  renderLessonsName () {
    const { lessons } = this.state
    return lessons.map((item, i) => <option className='options-lessons' key={i} value={item.id}>{item.name}</option>)
  }

  saveCommentClick = () => {
    const { comment, lessonId } = this.state

    this.setState({ error: '' })
    if (comment === '') {
      toastr.error('Please, fill your comment')
      return false
    }
    if (!lessonId) {
      toastr.error('Please, fill your topic')
      return false
    }
    this.saveComment()
  }
  render () {
    return (
      <div>
           <select
             className='topic-options-mylesson'
             value={this.state.lessonId}
             style={{ backgroundImage: 'url(https://firebasestorage.googleapis.com/v0/b/cyber-academy.appspot.com/o/topicField.jpg?alt=media&token=b4a9884f-7b19-4ac8-8657-f514aa314063)'}}
             onChange={(e) => this.setState({ lessonId: e.target.value })}>
             <option
               value=''
               className='options-lessons-mylesson'>Выбрать тему</option>
               {this.renderLessonsName()}
          </select>
          ​<textarea
            className='question-input-mylesson'
            style={{ backgroundImage: 'url(https://firebasestorage.googleapis.com/v0/b/cyber-academy.appspot.com/o/questionInput.jpg?alt=media&token=8f265c2b-e7d8-487e-88cf-6511ee3abfae)'}}
            cols='50'
            rows='4'
            value={this.state.comment}
            onChange={(e) => this.setState({ comment: e.target.value })}
          >
          </textarea>
          <div
            className='save-comment-button-mylesson'
            onClick={this.saveCommentClick}
            >Save comment
          </div>
      </div>
    )
  }
  }

CommentToForum.propTypes = {
  courseId: React.PropTypes.string,
  user: React.PropTypes.object,
  auth: React.PropTypes.object
}

export default CommentToForum
