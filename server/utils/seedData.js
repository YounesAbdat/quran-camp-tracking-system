import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

import User from '../models/User.js';
import Camp from '../models/Camp.js';
import Group from '../models/Group.js';
import Student from '../models/Student.js';
import DailyRecord from '../models/DailyRecord.js';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for seeding');
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Camp.deleteMany({});
    await Group.deleteMany({});
    await Student.deleteMany({});
    await DailyRecord.deleteMany({});

    console.log('🗑️  Cleared existing data');

    // Create admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin'
    });

    // Create supervisor users
    const supervisor1 = await User.create({
      name: 'Ahmed Hassan',
      email: 'supervisor@example.com',
      password: 'password123',
      role: 'supervisor',
      phone: '+234-801-234-5678'
    });

    const supervisor2 = await User.create({
      name: 'Fatima Ali',
      email: 'fatima@example.com',
      password: 'password123',
      role: 'supervisor',
      phone: '+234-802-345-6789'
    });

    console.log('👥 Created users');

    // Create camps
    const camp1 = await Camp.create({
      name: 'Summer Quran Camp 2025',
      description: 'Intensive 12-day Quran memorization camp',
      location: 'Al-Nahda Center Lagos',
      state: 'Lagos',
      gender: 'male',
      startDate: new Date('2025-06-01'),
      endDate: new Date('2025-06-12'),
      status: 'active',
      maxStudents: 100
    });

    const camp2 = await Camp.create({
      name: 'Sisters Quran Camp 2025',
      description: 'Dedicated camp for female students',
      location: 'Al-Nahda Center Abuja',
      state: 'FCT',
      gender: 'female',
      startDate: new Date('2025-06-01'),
      endDate: new Date('2025-06-12'),
      status: 'active',
      maxStudents: 80
    });

    console.log('🏕️  Created camps');

    // Create groups
    const group1 = await Group.create({
      name: 'Halaqa Al-Fajr',
      arabicName: 'حلقة الفجر',
      camp: camp1._id,
      supervisor: supervisor1._id,
      maxCapacity: 20,
      level: 'beginner',
      ageRange: { min: 8, max: 12 }
    });

    const group2 = await Group.create({
      name: 'Halaqa An-Nur',
      arabicName: 'حلقة النور',
      camp: camp1._id,
      supervisor: supervisor2._id,
      maxCapacity: 20,
      level: 'intermediate',
      ageRange: { min: 13, max: 17 }
    });

    const group3 = await Group.create({
      name: 'Halaqa Az-Zahra',
      arabicName: 'حلقة الزهراء',
      camp: camp2._id,
      supervisor: supervisor1._id,
      maxCapacity: 15,
      level: 'beginner',
      ageRange: { min: 8, max: 15 }
    });

    console.log('👥 Created groups');

    // Update supervisor assigned groups
    supervisor1.assignedGroups = [group1._id, group3._id];
    supervisor2.assignedGroups = [group2._id];
    await supervisor1.save();
    await supervisor2.save();

    // Create students
    const students = [
      {
        name: 'Abdullah Ahmed',
        age: 10,
        gender: 'male',
        group: group1._id,
        parentInfo: {
          fatherName: 'Ahmed Ibrahim',
          primaryContact: '+234-803-123-4567',
          email: 'ahmed.ibrahim@email.com'
        },
        emergencyContact: {
          name: 'Aisha Ahmed',
          relationship: 'Mother',
          phone: '+234-804-123-4567'
        }
      },
      {
        name: 'Omar Mahmoud',
        age: 11,
        gender: 'male',
        group: group1._id,
        parentInfo: {
          fatherName: 'Mahmoud Ali',
          primaryContact: '+234-805-123-4567',
          email: 'mahmoud.ali@email.com'
        },
        emergencyContact: {
          name: 'Khadija Mahmoud',
          relationship: 'Mother',
          phone: '+234-806-123-4567'
        }
      },
      {
        name: 'Yusuf Hassan',
        age: 14,
        gender: 'male',
        group: group2._id,
        parentInfo: {
          fatherName: 'Hassan Omar',
          primaryContact: '+234-807-123-4567',
          email: 'hassan.omar@email.com'
        },
        emergencyContact: {
          name: 'Maryam Hassan',
          relationship: 'Mother',
          phone: '+234-808-123-4567'
        }
      },
      {
        name: 'Aisha Fatima',
        age: 12,
        gender: 'female',
        group: group3._id,
        parentInfo: {
          fatherName: 'Ibrahim Musa',
          primaryContact: '+234-809-123-4567',
          email: 'ibrahim.musa@email.com'
        },
        emergencyContact: {
          name: 'Zainab Ibrahim',
          relationship: 'Mother',
          phone: '+234-810-123-4567'
        }
      },
      {
        name: 'Hafsa Ali',
        age: 13,
        gender: 'female',
        group: group3._id,
        parentInfo: {
          fatherName: 'Ali Usman',
          primaryContact: '+234-811-123-4567',
          email: 'ali.usman@email.com'
        },
        emergencyContact: {
          name: 'Amina Ali',
          relationship: 'Mother',
          phone: '+234-812-123-4567'
        }
      }
    ];

    const createdStudents = await Student.insertMany(students);
    console.log('🎓 Created students');

    // Update group student references
    group1.students = createdStudents.filter(s => s.group.toString() === group1._id.toString()).map(s => s._id);
    group2.students = createdStudents.filter(s => s.group.toString() === group2._id.toString()).map(s => s._id);
    group3.students = createdStudents.filter(s => s.group.toString() === group3._id.toString()).map(s => s._id);
    
    await group1.save();
    await group2.save();
    await group3.save();

    // Create sample daily records
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const dailyRecords = [];

    createdStudents.forEach(student => {
      // Yesterday's record
      dailyRecords.push({
        student: student._id,
        date: yesterday,
        memorization: {
          newVerses: Math.floor(Math.random() * 10) + 1,
          quality: ['excellent', 'good', 'average'][Math.floor(Math.random() * 3)]
        },
        revision: {
          versesRevised: Math.floor(Math.random() * 20) + 5,
          quality: ['excellent', 'good', 'average'][Math.floor(Math.random() * 3)]
        },
        attendance: {
          present: true,
          arrivalTime: '08:00',
          departureTime: '12:00'
        },
        supervisor: student.group.toString() === group1._id.toString() || student.group.toString() === group3._id.toString() 
          ? supervisor1._id 
          : supervisor2._id
      });

      // Today's record
      dailyRecords.push({
        student: student._id,
        date: today,
        memorization: {
          newVerses: Math.floor(Math.random() * 8) + 1,
          quality: ['excellent', 'good', 'average'][Math.floor(Math.random() * 3)]
        },
        revision: {
          versesRevised: Math.floor(Math.random() * 15) + 5,
          quality: ['excellent', 'good', 'average'][Math.floor(Math.random() * 3)]
        },
        attendance: {
          present: true,
          arrivalTime: '08:00',
          departureTime: '12:00'
        },
        supervisor: student.group.toString() === group1._id.toString() || student.group.toString() === group3._id.toString() 
          ? supervisor1._id 
          : supervisor2._id
      });
    });

    await DailyRecord.insertMany(dailyRecords);
    console.log('📊 Created daily records');

    console.log('✅ Seed data created successfully!');
    console.log('\n📋 Demo Accounts:');
    console.log('Admin: admin@example.com / password123');
    console.log('Supervisor: supervisor@example.com / password123');
    console.log('Supervisor: fatima@example.com / password123');

    process.exit(0);

  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

connectDB().then(() => {
  seedData();
});
