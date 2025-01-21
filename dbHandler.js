const { MongoClient } = require('mongodb');

// MongoDB connection URI and client setup
const uri = "mongodb://localhost:27017";  // Adjust if necessary
const client = new MongoClient(uri);

class MongoDBHandler {
  constructor(dbName, collectionName) {
    this.dbName = dbName;
    this.collectionName = collectionName;
    this.db = client.db(dbName);
    this.collection = this.db.collection(collectionName);
  }

  // Check if job exists by link
  async checkIfJobExists(link) {
    try {
      const job = await this.collection.findOne({ link });  // Find the job by link
      return !!job;
    } catch (error) {
      console.error('Error checking if job exists:', error);
      throw error;
    }
  }

  // Save job to MongoDB
  async saveJob(job) {
    try {
      await this.collection.insertOne(job);  // Insert a new document (job)
    } catch (error) {
      console.error('Error saving job:', error);
      throw error;
    }
  }

  // Optionally, you can define a method to close the MongoDB connection when done.
  async closeConnection() {
    await client.close();
  }
}

module.exports = MongoDBHandler;
