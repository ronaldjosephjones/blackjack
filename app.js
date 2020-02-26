// The deck of all 52 cards
let deckArray = [
    { name: '2', suit: 'hearts', points: 2},
    { name: '2', suit: 'diamonds', points: 2 },
    { name: '2', suit: 'spades', points: 2 },
    { name: '2', suit: 'clubs', points: 2 },
    { name: '3', suit: 'hearts', points: 3 },
    { name: '3', suit: 'diamonds', points: 3 },
    { name: '3', suit: 'spades', points: 3 },
    { name: '3', suit: 'clubs', points: 3 },
    { name: '4', suit: 'hearts', points: 4 },
    { name: '4', suit: 'diamonds', points: 4 },
    { name: '4', suit: 'spades', points: 4 },
    { name: '4', suit: 'clubs', points: 4 },
    { name: '5', suit: 'hearts', points: 5 },
    { name: '5', suit: 'diamonds', points: 5 },
    { name: '5', suit: 'spades', points: 5 },
    { name: '5', suit: 'clubs', points: 5 },
    { name: '6', suit: 'hearts', points: 6 },
    { name: '6', suit: 'diamonds', points: 6 },
    { name: '6', suit: 'spades', points: 6 },
    { name: '6', suit: 'clubs', points: 6 },
    { name: '7', suit: 'hearts', points: 7 },
    { name: '7', suit: 'diamonds', points: 7 },
    { name: '7', suit: 'spades', points: 7 },
    { name: '7', suit: 'clubs', points: 7 },
    { name: '8', suit: 'hearts', points: 8 },
    { name: '8', suit: 'diamonds', points: 8 },
    { name: '8', suit: 'spades', points: 8 },
    { name: '8', suit: 'clubs', points: 8 },
    { name: '9', suit: 'hearts', points: 9 },
    { name: '9', suit: 'diamonds', points: 9 },
    { name: '9', suit: 'spades', points: 9 },
    { name: '9', suit: 'clubs', points: 9 },
    { name: '10', suit: 'hearts', points: 10 },
    { name: '10', suit: 'diamonds', points: 10 },
    { name: '10', suit: 'spades', points: 10 },
    { name: '10', suit: 'clubs', points: 10 },
    { name: 'jack', suit: 'hearts', points: 10 },
    { name: 'jack', suit: 'diamonds', points: 10 },
    { name: 'jack', suit: 'spades', points: 10 },
    { name: 'jack', suit: 'clubs', points: 10 },
    { name: 'queen', suit: 'hearts', points: 10 },
    { name: 'queen', suit: 'diamonds', points: 10 },
    { name: 'queen', suit: 'spades', points: 10 },
    { name: 'queen', suit: 'clubs', points: 10 },
    { name: 'king', suit: 'hearts', points: 10 },
    { name: 'king', suit: 'diamonds', points: 10 },
    { name: 'king', suit: 'spades', points: 10 },
    { name: 'king', suit: 'clubs', points: 10 },
    { name: 'ace', suit: 'hearts', points: 11 },
    { name: 'ace', suit: 'diamonds', points: 11 },
    { name: 'ace', suit: 'spades', points: 11 },
    { name: 'ace', suit: 'clubs', points: 11 },
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
let dealerSecondCardDiv;
const messageOverlayDiv = document.getElementById('message-overlay');
const messageOverlaySpan = document.getElementById('message-overlay__text');

// Player object

const player = {
    bank: 1000,
    handsArray: []
}

// Dealer object

const dealer = {
    cardsArray: [],
    count1: 0,
    count2: 0,
    div: document.getElementById('dealer__hand'),
    countSpan: document.getElementById('dealer__count')
    }

// Hand constructor

function Hand() {
    this.cardsArray = [],
    this.count1 = 0,
    this.count2 = 0

    // Put this hand into the beginning of the player hand array

    player.handsArray.unshift(this);

    // Create new div to hold the cards

    this.div = document.createElement('div');
    this.div.setAttribute('class', 'hand');
    playerHandsContainerDiv.appendChild(this.div);

    this.countSpan = document.createElement('span');
    this.countSpan.setAttribute('class', 'hand__count');
    this.div.appendChild(this.countSpan);

}

let handBeingSplit;

// Load all event listeners

loadEventListeners();
function loadEventListeners() {

    // Deal initial cards event

    dealBtn.addEventListener('click', dealInitialCards);
    splitNoBtn.addEventListener('click', dontsplitHand);
    splitYesBtn.addEventListener('click', function() {
        splitHand(handBeingSplit);
    });

    // Hit event

    hitBtn.addEventListener('click', hit);

    // Stand event

    // standBtn.addEventListener('click', stand);

};

// Initial deal

function dealInitialCards(e) {

    // Create player's first hand

    new Hand();
    forceCard(player.handsArray[0], 'ace', 'spades', 0);
    forceCard(player.handsArray[0], 'ace', 'hearts', 0);

    // Deal first two cards to player and dealer

    forceCard(dealer, 'five', 'spades', 5);
    forceCard(dealer, 'three', 'spades', 3);

    // Display cards
    // displayCards(dealer.cardsArray, dealer);
    // displayCards(player.handsArray[0].cardsArray, player.handsArray[0]);

    // Display count of dealer's first card

    dealer.countSpan.innerText = dealer.cardsArray[0].points;

    // Put dealer's second card face down

    dealerSecondCardDiv = document.querySelector('#dealer__hand div:nth-child(3)');
    dealerSecondCardDiv.classList.add('card--facedown');

    // Hide the deal button

    dealBtn.classList.add('hidden');

    // Check for 21 / blackjack immediately

    if (player.handsArray[0].count1 === 21 ) {
        dealerSecondCardDiv.classList.remove('card--facedown');
        dealer.count1 = calccount1(dealer.cardsArray);
        dealer.countSpan.innerText = dealer.count1;

        if (dealer.count1 === 21) {
            displayMessageOverlay('Push!');
        }

        else {
            displayMessageOverlay('Blackjack! You Win!')
        }

        discardCards(player.handsArray[0]);
        discardCards(dealer);
        discardHand(player.handsArray[0]);
        player.handsArray.shift();
        dealBtn.classList.remove('hidden');
    }

    else {

        // Check for split

        let isSplittable = checkForSplit(player.handsArray[0]);

        if (isSplittable) {
            messageOverlayDiv.classList.remove('hidden');
            splitNoBtn.classList.remove('hidden');
            splitYesBtn.classList.remove('hidden');
        }

        else {
            standBtn.classList.remove('hidden');
            hitBtn.classList.remove('hidden');
        }
    }

    e.preventDefault();
};

// Hit
function hit(e) {

    // Grab the player's most recently created hand

    let hand = player.handsArray[0];

    // Deal one card to this hand

    dealCard(hand);

    e.preventDefault();
};

// Stand
// function stand(e) {
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

// Create and display the cards of a hand inside a container div

// function displayCards(cards, hand) {
//     for (let i = 0; i < cards.length; i++) {
//         hand.div.insertAdjacentHTML('beforeend', `
//             <div class="card">
//                 <div class="card__face card__face--front">
//                     <p>${hand.cardsArray[i].name}</p>
//                     <p>${hand.cardsArray[i].suit}</p>
//                     <p>${hand.cardsArray[i].points}</p>
//                 </div>
//                 <div class="card__face card__face--back"></div>
//             </div>
//         `)
//     }
// }


// Puts cards from a hand into the discard pile and animates off the page

function discardCards(hand) {

    // Store the length of the hand array before removing any cards

    let initialHandArrayLength = hand.cardsArray.length;

    // Loop through the cards in a hand and put them in the discard pile array

    for(let i = 0; i < initialHandArrayLength; i++) {
        let card = hand.cardsArray.shift();
        discardedCardsArray.push(card);
    }

    // Remove the count display / span from DOM

    hand.div.firstElementChild.remove();

    // Grab the card elements and amount of cards

    let cardElements = hand.div.children;
    let i = cardElements.length;

    // Add 'discard' class to each card so they transition off page
    // For loop isn't used because of setTimeout

    function discardTransition () {
        setTimeout( function () {
            if (i > 0) {
                cardElements[i - 1].classList.add('discard');
                discardTransition();
                i = i - 1;
            }
        }, 50)
    }

    discardTransition();
}

// Remove a hand div from the DOM

function discardHand(hand) {
    setTimeout(function() {
        hand.div.remove();
    }, 3000)
}

// Check for split

function checkForSplit(hand) {
    handBeingSplit = hand;
    let card1 = hand.cardsArray[0];
    let card2 = hand.cardsArray[1];

    if (card1.points === card2.points) {
        return true;
    }

    else {
        return false;
    }
}

function splitHand(originalHand) {

    // Take card from original hand, put it into new hand array
    let newHand = new Hand();
    let card = originalHand.cardsArray.shift();
    newHand.cardsArray.push(card);

    // Move split card div to new hand's div in the DOM
    newHand.div.appendChild(originalHand.div.children[1]);
    updateCountSpan(newHand);

    // Update original hand's count1

    // NOTE: Only count1 must be updated because this only runs if you're
    // splitting aces. If you've been dealt two aces updateCountSpan()
    // will not set count2 to 22 because that's a bust, and keeps it at 11,
    // removing a need to update it here. 
    if (originalHand.cardsArray[0].name === 'ace') {
        originalHand.count1 = 1;
    }

    else {
        originalHand.count1 = originalHand.count1 - originalHand.cardsArray[0].points;
        originalHand.count2 = originalHand.count2 - originalHand.cardsArray[0].points;
    }

    // Deal new card to original hand
    dealCard(originalHand);

    let isSplittable = checkForSplit(originalHand);

    if (isSplittable) {
        messageOverlayDiv.classList.remove('hidden');
        splitNoBtn.classList.remove('hidden');
        splitYesBtn.classList.remove('hidden');
    }

    else {
        // Hide split buttons, show hit / stand buttons
        messageOverlayDiv.classList.add('hidden');
        splitNoBtn.classList.add('hidden');
        splitYesBtn.classList.add('hidden');
        standBtn.classList.remove('hidden');
        hitBtn.classList.remove('hidden');
    }

}

function dontsplitHand() {
    handBeingSplit = {};

    // Hide the overlay and buttons

    messageOverlayDiv.classList.add('hidden');
    splitNoBtn.classList.add('hidden');
    splitYesBtn.classList.add('hidden');
    standBtn.classList.remove('hidden');
    hitBtn.classList.remove('hidden');
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

// Calculates sum of an array of cards point values

function calccount1(cardsArray) {
    return cardsArray.reduce((total, card) => total + card.points, 0);
}

// Force hands for testing purposes

function dealBlackjack(cardsArray) {
    let card1 = { name: 'ace', suit: 'clubs', points: 11 };
    let card2 = { name: 'jack', suit: 'clubs', points: 10 };
    cardsArray.push(card1);
    cardsArray.push(card2);
}

function dealSplit(hand) {
    let card1 = { name: 'ten', suit: 'clubs', points: 10 };
    let card2 = { name: 'queen', suit: 'hearts', points: 10 };
    hand.cardsArray.push(card1);
    hand.cardsArray.push(card2);

    let count = hand.cardsArray.reduce((total, card) => total + card.points, 0);
    hand.countSpan.innerText = count;

    hand.div.insertAdjacentHTML('beforeend', `
            <div class="card">
                <div class="card__face card__face--front">
                    <p>${card1.name}</p>
                    <p>${card1.suit}</p>
                    <p>${card1.points}</p>
                </div>
                <div class="card__face card__face--back"></div>
            </div>
        `);
    hand.div.insertAdjacentHTML('beforeend', `
            <div class="card">
                <div class="card__face card__face--front">
                    <p>${card2.name}</p>
                    <p>${card2.suit}</p>
                    <p>${card2.points}</p>
                </div>
                <div class="card__face card__face--back"></div>
            </div>
        `);
}

// Removes first card from deck and puts it in array of passed hand
function dealCard(hand) {
    let card = deckArray.shift();
    hand.cardsArray.push(card);

    hand.div.insertAdjacentHTML('beforeend', `
            <div class="card">
                <div class="card__face card__face--front">
                    <p>${hand.cardsArray[hand.cardsArray.length - 1].name}</p>
                    <p>${hand.cardsArray[hand.cardsArray.length - 1].suit}</p>
                    <p>${hand.cardsArray[hand.cardsArray.length - 1].points}</p>
                </div>
                <div class="card__face card__face--back"></div>
            </div>
        `);

    updateCountSpan(hand);
}

// force a card

function forceCard(hand, cardName, cardSuit, cardPoints) {
    let card = { name: cardName, suit: cardSuit, points: cardPoints };
    hand.cardsArray.push(card);

    hand.div.insertAdjacentHTML('beforeend', `
            <div class="card">
                <div class="card__face card__face--front">
                    <p>${hand.cardsArray[hand.cardsArray.length - 1].name}</p>
                    <p>${hand.cardsArray[hand.cardsArray.length - 1].suit}</p>
                    <p>${hand.cardsArray[hand.cardsArray.length - 1].points}</p>
                </div>
                <div class="card__face card__face--back"></div>
            </div>
        `);

    updateCountSpan(hand);

}

// Update count span
function updateCountSpan(hand) {

    let card = hand.cardsArray[hand.cardsArray.length - 1];

    // Check if card dealt is an ace
    if (card.name === 'ace') {
        
        // If ace will make hand a blackjack
        if (hand.count1 === 10) {
            hand.count1 = hand.count1 + 11;
            hand.countSpan.innerText = hand.count1;
        }

        // If ace can be used as 1 or 11
        else if (hand.count1 < 10) {
            hand.count1 = hand.count1 + 1;

            // If the the first card is not an ace
            if(hand.count2 + 11 < 21) {
                hand.count2 = hand.count2 + 11;
                hand.countSpan.innerText = `${hand.count1} / ${hand.count2}`;
            }

            // If the first card is also an ace
            else {
                hand.countSpan.innerText = `${hand.count1}`;
            }
        }

        // If ace has to be used as 1
        else if (hand.count1 > 10) {
            hand.count1 = hand.count1 + 1;
            hand.countSpan.innerText = hand.count1;
        }
    }

    // If card dealt is not an ace
    else {

        // Update the counts
        hand.count1 = hand.count1 + card.points;
        hand.count2 = hand.count2 + card.points;

        // Check if any aces are already in the hand
        let handContainsAce;
        for (i = 0; i < hand.cardsArray.length; i++) {
            if (hand.cardsArray[i].name === 'ace') {
                handContainsAce = true;
            }
        }

        // If there is an ace already in the hand
        if (handContainsAce) {

            if (hand.count2 === 21) {
                hand.countSpan.innerText = hand.count2;
            }

            else if (hand.count2 < 21) {
                hand.countSpan.innerText = `${hand.count1} / ${hand.count2}`;
            }

            else if (hand.count2 > 21) {
                hand.countSpan.innerText = hand.count1;
            }

            else if (hand.count1 === 21) {
                hand.countSpan.innerText = hand.count1;
            }

            else if (hand.count1 > 21) {
                hand.countSpan.innerText = hand.count1;
            }

        }

        // If no ace is already in the hand
        else {
            hand.countSpan.innerText = hand.count1;
        }
    }
}