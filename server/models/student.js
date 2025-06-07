import mongoose from 'mongoose';
import validator from 'validator';

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Student name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  arabicName: {
    type: String,
    trim: true
  },
  age: {
    type: Number,
    required: [true, 'Age is required'],
    min: [5, 'Student must be at least 5 years old'],
    max: [25, 'Student cannot be older than 25']
  },
  dateOfBirth: {
    type: Date
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
    required: [true, 'Gender is required']
  },
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    required: [true, 'Group assignment is required']
  },
  parentInfo: {
    fatherName: {
      type: String,
      required: [true, 'Father name is required'],
      trim: true
    },
    motherName: {
      type: String,
      trim: true
    },
    primaryContact: {
      type: String,
      required: [true, 'Primary contact is required'],
      validate: [validator.isMobilePhone, 'Please provide a valid phone number']
    },
    secondaryContact: {
      type: String,
      validate: [validator.isMobilePhone, 'Please provide a valid phone number']
    },
    email: {
      type: String,
      validate: [validator.isEmail, 'Please provide a valid email']
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String
    }
  },
  emergencyContact: {
    name: {
      type: String,
      required: [true, 'Emergency contact name is required']
    },
    relationship: {
      type: String,
      required: [true, 'Emergency contact relationship is required']
    },
    phone: {
      type: String,
      required: [true, 'Emergency contact phone is required'],
      validate: [validator.isMobilePhone, 'Please provide a valid phone number']
    }
  },
  medicalInfo: {
    allergies: [String],
    medications: [String],
    conditions: [String],
    notes: String
  },
  previousExperience: {
    hasMemorizedBefore: { type: Boolean, default: false },
    amountMemorized: String,
    institution: String
  },
  enrollmentDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'graduated', 'withdrawn'],
    default: 'active'
  },
  studentId: {
    type: String,
    unique: true
  }
}, {
  timestamps: true
});

// Generate student ID before saving
studentSchema.pre('save', async function(next) {
  if (!this.studentId) {
    const year = new Date().getFullYear();
    const count = await this.constructor.countDocuments();
    this.studentId = `STU${year}${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

export default mongoose.model('Student', studentSchema);
