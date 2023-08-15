const url = "./data.json";
const list = document.querySelector(".data-list");
const existingItems = new Set(); // Keep track of existing items

function sendData(url) {
  const formEl = document.querySelector("#data-form");

  formEl.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(formEl);
    const data = Object.fromEntries(formData);
    console.log(data);
  });
}

sendData(url);

// Initial call to getData
setInterval(() => {
  getData()
    .then((response) => {
      // console.log("working");
    })
    .catch((error) => {
      console.log("something goes wrong");
      console.log(error);
    });
}, 1000);

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
