// the main setup
const express = require("express");
const fs = require("fs").promises;
const app = express();
// Used to serve all pages and files withing public
app.listen(3000, () => console.log("listening at 3000"));
app.use(express.static("public"));

app.use(express.json({ limit: "5mb" }));

const dataFilePath = "public/data.json";

// read all items from json file
async function readItemsFromFile() {
  try {
    const data = await fs.readFile(dataFilePath);
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading file:", error);
    throw error;
  }
}
// write new data ( could be POST, PUT or DELETE)
async function writeItemToFile(data) {
  try {
    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error writing file:", error);
    throw error;
  }
}

// HANDLING THE POST request - this will add a new item
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
    await writeItemToFile(jsonData);
    res
      .status(201)
      .json({ message: "Item created successfully", item: newItem });
  } catch (error) {
    console.error("Error creating item:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// HANDLING THE DELETE request - this will delete a certain item
app.delete("/api", async (req, res) => {
  try {
    console.log("delete action");
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
      await writeItemToFile(jsonData);
      res
        .status(201)
        .json({ message: "Item deleted successfully", item: newItem });
    }
  } catch (error) {
    console.error("Error creating item:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
