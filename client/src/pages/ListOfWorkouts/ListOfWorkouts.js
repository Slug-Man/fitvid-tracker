import React, { useState, useEffect } from 'react';
import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme } from '@material-ui/core';
import WorkoutList from '../../components/WorkoutList/WorkoutList';
import FilterWorkouts from './../../components/WorkoutList/FilterWorkouts';
import './ListofWorkouts.css';
import { Link } from 'react-router-dom';
import Card from '@material-ui/core/Card';
import ApiClient from '../../Services/ApiClient';
import Navigation from './../../components/Navigation/navBar';
import { Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Workout from '../Workout/Workout';

function ListOfWorkouts(props) {
  const { handle } = props.match.params;
  const { state } = props.location;
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const user = useSelector((state) => state.currentUser);

  const handleTabChange = (event, newValue) => {
    console.log(newValue);
    setValue(newValue);
  };

  const [searchValue, setSearchValue] = useState('');
  const [myWorkouts, setmyWorkouts] = useState([]);
  const [AllWorkouts, setAllWorkouts] = useState([]);
  const [currentSelectedTabWorkouts, setcurrentSelectedTabWorkouts] = useState(
    []
  );
  const [filteredWorkouts, setfilteredWorkouts] = useState([]);
  const [checkBoxStatus, setcheckBoxStatus] = useState({
    easy: false,
    medium: false,
    hard: false,
  });

  useEffect(() => {
    ApiClient.getAllWorkouts().then((workouts) => setAllWorkouts(workouts));
    ApiClient.getAllWorkouts().then((workouts) =>
      setfilteredWorkouts(workouts)
    );
    ApiClient.getAllWorkouts().then((workouts) =>
      setcurrentSelectedTabWorkouts(workouts)
    );
    ApiClient.getAllWorkouts().then((workouts) =>
      console.log('fetch getAll Request', workouts)
    );
    ApiClient.getMyWorkouts().then((workouts) => setmyWorkouts(workouts));
  }, []);


  const handleInputChange = (enteredInput) => {
    setSearchValue(enteredInput);
    filterWorkoutsDifficultyAndSearch(checkBoxStatus, enteredInput);
  };

  const handleCheckBoxChange = (toggleKey) => {
    let messengerObjectForBoxStatus = Object.assign(checkBoxStatus);
    if (toggleKey === 'easy') {
      if (checkBoxStatus.easy === false) {
        setcheckBoxStatus({ ...checkBoxStatus, easy: true });
        messengerObjectForBoxStatus.easy = true;
      } else {
        setcheckBoxStatus({ ...checkBoxStatus, easy: false });
        messengerObjectForBoxStatus.easy = false;
      }
    }
    if (toggleKey === 'medium') {
      if (checkBoxStatus.medium === false) {
        setcheckBoxStatus({ ...checkBoxStatus, medium: true });
        messengerObjectForBoxStatus.medium = true;
      } else {
        setcheckBoxStatus({ ...checkBoxStatus, medium: false });
        messengerObjectForBoxStatus.medium = false;
      }
    }
    if (toggleKey === 'hard') {
      if (checkBoxStatus.hard === false) {
        setcheckBoxStatus({ ...checkBoxStatus, hard: true });
        messengerObjectForBoxStatus.hard = true;
      } else {
        setcheckBoxStatus({ ...checkBoxStatus, hard: false });
        messengerObjectForBoxStatus.hard = false;
      }
    }
    filterWorkoutsDifficultyAndSearch(messengerObjectForBoxStatus);
  };

  const filterWorkoutsDifficultyAndSearch = (
    checkBoxStatus,
    enteredInput = searchValue
  ) => {
    let filteredArray = [];
    console.log('inside filter method -->', filteredArray);

    if (checkBoxStatus.easy === true) {
      filteredArray = currentSelectedTabWorkouts.filter((Workout) => {
        return Workout.difficulties.easy;
      });
    }
    if (checkBoxStatus.medium === true) {
      filteredArray = filteredArray.concat(
        currentSelectedTabWorkouts.filter(
          (Workout) => Workout.difficulties.medium
        )
      );
    }
    if (checkBoxStatus.hard === true) {
      filteredArray = filteredArray.concat(
        currentSelectedTabWorkouts.filter(
          (Workout) => Workout.difficulties.hard
        )
      );
    } else {
    }

    if (
      (filteredArray.length > 0 && checkBoxStatus.easy) ||
      checkBoxStatus.medium ||
      checkBoxStatus.hard
    ) {
      filteredArray = filteredArray.filter((Workout) => {
        console.log('inside filter.length > 0 and on e true -->', Workout);
        return Workout.name.toLowerCase().includes(enteredInput.toLowerCase());
      });
      console.log(filteredArray);
      setfilteredWorkouts(filteredArray);
    } else {
      let searchFilteredArray = currentSelectedTabWorkouts.filter((Workout) => {
        return Workout.name.toLowerCase().includes(enteredInput.toLowerCase());
      });
      setfilteredWorkouts(searchFilteredArray);
    }
  };

  return !user ? (
    <Redirect to="/" />
  ) : (
    <div>
      <Navigation />
      <div className="header-search-view">
        <ThemeProvider theme={defaultMaterialTheme}>
          <Paper className={classes.root}>
            <Tabs
              value={value}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              centered
            >
              <Tab
                label="Browse Workouts"
                indicatorColor="primary"
                textColor="primary"
                centered
              />
              <Tab label="My saved Workouts" />
            </Tabs>
          </Paper>
        </ThemeProvider>
      </div>
      <div className="list-filter-container">
        <WorkoutList
          workouts={filteredWorkouts}
          passedIndex={
            state && state.passedIndex >= 0 ? state.passedIndex : 'nothing'
          }
        ></WorkoutList>
        <FilterWorkouts
          handleCheckBoxChange={handleCheckBoxChange}
        ></FilterWorkouts>
      </div>
    </div>
  );
}

export default ListOfWorkouts;

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
});

const defaultMaterialTheme = createMuiTheme({
  palette: {
    primary: {
      main: '#212121',
    },
  },
});
