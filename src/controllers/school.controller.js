import { createSchoolProfileRecord } from '../models/user.model.js';
import { createJob, findApplicantsForSchool } from '../models/job.model.js';
import { shortlistApplication } from '../models/application.model.js';

export const createSchoolProfile = async (req, res, next) => {
  try {
    const profile = await createSchoolProfileRecord(req.user.id, req.body);
    res.status(201).json(profile);
  } catch (err) {
    next(err);
  }
};

export const postJob = async (req, res, next) => {
  try {
    const job = await createJob(req.user.id, req.body);
    res.status(201).json(job);
  } catch (err) {
    next(err);
  }
};

export const manageApplicants = async (req, res, next) => {
  try {
    const applicants = await findApplicantsForSchool(req.user.id);
    res.json(applicants);
  } catch (err) {
    next(err);
  }
};

export const shortlistCandidate = async (req, res, next) => {
  try {
    const { applicationId } = req.params;
    const result = await shortlistApplication(applicationId);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const getSchoolProfile = async (req, res, next) => {
  try {
    const { schoolId } = req.params;
    // TODO: Implement fetching school profile from database
    res.json({ schoolId, message: 'School profile endpoint' });
  } catch (err) {
    next(err);
  }
};

export const getSchoolJobs = async (req, res, next) => {
  try {
    const { schoolId } = req.params;
    // TODO: Implement fetching school jobs from database
    res.json({ schoolId, message: 'School jobs endpoint' });
  } catch (err) {
    next(err);
  }
};
