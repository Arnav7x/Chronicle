const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");   // <-- add this
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth.routes");
const blogRoutes = require("./routes/blog.routes");

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(cookieParser());                     

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use("/auth", authRoutes);
app.use("/blogs", blogRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
