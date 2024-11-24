const mongoose = require("mongoose");

module.exports = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected To MongoDB ^_^");
  } catch (error) {
    console.log("Connection Failed To MongoDB!", error);
  }
};

// const mongoose = require("mongoose");

// module.exports = async () => {
//   try {
//     console.log("MONGO_URI:", process.env.MONGO_URI); // Log to confirm
//     await mongoose.connect(process.env.MONGO_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log("Connected to MongoDB ^_^");
//   } catch (error) {
//     console.error("Connection failed to MongoDB:", error);
//     process.exit(1); // Exit the process if connection fails
//   }
// };
