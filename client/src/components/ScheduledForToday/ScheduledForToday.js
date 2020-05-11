import React from 'react';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import WorkoutOnHome from '../../components/WorkoutOnHome/WorkoutOnHome';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import {
  DatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import { ThemeProvider } from "@material-ui/styles";
import { createMuiTheme } from "@material-ui/core";
import Typography from '@material-ui/core/Typography';


const defaultMaterialTheme = createMuiTheme({
  palette: {
    primary: {
      main: "#212121"
    },
  },
});

const useStyles = makeStyles((theme) => ({
  submit: {
    margin: theme.spacing(3, 0, 2),
    padding: "7px",
    marginLeft: "10px",
    backgroundColor: "black",
    color: "white",
    '&:hover': {
        backgroundColor: 'rgb(80,80,80)',
    }
  },
}));

function ScheduledForToday () {

  const schedule = useSelector(state => state.schedule);
  const classes = useStyles();
  const today = moment().format('YYYY-MM-DD');

  const [selectedDate, setSelectedDate] = useState(today);
  const [todaysWorkoutIds, setTodaysWorkoutIds] = useState([]);
  const [workoutsOfSelectedDay, setWorkoutsOfSelectedDay] = useState([]);
  const token = useSelector(state => state.currentUser).token;

  useEffect(() => {
    getWorkoutsOfSelectedDay();
  }, []);

  function changeDate (date) {
    setSelectedDate(moment(date).format('YYYY-MM-DD'));
    getWorkoutsOfSelectedDay();
  }

  function getScheduledFor () {
    return moment(selectedDate).calendar(null, {
      lastDay: '[yesterday]',
      sameDay: '[today]',
      nextDay: '[tomorrow]',
      lastWeek: '[last] dddd',
      nextWeek: '[next] dddd',
      sameElse: 'L'
    }).split(' at ')[0];
  }

  function getWorkoutsOfSelectedDay () {
    if (schedule) {
      console.log(schedule);
      console.log('selected date', selectedDate)

      setTodaysWorkoutIds(schedule.map.filter(day => (moment(day.day).format('YYYY-MM-DD') == selectedDate)));
      console.log("getWorkoutsOfSelectedDay -> todaysWorkoutIds", todaysWorkoutIds)

      if (todaysWorkoutIds.length > 0) {
        const fetchWorkoutUrl = process.env.REACT_APP_SERVER_URL + `/workout/${todaysWorkoutIds[0].workout}`;
        const workoutObj = fetch(fetchWorkoutUrl, {
          method: 'get',
          headers: new Headers({
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          })
        })
          .then(response => response.json()
            .then(data => { setWorkoutsOfSelectedDay([data]) }));
      }
    } else {
      setWorkoutsOfSelectedDay([]);
    }
  }

  return (
    <ThemeProvider theme={defaultMaterialTheme}>
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <div>
          <Typography variant="body1">Scheduled for {getScheduledFor()}:</Typography>
          <div>{todaysWorkoutIds.length < 1 ? 'nothing scheduled' :
            workoutsOfSelectedDay.map(workout => (
              <WorkoutOnHome workouts={workout} />
            ))
            }
            <Typography variant="body1">Select another day:</Typography>
              <DatePicker id="datePicker" format='YYYY-MM-DD' value={selectedDate} onChange={changeDate} />

          </div>
      </div>
    </MuiPickersUtilsProvider>
  </ThemeProvider>
  )
}

export default ScheduledForToday;
