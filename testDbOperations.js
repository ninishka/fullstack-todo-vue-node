const dbOps = require('./dbOperations');

const testDb = async () => {
  try {
    console.log('Adding a new entry...');
    const newEntry = await dbOps.addEntry('Another Sample Name');
    console.log('New entry added:', newEntry);

    console.log('Fetching all entries...');
    const entries = await dbOps.getAllEntries();
    console.log('All entries:', entries);
  } catch (err) {
    console.error('Error during database operations:', err);
  }
};

testDb();