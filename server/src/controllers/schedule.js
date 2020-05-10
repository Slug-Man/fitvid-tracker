const { Schedule } = require('../models/schedule');

const getSchedule = async (ctx, next) => {

  let schedule = await Schedule.findOne({ userId: ctx.user._id }).populate('map.workouts');
  if (!schedule) {
    schedule = {userId: ctx.user._id, map: []}
  }
  ctx.body = JSON.stringify(schedule);
  ctx.status = 200;
};

const updateSchedule = async (ctx, next) => {
  const update = ctx.request.body;
  console.log("updateSchedule -> update", update)
  await Schedule.findOneAndUpdate({ userId: ctx.user }, update, {
    new: true,
    upsert: true
  });
};

module.exports = {
  getSchedule,
  updateSchedule
};
