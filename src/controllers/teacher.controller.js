import { createTeacherProfileRecord } from '../models/user.model.js';
import { searchJobsWithFilters } from '../models/job.model.js';
import { createApplication, findApplicationsByTeacher } from '../models/application.model.js';

export const createTeacherProfile = async (req, res, next) => {
  try {
    const profile = await createTeacherProfileRecord(req.user.id, req.body);
    res.status(201).json(profile);
  } catch (err) {
    next(err);
  }
};

export const searchJobs = async (req, res, next) => {
  try {
    const filters = req.query;
    const jobs = await searchJobsWithFilters(filters);
    res.json(jobs);
  } catch (err) {
    next(err);
  }
};

export const applyJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const coverLetter = req.body.coverLetter || req.body.cover_letter;
    const experienceYears = req.body.experience_years || req.body.experienceYears;
    let resumeUrl = null;
    if (req.file) {
      resumeUrl = `/uploads/resumes/${req.file.filename}`;
    }
    const application = await createApplication(
      req.user.id,
      jobId,
      coverLetter,
      resumeUrl,
      experienceYears
    );
    res.status(201).json(application);
  } catch (err) {
    next(err);
  }
};

export const trackApplications = async (req, res, next) => {
  try {
    const applications = await findApplicationsByTeacher(req.user.id);
    res.json(applications);
  } catch (err) {
    next(err);
  }
};
