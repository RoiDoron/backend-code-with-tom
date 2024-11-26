export default {
  dbURL: process.env.MONGO_URL || 'mongodb+srv://roiDoron:<db_password>@masterjs.jub11.mongodb.net/?retryWrites=true&w=majority&appName=masterJS',
  dbName : process.env.DB_NAME || 'code_db'
}
