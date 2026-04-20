import { getAllUsers, getUserById, updateUser, deleteUser } from '../models/user.model.js';
import { getAllJobs, getJobById, updateJob, deleteJob } from '../models/job.model.js';
import { getAdminAnalytics } from '../models/notification.model.js';

export const getUsers = async (req, res, next) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (err) {
    next(err);
  }
};

export const monitorJobs = async (req, res, next) => {
  try {
    const jobs = await getAllJobs();
    res.json(jobs);
  } catch (err) {
    next(err);
  }
};

export const analytics = async (req, res, next) => {
  try {
    const analytics = await getAdminAnalytics();
    res.json(analytics);
  } catch (err) {
    next(err);
  }
};

export const updateUserAdmin = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { name, email, role, status } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required.' });
    }

    const user = await getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const updates = {};
    if (name) updates.name = name;
    if (email) updates.email = email;
    if (role) updates.role = role;
    if (status) updates.status = status;

    const updatedUser = await updateUser(userId, updates);
    res.json({ message: 'User updated successfully.', user: updatedUser });
  } catch (err) {
    next(err);
  }
};

export const deleteUserAdmin = async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required.' });
    }

    const user = await getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    await deleteUser(userId);
    res.json({ message: 'User deleted successfully.' });
  } catch (err) {
    next(err);
  }
};

export const updateJobAdmin = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const { title, description, salary, location, requirements, status } = req.body;

    if (!jobId) {
      return res.status(400).json({ error: 'Job ID is required.' });
    }

    const job = await getJobById(jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found.' });
    }

    const updates = {};
    if (title) updates.title = title;
    if (description) updates.description = description;
    if (salary) updates.salary = salary;
    if (location) updates.location = location;
    if (requirements) updates.requirements = requirements;
    if (status) updates.status = status;

    const updatedJob = await updateJob(jobId, updates);
    res.json({ message: 'Job updated successfully.', job: updatedJob });
  } catch (err) {
    next(err);
  }
};

export const deleteJobAdmin = async (req, res, next) => {
  try {
    const { jobId } = req.params;

    if (!jobId) {
      return res.status(400).json({ error: 'Job ID is required.' });
    }

    const job = await getJobById(jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found.' });
    }

    await deleteJob(jobId);
    res.json({ message: 'Job deleted successfully.' });
  } catch (err) {
    next(err);
  }
};
