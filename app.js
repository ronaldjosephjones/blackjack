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
    { name: 'ace', suit: 'hearts', points: 0 },
    { name: 'ace', suit: 'diamonds', points: 0 },
    { name: 'ace', suit: 'spades', points: 0 },
    { name: 'ace', suit: 'clubs', points: 0 },
];

let discardedCardsArray = [];

// UI selectors
const dealBtn = document.getElementById('deal-btn');
const standBtn = document.getElementById('stand-btn');
const hitBtn = document.getElementById('hit-btn');
const splitYesBtn = document.getElementById('btn-split--yes');
const splitNoBtn = document.getElementById('btn-split--no');
const splitContainer = document.getElementById('split-container');
const bankSpan = document.getElementById('bank__span');
const chip1 = document.getElementById('chip1');
const chip5 = document.getElementById('chip5');
const chip10 = document.getElementById('chip10');
const chip25 = document.getElementById('chip25');
const chip100 = document.getElementById('chip100');
const messageOverlayDiv = document.getElementById('message-overlay');
const messageOverlaySpan = document.getElementById('message-overlay__text');

// Player object
const player = {
    bank: 1000,
    bet: 0,
    handsArray: [],
    currentHand: -1,
    containerDiv: document.getElementById('player__hands-container')
}
// Dealer object
const dealer = {
    handsArray: [],
    containerDiv: document.getElementById('dealer__hand-container'),
    // handDiv: null,
    // countSpan: null,
    secondCardDiv: null
    // div: document.getElementById('dealer__hand'),
    // countSpan: document.getElementById('dealer__count')
    }

function Hand(playerOrDealer) {
    this.cardsArray = [],
    this.count1 = 0,
    this.count2 = 0

    // Put this hand at the end of the player hand array
    playerOrDealer.handsArray.push(this);

    // Create a container div to hold the cards
    this.container = document.createElement('div');
    this.container.setAttribute('class', 'hand');
    playerOrDealer.containerDiv.appendChild(this.container);

    // Create a span to display the count
    this.countSpan = document.createElement('span');
    this.countSpan.setAttribute('class', 'hand__count');
    this.container.appendChild(this.countSpan);

    this.cardsDiv = document.createElement('div');
    this.cardsDiv.setAttribute('class', 'cards__container');
    this.container.appendChild(this.cardsDiv);

    if (playerOrDealer === player) {
        // Create a span to display the hand's bet amount
        this.betSpan = document.createElement('span');
        this.betSpan.setAttribute('class', 'hand__bet');
        this.container.appendChild(this.betSpan);
        this.betSpan.innerText = `$${player.bet}`;
    }
}

// Load all event listeners
loadEventListeners();
function loadEventListeners() {

    dealBtn.addEventListener('click', dealInitialCards);
    splitNoBtn.addEventListener('click', dontsplitHand);
    splitYesBtn.addEventListener('click', function() {
        splitHand(player.handsArray[player.currentHand]);
    });
    hitBtn.addEventListener('click', function() {
        hit(player.handsArray[player.currentHand]);
    });
    standBtn.addEventListener('click', stand);
    chip1.addEventListener('click', betChip1);
    chip5.addEventListener('click', betChip5);
    chip10.addEventListener('click', betChip10);
    chip25.addEventListener('click', betChip25);
    chip100.addEventListener('click', betChip100);

};

// Bets chip amount
function betChip1() {
    if(player.bank >= 1) {
        player.bank = player.bank - 1;
        player.bet = player.bet + 1;
        updateBankSpan();
    }

    else {
        console.log("you don't have enough money!");
    }
}

function betChip5() {
    if (player.bank >= 5) {
        player.bank = player.bank - 5;
        player.bet = player.bet + 5;
        updateBankSpan();
    }

    else {
        console.log("you don't have enough money!");
    }
}
function betChip10() {
    if (player.bank >= 10) {
        player.bank = player.bank - 10;
        player.bet = player.bet + 10;
        updateBankSpan();
    }

    else {
        console.log("you don't have enough money!");
    }
}
function betChip25() {
    if (player.bank >= 25) {
        player.bank = player.bank - 25;
        player.bet = player.bet + 25;
        updateBankSpan();
    }

    else {
        console.log("you don't have enough money!");
    }
}
function betChip100() {
    if (player.bank >= 100) {
        player.bank = player.bank - 100;
        player.bet = player.bet + 100;
        updateBankSpan();
    }

    else {
        console.log("you don't have enough money!");
    }
}

function updateBankSpan() {
    bankSpan.innerText = player.bank;
}

// how many cards have been dealt
let cardX = 0;
// max number of cards to deal, when stop dealing ...
let cardXStop = 0;

function endCardDeal(ev) {
    cardX++; // done here as we've just dealt a card ... so increment before dealing another card ...
    if (cardX <= cardXStop) {
        if (cardX % 2 == 1) {
            // odd = player
            forceCard(player.handsArray[0], '10', 'hearts', 10);
            let x = player.handsArray[0].cardsArray[0];
            updateCountSpan(player.handsArray[0]);
                    setTimeout(function () {
                    x.div.classList.remove('card--being-dealt');
        }, 4000)
        }
        else {
            // even = dealer
            forceCard(dealer.handsArray[0], '5', 'hearts', 5);
            if (cardX == 2) {
                // Dealer's first card is an ace
                if (dealer.handsArray[0].cardsArray[0].name === 'ace') {
                    dealer.handsArray[0].countSpan.innerText = '1 / 11';

                    // Dealer's second card is not an ace; remove it
                    // from the counts so the player won't know what the second card is
                    if (dealer.handsArray[0].cardsArray[1].name !== 'ace') {
                        dealer.handsArray[0].count1 -= dealer.handsArray[0].cardsArray[1].points;
                        dealer.handsArray[0].count2 -= dealer.handsArray[0].cardsArray[1].points;
                    }

                    else {
                        dealer.handsArray[0].count1 -= 1;
                        dealer.handsArray[0].count2 -= 11;
                    }
                    console.log(dealer.handsArray[0].count1);
                    console.log(dealer.handsArray[0].count2);
                }

                // Dealer's first card is not an ace.
                // Reset the dealer counts because according to the player the second card
                // isn't known.
                else {
                    dealer.handsArray[0].countSpan.innerText = dealer.handsArray[0].cardsArray[0].points;
                    dealer.handsArray[0].count1 = dealer.handsArray[0].cardsArray[0].points;
                    dealer.handsArray[0].count2 = dealer.handsArray[0].cardsArray[0].points;
                }
            }
            // Deal second dealer card facedown
            if(cardX == 4) {
                // dealer.handsArray[0].cardsArray[1].div.style.transform = '';
                dealer.handsArray[0].cardsArray[1].div.style.animation = 'deal-card--facedown .5s ease-in-out forwards';
            }
        }
    }


    if(cardX)
    // run "once" per event trigger call.
    this.removeEventListener('animationend', endCardDeal);
}

// Initial deal
function dealInitialCards(e) {

    // If a bet is placed
    if (player.bet !== 0) {
        // Hide the deal button
        dealBtn.classList.add('hidden');

        // Disable ability to bet more
        chip1.removeEventListener('click', betChip1);
        chip5.removeEventListener('click', betChip5);
        chip10.removeEventListener('click', betChip10);
        chip25.removeEventListener('click', betChip25);
        chip100.removeEventListener('click', betChip100);

        // Create player's first hand
        new Hand(player);
        new Hand(dealer);
        // forceCard(player.handsArray[0], '10', 'clubs', 10);
        // forceCard(player.handsArray[0], '10', 'hearts', 10);
        // setTimeout(function () {
        //     forceCard(player.handsArray[0], '10', 'clubs', 10);
        // }, 1)

        // setTimeout(function () {
        //     forceCard(dealer.handsArray[0], '5', 'hearts', 5);
        // }, 2000)

        // setTimeout(function () {
        //     forceCard(player.handsArray[0], '10', 'hearts', 10);
        // }, 4000)

        // setTimeout(function () {
        //     forceCard(dealer.handsArray[0], '2', 'spades', 2);
        // }, 6000)

        cardX = 1;
        cardXStop = 4;

        forceCard(player.handsArray[0], '10', 'clubs', 10);
        updateCountSpan(player.handsArray[0]);

        // Give time for card animations to finish
        setTimeout(function () {

            // reset cardX and cardXstop
            cardX = 0;
            cardXstop = 0;

            // Check for 21 / blackjack immediately
            if (player.handsArray[0].count1 === 21) {
                updateCountSpan(dealer);
                dealer.handsArray[0].countSpan.innerText = dealer.handsArray[0].cardsArray[0].points;

                if (dealer.count1 === 21) {
                    displayMessageOverlay('Push!');
                }

                else {
                    displayMessageOverlay('Blackjack! You Win!')
                }

                // discardHand(player, 0);
                player.handsArray.shift();
                dealBtn.classList.remove('hidden');
            }

            else {

                // Check for split
                checkForSplit(player.handsArray[0]);
            }

            // Grab and put dealer's second card face down
            dealer.secondCardDiv = dealer.handsArray[0].cardsDiv.children[1];

            e.preventDefault();
            player.currentHand += 1;
        }, 8001)
    }

    // Player hasn't bet
    else {
        console.log('You must first place a bet!');
    }

};

// Hit
function hit() {
    let newCard = dealCard(player.handsArray[player.currentHand]);
    // Wait for card animation to finish
    newCard.onanimationend = () => {

        updateCountSpan(player.handsArray[player.currentHand]);

        let count1 = player.handsArray[player.currentHand].count1;
        let count2 = player.handsArray[player.currentHand].count2;

        let amountOfHands = player.handsArray.length;

        if (count1 === 21 || count2 === 21) {

            // Player has multiple hands
            if (player.handsArray.length > 1) {

                // More hands must hit / stand
                if (player.currentHand !== 0) {
                    console.log('blackjack');
                    player.currentHand -= 1;
                }

                else {
                    console.log('final hand has blackjack')
                    dealer.secondCardDiv.classList.remove('card--facedown');
                    updateCountSpan(dealer.handsArray[0]);
                    for (let i = 0; i < amountOfHands; i++) {
                        compareToDealer();
                    }

                    // resetTable();
                    player.bet = 0;
                    console.log('game over');
                }
            }

            // Player has no more hands; dealer plays hand
            else {
                dealer.secondCardDiv.classList.remove('card--facedown');
                updateCountSpan(dealer.handsArray[0]);
                for (let i = 0; i < amountOfHands; i++) {
                    compareToDealer();
                }

                // resetTable();
                player.bet = 0;
                console.log('game over');
            }
        }

        // Player busts
        else if (count1 > 21) {
            console.log('bust');

            // If player has multiple hands
            if (player.handsArray.length > 1) {

                // If currentHand isn't the oldest / first hand in player.handsArray
                if (player.currentHand !== 0) {

                    // Move to the next hand
                    player.currentHand -= 1;
                }

                // Player is done hitting; compare the hands to the dealer
                else {
                    compareToDealer();
                }
            }

            // Player has only one hand; reset table
            else {
                resetTable();
            }
        }

    }
};

// Stand
function stand() {

    // If player has multiple hands
    if (player.handsArray.length > 1) {

        // If hand has ace, take higher count
        if (player.handsArray[player.currentHand].count1 !== player.handsArray[player.currentHand].count2) {
            player.handsArray[player.currentHand].count1 = player.handsArray[player.currentHand].count2;
            player.handsArray[player.currentHand].countSpan.innerText = player.handsArray[player.currentHand].count2;
        }

        // If more hands can hit / stand
        if (player.currentHand !== 0) {

            // Move to next hand
            player.currentHand -= 1;
        }

        // No more hands can hit / stand
        else {
            
            standBtn.classList.add('hidden');
            hitBtn.classList.add('hidden');

            // Grab original amount of player hands / reveal dealer's second card
            let amountOfHands = player.handsArray.length;
            dealer.secondCardDiv.style.animation = 'reveal-card 1.5s ease-in-out forwards';
            updateCountSpan(dealer.handsArray[0]);

            // for(let i = 0; i < amountOfHands; i++) {
            //     compareToDealer();
            // }
            compareToDealer();

        }
    }

    // Player only has one hand
    else {
        standBtn.classList.add('hidden');
        hitBtn.classList.add('hidden');

        // If hand has ace, take higher count
        if (player.handsArray[player.currentHand].count1 !== player.handsArray[player.currentHand].count2) {
            player.handsArray[player.currentHand].count1 = player.handsArray[player.currentHand].count2;
            player.handsArray[player.currentHand].countSpan.innerText = player.handsArray[player.currentHand].count2;
        }

        // Reveal dealer's second card
        dealer.secondCardDiv.style.animation = 'reveal-card 1.5s ease-in-out forwards';
        setTimeout(function () {
            updateCountSpan(dealer.handsArray[0]);
            compareToDealer();
            // resetTable();
        }, 1501)
    }
}

// Compare a player hand to the dealer's
function compareToDealer() {

    // How many player hands remain
    numberOfHands = player.handsArray.length;

    if(numberOfHands !== 0) {
        // Player's hand busted
        if (player.handsArray[0].count1 > 21) {
            console.log('this hand busted');
            // discardHand(player, 0);
            player.handsArray.splice(0, 1);
            if (numberOfHands !== 0) {
                compareToDealer();
            }
        }

        // Dealer has 21
        else if (dealer.handsArray[0].count1 === 21 || dealer.handsArray[0].count2 === 21) {

            if (player.handsArray[0].count1 === 21) {
                console.log('push with blackjack');
                player.bank += player.bet;
                updateBankSpan();
            }
            console.log("Dealer has blackjack");
            // discardHand(player, 0);
            player.handsArray.splice(0, 1);
            if (numberOfHands !== 0) {
                compareToDealer();
            }
        }

        // Dealer has higher count than player
        else if (dealer.handsArray[0].count1 > player.handsArray[0].count1) {

            // Dealer doesn't bust
            if (dealer.handsArray[0].count1 < 22) {
                console.log("Dealer wins");
                // discardHand(player, 0);
                player.handsArray.splice(0, 1);
                if (numberOfHands !== 0) {
                    compareToDealer();
                }
            }

            // Dealer busts
            else {
                console.log("Dealer busts");
                player.bank += (player.bet * 2);
                updateBankSpan();
                // discardHand(player, 0);
                player.handsArray.splice(0, 1);
                if (numberOfHands !== 0) {
                    compareToDealer();
                }
            }

            // resetTable();
        }

        // Dealer has lower count
        else if (dealer.handsArray[0].count2 < player.handsArray[0].count1) {

            // Dealer hits
            if (dealer.handsArray[0].count1 < 17) {
                console.log('dealer hits');
                dealCard(dealer.handsArray[0]);
                setTimeout(function () {
                    updateCountSpan(dealer.handsArray[0]);
                    console.log(dealer.handsArray[0].count1);
                    compareToDealer();
                }, 2001)
            }

            // Dealer can't hit
            else {
                console.log('player wins');
                player.bank += (player.bet * 2);
                updateBankSpan();
                // discardHand(player, 0);
                player.handsArray.splice(0, 1);
                if (numberOfHands !== 0) {
                    compareToDealer();
                }
            }

        }

        // Push
        else if (dealer.handsArray[0].count1 === player.handsArray[0].count1) {
            console.log('push');
            player.bank += player.bet;
            updateBankSpan();
            // discardHand(player, 0);
            player.handsArray.splice(0, 1);
            if (numberOfHands !== 0) {
                compareToDealer();
            }
        }
    }

    else {
        console.log('final game over');
        setTimeout(function () {
            resetTable();
        }, 4000)
    }
    

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

// Remove a hand from the DOM and dealer or player object
function discardHand(playerOrDealer) {

    // Store the length of the cards array before removing any cards
    let amountOfCards = playerOrDealer.handsArray[playerOrDealer.handsArray.length - 1].cardsArray.length;

    // Loop through the cards and put them in the discard pile array
    for (let i = 0; i < amountOfCards; i++) {
        let card = playerOrDealer.handsArray[playerOrDealer.handsArray.length - 1].cardsArray.shift();
        // Animate off screen
        // Move card object to discard pile
        discardedCardsArray.push(card);
    }

    // Remove the count display / span from DOM
    // playerOrDealer.handsArray[index].container.firstElementChild.remove();

    // // Grab the card elements and amount of cards
    // let cardElements = playerOrDealer.handsArray[index].container.children;
    // let i = cardElements.length;

    setTimeout(function() {
        playerOrDealer.handsArray[playerOrDealer.handsArray.length - 1].container.remove();
        playerOrDealer.handsArray.splice(playerOrDealer.handsArray.length - 1, 1);
    }, 3000)
}

// Reset chip buttons / clear hands
function resetTable() {
    const cards = document.querySelectorAll('.card');
    for(let i = 0; i < cards.length; i++) {
        cards[i].classList.add('offscreen--discard');
    }
    discardHand(dealer);
    player.handsArray.forEach(hand => discardHand(player));
    player.bet = 0;
    player.currentHand = -1;
    showDealBtn();
    chip1.addEventListener('click', betChip1);
    chip5.addEventListener('click', betChip5);
    chip10.addEventListener('click', betChip10);
    chip25.addEventListener('click', betChip25);
    chip100.addEventListener('click', betChip100);
}

// Check for split
function checkForSplit(hand) {
    let card1 = hand.cardsArray[0];
    let card2 = hand.cardsArray[1];

    // Can split
    if (card1.points === card2.points && player.bank >= player.bet) {
        messageOverlayDiv.classList.remove('hidden');
        splitContainer.classList.remove('hidden');
    }

    // Can't split
    else {
        standBtn.classList.remove('hidden');
        hitBtn.classList.remove('hidden');
    }
}

function splitHand(originalHand) {

    // Take money for bet
    player.bank -= player.bet;
    updateBankSpan();

    // Take card from original hand, put it into new hand array
    let newHand = new Hand(player);
    let card = originalHand.cardsArray.pop();
    newHand.cardsArray.unshift(card);
    player.currentHand += 1;

    // Move split card div to new hand's div in the DOM
    newHand.cardsDiv.appendChild(originalHand.cardsDiv.children[1]);
    updateCountSpan(newHand);

    // Deal second card to new hand
    dealCard(newHand);
    updateCountSpan(newHand);
    splitContainer.classList.add('hidden');

    // Update original hand's counts if an ace
    if (originalHand.cardsArray[0].name === 'ace') {
        originalHand.count1 = 1;
        originalHand.count2 = 11;
        updateCountSpan(originalHand);
    }

    // Reset counts because a card was removed
    else {
        originalHand.count1 = 0;
        originalHand.count2 = 0;
        updateCountSpan(originalHand);
    }

    // Check for blackjack on the new hand after it's dealt a second card
    if (newHand.count2 === 21 || newHand.count1 === 21) {
        console.log('blackjack');
        player.currentHand -= 1;
        standBtn.classList.remove('hidden');
        hitBtn.classList.remove('hidden');
    }

    else {
        checkForSplit(newHand);
    }


}

function dontsplitHand() {

    // Hide buttons
    closeMessageOverlay();
    splitContainer.classList.add('hidden');
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

function showDealBtn() {
    standBtn.classList.add('hidden');
    hitBtn.classList.add('hidden');
    dealBtn.classList.remove('hidden');
}

// Calculates sum of an array of cards point values
function calccount1(cardsArray) {
    return cardsArray.reduce((total, card) => total + card.points, 0);
}

// Removes first card from deck and puts it in array of passed hand
function dealCard(hand) {
    let card = deckArray.shift();
    hand.cardsArray.push(card);

    hand.cardsDiv.insertAdjacentHTML('beforeend', `
            <div class="card card--being-dealt card--facedown">
                <div class="card__face card__face--front">
                    <p>${hand.cardsArray[hand.cardsArray.length - 1].name}</p>
                    <p>${hand.cardsArray[hand.cardsArray.length - 1].suit}</p>
                    <p>${hand.cardsArray[hand.cardsArray.length - 1].points}</p>
                </div>
                <div class="card__face card__face--back"></div>
            </div>
        `);

    // Grab the card in the DOM
    hand.cardsArray[hand.cardsArray.length - 1].div = hand.cardsDiv.lastElementChild;
    // setTimeout(function () {
    //     hand.cardsArray[hand.cardsArray.length - 1].div.classList.remove('card--facedown');
    //     hand.cardsArray[hand.cardsArray.length - 1].div.classList.remove('card--being-dealt');
    // }, 4000)

    hand.cardsArray[hand.cardsArray.length - 1].div.onanimationend = () => {
        hand.cardsArray[hand.cardsArray.length - 1].div.classList.remove('card--facedown');
        hand.cardsArray[hand.cardsArray.length - 1].div.classList.remove('card--being-dealt');
    }

    return hand.cardsArray[hand.cardsArray.length - 1].div;
}

// force a card
function forceCard(hand, cardName, cardSuit, cardPoints) {
    let card = { name: cardName, suit: cardSuit, points: cardPoints };
    hand.cardsArray.push(card);

    hand.cardsDiv.insertAdjacentHTML('beforeend', `
            <div class="card card--being-dealt">
                <div class="card__face card__face--front">
                    <p>${hand.cardsArray[hand.cardsArray.length - 1].name}</p>
                    <p>${hand.cardsArray[hand.cardsArray.length - 1].suit}</p>
                    <p>${hand.cardsArray[hand.cardsArray.length - 1].points}</p>
                </div>
                <div class="card__face card__face--back"></div>
            </div>
        `);

    // Grab the card in the DOM
    hand.cardsArray[hand.cardsArray.length - 1].div = hand.cardsDiv.lastElementChild;
    hand.cardsArray[hand.cardsArray.length - 1].div.addEventListener('animationend', endCardDeal);

    // Grab the card in the DOM

    setTimeout(function () {
        hand.cardsArray[hand.cardsArray.length - 1].div.classList.remove('card--facedown');
        hand.cardsArray[hand.cardsArray.length - 1].div.classList.remove('card--being-dealt');
        console.log('card--facedown and card--being-dealt have been removed');
    }, 4000)
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
                hand.countSpan.innerText = hand.count1;
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

        // Check if hand has aces and how many
        let handContainsAce;
        let numberOfAces = 0;
        for (i = 0; i < hand.cardsArray.length; i++) {
            if (hand.cardsArray[i].name === 'ace') {
                handContainsAce = true;
                numberOfAces = numberOfAces + 1;
            }
        }

        // If there is an ace already in the hand
        if (handContainsAce) {

            // If hand has > 1 ace, display count1 which values aces as 1 point
            if (numberOfAces > 1) {
                hand.countSpan.innerText = hand.count1;
                hand.count2 = 22;
            }

            // If blackjack on count2
            else if (hand.count2 === 21) {
                hand.countSpan.innerText = hand.count2;
            }

            // If aces can be valued as 1 or 11
            else if (hand.count2 < 21) {
                hand.countSpan.innerText = `${hand.count1} / ${hand.count2}`;
            }

            // If ace valuing 11 will bust
            else if (hand.count2 > 21) {
                hand.countSpan.innerText = hand.count1;
            }

            // If blackjack on count1
            else if (hand.count1 === 21) {
                hand.countSpan.innerText = hand.count1;
            }

            // If ace valuing 1 will bust
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