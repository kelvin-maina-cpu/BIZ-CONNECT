const Application = require('../models/Application');
const Gig = require('../models/Gig');

exports.applyForGig = async (req, res) => {
  try {
    const { gigId, coverLetter, proposedRate, estimatedDuration } = req.body;

    const gig = await Gig.findById(gigId);
    if (!gig) {
      return res.status(404).json({ message: 'Gig not found' });
    }

    if (gig.status !== 'open') {
      return res.status(400).json({ message: 'This gig is no longer accepting applications' });
    }

    const application = await Application.create({
      gig: gigId,
      student: req.user._id,
      coverLetter,
      proposedRate,
      estimatedDuration
    });

    // Increment application count
    await Gig.findByIdAndUpdate(gigId, { $inc: { applicationsCount: 1 } });

    res.status(201).json(application);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'You have already applied for this gig' });
    }
    res.status(500).json({ message: error.message });
  }
};

exports.getGigApplications = async (req, res) => {
  try {
    const { gigId } = req.params;
    const gig = await Gig.findById(gigId);

    if (!gig || gig.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const applications = await Application.find({ gig: gigId })
      .populate('student', 'profile.firstName profile.lastName profile.avatar profile.skills profile.bio')
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ student: req.user._id })
      .populate('gig', 'title description budget deadline status')
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId, status, clientNotes } = req.body;
    
    const application = await Application.findById(applicationId).populate('gig');
    
    if (!application || application.gig.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    application.status = status;
    if (clientNotes) application.clientNotes = clientNotes;
    await application.save();

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.withdrawApplication = async (req, res) => {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      student: req.user._id
    });

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    application.status = 'withdrawn';
    await application.save();

    // Decrement application count
    await Gig.findByIdAndUpdate(application.gig, { $inc: { applicationsCount: -1 } });

    res.json({ message: 'Application withdrawn' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};