const User = require('../models/User');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id || req.user._id)
      .select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const updates = { ...req.body }

    // Allow updating email separately from profile.
    const email = updates.email
    delete updates.email

    const updateData = {}

    if (email) {
      updateData.email = email.toLowerCase()
    }

    // Keep profile updates separate; avoid overwriting role or other fields.
    if (Object.keys(updates).length > 0) {
      updateData.profile = updates
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.downloadResume = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('profile.resume profile.resumeName');
    if (!user?.profile?.resume) {
      return res.status(404).json({ message: 'No resume found.' });
    }

    let base64 = user.profile.resume;
    const commaIndex = base64.indexOf(',');
    if (commaIndex !== -1) base64 = base64.slice(commaIndex + 1);

    const buffer = Buffer.from(base64, 'base64');
    const filename = user.profile.resumeName || 'resume.pdf';

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(buffer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.searchStudents = async (req, res) => {
  try {
    const { skills, minRating, page = 1, limit = 10 } = req.query;
    const query = { role: 'student' };

    if (skills) {
      query['profile.skills'] = { $in: skills.split(',') };
    }
    if (minRating) {
      query['rating.average'] = { $gte: parseFloat(minRating) };
    }

    const students = await User.find(query)
      .select('profile rating')
      .limit(limit * 1)
      .skip((page - 1) * limit);

    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
