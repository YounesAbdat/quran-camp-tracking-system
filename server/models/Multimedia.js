import mongoose from 'mongoose';

const multimediaSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  type: {
    type: String,
    enum: ['photo', 'video', 'audio', 'document'],
    required: [true, 'Media type is required']
  },
  url: {
    type: String,
    required: [true, 'File URL is required']
  },
  filename: {
    type: String,
    required: [true, 'Filename is required']
  },
  fileSize: {
    type: Number,
    required: [true, 'File size is required']
  },
  mimeType: {
    type: String,
    required: [true, 'MIME type is required']
  },
  camp: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Camp'
  },
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group'
  },
  tags: [String],
  category: {
    type: String,
    enum: ['daily_activity', 'ceremony', 'competition', 'graduation', 'announcement', 'other'],
    default: 'daily_activity'
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Uploader reference is required']
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  viewCount: {
    type: Number,
    default: 0
  },
  likes: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    date: { type: Date, default: Date.now }
  }],
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

multimediaSchema.virtual('likesCount').get(function() {
  return this.likes.length;
});

export default mongoose.model('Multimedia', multimediaSchema);
