import mongoose from 'mongoose';

const dailyRecordSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: [true, 'Student reference is required']
  },
  date: {
    type: Date,
    required: [true, 'Date is required'],
    default: Date.now
  },
  memorization: {
    newVerses: {
      type: Number,
      default: 0,
      min: [0, 'New verses cannot be negative']
    },
    surah: String,
    fromVerse: Number,
    toVerse: Number,
    quality: {
      type: String,
      enum: ['excellent', 'good', 'average', 'needs_improvement'],
      default: 'good'
    }
  },
  revision: {
    versesRevised: {
      type: Number,
      default: 0,
      min: [0, 'Revised verses cannot be negative']
    },
    surahs: [String],
    quality: {
      type: String,
      enum: ['excellent', 'good', 'average', 'needs_improvement'],
      default: 'good'
    }
  },
  attendance: {
    present: { type: Boolean, default: true },
    arrivalTime: String,
    departureTime: String,
    lateArrival: { type: Boolean, default: false },
    earlyDeparture: { type: Boolean, default: false }
  },
  behavior: {
    participation: {
      type: String,
      enum: ['excellent', 'good', 'average', 'poor'],
      default: 'good'
    },
    discipline: {
      type: String,
      enum: ['excellent', 'good', 'average', 'poor'],
      default: 'good'
    },
    cooperation: {
      type: String,
      enum: ['excellent', 'good', 'average', 'poor'],
      default: 'good'
    }
  },
  notes: {
    supervisorNotes: String,
    studentFeedback: String,
    parentNotes: String
  },
  supervisor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Supervisor reference is required']
  },
  lastModified: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Ensure one record per student per day
dailyRecordSchema.index({ student: 1, date: 1 }, { unique: true });

// Calculate total score
dailyRecordSchema.virtual('totalScore').get(function() {
  const memorizationScore = this.memorization.newVerses * 2;
  const revisionScore = this.revision.versesRevised * 1;
  const qualityBonus = this.memorization.quality === 'excellent' ? 5 : 0;
  return memorizationScore + revisionScore + qualityBonus;
});

export default mongoose.model('DailyRecord', dailyRecordSchema);
