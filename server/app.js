const express = require("express");
const importRoute = require("../routes/importRoute");
const testRoute = require("../routes/testRoute");
const app = express();

app.use(express.json());

// app.use("/importfile", importRoute);
app.use("/", importRoute);
app.use("/testapi", testRoute);

app.listen(5000, () => {
  console.log("server has started on port 5000");
});
