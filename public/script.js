const list = document.querySelector(".data-list");
const existingItems = new Set(); // Keep track of existing items

function sendData(url) {
  const formEl = document.querySelector("#data-form");

  formEl.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(formEl);

    // console.log(formData);

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
    })
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error(response.status);
      })
      .then((data) => {
        console.log(`Response from server: ${data.returnMessage}`);
      })
      .catch((error) => {
        console.log(error);
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

  let iterator = 0;
  shoppingList.forEach((element) => {
    if (!existingItems.has(element.product)) {
      iterator++;
      const outerBox = document.createElement("div");
      const output = document.createElement("div");
      const button = document.createElement("button");
      outerBox.classList.add("outer-box");
      button.classList.add("delete-button");
      button.dataset.count = iterator;
      output.classList.add("output");
      output.dataset.count = iterator;
      output.textContent = `${element.product} - \u20AC ${element.price}`;
      button.textContent = "Delete item";
      outerBox.appendChild(output);
      outerBox.appendChild(button);
      list.appendChild(outerBox);
      existingItems.add(element.product); // Add the new item to the set
    }
  });
}

async function getAllElements(selector) {
  await getData();
  const allElements = document.querySelectorAll(selector);
  return allElements;
}

function addDeleteFunctionality(callback) {
  for (let i = 0; i < callback.length; i += 2) {
    //this are the two i want to compare with each other
    console.log(callback[i].getAttribute("data-count"));
    console.log(callback[i].textContent);
    console.log(callback[i + 1].getAttribute("data-count"));
  }
}

const dataAttribute = "[data-count]";
getAllElements(dataAttribute).then(addDeleteFunctionality);
