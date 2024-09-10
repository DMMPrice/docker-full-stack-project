const express = require("express");
const axios = require("axios");
const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");
const app = express();
const port = 3000;

// Set EJS as the view engine
app.set("view engine", "ejs");

// Serve static files from the "public" directory
app.use(express.static("public"));

// Configure multer for file uploads
const upload = multer({ dest: "uploads/" });

// Route to fetch data and render it in a table
app.get("/", async (req, res) => {
  try {
    const response = await axios.get(
      "https://jsonplaceholder.typicode.com/posts"
    );
    const data = response.data;
    res.render("index", { data });
  } catch (error) {
    res.status(500).send("Error fetching data");
  }
});

// Route to render the upload form
app.get("/upload-form", (req, res) => {
  res.render("upload");
});

// Route to handle file uploads and parse CSV
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  const results = [];
  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", () => {
      res.render("uploaded-data", { data: results });
    });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
