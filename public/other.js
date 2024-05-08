const box4 = document.querySelector(".hidden");
const allBoxes = document.querySelectorAll(".output");

// window.addEventListener("resize", () => {
//   allBoxes.forEach((element) => {
//     const widthOfElement = calculateWidth(element);
//     const formattedElement = formatWidthOutput(widthOfElement);
//     console.log(formattedElement);
//     element.textContent = formattedElement;
//   });
// });

function calculateWidth(target) {
  const computedStyle = window.getComputedStyle(target);
  return computedStyle.width;
}

function formatWidthOutput(input) {
  let indexOfInput = input.indexOf(".");
  if (indexOfInput !== -1) {
    const newString = input.slice(0, indexOfInput);
    return newString;
  } else {
    indexOfInput = input.indexOf("px");
    const newString = input.slice(0, indexOfInput);
    return newString;
  }
}
