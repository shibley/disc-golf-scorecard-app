const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Friend = require('../models/friendModel');

exports.getAllFriends = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const friends = await Friend.find({ createdBy: userId }).sort({ 'scorecards.length': -1 });
  res.status(200).json(friends);
});

exports.getFriend = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'Friend does not exist' });
  }

  const friend = await Friend.findById(id);

  if (!friend) {
    return res.status(404).json({ error: 'Friend does not exist' });
  }

  res.status(200).json({ friend });
});

exports.updateFriendScorecards = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { scorecards } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'Friend does not exist' });
  }

  const friend = await Friend.findOneAndUpdate(
    { _id: id },
    { $push: { scorecards: { $each: scorecards } } },
  );

  if (!friend) {
    return res.status(404).json({ error: 'Friend does not exist' });
  }

  res.status(200).json({ friend });
});
