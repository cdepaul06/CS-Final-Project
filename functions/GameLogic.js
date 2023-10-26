//global  variables
let deck = [
  {
    color: null,
    number: null,
  },
];

const generateDeck = (colors, numbers) => {
  for (let i = 0; i < colors.length; i++) {
    for (let j = 0; j < numbers.length; j++) {
      deck.push({
        color: colors[i],
        number: numbers[j],
      });
    }
  }
};

generateDeck(
  ["red", "blue", "green", "yellow"],
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
);

let players = [
  {
    name: "",
    hand: [],
  },
];
let currentPlayer = 0;
let direction = 1;
let currentCardColor = "";
let currentCardNumber = 0;
let isWildCard = false;
let wildCardColor = "";

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

const generatespecialCard = (cardColor, cardNumber = "Wild") => {
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

// function to get a random card from the deck
const getRandomCard = () => {
  // get a random number between 0 and the length of the deck
  const randomCard = Math.floor(Math.random() * deck.length);
  // return the random card
  return randomCard;
};

// function to deal the cards to the players
const dealCards = () => {
  // loop through the players
  for (let i = 0; i < players.length; i++) {
    // loop through the cards
    for (let j = 0; j < 7; j++) {
      // get a random card
      const randomCard = getRandomCard();
      // push the card to the player's hand
      players[i].hand.push(randomCard);
      // remove the card from the deck
      deck.splice(randomCard, 1);
    }
  }
};
