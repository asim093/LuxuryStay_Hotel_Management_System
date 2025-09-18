const mongoose = require('mongoose');
const { HousekeepingTaskModel } = require('./src/Models/HousekeepingTask.model.js');

async function testCompletedTasks() {
  try {
    await mongoose.connect('mongodb://localhost:27017/hotel_management_system');
    console.log('Connected to MongoDB');

    // Check all tasks
    const allTasks = await HousekeepingTaskModel.find({}).populate('room', 'roomNumber roomType');
    console.log('Total tasks:', allTasks.length);

    // Check completed tasks
    const completedTasks = await HousekeepingTaskModel.find({ status: 'Completed' }).populate('room', 'roomNumber roomType');
    console.log('Completed tasks:', completedTasks.length);

    // Show task details
    console.log('\n=== ALL TASKS ===');
    allTasks.forEach(task => {
      console.log(`Task: ${task.taskNumber}, Status: ${task.status}, Room: ${task.room?.roomNumber || 'N/A'}`);
    });

    console.log('\n=== COMPLETED TASKS ===');
    completedTasks.forEach(task => {
      console.log(`Task: ${task.taskNumber}, Status: ${task.status}, Room: ${task.room?.roomNumber || 'N/A'}, Completed: ${task.completedDate}`);
    });

    // If no completed tasks, let's create one for testing
    if (completedTasks.length === 0) {
      console.log('\nNo completed tasks found. Creating a test completed task...');
      
      // Find a room first
      const { RoomModel } = require('./src/Models/Room.model.js');
      const room = await RoomModel.findOne({});
      
      if (room) {
        const testTask = new HousekeepingTaskModel({
          taskNumber: 'HT0001',
          room: room._id,
          taskType: 'Cleaning',
          priority: 'High',
          status: 'Completed',
          scheduledDate: new Date(),
          completedDate: new Date(),
          estimatedDuration: 45,
          actualDuration: 50,
          description: 'Test completed task',
          notes: 'This is a test completed task',
          createdBy: null
        });
        
        await testTask.save();
        console.log('Test completed task created successfully!');
      } else {
        console.log('No rooms found to create test task');
      }
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

testCompletedTasks();
