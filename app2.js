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
    { card: "ace", suit: "hearts", points: 0 },
    { card: "ace", suit: "diamonds", points: 0 },
    { card: "ace", suit: "spades", points: 0 },
    { card: "ace", suit: "clubs", points: 0 },
];

let discardedPileArray = [];

// UI selectors
const dealBtn = document.getElementById("deal-btn");
const standBtn = document.getElementById("stand-btn");
const hitBtn = document.getElementById("hit-btn");
const playerHandTotalSpan = document.getElementById("player-hand__total");
const dealerHandTotalSpan = document.getElementById("dealer-hand__total");
const messageOverlaySpan = document.getElementById("message-overlay__text");


// The cards in the player's hand
let playerHandArray = [];
// The sum / total of the player's cards
let playerHandTotal;
// Player's bank of money
let playerBank;

// Player object
const player = {
    bank: 1000,
    handsArray: []
}

// Hand constructor
function Hand(cards) {

    this.cardsArray = cards;

    // Check for split (two cards with same value)
    if (cards[0].points === cards[1].points) {
        console.log("cards have same value. split?");
    }

    else {
        
    }


    // Check for any aces in the hand
    // for (i = 0; i < cards.length - 1; i++) {
    //     if (handArray[i].card === "ace") {
    //         isAceInHand = true;
    //     }
    // }

    // this.pointTotal1 = 0;
    // this.pointTotal2 = 0;
}

// The cards in the dealer's hand
let dealerHandArray = [];
// The sum / total of the dealer's cards
let dealerHandTotal;

// Load event listeners
loadEventListeners();

// Load all event listeners
function loadEventListeners() {
    // Deal initial cards event
    dealBtn.addEventListener('click', dealInitialCards);
    // Hit event
    hitBtn.addEventListener('click', hit);
    // Stand event
    standBtn.addEventListener('click', stand);

};

// Inital deal
function dealInitialCards(e) {
    // Deal first card to player and dealer
    dealCard(playerHandArray);
    dealCard(dealerHandArray);
    // Deal second card to player and dealer
    dealCard(playerHandArray);
    dealCard(dealerHandArray);

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
    // Enable hit and call buttons
    standBtn.disabled = false;
    hitBtn.disabled = false

    if (playerHandTotal === 21) {
        messageOverlaySpan.innerText = "21! You win!";
        setTimeout(function () {
            messageOverlaySpan.innerText = "";
        }, 2500);
    }

    console.log(playerHandArray);

    e.preventDefault();
};

// Hit
function hit(e) {
    // Deal one card to the player
    dealCard(playerHandArray);

    // Calculate two totals: the player's hand and the dealer's
    playerHandTotal = calcHandTotal(playerHandArray);
    dealerHandTotal = calcHandTotal(dealerHandArray);

    // Display the totals in <span> elements
    playerHandTotalSpan.innerText = playerHandTotal;

    // Blackjack / player wins
    if (playerHandTotal === 21) {
        messageOverlaySpan.innerText = "21! You win!";
        setTimeout(function () {
            messageOverlaySpan.innerText = "";
        }, 2500);
        // Put all cards into discard pile
        discardCards(playerHandArray);
        discardCards(dealerHandArray);
        
        // Reset player and dealer hand totals
        playerHandTotal = 0;
        dealerHandTotal = 0;

        // Display empty hand totals
        playerHandTotalSpan.innerText = "";
        dealerHandTotalSpan.innerText = "";

        // Disable stand and hit buttons
        standBtn.disabled = true;
        hitBtn.disabled = true;

    }

    // Option to hit again
    else if (playerHandTotal < 21) {
        messageOverlaySpan.innerText = "Wanna hit again?";
        setTimeout(function () {
            messageOverlaySpan.innerText = "";
        }, 2500);
    }

    // Player busts and loses
    else if (playerHandTotal > 21) {
        messageOverlaySpan.innerText = "You busted! You lose!";
        setTimeout(function () {
            messageOverlaySpan.innerText = "";
        }, 2500);

        // Put all cards into discard pile
        discardCards(playerHandArray);
        discardCards(dealerHandArray);

        // Reset player and dealer hand totals
        playerHandTotal = 0;
        dealerHandTotal = 0;

        // Display empty hand totals
        playerHandTotalSpan.innerText = "";
        dealerHandTotalSpan.innerText = "";

        // Disable stand and hit buttons
        standBtn.disabled = true;
        hitBtn.disabled = true;
    }

    // Enable dealing again
    dealBtn.disabled = false;

    e.preventDefault();
};

// Stand
function stand(e) {
    standBtn.disabled = true;
    hitBtn.disabled = true;

    // Check outcomes to decide if player or dealer wins
    checkDealerOutcome();

    e.preventDefault();
};

// Checks the dealer's total and determines whether the player wins, loses, or draws
function checkDealerOutcome() {
    // Calculate total of dealer's cards and display it
    dealerHandTotal = calcHandTotal(dealerHandArray);
    dealerHandTotalSpan.innerText = dealerHandTotal;

    // Dealer hits again
    if (dealerHandTotal < 17 && dealerHandTotal < playerHandTotal) {
        dealCard(dealerHandArray);
        checkDealerOutcome();
    }

    // Dealer has blackjack
    else if (dealerHandTotal === 21) {
        messageOverlaySpan.innerText = "Dealer has blackjack. You lose!";
        setTimeout(function () {
            messageOverlaySpan.innerText = "";
        }, 2500);

    }

    // Dealer has lower hand, player wins
    else if (dealerHandTotal > 16 && dealerHandTotal < playerHandTotal) {
        messageOverlaySpan.innerText = "You've got a higher hand. You win";
        setTimeout(function () {
            messageOverlaySpan.innerText = "";
        }, 2500);
    }

    // Dealer has higher hand, player loses
    else if (dealerHandTotal < 22  && dealerHandTotal > playerHandTotal) {
        messageOverlaySpan.innerText = "Dealer has a higher hand. You lose";
        setTimeout(function () {
            messageOverlaySpan.innerText = "";
        }, 2500);
    }

    // Dealer and player tie
    else if (dealerHandTotal < 22 && dealerHandTotal === playerHandTotal) {
        messageOverlaySpan.innerText = "Push! You and the dealer tied!";
        setTimeout(function () {
            messageOverlaySpan.innerText = "";
        }, 2500);
    }

    // Dealer busts, player wins
    else if (dealerHandTotal > 22) {
        messageOverlaySpan.innerText = "Dealer busted. You win!";
        setTimeout(function () {
            messageOverlaySpan.innerText = "";
        }, 2500);
    }

    // Put all cards into discard pile
    discardCards(playerHandArray);
    discardCards(dealerHandArray);

    // Reset player and dealer hand totals
    playerHandTotal = 0;
    dealerHandTotal = 0;

    // Display empty hand totals
    playerHandTotalSpan.innerText = "";
    dealerHandTotalSpan.innerText = "";

    // Enable buttons again
    dealBtn.disabled = false;

}

// Shuffle the deck of cards
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

// Removes the first element / card from the deckArray and puts it at the end of the handArray
function dealCard(handArray) {
    let card = deckArray.shift();
    handArray.push(card);
}

// Puts cards from a hand into the discard pile
function discardCards(handArray) {

    // Store the length of the hand array before removing any cards
    let initialHandArrayLength = handArray.length;

    // Loop through the cards in a hand and put them in the discard pile
    for(let i = 0; i < initialHandArrayLength; i++) {
        let card = handArray.shift();
        discardedPileArray.push(card);
    }
}

// Calculate the sum / total of the cards from the passed hand
function calcHandTotal(handArray) {
    let isAceInHand;

    for(i = 0; i < handArray.length - 1; i++) {
        if (handArray[i].card === "ace") {
            isAceInHand = true;         
        }
    }

    if (isAceInHand) {
        console.log("there IS an ace");
        let firstTotal = handArray.reduce((total, card) => total + card.points, 0) + 1;
        let secondTotal = handArray.reduce((total, card) => total + card.points, 0) + 11;
        return `${firstTotal} / ${secondTotal}`;
    }

    else {
        console.log("there IS NOT an ace");
    }

    if (isAceInHand === true) {
        let firstTotal = handArray.reduce((total, card) => total + card.points, 0) + 1;
        let secondTotal = handArray.reduce((total, card) => total + card.points, 0) + 11;
        return `${firstTotal} / ${secondTotal}`;
    }

    // else {
    //     return handArray.reduce((total, card) => total + card.points, 0);
    // }
    
    return handArray.reduce((total, card) => total + card.points, 0);
}
