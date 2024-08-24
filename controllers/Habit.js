const Habit = require('../models/HabitSchema');

// Create a new habit
const createHabit = async (req, res) => {
  try {
    const { name, description, target_days_per_week } = req.body;

    if (!name || !description || typeof target_days_per_week !== 'number' || target_days_per_week < 1 || target_days_per_week > 7) {
      return res.status(400).json({ error: 'Invalid input data.' });
    }

    const newHabit = new Habit({
      name,
      description,
      target_days_per_week
    });

    const savedHabit = await newHabit.save();

    // Add createdAt to completion array
    savedHabit.completion = [savedHabit.createdAt];
    await savedHabit.save();

    return res.status(201).json({
      id: savedHabit._id,
      name: savedHabit.name,
      description: savedHabit.description,
      target_days_per_week: savedHabit.target_days_per_week,
      completion: savedHabit.completion,
      message: 'Habit created successfully.'
    });
  } catch (error) {
    console.error('Error details:', error);
    return res.status(500).json({ error: 'Failed to create habit.' });
  }
};

// Log habit completion
const logCompletion = async (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.body;

    if (!date || !Date.parse(date)) {
      return res.status(400).json({ error: 'Invalid date format.' });
    }

    const parsedDate = new Date(date).toISOString().split('T')[0]; 

    const habit = await Habit.findById(id);
    if (!habit) {
      return res.status(404).json({ error: 'Habit not found.' });
    }

    // Check if the date is already recorded
    if (habit.completion.includes(parsedDate)) {
      return res.status(400).json({ error: 'Completion for this date already recorded.' });
    }

    habit.completion.push(parsedDate);
    await habit.save();

    res.status(201).json({
      id: habit._id,
      date: parsedDate,
      message: 'Completion logged successfully.',
    });
  } catch (error) {
    console.error('Error details:', error);
    res.status(500).json({ error: 'An unexpected error occurred.' });
  }
};

// Get list of habits with pagination and filtering
const getHabits = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, name } = req.query;

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    if (isNaN(pageNumber) || pageNumber <= 0) {
      return res.status(400).json({ error: 'Invalid page number.' });
    }
    if (isNaN(limitNumber) || limitNumber <= 0) {
      return res.status(400).json({ error: 'Invalid limit number.' });
    }

    const query = {};
    if (status === 'completed') {
      query.completion = { $exists: true, $ne: [] };
    } else if (status === 'not_completed') {
      query.completion = { $exists: false };
    }
    if (name) {
      query.name = { $regex: name, $options: 'i' };
    }

    const [habits, total] = await Promise.all([
      Habit.find(query)
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber)
        .exec(),
      Habit.countDocuments(query)
    ]);

    const habitsWithProgress = habits.map(habit => ({
      id: habit._id,
      name: habit.name,
      description: habit.description,
      target_days_per_week: habit.target_days_per_week,
      completed_days: habit.completion.length
    }));

    const totalPages = Math.ceil(total / limitNumber);

    res.status(200).json({
      habits: habitsWithProgress,
      total,
      totalPages,
      currentPage: pageNumber,
      limit: limitNumber
    });
  } catch (error) {
    console.error('Error details:', error);
    res.status(500).json({ error: 'An unexpected error occurred.' });
  }
};

// Delete a habit by ID
const deleteHabit = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await Habit.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ error: 'Habit not found.' });
    }

    res.status(204).json({ message: 'Habit deleted successfully.' });
  } catch (error) {
    console.error('Error details:', error);
    res.status(500).json({ error: 'An unexpected error occurred.' });
  }
};

module.exports = {
  createHabit,
  logCompletion,
  getHabits,
  deleteHabit
};
