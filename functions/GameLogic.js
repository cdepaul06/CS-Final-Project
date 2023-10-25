// This function can be used to create a single card or even a full deck of cards if we pass an array of numbers
const generateNumCards = (cardColor, cardNumber) => {
  const parentElement = document.getElementById("cards-container");

  // Create card structure
  const cardElement = document.createElement("div");
  cardElement.classList.add("uno-card", cardColor);

  const topLeft = document.createElement("div");
  topLeft.classList.add("top-left");
  topLeft.innerText = cardNumber;

  const circle = document.createElement("div");
  circle.classList.add("circle");

  const number = document.createElement("div");
  number.classList.add("number");
  number.innerText = cardNumber;

  const bottomRight = document.createElement("div");
  bottomRight.classList.add("bottom-right");
  bottomRight.innerText = cardNumber;

  // Append all parts to the card
  cardElement.appendChild(topLeft);
  cardElement.appendChild(circle);
  cardElement.appendChild(number);
  cardElement.appendChild(bottomRight);

  // Append the card to the parent element
  parentElement.appendChild(cardElement);
};

const generatespecialCard = (
  cardColor,
  cardNumber = "Wild",
  action,
  symbol
) => {
  const parentElement = document.getElementById("cards-container");

  // Create card structure
  const cardElement = document.createElement("div");
  cardElement.classList.add("uno-card", cardColor);

  const topLeft = document.createElement("div");
  topLeft.classList.add("top-left");
  topLeft.innerText = cardNumber;

  const circle = document.createElement("div");
  circle.classList.add("circle");

  const number = document.createElement("div");
  number.classList.add("number");
  number.innerText = cardNumber;

  const bottomRight = document.createElement("div");
  bottomRight.classList.add("bottom-right");
  bottomRight.innerText = cardNumber;

  // Append all parts to the card
  cardElement.appendChild(topLeft);
  cardElement.appendChild(circle);
  cardElement.appendChild(number);
  cardElement.appendChild(bottomRight);

  // Append the card to the parent element
  parentElement.appendChild(cardElement);
};
