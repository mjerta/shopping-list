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
        if (data.returnMessage) {
          console.log(`Response from server: ${data.returnMessage}`);
        } else {
          // console.log(data.item);
          const dataAttribute = ".delete-button";
          getAllElements(dataAttribute).then(addDeleteFunctionality);
          console.log(data.message);
          console.log(data.item);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  });
}

const url = "./data.json";
sendData(url);

// Initial call to getData
// setInterval(() => {
//   getData()
//     .then((response) => {
//       // console.log("working");
//     })
//     .catch((error) => {
//       console.log("something goes wrong");
//       console.log(error);
//     });
// }, 1000);

async function getData() {
  const response = await fetch(url);
  const data = await response.json();

  const shoppingList = data.shoppingList;

  shoppingList.forEach((element) => {
    if (!existingItems.has(element.product)) {
      const outerBox = document.createElement("div");
      const output = document.createElement("div");
      const button = document.createElement("button");
      outerBox.classList.add("outer-box");
      button.classList.add("delete-button");
      output.classList.add("output");
      output.textContent = `${element.product} - \u20AC ${element.price}`;
      button.textContent = "Delete item";
      button.setAttribute("id", element.id);
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
  callback.forEach((element) => {
    const data = { id: element.getAttribute("id") };
    console.log(data);
    element.addEventListener("click", () => {
      console.log(element);
      const parent = element.parentNode;
      console.log(parent);
      parent.parentNode.removeChild(parent);
      fetch("/api", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => {
          if (response.ok) return response.json();
          throw new Error(response.status);
        })
        .then((data) => {
          if (data.returnMessage) {
            console.log(`Response from server: ${data.returnMessage}`);
          } else {
            // console.log(data.item);
            console.log(data.message);
            console.log(data.item);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    });
  });
}

const dataAttribute = ".delete-button";
getAllElements(dataAttribute).then(addDeleteFunctionality);
