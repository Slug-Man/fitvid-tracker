import React, { useState, useEffect } from 'react';
import NameWorkout from '../../components/NameWorkout/NameWorkout';
import Table from '../../components/Table/Table';
import YoutubePlayer from '../../components/YoutubePLayer/YoutubePlayer'
import DescriptionWorkout from '../../components/DescriptionWorkout/DescriptionWorkout';
import DifficultyWorkout from '../../components/DifficultyWorkout/DifficultyWorkout';
import DaysWorkout from '../../components/DaysWorkout/DaysWorkout';
import TopBar from '../../components/TopBar/TopBar';
import PublicWorkout from '../../components/PublicWorkout/PublicWorkout';



//mock data
const workout = {id:"randomNumber", publicWorkout:true, workoutName:"AthleanX, fullbody", youtubeId:"vc1E5CfRfos", days: {monday: true, tuesday: false, wednesday: true, thursday: false, friday: false, saturday: false, sunday: false}, description: "Full body, bodyweight exercises with two different plans",difficulties: {easy: false, medium: true, hard: false}, exercises: [{ name: "Pull-ups", sets: 3, reps: 20, timestamp: "15"}, { name: "Abs ", sets: 2, reps: 1, timestamp: "3:00"}]}

function Workout ({
  //url/id, exercises
}) {
  
  const [exercises, setExercise] = useState(null);

  const [workoutName, setWorkoutName] = useState();
  const [description, setDescription] = useState('');
  const [difficulties, setDifficulties] = useState({easy:false, medium:false, hard:false});
  const [days, setDays] = useState({monday:false, tuesday:false, wednesday:false, thursday:false, friday:false, saturday:false, sunday:false});
  const [publicWorkout, setPublicWorkout] = useState(false);

  //videoplayer states, work on table if status editable=false
  const [timeVideo, setTimeVideo] = useState();
  const [clickTimestamp, setClickTimestamp] = useState(false);
  const [editable, setEditable] = useState(false)

  useEffect(()=>{
    setExercise(workout.exercises);
    setDescription(workout.description);
    setDifficulties(workout.difficulties);
    setDays(workout.days);
    setWorkoutName(workout.workoutName);
    setPublicWorkout(workout.publicWorkout)
  }, [])

  console.log("ex", exercises)

  return (
    <div>
      <TopBar />
      <br/>
      <button onClick={()=>{setEditable(!editable)}}>{editable? "Done" : "Edit"}</button>
      <div className='div-Workout'>
        <NameWorkout workoutName={workoutName} setWorkoutName={setWorkoutName} editable={editable}/>
        <YoutubePlayer url={`https://www.youtube.com/watch?v=${workout.youtubeId}`} timeVideo={timeVideo} clickTimestamp={clickTimestamp} />
        {exercises && <Table exercises={exercises} setExercise={setExercise} editable={editable} setTimeVideo={setTimeVideo} setClickTimestamp={setClickTimestamp} clickTimestamp={clickTimestamp} />}
        <DescriptionWorkout description={description} setDescription={setDescription} editable={editable}/>
        <DifficultyWorkout difficulties={difficulties} setDifficulties={setDifficulties} editable={editable}/>
        <DaysWorkout days={days} setDays={setDays} editable={editable}/>
        <PublicWorkout publicWorkout={publicWorkout} setPublicWorkout={setPublicWorkout} editable={editable}/>
      </div>
    </div>
  )
}

export default Workout;