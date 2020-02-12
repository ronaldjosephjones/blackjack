// The deck of all 52 cards
let deckArray = [
    { card: "2", suit: "hearts", points: 2},
    { card: "2", suit: "diamonds", points: 2 },
    { card: "2", suit: "spades", points: 2 },
    { card: "2", suit: "clubs", points: 2 },
    { card: "3", suit: "hearts", points: 3 },
    { card: "3", suit: "diamonds", points: 3 },
    { card: "3", suit: "spades", points: 3 },
    { card: "3", suit: "clubs", points: 3 },
    { card: "4", suit: "hearts", points: 4 },
    { card: "4", suit: "diamonds", points: 4 },
    { card: "4", suit: "spades", points: 4 },
    { card: "4", suit: "clubs", points: 4 },
    { card: "5", suit: "hearts", points: 5 },
    { card: "5", suit: "diamonds", points: 5 },
    { card: "5", suit: "spades", points: 5 },
    { card: "5", suit: "clubs", points: 5 },
    { card: "6", suit: "hearts", points: 6 },
    { card: "6", suit: "diamonds", points: 6 },
    { card: "6", suit: "spades", points: 6 },
    { card: "6", suit: "clubs", points: 6 },
    { card: "7", suit: "hearts", points: 7 },
    { card: "7", suit: "diamonds", points: 7 },
    { card: "7", suit: "spades", points: 7 },
    { card: "7", suit: "clubs", points: 7 },
    { card: "8", suit: "hearts", points: 8 },
    { card: "8", suit: "diamonds", points: 8 },
    { card: "8", suit: "spades", points: 8 },
    { card: "8", suit: "clubs", points: 8 },
    { card: "9", suit: "hearts", points: 9 },
    { card: "9", suit: "diamonds", points: 9 },
    { card: "9", suit: "spades", points: 9 },
    { card: "9", suit: "clubs", points: 9 },
    { card: "10", suit: "hearts", points: 10 },
    { card: "10", suit: "diamonds", points: 10 },
    { card: "10", suit: "spades", points: 10 },
    { card: "10", suit: "clubs", points: 10 },
    { card: "jack", suit: "hearts", points: 10 },
    { card: "jack", suit: "diamonds", points: 10 },
    { card: "jack", suit: "spades", points: 10 },
    { card: "jack", suit: "clubs", points: 10 },
    { card: "queen", suit: "hearts", points: 10 },
    { card: "queen", suit: "diamonds", points: 10 },
    { card: "queen", suit: "spades", points: 10 },
    { card: "queen", suit: "clubs", points: 10 },
    { card: "king", suit: "hearts", points: 10 },
    { card: "king", suit: "diamonds", points: 10 },
    { card: "king", suit: "spades", points: 10 },
    { card: "king", suit: "clubs", points: 10 },
    { card: "ace", suit: "hearts", points: 11 },
    { card: "ace", suit: "diamonds", points: 11 },
    { card: "ace", suit: "spades", points: 11 },
    { card: "ace", suit: "clubs", points: 11 },
];

// Button selectors
const dealBtn = document.getElementById("deal-btn");
const standBtn = document.getElementById("stand-btn");
const hitBtn = document.getElementById("hit-btn");

// Span selectors
const playerHandTotalSpan = document.getElementById("player-hand__total");
const dealerHandTotalSpan = document.getElementById("dealer-hand__total");
const messageOverlaySpan = document.getElementById("message-overlay__text");


// The cards in the player's hand
let playerHandArray = [];
// The sum / total of the player's cards
let playerHandTotal;

// The cards in the dealer's hand
let dealerHandArray = [];
// The sum / total of the dealer's cards
let dealerHandTotal;

dealBtn.addEventListener("click", function(e) {
    // Deal first card to player and dealer
    dealCard(deckArray, playerHandArray);
    dealCard(deckArray, dealerHandArray);
    // Deal second card to player and dealer
    dealCard(deckArray, playerHandArray);
    dealCard(deckArray, dealerHandArray);

    // Calculate the total of the player's two cards
    playerHandTotal = calcHandTotal(playerHandArray);
    // Set dealers total only to the amount of the first card
    // because the second card is hidden to the player until
    // they stand or bust
    dealerHandTotal = dealerHandArray[0].points;

    // Display the totals in <span> elements
    playerHandTotalSpan.innerText = playerHandTotal;
    dealerHandTotalSpan.innerText = dealerHandTotal;

    // Disable the deal button
    dealBtn.disabled = true;

    if (playerHandTotal === 21) {
        messageOverlaySpan.innerText = "21! You win!";
        setTimeout(function () {
            messageOverlaySpan.innerText = "";
        }, 2500);
    }

    console.log(dealerHandArray);
    console.log(calcHandTotal(dealerHandArray));

    e.preventDefault();
});

hitBtn.addEventListener("click", function(e) {
    // Deal one card to the player
    dealCard(deckArray, playerHandArray);

    // Calculate two totals: the player's hand and the dealer's
    playerHandTotal = calcHandTotal(playerHandArray);
    dealerHandTotal = calcHandTotal(dealerHandArray);

    // Display the totals in <span> elements
    playerHandTotalSpan.innerText = playerHandTotal;

    // Different cases
    if (playerHandTotal === 21) {
        messageOverlaySpan.innerText = "21! You win!";
        setTimeout(function () {
            messageOverlaySpan.innerText = "";
        }, 2500);
    }

    else if (playerHandTotal < 21) {
        messageOverlaySpan.innerText = "Wanna hit again?";
        setTimeout(function () {
            messageOverlaySpan.innerText = "";
        }, 2500);
    }

    else if (playerHandTotal > 21) {
        messageOverlaySpan.innerText = "You busted! You lose!";
        setTimeout(function () {
            messageOverlaySpan.innerText = "";
        }, 2500);
    }

    e.preventDefault();
});

standBtn.addEventListener("click", function(e) {
    standBtn.disabled = true;
    hitBtn.disabled = true;

    checkDealerOutcome();

    e.preventDefault();
})

// This function checks the dealer's total and determines whether the player
// wins, loses, or draws
function checkDealerOutcome() {
    // Calculate total of dealer's cards and display it
    dealerHandTotal = calcHandTotal(dealerHandArray);
    dealerHandTotalSpan.innerText = dealerHandTotal;
    console.log(dealerHandArray);
    console.log(dealerHandTotal);

    if (dealerHandTotal < 17 && dealerHandTotal < playerHandTotal) {
        dealCard(deckArray, dealerHandArray);
        checkDealerOutcome();
    }

    else if (dealerHandTotal === 21) {
        messageOverlaySpan.innerText = "Dealer has blackjack. You lose!";
        setTimeout(function () {
            messageOverlaySpan.innerText = "";
        }, 2500);
    }

    else if (dealerHandTotal > 16 && dealerHandTotal < playerHandTotal) {
        messageOverlaySpan.innerText = "You've got a higher hand. You win";
        setTimeout(function () {
            messageOverlaySpan.innerText = "";
        }, 2500);
    }

    else if (dealerHandTotal < 22  && dealerHandTotal > playerHandTotal) {
        messageOverlaySpan.innerText = "Dealer has a higher hand. You lose";
        setTimeout(function () {
            messageOverlaySpan.innerText = "";
        }, 2500);
    }

    else if (dealerHandTotal < 22 && dealerHandTotal === playerHandTotal) {
        messageOverlaySpan.innerText = "Push! You and the dealer tied!";
        setTimeout(function () {
            messageOverlaySpan.innerText = "";
        }, 2500);
    }

    else if (dealerHandTotal > 22) {
        messageOverlaySpan.innerText = "Dealer busted. You win!";
        setTimeout(function () {
            messageOverlaySpan.innerText = "";
        }, 2500);
    }
}

// Shuffle the deck of cards before anything else is done.
shuffleDeck(deckArray);

// Use Fisher-Yates algorithm to shuffle the deck array
function shuffleDeck(deck) {
    let newPos;
    let card;
    for (let i = deck.length -1; i > 0; i--) {
        newPos = Math.floor(Math.random() * (i + 1));
        card = deck[i];
        deck[i] = deck[newPos];
        deck[newPos] = card;
    }
    return deck;
}

// This function removes the first element / card from the deckArray
// and puts it at the end of the handArray
function dealCard(deckArray, handArray) {
    let card = deckArray.shift();
    handArray.push(card);
}

// Calculate the sum / total of the cards from the passed hand
function calcHandTotal(handArray) {
    return handArray.reduce((total, card) => total + card.points, 0);
}