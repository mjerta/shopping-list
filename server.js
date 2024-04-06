const express = require("express");
const fs = require("fs").promises;
// const { eventNames } = require("process");
const app = express();
app.listen(3000, () => console.log("listening at 3000"));
app.use(express.static("public"));

app.use(express.json({ limit: "1mb" }));

const dataFilePath = "public/data.json";

//Function to read items from JSON file
// async function readItemsFromFile() {
//   const data = await fs.readFile(dataFilePath);
//   const jsonData = JSON.parse(data);
//   return jsonData;
// }
async function readItemsFromFile() {
  try {
    const data = await fs.readFile(dataFilePath);
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading file:", error);
    throw error;
  }
}

async function writeData(data) {
  try {
    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error writing file:", error);
    throw error;
  }
}

// Create an item
app.post("/api", async (req, res) => {
  try {
    const newItem = req.body;
    const jsonData = await readItemsFromFile();

    const compareSequence = jsonData.shoppingList.some(
      (item) => item.product === newItem.product
    );

    if (compareSequence) {
      res.json({
        returnMessage: "Double record detected",
      });
      console.log("Double record detected");
      return;
    }
    newItem.id = Date.now().toString(); // Generate unique ID (timestamp)
    console.log(newItem.id);
    jsonData.shoppingList.push(newItem);
    await writeData(jsonData);
    res
      .status(201)
      .json({ message: "Item created successfully", item: newItem });
  } catch (error) {
    console.error("Error creating item:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.delete("/api", async (req, res) => {
  try {
    const newItem = req.body;
    const jsonData = await readItemsFromFile();

    const indexToDelete = jsonData.shoppingList.some(
      (item) => item.id === newItem.id
    );

    if (indexToDelete) {
      const filteredData = jsonData.shoppingList.filter(
        (item) => item.id !== newItem.id
      );
      jsonData.shoppingList = filteredData;
      console.log(jsonData.shoppingList);
      await writeData(jsonData);
      res
        .status(201)
        .json({ message: "Item deleted successfully", item: newItem });
    }
  } catch (error) {
    console.error("Error creating item:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//This is for handling incoming data
// app.post("/api", (request, response) => {
//   const newData = request.body;

//   fs.readFile("public/data.json", (err, data) => {
//     if (err) {
//       console.log("Error reading file", err);
//       return;
//     }

//     try {
//       const jsonData = JSON.parse(data);
//       console.log(jsonData.shoppingList);
//       // some variables
//       const compareSequence = jsonData.shoppingList.some(
//         (item) => item.product === newData.product
//       );
//       const indexToDelete = jsonData.shoppingList.findIndex(
//         (item) => item.product === "test8"
//       );
//       console.log(indexToDelete);

//       console.log(compareSequence);
//       if (compareSequence) {
//         console.log("Double record detected");
//         response.json({
//           returnMessage: "Double record detected",
//         });
//         return;
//       } else {
//         jsonData.shoppingList.push(newData);
//         console.log("start writing to json file");
//         fs.writeFile(
//           "public/data.json",
//           JSON.stringify(jsonData, null, 2),
//           "utf8",
//           (err) => {
//             if (err) {
//               console.log("Error writing file", err);
//               return;
//             }
//             console.log("JSON file updated successfully");
//             return;
//           }
//         );
//       }
//     } catch (parseError) {
//       console.log("Error parsing JSON:", parseError);
//     }
//   });
// });
