//#region Global Variables
var players = []; // Array to hold each player's hand
var deck = []; // Array to hold the deck of cards
var discardPile = []; // Array to hold the discard pile
var currentColorInPlay = ""; // Variable to hold the current color in play
var maxDrawCount = 0; // Variable to hold the max number of cards to draw
var currentPlayer = 0; // Variable to hold the current player
const shuffleDealButton = document.getElementById("shuffle-deal");
const cardWidth = 73;
const cardHeight = 110;

//#endregion

//#region Card Generation

const cardColor = (num) => {
  let color;
  if (num % 14 === 13) {
    return "black";
  }
  switch (Math.floor(num / 14)) {
    case 0:
    case 4:
      color = "red";
      break;
    case 1:
    case 5:
      color = "yellow";
      break;
    case 2:
    case 6:
      color = "green";
      break;
    case 3:
    case 7:
      color = "blue";
      break;
  }
  return color;
};

const cardType = (num) => {
  switch (num % 14) {
    case 10: //Skip
      return "Skip";
    case 11: //Reverse
      return "Reverse";
    case 12: //Draw 2
      return "Draw2";
    case 13: //Wild or Wild Draw 4
      if (Math.floor(num / 14) >= 4) {
        return "Draw4";
      } else {
        return "Wild";
      }
    default:
      return num % 14;
  }
};

// Load the image
const cardImage = new Image();
cardImage.src = "./assets/deck.svg";

// Create the deck from the SVG and remove blank cards from deck
cardImage.onload = () => {
  let num = 0;
  for (let y = 0; y < 8 * cardHeight; y += cardHeight) {
    for (let x = 0, count = 0; count < 14; x += cardWidth, count++) {
      // Skip the first card in rows 5-8
      if (y >= 4 * cardHeight && count === 0) {
        num++;
        continue;
      }
      const cardEl = createCardElement(cardImage, x + 1, y - 1);
      cardEl.dataset.color = cardColor(num);
      cardEl.dataset.type = cardType(num);
      deck.push(cardEl);
      num++;
    }
  }
  //! Debug
  console.log("Deck initialized with " + deck.length + " cards.");
};

// Function to create a canvas with a specific card drawn on it
const createCardElement = (cardImage, x, y) => {
  const canvas = document.createElement("canvas");
  canvas.width = cardWidth;
  canvas.height = cardHeight;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(
    cardImage,
    x,
    y,
    cardWidth,
    cardHeight,
    0,
    0,
    cardWidth,
    cardHeight
  );
  canvas.onclick = () => playCard(canvas);
  return canvas;
};
const cardPile = document.getElementById("card-pile");
const cardDeckEl = document.getElementById("card-deck");

// Shuffle the deck
const shuffleDeck = () => {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  //! Debug
  console.log("Deck shuffled.");
};

shuffleDealButton.addEventListener("click", shuffleDeck);
//#endregion

//#region Modal Logic
// When the page loads, show the modal
window.onload = function () {
  var modal = document.getElementById("opponentSelectDialog");
  modal.style.display = "block";

  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];

  // When the user clicks on <span> (x), close the modal
  span.onclick = function () {
    modal.style.display = "none";
  };
};
//#endregion

const initializeDiscardPile = () => {
  if (deck.length > 0) {
    const flippedCard = deck.shift();
    const flippedCardElement = document.getElementById("discarded-card");
    flippedCard.id = "discarded-card";
    flippedCardElement.replaceWith(flippedCard); // Replace the canvas with the actual card
    discardPile.push(flippedCard);
    console.log("discardPile", discardPile);
  }

  console.log("Discard pile initialized.");
};

// Function to initialize players
const initializePlayers = (opponentCount, playerName) => {
  for (let i = 0; i <= opponentCount; i++) {
    players.push({ name: i === 0 ? playerName : `Opponent ${i}`, hand: [] });
  }
};

//#region Game Logic
// Function to start the game with the selected number of opponents and player name
const startGame = () => {
  var playerName = document.getElementById("playerName").value.trim();
  var opponentCount = document.getElementById("opponentCount").value;

  if (!playerName) {
    alert("Please enter your name.");
    return;
  }

  if (!opponentCount) {
    alert("Please select the number of opponents.");
    return;
  }

  console.log(
    "Player Name: " +
      playerName +
      ", Starting game with " +
      opponentCount +
      " opponents"
  );

  // Display names of opponents based on the selected number
  if (opponentCount >= 1) {
    document.getElementById("opponent-1-NameDisplay").style.display = "block";
  }
  if (opponentCount >= 2) {
    document.getElementById("opponent-2-NameDisplay").style.display = "block";
  }
  if (opponentCount >= 3) {
    document.getElementById("opponent-3-NameDisplay").style.display = "block";
  }

  // Additional game initialization logic
  // Close the modal after selection
  document.getElementById("opponentSelectDialog").style.display = "none";
  initializePlayers(opponentCount, playerName);
  var playerNameDisplay = document.getElementById("playerNameDisplay");
  playerNameDisplay.innerHTML = playerName;
  playerNameDisplay.style.display = "block";
  shuffleDeck();
  dealCards();
  initializeDiscardPile();
};

// Function to create an element for the back of a card
const createBackCardElement = () => {
  const img = document.createElement("img");
  img.src = "./assets/uno.svg"; // Path to the back of the card image
  img.alt = "Card Back";
  img.style.width = "73px";
  img.style.height = "110px";
  img.style.margin = "2px";
  // Set any additional attributes, styles, or classes as needed
  return img;
};

// Function to deal cards
const dealCards = () => {
  for (let cardCount = 0; cardCount < 7; cardCount++) {
    players.forEach((player, index) => {
      if (deck.length > 0) {
        const card = deck.shift();

        if (
          player.name === document.getElementById("playerName").value.trim()
        ) {
          // Dealing to the human player
          player.hand.push(card);
          const playerCardsContainer = document.getElementById("player-cards");
          playerCardsContainer.appendChild(card); // Add the card to the player's cards container
        } else {
          // Dealing to opponents
          const backCardEl = createBackCardElement();
          player.hand.push(backCardEl);
          // Determine the correct container for each opponent
          let opponentContainerId = "";
          switch (index) {
            case 1:
              opponentContainerId = "opponent-1-cards"; // Opponent 1 (Top)
              break;
            case 2:
              opponentContainerId = "opponent-2-cards"; // Opponent 2 (Left)
              break;
            case 3:
              opponentContainerId = "opponent-3-cards"; // Opponent 3 (Right)
              break;
          }
          const opponentContainer =
            document.getElementById(opponentContainerId);
          if (opponentContainer) {
            opponentContainer.appendChild(backCardEl); // Add the back of the card to the opponent's container
          }
        }
      }
    });
  }
};

// Function to draw a card from the pile
const drawCard = () => {
  if (deck.length > 0) {
    const card = deck.shift();
    const playerHand = players[0].hand; // Assuming players[0] is the human player
    playerHand.push(card);
    const playerCardsContainer = document.getElementById("player-cards");
    playerCardsContainer.appendChild(card);
  }
};

// Add this event listener to the card pile image
document.getElementById("card-pile").addEventListener("click", drawCard);

// Logic to determine if legal play was made
const isLegalPlay = (card) => {
  // Get the last card from the discard pile
  const topDiscard = discardPile[discardPile.length - 1];

  // Check if the played card matches the top card of the discard pile in color or type,
  // or if the played card is a Wild or Wild Draw 4 card.
  if (card.dataset.type === "Wild" || card.dataset.type === "Draw4") {
    console.log(discardPile);
    players[0].hand.splice(players[0].hand.indexOf(card), 1);
    discardPile.push(card);
    return true; // Wild and Wild Draw 4 cards can be played on anything
  } else if (card.dataset.color === topDiscard.dataset.color) {
    players[0].hand.splice(players[0].hand.indexOf(card), 1);
    discardPile.push(card);
    console.log(discardPile);
    return true; // Same color can always be played
  } else if (card.dataset.type === topDiscard.dataset.type) {
    players[0].hand.splice(players[0].hand.indexOf(card), 1);
    discardPile.push(card);
    console.log(discardPile);
    return true; // Same type can always be played
  }

  // If none of the above conditions are met, the play is illegal
  return false;
};

// Function to play a card
const playCard = (card) => {
  if (isLegalPlay(card)) {
    const topCard = document.getElementById("discarded-card");
    if (topCard) {
      topCard.replaceWith(card);
      card.id = "discarded-card"; // Assigning the ID to the new card
    } else {
      console.error("No top card found in the discard pile.");
      // handle this error case
    }
  } else {
    alert("Illegal Play, please try again.");
  }
};

//#endregion
