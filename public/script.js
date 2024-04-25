const list = document.querySelector(".data-list"); // All html elements to show items
const formEl = document.querySelector("#data-form"); // The form element
let existingItems = new Set(); // Keep track of existing items
const url = "./data.json"; //this is the url from the data json file
let addItemActivated;

async function getData() {
  const response = await fetch(url); // this will read out the file
  const data = await response.json(); // this will turn the json input into a JavaScript object

  const shoppingList = data.shoppingList; // this is used to get the array 'shoppingList' from the json file
  console.log(shoppingList);
  // this will loop over all the object inside the 'shoppingList' array
  shoppingList.forEach((element) => {
    // as long the existingItems set is not been set with the specifik element it will continue
    // to loop the next item.
    console.log(element.product);
    if (!existingItems.has(element.product)) {
      // setting variables for the HTML elemenmts
      const outerBox = document.createElement("div");
      const output = document.createElement("div");
      const button = document.createElement("button");
      // adding classes
      outerBox.classList.add("outer-box");
      button.classList.add("delete-button");
      output.classList.add("output");
      //adding content
      output.textContent = `${element.product} - \u20AC ${element.price}`;
      output.setAttribute("item", element.product);
      button.textContent = "Delete item";
      // add id from the json file, this is needed for example to delete the item
      button.setAttribute("id", element.id);
      //appending the output and button to the main 'outerbox' element
      outerBox.appendChild(output);
      outerBox.appendChild(button);
      //eventually this will be appended to the  visable shopping list
      list.appendChild(outerBox);
      // Add the new item to the set
      existingItems.add(element.product);
    }
  });
}
// click event to execute addItem function
formEl.addEventListener("submit", addItem);

// creates new item
function addItem(e) {
  // addItemActivated = true;
  console.log("test");
  e.preventDefault(); // this will stop the default behaviour
  // startInterval();
  const formData = new FormData(formEl);

  // defining the shoppingList Object
  const shoppingList = {
    product: formData.get("article"),
    price: formData.get("price"),
  };

  // using the POST method
  fetch("/api", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(shoppingList),
  })
    .then((response) => {
      if (response.ok) {
        // If the response is successful, parse the JSON data
        getAllElements().then(deleteItem);

        return response.json();
      } else {
        // If the response is not successful, throw an error with the response status
        throw new Error(response.status);
      }
    })
    .then((data) => {
      console.log(data);
      if (data.returnMessage) {
        console.log(`Response from server: ${data.returnMessage}`);
      } else {
        console.log(data.message);
        console.log(data.item);
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

// this item is needed to get all list item is visible at one point
async function getAllElements() {
  const dataAttribute = ".delete-button";
  // so all the items will be selected after the getData is being runned
  // to be able to show all delete buttons
  await getData();
  const allElements = document.querySelectorAll(dataAttribute);
  return allElements;
}

// delete specific item
function deleteItem(callback) {
  callback.forEach((element) => {
    console.log("star of delete function " + callback.length);
    console.log(element);
    const data = { id: element.getAttribute("id") };

    // startInterval();
    console.log(addItemActivated);
    // in this case for every delete button there will be an event listener added
    addItemActivated = element.addEventListener("click", (e) => {
      e.preventDefault();
      console.log("testmoment");
      // below the visible item will be removed - (just the visable one )
      const parent = element.parentNode;
      if (parent) {
        console.log(parent);
        console.log(parent.childNodes[0]);
        console.log(existingItems);
        existingItems.delete(parent.childNodes[0].getAttribute("item"));
        // console.log(parent.childNodes[0].getAttribute("item"));
        const parentOfParent = parent.parentNode;
        if (parentOfParent) {
          parentOfParent.removeChild(parent);
        }
      }
      // existingItems

      // using the DELETE method

      fetch("/api", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => {
          if (response.ok) {
            // If the response is successful, parse the JSON data
            return response.json();
          } else {
            // If the response is not successful, throw an error with the response status
            throw new Error(response.status);
          }
        })
        .then((data) => {
          if (data.returnMessage) {
            console.log(`Response from server: ${data.returnMessage}`);
          } else {
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

// this will all items from the enpoint
// and put all delete functionality to it as well
getAllElements().then(deleteItem);

let intervalId;

function startInterval() {
  console.log("interval started");
  intervalId = setInterval(() => {
    const dataAttribute = ".delete-button";
    getAllElements(dataAttribute)
      .then(deleteItem)
      .catch((error) => {
        console.log("something goes wrong");
        console.log(error);
      });
  }, 1000);
}

function stopInterval() {
  clearInterval(intervalId);
}

// startInterval();
