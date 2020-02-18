// The deck of all 52 cards
let deckArray = [
    { cardName: '2', suit: 'hearts', points: 2},
    { cardName: '2', suit: 'diamonds', points: 2 },
    { cardName: '2', suit: 'spades', points: 2 },
    { cardName: '2', suit: 'clubs', points: 2 },
    { cardName: '3', suit: 'hearts', points: 3 },
    { cardName: '3', suit: 'diamonds', points: 3 },
    { cardName: '3', suit: 'spades', points: 3 },
    { cardName: '3', suit: 'clubs', points: 3 },
    { cardName: '4', suit: 'hearts', points: 4 },
    { cardName: '4', suit: 'diamonds', points: 4 },
    { cardName: '4', suit: 'spades', points: 4 },
    { cardName: '4', suit: 'clubs', points: 4 },
    { cardName: '5', suit: 'hearts', points: 5 },
    { cardName: '5', suit: 'diamonds', points: 5 },
    { cardName: '5', suit: 'spades', points: 5 },
    { cardName: '5', suit: 'clubs', points: 5 },
    { cardName: '6', suit: 'hearts', points: 6 },
    { cardName: '6', suit: 'diamonds', points: 6 },
    { cardName: '6', suit: 'spades', points: 6 },
    { cardName: '6', suit: 'clubs', points: 6 },
    { cardName: '7', suit: 'hearts', points: 7 },
    { cardName: '7', suit: 'diamonds', points: 7 },
    { cardName: '7', suit: 'spades', points: 7 },
    { cardName: '7', suit: 'clubs', points: 7 },
    { cardName: '8', suit: 'hearts', points: 8 },
    { cardName: '8', suit: 'diamonds', points: 8 },
    { cardName: '8', suit: 'spades', points: 8 },
    { cardName: '8', suit: 'clubs', points: 8 },
    { cardName: '9', suit: 'hearts', points: 9 },
    { cardName: '9', suit: 'diamonds', points: 9 },
    { cardName: '9', suit: 'spades', points: 9 },
    { cardName: '9', suit: 'clubs', points: 9 },
    { cardName: '10', suit: 'hearts', points: 10 },
    { cardName: '10', suit: 'diamonds', points: 10 },
    { cardName: '10', suit: 'spades', points: 10 },
    { cardName: '10', suit: 'clubs', points: 10 },
    { cardName: 'jack', suit: 'hearts', points: 10 },
    { cardName: 'jack', suit: 'diamonds', points: 10 },
    { cardName: 'jack', suit: 'spades', points: 10 },
    { cardName: 'jack', suit: 'clubs', points: 10 },
    { cardName: 'queen', suit: 'hearts', points: 10 },
    { cardName: 'queen', suit: 'diamonds', points: 10 },
    { cardName: 'queen', suit: 'spades', points: 10 },
    { cardName: 'queen', suit: 'clubs', points: 10 },
    { cardName: 'king', suit: 'hearts', points: 10 },
    { cardName: 'king', suit: 'diamonds', points: 10 },
    { cardName: 'king', suit: 'spades', points: 10 },
    { cardName: 'king', suit: 'clubs', points: 10 },
    { cardName: 'ace', suit: 'hearts', points: 11 },
    { cardName: 'ace', suit: 'diamonds', points: 11 },
    { cardName: 'ace', suit: 'spades', points: 11 },
    { cardName: 'ace', suit: 'clubs', points: 11 },
];

let discardedCardsArray = [];

// UI selectors
const dealBtn = document.getElementById('deal-btn');
const standBtn = document.getElementById('stand-btn');
const hitBtn = document.getElementById('hit-btn');
const splitYesBtn = document.getElementById('btn-split--yes');
const splitNoBtn = document.getElementById('btn-split--no');
const splitContainer = document.getElementById('split-container');
const playerHandsContainerDiv = document.getElementById('player__hands-container');
const dealerHandContainerDiv = document.getElementById('dealer__hand-container');
const dealerHandDiv = document.getElementById('dealer__hand');
const dealerCountSpan = document.getElementById('dealer__count');
let dealerSecondCardDiv;
const messageOverlayDiv = document.getElementById('message-overlay');
const messageOverlaySpan = document.getElementById('message-overlay__text');

// Player object

const player = {
    bank: 1000,
    handsArray: [],
    playHands: function() {

        // Determines if each hand beats dealer

        for(i = 0; i < this.handsArray.length; i++) {

            // If a hand only has one card because it was split, add new card,
            // check for splits, and exit the check hands loop 

            if(this.handsArray[i].length < 2) {
                dealCard(this.handsArray[i]);
                checkForSplit(this.handsArray[i]);
                break;
            }

            else {

                // Grab first two cards

                let card1 = this.handsArray[i].cardsArray[0];
                let card2 = this.handsArray[i].cardsArray[1];

                // Check for 21, player wins immediately

                if (this.handsArray[i].countTotal === 21) {
                    displayMessageOverlay('Blackjack! You win!');
                    discardCards(this.handsArray[i]);
                    this.handsArray[i].shift();
                }

                else {
                    standBtn.classList.remove('hidden');
                    hitBtn.classList.remove('hidden');
                }
            }

        }
    }
}

// Dealer object

const dealer = {
    cardsArray: [],
    countTotal: 0
    }

// Hand constructor

function Hand(cards) {
    this.cardsArray = cards;
    this.countTotal = calcCountTotal(this.cardsArray);

    // Put this hand into the beginning of the player hand array

    player.handsArray.unshift(this);

    // Create new div to hold the cards

    this.handDiv = document.createElement('div');
    this.handDiv.setAttribute('class', 'hand');
    playerHandsContainerDiv.appendChild(this.handDiv);

    let handCountSpan = document.createElement('span');
    handCountSpan.setAttribute('class', 'hand__count');
    handCountSpan.innerText = `${this.countTotal}`;
    this.handDiv.appendChild(handCountSpan);

}

let cardsForSplit = [];

// Load event listeners
loadEventListeners();

// Load all event listeners
function loadEventListeners() {
    // Deal initial cards event
    dealBtn.addEventListener('click', dealInitialCards);
    splitNoBtn.addEventListener('click', dontSplitCards);
    splitYesBtn.addEventListener('click', function() {
        splitCards(cardsForSplit);
    });
    // Hit event
    // hitBtn.addEventListener('click', hit);
    // Stand event
    // standBtn.addEventListener('click', stand);

};

// Inital deal

function dealInitialCards(e) {

    // Temporary array to hold player's first two cards

    let tempArr = [];

    // Deal first two cards to player and dealer

    dealCard(tempArr);
    dealCard(dealer.cardsArray);
    dealCard(tempArr);
    dealCard(dealer.cardsArray);

    // Create first hand for player

    new Hand(tempArr);

    console.log(player);
    console.log(dealer);

    // Display cards
    displayCards(dealer.cardsArray, dealerHandDiv);
    displayCards(player.handsArray[0].cardsArray, player.handsArray[0].handDiv);

    // Display count of dealer's first card

    dealerCountSpan.innerText = dealer.cardsArray[0].points;

    // Put dealer's second card face down

    dealerSecondCardDiv = document.querySelector('#dealer__hand div:nth-child(3)');
    dealerSecondCardDiv.classList.add('card--facedown');

    // Hide the deal button

    dealBtn.classList.add('hidden');

    // if (playerHandTotal === 21) {
    //     messageOverlaySpan.innerText = '21! You win!';
    //     setTimeout(function () {
    //         messageOverlaySpan.innerText = '';
    //     }, 2500);
    // }

    // Check for split

    let isSplittable = checkForSplit(player.handsArray[0]);

    if(isSplittable) {
        messageOverlayDiv.classList.remove('hidden');
        splitNoBtn.classList.remove('hidden');
        splitYesBtn.classList.remove('hidden');
    }

    else {
        player.playHands();
    }

    e.preventDefault();
};

// Hit
// function hit(e) {
//     // Deal one card to the player
//     dealCard(player.handsArray);

//     // Calculate two totals: the player's hand and the dealer's
//     playerHandTotal = calcHandTotal(player.handsArray);
//     dealerHandTotal = calcHandTotal(dealerHandArray);

//     // Display the totals in <span> elements
//     playerHandTotalSpan.innerText = playerHandTotal;

//     // Blackjack / player wins
//     if (playerHandTotal === 21) {
//         messageOverlaySpan.innerText = '21! You win!';
//         setTimeout(function () {
//             messageOverlaySpan.innerText = '';
//         }, 2500);
//         // Put all cards into discard pile
//         discardCards(player.handsArray);
//         discardCards(dealerHandArray);
        
//         // Reset player and dealer hand totals
//         playerHandTotal = 0;
//         dealerHandTotal = 0;

//         // Display empty hand totals
//         playerHandTotalSpan.innerText = '';
//         dealerHandTotalSpan.innerText = '';

//         // Disable stand and hit buttons
//         standBtn.disabled = true;
//         hitBtn.disabled = true;

//     }

//     // // Option to hit again
//     // else if (playerHandTotal < 21) {
//     //     messageOverlaySpan.innerText = 'Wanna hit again?';
//     //     setTimeout(function () {
//     //         messageOverlaySpan.innerText = '';
//     //     }, 2500);
//     // }

//     // Player busts and loses
//     else if (playerHandTotal > 21) {
//         messageOverlaySpan.innerText = 'You busted! You lose!';
//         setTimeout(function () {
//             messageOverlaySpan.innerText = '';
//         }, 2500);

//         // Put all cards into discard pile
//         discardCards(player.handsArray);
//         discardCards(dealerHandArray);

//         // Reset player and dealer hand totals
//         playerHandTotal = 0;
//         dealerHandTotal = 0;

//         // Display empty hand totals
//         playerHandTotalSpan.innerText = '';
//         dealerHandTotalSpan.innerText = '';

//         // Disable stand and hit buttons
//         standBtn.disabled = true;
//         hitBtn.disabled = true;
//     }

//     // Enable dealing again
//     dealBtn.disabled = false;

//     e.preventDefault();
// };

// Stand
// function stand(e) {
//     standBtn.disabled = true;
//     hitBtn.disabled = true;

//     // Check outcomes to decide if player or dealer wins
//     checkDealerOutcome();

//     e.preventDefault();
// };

// // Checks the dealer's total and determines whether the player wins, loses, or draws
// function checkDealerOutcome() {
//     // Calculate total of dealer's cards and display it
//     dealerHandTotal = calcHandTotal(dealerHandArray);
//     dealerHandTotalSpan.innerText = dealerHandTotal;

//     // Dealer hits again
//     if (dealerHandTotal < 17 && dealerHandTotal < playerHandTotal) {
//         dealCard(dealerHandArray);
//         checkDealerOutcome();
//     }

//     // Dealer has blackjack
//     else if (dealerHandTotal === 21) {
//         messageOverlaySpan.innerText = 'Dealer has blackjack. You lose!';
//         setTimeout(function () {
//             messageOverlaySpan.innerText = '';
//         }, 2500);

//     }

//     // Dealer has lower hand, player wins
//     else if (dealerHandTotal > 16 && dealerHandTotal < playerHandTotal) {
//         messageOverlaySpan.innerText = 'You've got a higher hand. You win';
//         setTimeout(function () {
//             messageOverlaySpan.innerText = '';
//         }, 2500);
//     }

//     // Dealer has higher hand, player loses
//     else if (dealerHandTotal < 22  && dealerHandTotal > playerHandTotal) {
//         messageOverlaySpan.innerText = 'Dealer has a higher hand. You lose';
//         setTimeout(function () {
//             messageOverlaySpan.innerText = '';
//         }, 2500);
//     }

//     // Dealer and player tie
//     else if (dealerHandTotal < 22 && dealerHandTotal === playerHandTotal) {
//         messageOverlaySpan.innerText = 'Push! You and the dealer tied!';
//         setTimeout(function () {
//             messageOverlaySpan.innerText = '';
//         }, 2500);
//     }

//     // Dealer busts, player wins
//     else if (dealerHandTotal > 22) {
//         messageOverlaySpan.innerText = 'Dealer busted. You win!';
//         setTimeout(function () {
//             messageOverlaySpan.innerText = '';
//         }, 2500);
//     }

//     // Put all cards into discard pile
//     discardCards(player.handsArray);
//     discardCards(dealerHandArray);

//     // Reset player and dealer hand totals
//     playerHandTotal = 0;
//     dealerHandTotal = 0;

//     // Display empty hand totals
//     playerHandTotalSpan.innerText = '';
//     dealerHandTotalSpan.innerText = '';

//     // Enable buttons again
//     dealBtn.disabled = false;

// }

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

// Removes first card from deck and puts it in array of passed hand
function dealCard(cardsArray) {
    let card = deckArray.shift();
    cardsArray.push(card);
}

// Create and display the cards of a hand inside a container div

function displayCards(cardsArray, cardContainer) {
    for (let i = 0; i < cardsArray.length; i++) {
        cardContainer.insertAdjacentHTML('beforeend', `
            <div class="card">
                <div class="card__face card__face--front">
                    <p>${cardsArray[i].cardName}</p>
                    <p>${cardsArray[i].suit}</p>
                    <p>${cardsArray[i].points}</p>
                </div>
                <div class="card__face card__face--back"></div>
            </div>
        `)
    }
}


// Puts cards from a hand into the discard pile
function discardCards(handArray) {

    // Store the length of the hand array before removing any cards
    let initialHandArrayLength = handArray.length;

    // Loop through the cards in a hand and put them in the discard pile
    for(let i = 0; i < initialHandArrayLength; i++) {
        let card = handArray.shift();
        discardedCardsArray.push(card);
    }
}

// Calculate the sum / total of the cards from the passed hand
// function calcHandTotal(handArray) {
//     let isAceInHand;

//     for(i = 0; i < handArray.length - 1; i++) {
//         if (handArray[i].card === 'ace') {
//             isAceInHand = true;         
//         }
//     }

//     if (isAceInHand) {
//         console.log('there IS an ace');
//         let firstTotal = handArray.reduce((total, card) => total + card.points, 0) + 1;
//         let secondTotal = handArray.reduce((total, card) => total + card.points, 0) + 11;
//         return `${firstTotal} / ${secondTotal}`;
//     }

//     else {
//         console.log('there IS NOT an ace');
//     }

//     if (isAceInHand === true) {
//         let firstTotal = handArray.reduce((total, card) => total + card.points, 0) + 1;
//         let secondTotal = handArray.reduce((total, card) => total + card.points, 0) + 11;
//         return `${firstTotal} / ${secondTotal}`;
//     }

//     // else {
//     //     return handArray.reduce((total, card) => total + card.points, 0);
//     // }
    
//     return handArray.reduce((total, card) => total + card.points, 0);
// }

// Calculate total count of passed array of cards

function calcHandCount(cardsArray) {
    return cardsArray.reduce((total, card) => total + card.points, 0);
}

// Check for split

function checkForSplit(hand) {
    cardsForSplit = hand;
    let card1 = hand.cardsArray[0];
    let card2 = hand.cardsArray[1];

    if (card1.points === card2.points) {
        return true;
    }

    else {
        return false;
    }
}

function splitCards(originalHand) {

    // Take card from original hand, put it into new hand

    let newHandCards = [];
    let card = originalHand.cardsArray.shift();
    newHandCards.push(card);
    let newHand = new Hand(newHandCards);

    // Move split card to new hand's div

    newHand.handDiv.appendChild(originalHand.handDiv.children[1]);

    // Deal new card to original hand and display it

    dealCard(originalHand.cardsArray);
    let tempArr = [originalHand.cardsArray[1]];
    displayCards(tempArr, originalHand.handDiv);
    originalHand.handDiv.children[0].innerText = calcCountTotal(originalHand.cardsArray);

    let isSplittable = checkForSplit(originalHand);

    if (isSplittable) {
        messageOverlayDiv.classList.remove('hidden');
        splitNoBtn.classList.remove('hidden');
        splitYesBtn.classList.remove('hidden');
    }

    else {

        // Hide split buttons

        messageOverlayDiv.classList.add('hidden');
        splitNoBtn.classList.add('hidden');
        splitYesBtn.classList.add('hidden');

        player.playHands();
    }
}

function dontSplitCards() {
    cardsForSplit = [];

    // Hide the overlay and buttons

    messageOverlayDiv.classList.add('hidden');
    splitNoBtn.classList.add('hidden');
    splitYesBtn.classList.add('hidden');

    // Play the rest of the hands against the dealer

    player.playHands();
}

function closeMessageOverlay() {
    messageOverlayDiv.classList.add('hidden');
}

function displayMessageOverlay(message) {
    messageOverlaySpan.innerText = message;
    messageOverlayDiv.classList.remove('hidden');
    setTimeout(function () {
        messageOverlaySpan.innerText = '';
        messageOverlayDiv.classList.add('hidden');
    }, 2500);
}

function calcCountTotal(cardsArray) {
    return cardsArray.reduce((total, card) => total + card.points, 0);
}