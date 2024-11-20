
// Running the server 
const PORT = process.env.PORT || 8000;
const app = require("./app");
app.listen(PORT, () => console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`));