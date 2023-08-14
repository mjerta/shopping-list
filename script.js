const url = "./data.json";
const list = document.querySelector(".data-list");
const existingItems = new Set(); // Keep track of existing items

// Initial call to getData
getData();
setInterval(getData, 1000);

async function getData() {
  const response = await fetch(url);
  const data = await response.json();

  const shoppingList = data.shoppingList;

  shoppingList.forEach((element) => {
    if (!existingItems.has(element.product)) {
      const listItem = document.createElement("li");
      listItem.textContent = element.product;
      list.appendChild(listItem);

      existingItems.add(element.product); // Add the new item to the set
    }
  });
}
