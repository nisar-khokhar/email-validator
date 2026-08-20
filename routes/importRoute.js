const express = require("express");
const multer = require("multer");
const path = require("path");
const importController = require("../controllers/importController");

const app = express();

// app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.static(path.resolve("./public")));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post("/importfile", upload.single("file"), importController.importUser);

app.get("/exportfile", importController.exportUser);

module.exports = app;
