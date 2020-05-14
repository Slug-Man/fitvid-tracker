import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import './WorkoutPlanBox.css';
import {
  DatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import { ThemeProvider } from "@material-ui/styles";
import MomentUtils from '@date-io/moment';
import { createMuiTheme } from "@material-ui/core";
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import { setSchedule } from '../../redux/actions/scheduleActions';
import ApiClient from '../../Services/ApiClient';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

const defaultMaterialTheme = createMuiTheme({
  palette: {
    primary: {
      main: "#212121"
    },
  },
});

const useStyles = makeStyles((theme) => ({
  button: {
    backgroundColor: 'white',

    '&:hover': {
      backgroundColor: 'black',
      color: 'white',
    },
  },
}));


const WorkoutPlanBox = ({ plan }) => {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [firstYoutubeId, setFirstYouTubeId] = useState(null);

  const schedule = useSelector(state => state.schedule);
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    ApiClient.getWorkout(plan.workoutList[0]).then(workout => setFirstYouTubeId(workout.youtubeId))
  }, [])

  function addToSchedule (startDate) {
    const newScheduleItems = [];

    for (let i = 0; i < plan.workoutList.length; i++) {
      if (plan.workoutList[i]) {
        newScheduleItems.push({
          day: moment(startDate).add(i, 'days').format('YYYY-MM-DD'),
          workout: plan.workoutList[i]
        })
      }
    }

    const newSchedule = { userId: schedule.userId, map: [...schedule.map, ...newScheduleItems] };
    ApiClient.updateSchedule(newSchedule).then((response) => {
      dispatch(setSchedule(response));
    });
  }

  const classes = useStyles(); 

  function changeDate (date) {
    addToSchedule(date)
    setPickerOpen(false);
  }

  function closePicker () { setPickerOpen(false) };
  function openPicker () { setPickerOpen(true) };

  function redirectToWorkoutPlan () {
    const planPath = `/WorkoutPlan/${plan._id}`;
    history.push(planPath);
  }

  return (
    <ThemeProvider theme={defaultMaterialTheme}>
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <div className="single-workout-box">
          <div className="description-and-middle-box">
            <div className="description-box" onClick={redirectToWorkoutPlan}>
              <h2>{plan.name}</h2>
              <p>{plan.description}</p>

              {/* <p>
                <u>difficulty:</u> {'workout.difficulty'}
              </p> */}
            </div>

            <div className="option-buttons">
              <Button className={classes.button} onClick={openPicker}>Add to schedule</Button>
              <DatePicker open={pickerOpen} id="datePicker" format='YYYY-MM-DD' onChange={changeDate} onClose={closePicker} style={{ display: 'none' }}></DatePicker>

              {plan.trainingDays ? (
                <Link
                  style={{ textDecoration: 'none'}}
                  to={{ pathname: '/WorkoutPlan', state: { workout: plan } }}
                >
                  <Button className={classes.button}>View Workout Plan</Button>
                </Link>
              ) : (
                  <Link style={{ textDecoration: 'none'}} to={{ pathname: '/CreateWorkoutPlan', state: { workout: plan } }}>
                    <Button className={classes.button}>Add to Workoutplan</Button>
                  </Link>
                )}
            </div>
          </div>

          <div className="video-box">
            <iframe
              src={`https://www.youtube.com/embed/${firstYoutubeId}`}
              frameborder="0"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>
          </div>
        </div>
      </MuiPickersUtilsProvider>
    </ThemeProvider>
  );
};

export default WorkoutPlanBox;
