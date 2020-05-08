import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import TopBar from '../../components/TopBar/TopBar';
import { useSelector } from "react-redux";
import ScheduledForToday from '../../components/ScheduledForToday/ScheduledForToday';
import Navigation from './../../components/Navigation/nav'


function HomePage () {

  const user = useSelector(state => state.currentUser);

  return (
    <div>
      <TopBar />
      <Navigation/>
      <div>Welcome {user.firstName}, ready for a workout?</div>
      <ScheduledForToday />
      <div>
        <Link to="/workoutList">Browse Workouts</Link>
        <Link to="/createWorkout">Create New Workout</Link>
      </div>
      <div>
        <Link to="/ListOfWorkoutPlans">Browse Workout Plans</Link>
        <Link to="/CreateWorkoutPlan">Create New Workout Plan</Link>
      </div>
    </div>
  )
}

export default HomePage;