import React, { Component } from 'react'
import TabLinks from '../../../components/TabLinks'
import axios from 'axios'
import { connect } from 'react-redux'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import moment from 'moment'
import firebase from 'firebase'
import CustomTooltip from './CustomTooltip'
import backend from '../../../../config/apis'

const NewStatisticsEnabled = false;

/*NEW STATISTICS*/
const MillisecondsInWeek = 24 * 7 * 60 * 60 * 1000;
const MillisecondsInMonth = 24 * 31 * 60 * 60 * 1000;
const MillisecondsInYear = 24 * 365 * 60 * 60 * 1000;


const OldStatisticFieldNamesToNew = {gpm: "gpm", heroDamage: "hero_damage", xpm: "xpm", 
lastHits: "last_hits", kda: "kda", towerDamage: "tower_damage", denies: "denies"};

/************** */

class Statistics extends Component {
  constructor (props) {
    super(props)
    this.state = {
      currentTab: 'totals',
      data: [],
      userData: {},
      field: 'kda',
      period: 'allTime',
      periodDataChart: [],
      daysArray: [],
      newStatistics: [],
    }
  }

  /*NEW STATISTICS*/
  formatData(field, period, inMatches) {
    console.log("formatData: " + field);
    field = OldStatisticFieldNamesToNew[field];

    let data = [];
    
    let matches = inMatches.slice(0);

    matches.sort(function (a, b) {
      return a.start_time - b.start_time;
    });

    //filter
    if (period == "month") {
      var today = new Date;
      var monthBefore = new Date(today.getTime() - MillisecondsInMonth);

      var startTime = monthBefore.getTime();
      var endTime = today.getTime();

      console.log("startTime is: " + new Date(startTime).toUTCString());
      console.log("endTime is: " + new Date(endTime).toUTCString());

        matches = matches.filter(function(match) {
          let startTimeMilliseconds = match.start_time * 1000;
          return startTimeMilliseconds >= startTime && startTimeMilliseconds <= endTime;
        });
      }
      else if (period == "week") {
        var today = new Date;
        var weekBefore = new Date(today.getTime() - MillisecondsInWeek);

        var startTime = weekBefore.getTime();
        var endTime = today.getTime();

        console.log("startTime is: " + new Date(startTime).toUTCString());
        console.log("endTime is: " + new Date(endTime).toUTCString());

        matches = matches.filter(function(match) {
          let startTimeMilliseconds = match.start_time * 1000;
          return startTimeMilliseconds >= startTime && startTimeMilliseconds <= endTime;
        });
      }
      else if (period == "day") {
        var curr = new Date;

        matches = matches.filter(function(match) {
          let dateTime = new Date(match.start_time);
          return dateTime.getDate() == curr.getDate();
        });
      }

    console.log("Sorted");

    var dateToHumanReadable = function(timestamp) {
      let dateTime = new Date(timestamp * 1000);
      let year = dateTime.getFullYear();
      let month = dateTime.getMonth();
      let date = dateTime.getDate();
      let hours = dateTime.getHours();
      let minutes = dateTime.getMinutes();
      
      //return (date + "/" + month + "/" + year + " " + hours + ":" + minutes);
      return dateTime.toLocaleDateString() + " " + dateTime.toLocaleTimeString();
    }


    for (let i = 0; i < matches.length; ++i) {
      let dataEntry = {date: dateToHumanReadable(matches[i].start_time), value: matches[i][field]};
      data.push(dataEntry);
    }

    console.dir(this.state)

    return data;
  }

  componentWillMount () {
    if (NewStatisticsEnabled) {
      console.log("componentWillMount");
      const { user } = this.props;

      this.fetchStatisticsForUserId(user.uid)
      .then((response) =>this.handleNewStatisticsFetchSuccess(response))
      .catch((error) =>this.handleNewStatisticsFetchError(error));
    }
  }

  handleNewStatisticsFetchSuccess(response) {
    console.log("handleNewStatisticsFetchSuccess");
    console.dir(response);
    if (response.matches) {
      this.setNewStatistics(response.matches);
    }
    else {
      console.log("Error: response.matches doesn't exist");
    }
  }

  handleNewStatisticsFetchError(error) {
    console.log("handleNewStatisticsFetchError: " + error);
  }

  setNewStatistics(statistics) {
    if (!NewStatisticsEnabled) {
      console.log("Warning: NewStatisticsEnabled is disabled!");
      return;
    }

    console.log("setNewStatistics: ");
    console.dir(statistics);
    let copy = Object.assign(this.state, {}, {newStatistics: statistics});
    console.dir(copy);
    this.setState(copy);
  }

 fetchStatisticsForUserId = function(userId) {
   if (!NewStatisticsEnabled) {
     console.log("Warning: NewStatisticsEnabled is disabled!");
     return {};
   }
    let requestURL = `${backend}/getdotastatistics/?steamID=${userId}`;
  
    return axios.get(requestURL)
    .then(function (response) {
      let data = response.data;
      return data;
    })
    .catch(function (error) {
      console.log("fetchStatisticsForUserId failed: " + error);
      return {};
    });
  }

  renderChartNewStatistics (data = []) {
    const { period, userDataLoaded } = this.state
    const isDayChart = (period === 'day')
    const isWeekChart = (period === 'week')
    const periodCount = {
      day: 'dddd',
      week: 'dddd',
      month: 'DD/MM',
      allTime: 'MM/YY'
    }

    const timeAway = {
      day: (24 * 60 * 60 * 1000),
      week: (7 * 24 * 60 * 60 * 1000),
      month:(30 * 24 * 60 * 60 * 1000),
      allTime: (10 * 12 * 30 * 24 * 60 * 60 * 1000)
    }
    const newData = data.filter(item => { return item.date > (Date.now() - timeAway[`${period}`]) })
    console.log(period,newData )
    const newDataWithPoints = this.cutPoints(newData, periodCount)
    const dateFormatMonthAndAllTime = (time) => {
      return moment(time).format(periodCount[`${period}`])
    }

    const dateFormatWeek = (time) => {
      if (!!data.filter(item => item.date === time)[0].dayValue) {
        return moment(time).format(periodCount[`${period}`])
      }
    }

    //TODO: bring this.state.period and this.formatData input to alignment
    if(period == "month") {
      const formattedData = this.formatData(this.state.field, "month", this.state.newStatistics);
      
      return (<div>
        <LineChart width={1100} height={400} data={formattedData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }} >
            <XAxis dataKey='date' stroke='white' tickFormatter={dateFormatMonthAndAllTime}
              interval={Math.floor(data.length / 14)} />
            <YAxis dataKey='value' stroke='yellow' />
            <Tooltip content={<CustomTooltip data={formattedData} period='monthAndAllTime' />} />
            <Line type='linear' dataKey='value' stroke='yellow' strokeWidth={3} />
          </LineChart>
      </div>);
    }
    else if(period == "week") {
      const formattedData = this.formatData(this.state.field, "week", this.state.newStatistics);
      
      return (<div>
        <LineChart width={1100} height={400} data={formattedData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }} >
            <XAxis dataKey='date' stroke='white' tickFormatter={dateFormatMonthAndAllTime}
              interval={Math.floor(data.length / 14)} />
            <YAxis dataKey='value' stroke='yellow' />
            <Tooltip content={<CustomTooltip data={formattedData} period='week' />} />
            <Line type='linear' dataKey='value' stroke='yellow' strokeWidth={3} />
          </LineChart>
      </div>);
    }
    else if(period == "day") {
      const formattedData = this.formatData(this.state.field, "day", this.state.newStatistics);
      
      return (<div>
        <LineChart width={1100} height={400} data={formattedData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }} >
            <XAxis dataKey='date' stroke='white' tickFormatter={dateFormatMonthAndAllTime}
              interval={Math.floor(data.length / 14)} />
            <YAxis dataKey='value' stroke='yellow' />
            <Tooltip content={<CustomTooltip data={formattedData} period='day' />} />
            <Line type='linear' dataKey='value' stroke='yellow' strokeWidth={3} />
          </LineChart>
      </div>);
    }
    else {
      //TODO: Make it work for other periods as well
      const formattedData = this.formatData(this.state.field, "all_time", this.state.newStatistics);

      let estimatedInterval = Math.floor(formattedData.length / 14);

      console.log("Estimated interval for all time is: " + estimatedInterval);
      
      return (<div>
        <LineChart width={1100} height={400} data={formattedData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }} >
            <XAxis dataKey='date' stroke='white' tickFormatter={dateFormatMonthAndAllTime}
              interval={estimatedInterval} />
            <YAxis dataKey='value' stroke='yellow' />
            <Tooltip content={<CustomTooltip data={formattedData} period='monthAndAllTime' />} />
            <Line type='linear' dataKey='value' stroke='yellow' strokeWidth={3} />
          </LineChart>
      </div>);
    }
  }

  /************** */

  componentDidMount () {
    this.fetchData();
  }

  fetchData () {
    const { user } = this.props
    const { field } = this.state
    this.setState({
      userData: [],
      userDataLoaded: false
    })
    firebase.database().ref('users/' + user.uid)
    .once('value')
    .then(snapshot => {
      const object = snapshot.val()
      if (object !== null) {
        const userData = object.statistics.chartStatistic ? object.statistics.chartStatistic : []
        const userDataArray = Object.values(userData)
        this.setState({ userDataArray, userDataLoaded: true })
        this.countFieldDataChart(field)
      } else {
        this.setState({ userDataLoaded: true })
      }
    })
  }
  cutPoints (data, periodCount) {
    console.log(data, Date.now())

    const { period } = this.state
    if (period === 'day') {
      return data
    } else if (period === 'week') {
      let set = new Set()
      data.forEach(item => {
        if (!set.has(moment(item.date).format(periodCount[`${period}`]))) {
          set.add(moment(item.date).format(periodCount[`${period}`]))
          item.dayValue = item.value
        }
      })
      console.log(data.length, set, Date.now())
      if (data.length !== 0) {
      data[data.length - 1].dayValue = data[data.length - 1].value
    }
      console.log(data, set, Date.now())
      return data
    } else {
      return data
    }
  }

  renderChart (data = []) {

    //TODO: remove old charts, as soon as they work
    if (NewStatisticsEnabled && this.state.newStatistics.length > 0) {
      return this.renderChartNewStatistics(data);
    }

    const { period, userDataLoaded } = this.state
    const isDayChart = (period === 'day')
    const isWeekChart = (period === 'week')
    const periodCount = {
      day: 'dddd',
      week: 'dddd',
      month: 'DD/MM',
      allTime: 'MM/YY'
    }

    const timeAway = {
      day: (24 * 60 * 60 * 1000),
      week: (7 * 24 * 60 * 60 * 1000),
      month:(30 * 24 * 60 * 60 * 1000),
      allTime: (10 * 12 * 30 * 24 * 60 * 60 * 1000)
    }
    const newData = data.filter(item => { return item.date > (Date.now() - timeAway[`${period}`]) })
    console.log(period,newData )
    const newDataWithPoints = this.cutPoints(newData, periodCount)
    const dateFormatMonthAndAllTime = (time) => {
      return moment(time).format(periodCount[`${period}`])
    }

    const dateFormatWeek = (time) => {
      if (!!data.filter(item => item.date === time)[0].dayValue) {
        return moment(time).format(periodCount[`${period}`])
      }
    }

    if (NewStatisticsEnabled && !!newData.length && !isDayChart && !isWeekChart) {
      //TODO: Make it work for other periods as well

      const formattedData = this.formatData("gpm", "all_time", this.state.newStatistics);
      
      return (<div>
        {!!newData.length && !isDayChart && !isWeekChart &&
          <LineChart width={1100} height={400} data={formattedData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }} >
            <XAxis dataKey='date' stroke='white' tickFormatter={dateFormatMonthAndAllTime}
              interval={Math.floor(data.length / 14)} />
            <YAxis dataKey='value' stroke='yellow' />
            <Tooltip content={<CustomTooltip data={formattedData} period='monthAndAllTime' />} />
            <Line type='linear' dataKey='value' stroke='yellow' strokeWidth={3} />
          </LineChart>
        }
      </div>);
    }

    return (
      <div>
        {userDataLoaded && !newData.length && <div> </div>}
        {!!newData.length && isDayChart && !isWeekChart &&
          <LineChart width={1100} height={400} data={newDataWithPoints}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }} >
            <XAxis dataKey='n' stroke='white' />
            <YAxis dataKey='value' stroke='yellow' />
            <Tooltip content={<CustomTooltip data={newDataWithPoints} period='day' />} />
            <Line type='linear' dataKey='value' stroke='yellow' strokeWidth={3} />
          </LineChart>
        }
        {!!newData.length && !isDayChart && !isWeekChart &&
          <LineChart width={1100} height={400} data={newDataWithPoints}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }} >
            <XAxis dataKey='date' stroke='white' tickFormatter={dateFormatMonthAndAllTime}
              interval={Math.floor(data.length / 14)} />
            <YAxis dataKey='value' stroke='yellow' />
            <Tooltip content={<CustomTooltip data={newDataWithPoints} period='monthAndAllTime' />} />
            <Line type='linear' dataKey='value' stroke='yellow' strokeWidth={3} />
          </LineChart>
        }
        {!!newData.length && isWeekChart &&
          <LineChart width={1100} height={400} data={newDataWithPoints}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }} >
            <XAxis dataKey='date' stroke='white' tickFormatter={dateFormatWeek} />
            <YAxis dataKey='value' stroke='yellow' />
            <Tooltip content={<CustomTooltip data={newDataWithPoints} period='week' />} />
            <Line type='linear' dataKey='value' stroke='yellow' strokeWidth={3} />
            <Line type='linear' connectNulls={true} dataKey='dayValue' stroke='blue' strokeWidth={3} />
          </LineChart>
        }
      </div>
    )
  }
  countFieldDataChart = (field) => {
    const { userDataArray = [] } = this.state
    const dataField = userDataArray ? userDataArray.find(item => item.field === field) : []
    const fieldDataChart = dataField ? dataField.values : []
    this.setState({ fieldChartData: fieldDataChart })
  }

  renderData () {
    const { userDataArray = [], fieldChartData, field } = this.state
    if (!userDataArray) {
      return <div>Loading...</div>
    }
    return (
        <div className='container'>
          <div className='content'>
            <div className='row'>
              <div className='col-sm-4 col-md-4'>
                {userDataArray.map((item, i) => <div key={i}>
                  <button
                    type='button'
                    className='btn btn-success lg'
                    onClick={() => {
                      this.setState({ field : item.field })
                      this.countFieldDataChart(item.field)
                    }}
                    >
                    {item.name}
                  </button>
                </div>)}
                <button
                  type='button'
                  className='btn btn-success lg'
                  onClick={() => {
                    this.setState({ period : 'day' })
                    this.countFieldDataChart(field)
                  }
                }
                >
                  Statistic for day
                </button>

                <button
                  type='button'
                  className='btn btn-success lg'
                  onClick={() => {
                    this.setState({ period : 'week' })
                    this.countFieldDataChart(field)
                  }
                }
                >
                  Statistic for week
                </button>

                <button
                  type='button'
                  className='btn btn-success lg'
                  onClick={() => {
                    this.setState({ period : 'month' })
                    this.countFieldDataChart(field)
                  }
                }
                >
                  Statistic for mounth
                </button>

                <button
                  type='button'
                  className='btn btn-success lg'
                  onClick={() => {
                    this.setState({ period : 'allTime' })
                    this.countFieldDataChart(field)
                  }
                }
                >
                  All time statistic
                </button>

                {this.renderChart(fieldChartData)}
              </div>
            </div>
          </div>
        </div>
      )
    }
  render () {
    return (
      <div>
        {this.renderData()}
        <div>  </div>
              <div>  </div>
                    <div>  </div>
                          <div>  </div>
                                <div>  </div>
                                      <div>  </div>
      </div>
    )
  }
  }

const mapDispatchToProps = state => ({
  user: state.auth.user
})

export default connect(mapDispatchToProps)(Statistics)
