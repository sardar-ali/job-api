const Job = require("../models/Job");
const { BadRequestError, NotFoundError } = require("../errors");
const { StatusCodes } = require("http-status-codes");

const getAllJobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user.userId }).sort(
    "-createdAt"
  );
  return res.status(StatusCodes.OK).json({
    success: true,
    message: "get jobs list successfully",
    jobs,
    counts: jobs.length,
  });
};

const getSingleJob = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;
  const job = await Job.findOne({ _id: id, createdBy: userId });

  if (!job) {
    throw new BadRequestError("No Job Found!");
  }
  return res.status(StatusCodes.OK).json({
    success: true,
    message: "get job successfully",
    job,
  });
};

const createJob = async (req, res) => {
  const { company, position } = req.body;

  if (!company || !position) {
    throw new BadRequestError("Some fields are missing!");
  }

  const job = await Job.create({ ...req.body, createdBy: req.user.userId });
  if (!job) {
    throw new BadRequestError("Something went worng!");
  }
  return res.status(StatusCodes.CREATED).json({
    success: true,
    message: "Job created successfully",
    job,
  });
};

const updateJob = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;

  const job = await Job.findOneAndUpdate(
    { _id: id, createdBy: userId },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!job) {
    throw new BadRequestError("No Job Found!");
  }

  return res.status(StatusCodes.OK).json({
    success: true,
    message: "update job successfully",
    job,
  });
};

const deleteJob = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;

  const job = await Job.findOneAndDelete({ _id: id, createdBy: userId });

  if (!job) {
    throw new BadRequestError("No Job Found!");
  }

  return res.status(StatusCodes.OK).json({
    success: true,
    message: "job deleted successfully",
    job,
  });
};

module.exports = {
  getAllJobs,
  getSingleJob,
  createJob,
  updateJob,
  deleteJob,
};
