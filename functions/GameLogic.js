//#region Global Variables
var players = []; // Array to hold each player's hand
var deck = []; // Array to hold the deck of cards
var discardPile = []; // Array to hold the discard pile
let cpuPlayTimeout = null; // Variable to hold the interval for CPU play
var currentColorInPlay = ""; // Variable to hold the current color in play
var maxDrawCount = 0; // Variable to hold the max number of cards to draw
var drawnCount = 0; // Variable to hold the number of cards drawn
var currentPlayer = {}; // Variable to hold the current player
var turnLogText = []; // Array to hold the turn log// Variable to hold whether it is the player's turn
var colors = ["red", "yellow", "green", "blue"]; // Array to hold the colors
const cardWidth = 73;
const cardHeight = 110;
var playerName = null;
var opponentCount = null;
var selectedColor = null;
//#endregion

//#region Sound Effects
const cardHoverSound = document.getElementById("cardHoverSound");
const cardPlaySound = document.getElementById("cardPlaySound");
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
  canvas.onmouseover = () => {
    if (cardHoverSound) {
      cardHoverSound.currentTime = 0; // Reset playback position to the start
      cardHoverSound.play(); // Play the sound when the mouse is over the card
    }
  };
  return canvas;
};

const convertCPUBackCardtoFront = (card) => {
  const frontCard = createCardElement(cardImage, cardWidth, cardHeight, true);
  frontCard.dataset.color = card.dataset.color;
  frontCard.dataset.type = card.dataset.type;
  return frontCard;
};

// Function to create a canvas element for the back of a card
const createBackCardElement = (color, type) => {
  const canvas = document.createElement("canvas");
  canvas.width = cardWidth;
  canvas.height = cardHeight;
  const ctx = canvas.getContext("2d");

  const backCardImage = new Image();
  backCardImage.src = "./assets/uno.svg"; // Path to the back of the card image
  backCardImage.onload = () => {
    ctx.drawImage(backCardImage, 0, 0, cardWidth, cardHeight);
  };

  // Store the actual card information in the dataset
  canvas.dataset.color = color;
  canvas.dataset.type = type;

  return canvas;
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

const cardPile = document.getElementById("card-pile");
const cardDeckEl = document.getElementById("card-deck");

const determineCPUContainer = (index, backCardCanvas) => {
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
  const opponentContainer = document.getElementById(opponentContainerId);
  if (opponentContainer) {
    opponentContainer.appendChild(backCardCanvas); // Add the back of the card canvas to the opponent's container
  }
};

//#endregion

//#region Modal Logic
// When the page loads, show the modal
window.onload = () => {
  var modal = document.getElementById("opponentSelectDialog");
  modal.style.display = "block";

  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];

  // When the user clicks on <span> (x), close the modal
  span.onclick = () => {
    modal.style.display = "none";
  };
};
//#endregion

//#region Game Initialization Logic
// Shuffle the deck
const shuffleDeck = () => {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  //! Debug
  console.log("Deck shuffled.");
};

const initializeDiscardPile = () => {
  if (deck.length > 0) {
    const flippedCard = deck.shift();
    const flippedCardElement = document.getElementById("discarded-card");
    flippedCard.id = "discarded-card";
    flippedCard.onclick = null;
    flippedCardElement.replaceWith(flippedCard); // Replace the canvas with the actual card
    discardPile.push(flippedCard);
  }
  //! Debug
  console.log("Discard pile initialized.");
};

// Function to initialize players
const initializePlayers = (opponentCount, playerName) => {
  for (let i = 0; i <= opponentCount; i++) {
    players.push({ name: i === 0 ? playerName : `Opponent ${i}`, hand: [] });
  }
};

// Function to start the game with the selected number of opponents and player name
const startGame = () => {
  playerName = document.getElementById("playerName").value.trim();
  opponentCount = document.getElementById("opponentCount").value;

  if (!playerName) {
    playAlert("Please enter your name.");
    return;
  }

  //* This will never evaluate to true, but just good practice to add the validation
  if (!opponentCount) {
    playAlert("Please select the number of opponents.");
    return;
  }

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

  currentPlayer = players[0];

  currentColorInPlay = discardPile[discardPile.length - 1].dataset.color;
  if (discardPile[discardPile.length - 1].dataset.type === "Draw4") {
    maxDrawCount = 4;
    checkForColorChange(discardPile[discardPile.length - 1]);
  }

  if (discardPile[discardPile.length - 1].dataset.type === "Wild") {
    checkForColorChange(discardPile[discardPile.length - 1]);
  }

  if (discardPile[discardPile.length - 1].dataset.type === "Draw2") {
    maxDrawCount = 2;
  }

  if (discardPile[discardPile.length - 1].dataset.type === "Reverse") {
    if (players.length === 2) {
      // If there are only two players, act like a skip card
      changePlayer();
    } else {
      // For more than two players, reverse the order
      players.reverse();
      let reversePlayerIndex = players.findIndex(
        (p) => p.name === currentPlayer.name
      );
      currentPlayer = players[(reversePlayerIndex + 1) % players.length];
    }
  } else if (discardPile[discardPile.length - 1].dataset.type === "Skip") {
    changePlayer(); // Skip the next player
    if (opponentCount === 1) {
      // If there is only one opponent, it's your turn again
      changePlayer();
    }
  }

  if (currentPlayer.name !== playerName) {
    startCPUPlay();
  }

  turnLogText.push(`${currentPlayer.name}'s turn.`);
  const gameLog = document.getElementById("game-log");
  gameLog.innerHTML = turnLogText
    .map((turn, index) => `<p>${index + 1}. ${turn}</p>`)
    .join("");
  console.log("Game started.");
};

//#endregion

//#region Card & Turn Logic
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
          const backCardCanvas = createBackCardElement(
            card.dataset.color,
            card.dataset.type
          );
          player.hand.push(backCardCanvas);
          determineCPUContainer(index, backCardCanvas);
        }
      }
    });
  }
  console.log("Cards dealt.");
};

// Function to draw a card from the pile of cards
const drawCard = () => {
  // Check if the deck is not empty
  if (deck.length > 0) {
    // Draw a card
    const card = deck.shift();
    currentPlayer.hand.push(card);

    console.log("current player", currentPlayer.hand.length);

    // Update the UI for the drawn card
    if (currentPlayer.name === playerName) {
      const playerCardsContainer = document.getElementById("player-cards");
      playerCardsContainer.appendChild(card);
    } else {
      const backCardCanvas = createBackCardElement(
        card.dataset.color,
        card.dataset.type
      );
      determineCPUContainer(players.indexOf(currentPlayer), backCardCanvas);
    }

    // Log the draw
    turnLogText.push(
      `${currentPlayer.name} drew a card. They now have ${currentPlayer.hand.length} cards.`
    );
    const gameLog = document.getElementById("game-log");
    gameLog.innerHTML = turnLogText
      .map((turn, index) => `<p>${index + 1}. ${turn}</p>`)
      .join("");

    // Increment the drawn card count
    drawnCount++;

    // Check if the player has drawn the max number of cards or if it's a human player who drew a playable card
    if (
      drawnCount >= maxDrawCount ||
      (currentPlayer.name === playerName && isLegalPlay(card))
    ) {
      // Reset drawn count and max draw count for the next player
      drawnCount = 0;
      maxDrawCount = 0;
      changePlayer();

      if (currentPlayer.name !== playerName) {
        startCPUPlay();
      }
    }
  }
};

// Logic to determine if legal play was made
const isLegalPlay = (card) => {
  // Get the last card from the discard pile
  const topDiscard = discardPile[discardPile.length - 1];

  // Check if the played card matches the top card of the discard pile in color or type,
  // or if the played card is a Wild or Wild Draw 4 card.
  if (card.dataset.type === "Wild" || card.dataset.type === "Draw4") {
    currentPlayer.hand.splice(currentPlayer.hand.indexOf(card), 1);
    discardPile.push(card);
    return true; // Wild and Wild Draw 4 cards can be played on anything
  } else if (card.dataset.color === topDiscard.dataset.color) {
    currentPlayer.hand.splice(currentPlayer.hand.indexOf(card), 1);
    discardPile.push(card);
    return true; // Same color can always be played
  } else if (card.dataset.type === topDiscard.dataset.type) {
    currentPlayer.hand.splice(currentPlayer.hand.indexOf(card), 1);
    discardPile.push(card);
    return true; // Same type can always be played
  }

  // If none of the above conditions are met, the play is illegal
  return false;
};

// Function to play a card
const playCard = (card) => {
  if (
    card.dataset.type === "Wild" ||
    card.dataset.type === "Skip" ||
    card.dataset.type === "Draw4" ||
    card.dataset.type === "Reverse" ||
    card.dataset.type === "Draw2"
  ) {
    playAlert(card.dataset.type);
  }
  const topCard = document.getElementById("discarded-card");

  if (isLegalPlay(card)) {
    // Update the UI to reflect the played card
    if (topCard) {
      cardPlaySound.play();
      topCard.replaceWith(card);
      card.id = "discarded-card";
      card.onclick = null;
      turnLogText.push(
        `${currentPlayer.name} played a ${card.dataset.color} ${card.dataset.type}.`
      );
      const gameLog = document.getElementById("game-log");
      gameLog.innerHTML = turnLogText
        .map((turn, index) => `<p>${index + 1}. ${turn}</p>`)
        .join("");
    }

    // Check for UNO condition after the card is played
    if (currentPlayer.hand.length === 1) {
      playAlert("UNO!");
    }

    // Check for a winner
    if (checkForWinner()) {
      endGame();
      return;
    }

    // Handle special cards
    if (card.dataset.type === "Reverse") {
      if (players.length === 2) {
        changePlayer();
      } else {
        players.reverse();
        let reversePlayerIndex = players.findIndex(
          (p) => p.name === currentPlayer.name
        );
        currentPlayer = players[(reversePlayerIndex + 1) % players.length];
      }
    } else if (card.dataset.type === "Skip") {
      changePlayer();
      if (opponentCount === 1) {
        changePlayer();
      }
    } else if (card.dataset.type === "Wild" || card.dataset.type === "Draw4") {
      checkForColorChange(card);
      if (card.dataset.type === "Draw4") {
        maxDrawCount = 4;
      }
      if (currentPlayer.name === playerName) {
        return;
      }
    } else if (card.dataset.type === "Draw2") {
      maxDrawCount = 2;
    }

    // Change player after a Draw2/Draw4 card or other regular cards
    if (card.dataset.type === "Draw2" || card.dataset.type === "Draw4") {
      changePlayer();
      if (currentPlayer.name !== playerName) {
        startCPUPlay();
      }
      return;
    }

    changePlayer();
    if (currentPlayer.name !== playerName) {
      startCPUPlay();
    }
  } else {
    playAlert("Illegal Play, please try again.");
  }

  // Error handling if the top card is not found
  if (!topCard) {
    console.error("Something is broken!");
  }
};

const checkForColorChange = (card) => {
  if (
    (card.dataset.type === "Wild" || card.dataset.type === "Draw4") &&
    currentPlayer.name === playerName
  ) {
    var modal = document.getElementById("colorSelectDialog");
    modal.style.display = "block";
  } else if (
    (card.dataset.type === "Draw4" || card.dataset.type === "Wild") &&
    currentPlayer.name !== playerName
  ) {
    // if not a human player randomly select a color from colors array
    currentColorInPlay = colors[Math.floor(Math.random() * colors.length)];
    discardPile[discardPile.length - 1].dataset.color = currentColorInPlay;
    turnLogText.push(
      `${currentPlayer.name} changed the color to ${currentColorInPlay}.`
    );
  }
};

const setCurrentColor = () => {
  selectedColor = document.getElementById("colorSelection").value;
  currentColorInPlay = selectedColor;
  discardPile[discardPile.length - 1].dataset.color = currentColorInPlay;
  turnLogText.push(
    `${currentPlayer.name} changed the color to ${currentColorInPlay}.`
  );
  const gameLog = document.getElementById("game-log");
  gameLog.innerHTML = turnLogText
    .map((turn, index) => `<p>${index + 1}. ${turn}</p>`)
    .join("");

  var modal = document.getElementById("colorSelectDialog");
  modal.style.display = "none";

  // Check if it's the start of the game and the first card is a Wild
  if (
    discardPile.length === 1 &&
    (discardPile[0].dataset.type === "Wild" ||
      discardPile[0].dataset.type === "Draw4")
  ) {
    // Do not change player, let the human player continue their turn
    return;
  }

  changePlayer();

  if (currentPlayer.name !== playerName) {
    startCPUPlay(); // Starting the next CPU play if it's not the human player's turn
  }
};

// function to change currentPlayer
const changePlayer = () => {
  const currentPlayerIndex = players.indexOf(currentPlayer);
  const nextPlayerIndex = (currentPlayerIndex + 1) % players.length;
  currentPlayer = players[nextPlayerIndex];

  drawnCount = 0;
  turnLogText.push(`${currentPlayer.name}'s turn.`);
  const gameLog = document.getElementById("game-log");
  gameLog.innerHTML = turnLogText
    .map((turn, index) => `<p>${index + 1}. ${turn}</p>`)
    .join("");
};

const startCPUPlay = () => {
  if (currentPlayer.name !== playerName) {
    cpuPlay();
  }
};

// If the current player which is not human has a playable card, use the playCard function
const cpuPlay = () => {
  cpuPlayTimeout = 3000;
  if (currentPlayer.name !== playerName) {
    setTimeout(() => {
      if (maxDrawCount > 0) {
        // CPU needs to draw cards due to Draw2 or Draw4
        while (drawnCount < maxDrawCount) {
          drawCard();
        }
        // Reset for next player and change player
        maxDrawCount = 0;
        drawnCount = 0;
        changePlayer();
        return; // Stop further actions in this call
      } else {
        // Normal CPU play logic
        const playableCard = currentPlayer.hand.find((card) =>
          isLegalPlay(card)
        );

        if (playableCard) {
          playCard(playableCard);
          if (checkForWinner()) {
            endGame();
            return;
          }
        } else {
          drawCard();
        }
      }
    }, cpuPlayTimeout);
  }
  clearTimeout(cpuPlayTimeout);
};

const playAlert = (message) => {
  var x = document.getElementById("toast");
  x.className = "show";
  x.innerText = message;
  // After 3 seconds, remove the show class from DIV
  setTimeout(() => {
    x.className = x.className.replace("show", "");
  }, 3000);
};

// check to see if a player has won the game
const checkForWinner = () => {
  if (currentPlayer.hand.length === 0) {
    playAlert(`${currentPlayer.name} has won the game!`);
    return true;
  } else {
    return false;
  }
};

const endGame = () => {
  setTimeout(() => {
    window.location.href = "index.html";
  }, 5000); // Redirect after 3 seconds
};

//#region Event Listeners
// Event listener for the card deck
document.getElementById("card-pile").addEventListener("click", drawCard);
//#endregion
