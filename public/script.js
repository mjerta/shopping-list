const list = document.querySelector(".data-list");
const existingItems = new Set(); // Keep track of existing items

function sendData(url) {
  const formEl = document.querySelector("#data-form");

  formEl.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(formEl);

    console.log(formData);

    const shoppingList = {
      product: formData.get("article"),
      price: formData.get("price"),
    };
    // Other products...
    // console.log(url);

    fetch("/api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(shoppingList),
    }).then((response) => {
      console.log(response);
    });
  });
}

const url = "./data.json";
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
      listItem.classList.add("li-item");
      listItem.textContent = `${element.product} - \u20AC ${element.price}`;
      list.appendChild(listItem);
      existingItems.add(element.product); // Add the new item to the set
    }
  });
}

async function getAllElements(selector) {
  await getData();
  const allElements = document.querySelectorAll(selector);
  return allElements;
}

async function clickListElement(list, callBack) {
  const arr = await callBack(list);

  arr.forEach((item) => {
    console.log(item);
  });
}

clickListElement(".li-item", getAllElements);
