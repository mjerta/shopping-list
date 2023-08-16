const express = require("express");
const app = express();
app.listen(3000, () => console.log("listening at 3000"));
app.use(express.static("public"));

app.use(express.json({ limint: "1mb" }));
app.post("/api", (request, response) => {
  console.log("test");
  console.log(request.body);
  response.json({
    status: "succes",
  });
});

const fs = require("fs");
const dataFs = fs.readFile("public/data.json", function (err, data) {
  if (err) {
    console.log(error);
    return;
  }
  console.log(JSON.parse(data));
  console.log("wassap");
});
