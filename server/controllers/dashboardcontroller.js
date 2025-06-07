import Student from '../models/Student.js';
import Camp from '../models/Camp.js';
import Group from '../models/Group.js';
import DailyRecord from '../models/DailyRecord.js';
import Multimedia from '../models/Multimedia.js';

// @desc    Get dashboard statistics
// @route   GET /api/dashboard
// @access  Private
export const getDashboardStats = async (req, res) => {
  try {
    const { role, assignedGroups } = req.user;

    let matchCondition = {};
    
    // If supervisor, limit to their assigned groups
    if (role === 'supervisor' && assignedGroups.length > 0) {
      const supervisorStudents = await Student.find({ 
        group: { $in: assignedGroups } 
      }).select('_id');
      matchCondition.student = { $in: supervisorStudents.map(s => s._id) };
    }

    // Basic counts
    const totalStudents = role === 'admin' 
      ? await Student.countDocuments({ status: 'active' })
      : await Student.countDocuments({ 
          group: { $in: assignedGroups }, 
          status: 'active' 
        });

    const totalCamps = await Camp.countDocuments({ status: 'active' });
    
    const totalGroups = role === 'admin'
      ? await Group.countDocuments()
      : assignedGroups.length;

    // Get date range for current week
    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
    const endOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6));

    // Top performers this week
    const topPerformers = await DailyRecord.aggregate([
      {
        $match: {
          ...matchCondition,
          date: { $gte: startOfWeek, $lte: endOfWeek }
        }
      },
      {
        $group: {
          _id: '$student',
          totalMemorized: { $sum: '$memorization.newVerses' },
          totalRevised: { $sum: '$revision.versesRevised' },
          averageQuality: { $avg: { $cond: [
            { $eq: ['$memorization.quality', 'excellent'] }, 4,
            { $cond: [
              { $eq: ['$memorization.quality', 'good'] }, 3,
              { $cond: [
                { $eq: ['$memorization.quality', 'average'] }, 2, 1
              ]}
            ]}
          ]}}
        }
      },
      {
        $lookup: {
          from: 'students',
          localField: '_id',
          foreignField: '_id',
          as: 'student'
        }
      },
      {
        $unwind: '$student'
      },
      {
        $project: {
          name: '$student.name',
          memorized: '$totalMemorized',
          revised: '$totalRevised',
          score: { 
            $add: [
              { $multiply: ['$totalMemorized', 2] },
              '$totalRevised',
              { $multiply: ['$averageQuality', 2] }
            ]
          }
        }
      },
      {
        $sort: { score: -1 }
      },
      {
        $limit: 5
      }
    ]);

    // Recent activity
    const recentRecords = await DailyRecord.find(matchCondition)
      .populate('student', 'name')
      .populate('supervisor', 'name')
      .sort({ createdAt: -1 })
      .limit(10);

    // Weekly progress chart data
    const weeklyProgress = await DailyRecord.aggregate([
      {
        $match: {
          ...matchCondition,
          date: { $gte: startOfWeek, $lte: endOfWeek }
        }
      },
      {
        $group: {
          _id: { 
            $dateToString: { format: '%Y-%m-%d', date: '$date' }
          },
          totalMemorized: { $sum: '$memorization.newVerses' },
          totalRevised: { $sum: '$revision.versesRevised' },
          studentsCount: { $addToSet: '$student' }
        }
      },
      {
        $project: {
          date: '$_id',
          totalMemorized: 1,
          totalRevised: 1,
          studentsCount: { $size: '$studentsCount' }
        }
      },
      {
        $sort: { date: 1 }
      }
    ]);

    // Media counts
    const mediaStats = await Multimedia.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      totalStudents,
      totalCamps,
      totalGroups,
      topPerformers,
      recentActivity: recentRecords,
      weeklyProgress,
      mediaStats: mediaStats.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      lastUpdated: new Date()
    });

  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Error fetching dashboard statistics' });
  }
};

// @desc    Get performance analytics
// @route   GET /api/dashboard/analytics
// @access  Private
export const getPerformanceAnalytics = async (req, res) => {
  try {
    const { timeRange = '7d', groupId } = req.query;
    const { role, assignedGroups } = req.user;

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    
    switch (timeRange) {
      case '7d':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(endDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(endDate.getDate() - 90);
        break;
      default:
        startDate.setDate(endDate.getDate() - 7);
    }

    let matchCondition = {
      date: { $gte: startDate, $lte: endDate }
    };

    // Apply role-based filtering
    if (role === 'supervisor') {
      const supervisorStudents = await Student.find({ 
        group: { $in: assignedGroups } 
      }).select('_id');
      matchCondition.student = { $in: supervisorStudents.map(s => s._id) };
    }

    // Apply group filter if specified
    if (groupId) {
      const groupStudents = await Student.find({ group: groupId }).select('_id');
      matchCondition.student = { $in: groupStudents.map(s => s._id) };
    }

    // Performance trends
    const performanceTrends = await DailyRecord.aggregate([
      { $match: matchCondition },
      {
        $group: {
          _id: { 
            $dateToString: { format: '%Y-%m-%d', date: '$date' }
          },
          avgMemorized: { $avg: '$memorization.newVerses' },
          avgRevised: { $avg: '$revision.versesRevised' },
          totalStudents: { $addToSet: '$student' }
        }
      },
      {
        $project: {
          date: '$_id',
          avgMemorized: { $round: ['$avgMemorized', 2] },
          avgRevised: { $round: ['$avgRevised', 2] },
          studentsCount: { $size: '$totalStudents' }
        }
      },
      { $sort: { date: 1 } }
    ]);

    // Quality distribution
    const qualityDistribution = await DailyRecord.aggregate([
      { $match: matchCondition },
      {
        $group: {
          _id: '$memorization.quality',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      performanceTrends,
      qualityDistribution,
      timeRange,
      dateRange: { startDate, endDate }
    });

  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ message: 'Error fetching performance analytics' });
  }
};
