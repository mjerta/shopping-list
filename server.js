const express = require("express");
const fs = require("fs");
const { eventNames } = require("process");
const app = express();
app.listen(3000, () => console.log("listening at 3000"));
app.use(express.static("public"));

app.use(express.json({ limit: "1mb" }));

//This is for handling incoming data
app.post("/api", (request, response) => {
  const newData = request.body;

  fs.readFile("public/data.json", (err, data) => {
    if (err) {
      console.log("Error reading file", err);
      return;
    }

    try {
      const jsonData = JSON.parse(data);
      const compareSequence = jsonData.shoppingList.some(
        (item) => item.product === newData.product
      );

      if (compareSequence) {
        console.log("true");
        response.json({
          status: "goed gedaan",
        });
      }
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
});
