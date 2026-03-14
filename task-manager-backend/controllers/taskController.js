const Task = require("../models/Task");
exports.createTask = async (req, res) => {

  try {

    const { title, description, status } = req.body;

    if (!title) {
      return res.status(400).json({
        success:false,
        message:"Title is required"
      });
    }

    const task = await Task.create({
      title,
      description,
      status,
      user: req.userId
    });

    res.status(201).json({
      success:true,
      task
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success:false,
      message:"Server error",
      error:error.message
    });

  }

};

exports.getTasks = async (req, res) => {

  try {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const status = req.query.status;
    const search = req.query.search;

    const skip = (page - 1) * limit;

    const query = {
      user: req.userId
    };

    // Status filter
    if (status) {
      query.status = status;
    }

    // Title search
    if (search) {
      query.title = {
        $regex: search,
        $options: "i"
      };
    }

    const tasks = await Task.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalTasks = await Task.countDocuments(query);

    res.json({
      success: true,
      page,
      totalPages: Math.ceil(totalTasks / limit),
      totalTasks,
      tasks
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });

  }

};
exports.updateTask = async (req, res) => {
  try {

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      req.body,
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {

    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.userId
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};