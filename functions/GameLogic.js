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
//if card matches color or number, is a skip card matching color or if it's a wild card, let it be played
//if there's more than 2 players, allow direction switching cards to be drawn and played
const checkCards = (params) => {
    var currentCardColor, currentCardNumber, wildCard, skipCard, playerChosenColor;
    if (wildCard == true) {
        //set up logic to allow player to set color
        //if +2 or +4, increase next player's hand by that amount
        currentCardColor = playerChosenColor;
        currentCardNumber = 0;
    } else if (skipCard == true && cardColor == currentCardColor) {
        //allow card to be played and skip next player's turn
        currentCardColor = playerChosenColor;
        currentCardNumber = 0;
    } else if (cardColor == currentCardColor || cardNumber == currentCardNumber) {
        //allow to be played
        currentCardColor = cardColor;
        currentCardNumber = cardNumber;
    } else {
        //don't allow the selected card to be played
        params = "This is not the number 1234";
        console.log(params);
    }
};
// function to check if a card can be played
const canPlayCard = (playedCard, currentPlayer) => {
    if (playedCard.color === wildCardColor) {
        // Logic for wild card, check if the chosen color is valid
        return isValidColor(playerChosenColor);
    } else if (playedCard.color === currentCardColor || playedCard.number === currentCardNumber) {
        // Logic for regular cards, check if color or number matches
        return true;
    } else if (playedCard.number === "Skip" && playedCard.color === currentCardColor) {
        // Logic for Skip cards
        // Perform actions for Skip card (e.g., skipping next player's turn)
        skipNextPlayer();
        return true;
    } else {
        return false;
    }
};

// function to play a card
const playCard = (playedCardIndex, playerChosenColor) => {
    const playedCard = players[currentPlayer].hand[playedCardIndex];

    if (canPlayCard(playedCard, currentPlayer)) {
        // Card can be played
        currentCardColor = playedCard.color;
        currentCardNumber = playedCard.number;

        // Additional logic for special cards (e.g., +2 or +4)
        handleSpecialCard(playedCard);

        // Remove the played card from the player's hand
        players[currentPlayer].hand.splice(playedCardIndex, 1);

        // Switch to the next player
        switchPlayer();

        // Draw a card for the next player if needed
        drawCardForNextPlayer();
    } else {
        // Card cannot be played
        console.log("Invalid move. Try again.");
    }
};

// This handles special cards (e.g., +2 or +4)
const handleSpecialCard = (playedCard) => {
    if (playedCard.number === "+2") {
        // Draw two cards for the next player
        drawCardsForNextPlayer(2);
    } else if (playedCard.number === "+4") {
        // Draw four cards for the next player
        drawCardsForNextPlayer(4);
    }
};

// draw cards for the next player
const drawCardsForNextPlayer = (numCards) => {
    const nextPlayerIndex = getNextPlayerIndex();
    for (let i = 0; i < numCards; i++) {
        const randomCard = getRandomCard();
        players[nextPlayerIndex].hand.push(randomCard);
        deck.splice(randomCard, 1);
    }
};

// function to skip the next player's turn
const skipNextPlayer = () => {
    currentPlayer = getNextPlayerIndex();
};

// function to switch to the next player
const switchPlayer = () => {
    currentPlayer += direction;
    if (currentPlayer < 0) {
        currentPlayer = players.length - 1;
    } else if (currentPlayer >= players.length) {
        currentPlayer = 0;
    }
};

// function to get the index of the next player
const getNextPlayerIndex = () => {
    let nextPlayer = currentPlayer + direction;
    if (nextPlayer < 0) {
        nextPlayer = players.length - 1;
    } else if (nextPlayer >= players.length) {
        nextPlayer = 0;
    }
    return nextPlayer;
};

// function to check if a color is valid
const isValidColor = (color) => {
    return ["red", "blue", "green", "yellow"].includes(color);
};