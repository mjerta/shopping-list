const list = document.querySelector(".data-list"); // All html elements to show items
const formEl = document.querySelector("#data-form"); // The form element
const url = "./data.json"; //this is the url from the data json file
let existingItems = new Set(); // Keep track of existing items
let addItemActivated; // Is used to keep track of items are being added
let isClickInProgress = false; // is used to check if a click event is being in place at a certain moment

async function getData() {
  const response = await fetch(url); // this will read out the file
  const data = await response.json(); // this will turn the json input into a JavaScript object

  const shoppingList = data.shoppingList; // this is used to get the array 'shoppingList' from the json file

  // this will loop over all the object inside the 'shoppingList' array
  shoppingList.forEach((element) => {
    // as long the existingItems set is not been set with the specifik element it will continue
    // to loop the next item.
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
  addItemActivated = true;
  e.preventDefault(); // this will stop the default behaviour
  // startInterval();
  const formData = new FormData(formEl);
  formEl.reset();
  console.log(formEl.childNodes[1].childNodes[3]);
  formEl.childNodes[1].childNodes[3].focus();

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
        getAllElements().then(activateDeleteButtons);

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

// activate delete functionality for all items in the list
function activateDeleteButtons(callback) {
  if (addItemActivated) {
    // when new items are being added there shiould only be added one event listener
    console.log(list.childNodes.length);
    if (list.childNodes.length != 0) {
      const lastItem = callback[callback.length - 1];

      // This data will be used to select the last item from the list to be deleted (everytime an item is added).
      // So this repeats itself everytime a Item is added.

      // SIDENOTE
      // This is better then saving the element last been created, because this would change over and over again,
      // what would be cause that only the latest saved data could be reach
      const data = { id: lastItem.getAttribute("id") };
      lastItem.addEventListener("click", (e) => {
        e.preventDefault();
        deleteItem(lastItem, data);
      });
    }
  } else {
    // in this case for every delete button there will be an event listener added
    callback.forEach((element) => {
      // this data will be used to select the item to be deleted
      const data = { id: element.getAttribute("id") };

      element.addEventListener("click", (e) => {
        e.preventDefault();
        deleteItem(element, data);
      });
    });
  }
}

function deleteItem(elementCLicked, id) {
  // below the visible item will be removed - (just the visable one )
  const parent = elementCLicked.parentNode;
  if (parent) {
    existingItems.delete(parent.childNodes[0].getAttribute("item"));
    const parentOfParent = parent.parentNode;
    if (parentOfParent) {
      parentOfParent.removeChild(parent);
    }
  }

  // using the DELETE method
  fetch("/api", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(id),
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
}

// ON STARTUP
// this will all items from the enpoint
// and put all delete functionality to it as well
getAllElements()
  .then(activateDeleteButtons)
  .catch((error) => {
    console.log("something goes wrong");
    console.log(error);
  });

let intervalId; // variable can be use to stop the interval

// This interval is used to run updates every 30s to make sure if one other user is entering data, it would be visisble
function startInterval() {
  intervalId = setInterval(() => {
    // Check to see if click event is taking place, if not the update of items can start
    if (!isClickInProgress) {
      getAllElements()
        .then(activateDeleteButtons)
        .catch((error) => {
          console.log("something goes wrong");
          console.log(error);
        });
    } else {
      console.log("Update of items not worked, click event was taking place");
    }
  }, 30000);
}
startInterval();

//this function is not used for now
function stopInterval() {
  clearInterval(intervalId);
}

// this will add a check to see if a click event happened at the wrong time
document.addEventListener("click", () => {
  isClickInProgress = true;

  // duration i give to process the click event
  setTimeout(() => {
    isClickInProgress = false;
  }, 500);
});
