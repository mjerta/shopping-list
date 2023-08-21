const express = require("express");
const fs = require("fs");
const app = express();
app.listen(3000, () => console.log("listening at 3000"));
app.use(express.static("public"));

app.use(express.json({ limint: "1mb" }));
app.post("/api", (request, response) => {
  const newData = request.body;

  fs.readFile("public/data.json", (err, data) => {
    if (err) {
      console.log("Error reading file", err);
      return;
    }

    try {
      const jsonData = JSON.parse(data);
      jsonData.shoppingList.push(newData);
      fs.writeFile(
        "public/data.json",
        JSON.stringify(jsonData, null, 2),
        "utf8",
        (err) => {
          if (err) {
            console.log("Error writing file", err);
            return;
          }
          console.log("JSON file updated successfully");
        }
      );
    } catch (parseError) {
      console.log("Error parsing JSON:", parseError);
    }
  });

  response.json({
    status: "succes",
  });
});
