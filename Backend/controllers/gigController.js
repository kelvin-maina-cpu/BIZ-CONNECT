const Gig = require('../models/Gig');
const Application = require('../models/Application');

exports.createGig = async (req, res) => {
  try {
    const gig = await Gig.create({
      ...req.body,
      client: req.user._id
    });
    res.status(201).json(gig);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getGigs = async (req, res) => {
  try {
    const { category, search, status = 'open', page = 1, limit = 10 } = req.query;
    const query = { status };

    if (category) query.category = category;
    if (search) {
      query.$text = { $search: search };
    }

    const gigs = await Gig.find(query)
      .populate('client', 'profile.firstName profile.lastName profile.companyName')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Gig.countDocuments(query);

    res.json({
      gigs,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getGigById = async (req, res, next) => {
  try {
    const gig = await Gig.findById(req.params.id)
      .populate('client', 'profile.firstName profile.lastName profile.companyName profile.bio')
      .populate('hiredStudent', 'profile.firstName profile.lastName');

    if (!gig) {
      return res.status(404).json({ message: 'Gig not found' });
    }

    res.json(gig);
  } catch (error) {
    console.error('Error fetching gig by id', { id: req.params.id, error: error.message });
    next(error);
  }
};

exports.updateGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);

    if (!gig) {
      return res.status(404).json({ message: 'Gig not found' });
    }

    if (gig.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedGig = await Gig.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedGig);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);

    if (!gig) {
      return res.status(404).json({ message: 'Gig not found' });
    }

    if (gig.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await gig.deleteOne();
    res.json({ message: 'Gig removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyGigs = async (req, res) => {
  try {
    const gigs = await Gig.find({ client: req.user._id })
      .sort({ createdAt: -1 });
    res.json(gigs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.hireStudent = async (req, res) => {
  try {
    const { gigId, studentId } = req.body;
    
    const gig = await Gig.findById(gigId);
    if (!gig || gig.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    gig.hiredStudent = studentId;
    gig.status = 'in-progress';
    await gig.save();

    // Update application status
    await Application.updateMany(
      { gig: gigId },
      { $set: { status: 'rejected' } }
    );
    await Application.findOneAndUpdate(
      { gig: gigId, student: studentId },
      { $set: { status: 'accepted' } }
    );

    res.json(gig);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};