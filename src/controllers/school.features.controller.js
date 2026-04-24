import schoolFeaturesModel from '../models/school.features.model.js';

// Get school analytics dashboard
const getSchoolAnalytics = async (req, res) => {
  try {
    const schoolId = req.school?.id || req.user?.schoolId;
    if (!schoolId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const analytics = await schoolFeaturesModel.getSchoolAnalytics(schoolId);
    res.json({ success: true, data: analytics });
  } catch (error) {
    console.error('Error getting school analytics:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all applicants for school
const getSchoolApplicants = async (req, res) => {
  try {
    const schoolId = req.school?.id || req.user?.schoolId;
    if (!schoolId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;

    const result = await schoolFeaturesModel.getSchoolApplicants(schoolId, limit, offset);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error getting applicants:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get applicant details
const getApplicantDetails = async (req, res) => {
  try {
    const schoolId = req.school?.id || req.user?.schoolId;
    const { applicationId } = req.params;

    if (!schoolId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const applicant = await schoolFeaturesModel.getApplicantDetails(schoolId, applicationId);
    if (!applicant) {
      return res.status(404).json({ message: 'Applicant not found' });
    }

    res.json({ success: true, data: applicant });
  } catch (error) {
    console.error('Error getting applicant details:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update application status
const updateApplicationStatus = async (req, res) => {
  try {
    const schoolId = req.school?.id || req.user?.schoolId;
    const { applicationId } = req.params;
    const { status } = req.body;

    if (!schoolId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (!['applied', 'viewed', 'shortlisted', 'rejected', 'interview_scheduled', 'offer_extended', 'offer_accepted'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const updated = await schoolFeaturesModel.updateApplicationStatus(schoolId, applicationId, status);
    if (!updated) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get job performance metrics
const getJobPerformance = async (req, res) => {
  try {
    const schoolId = req.school?.id || req.user?.schoolId;
    const { jobId } = req.params;

    if (!schoolId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const performance = await schoolFeaturesModel.getJobPerformance(schoolId, jobId);
    if (!performance) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json({ success: true, data: performance });
  } catch (error) {
    console.error('Error getting job performance:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all job performances
const getAllJobPerformances = async (req, res) => {
  try {
    const schoolId = req.school?.id || req.user?.schoolId;

    if (!schoolId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const jobs = await schoolFeaturesModel.getAllJobPerformances(schoolId);
    res.json({ success: true, data: jobs });
  } catch (error) {
    console.error('Error getting job performances:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get school profile strength
const getSchoolProfileStrength = async (req, res) => {
  try {
    const schoolId = req.school?.id || req.user?.schoolId;

    if (!schoolId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const strength = await schoolFeaturesModel.getSchoolProfileStrength(schoolId);
    if (!strength) {
      return res.status(404).json({ message: 'School not found' });
    }

    res.json({ success: true, data: strength });
  } catch (error) {
    console.error('Error getting school profile strength:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create/Update shortlist
const createShortlist = async (req, res) => {
  try {
    const schoolId = req.school?.id || req.user?.schoolId;
    const { applicationId, notes } = req.body;

    if (!schoolId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const shortlist = await schoolFeaturesModel.createShortlist(schoolId, applicationId, notes);
    res.json({ success: true, data: shortlist });
  } catch (error) {
    console.error('Error creating shortlist:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get school shortlist
const getSchoolShortlist = async (req, res) => {
  try {
    const schoolId = req.school?.id || req.user?.schoolId;

    if (!schoolId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const shortlist = await schoolFeaturesModel.getSchoolShortlist(schoolId);
    res.json({ success: true, data: shortlist });
  } catch (error) {
    console.error('Error getting shortlist:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Remove from shortlist
const removeFromShortlist = async (req, res) => {
  try {
    const schoolId = req.school?.id || req.user?.schoolId;
    const { applicationId } = req.params;

    if (!schoolId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const removed = await schoolFeaturesModel.removeFromShortlist(schoolId, applicationId);
    if (!removed) {
      return res.status(404).json({ message: 'Not found in shortlist' });
    }

    res.json({ success: true, message: 'Removed from shortlist' });
  } catch (error) {
    console.error('Error removing from shortlist:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Rate a candidate
const rateCandidateBySchool = async (req, res) => {
  try {
    const schoolId = req.school?.id || req.user?.schoolId;
    const { teacherId, rating, feedback } = req.body;

    if (!schoolId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const rated = await schoolFeaturesModel.rateCandidateBySchool(schoolId, teacherId, rating, feedback);
    res.json({ success: true, data: rated });
  } catch (error) {
    console.error('Error rating candidate:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get candidate ratings
const getCandidateRatings = async (req, res) => {
  try {
    const { teacherId } = req.params;

    const ratings = await schoolFeaturesModel.getCandidateRatings(teacherId);
    res.json({ success: true, data: ratings });
  } catch (error) {
    console.error('Error getting candidate ratings:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Schedule interview
const scheduleInterview = async (req, res) => {
  try {
    const schoolId = req.school?.id || req.user?.schoolId;
    const { applicationId, interviewDate, interviewType, notes } = req.body;

    if (!schoolId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (!['phone', 'video', 'in_person', 'group'].includes(interviewType)) {
      return res.status(400).json({ message: 'Invalid interview type' });
    }

    const interview = await schoolFeaturesModel.scheduleInterview(
      schoolId,
      applicationId,
      interviewDate,
      interviewType,
      notes
    );
    res.json({ success: true, data: interview });
  } catch (error) {
    console.error('Error scheduling interview:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get scheduled interviews
const getScheduledInterviews = async (req, res) => {
  try {
    const schoolId = req.school?.id || req.user?.schoolId;

    if (!schoolId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const interviews = await schoolFeaturesModel.getScheduledInterviews(schoolId);
    res.json({ success: true, data: interviews });
  } catch (error) {
    console.error('Error getting interviews:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get hiring pipeline
const getHiringPipeline = async (req, res) => {
  try {
    const schoolId = req.school?.id || req.user?.schoolId;

    if (!schoolId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const pipeline = await schoolFeaturesModel.getHiringPipeline(schoolId);
    res.json({ success: true, data: pipeline });
  } catch (error) {
    console.error('Error getting hiring pipeline:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Compare candidates
const compareCandidates = async (req, res) => {
  try {
    const schoolId = req.school?.id || req.user?.schoolId;
    const { applicationIds } = req.body;

    if (!schoolId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (!Array.isArray(applicationIds) || applicationIds.length === 0) {
      return res.status(400).json({ message: 'Please provide applicationIds array' });
    }

    const candidates = await schoolFeaturesModel.compareCandidates(schoolId, applicationIds);
    res.json({ success: true, data: candidates });
  } catch (error) {
    console.error('Error comparing candidates:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export default {
  getSchoolAnalytics,
  getSchoolApplicants,
  getApplicantDetails,
  updateApplicationStatus,
  getJobPerformance,
  getAllJobPerformances,
  getSchoolProfileStrength,
  createShortlist,
  getSchoolShortlist,
  removeFromShortlist,
  rateCandidateBySchool,
  getCandidateRatings,
  scheduleInterview,
  getScheduledInterviews,
  getHiringPipeline,
  compareCandidates,
};
