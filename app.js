'use strict';

const Player = {
    bank: 1000,
    container: document.getElementById('player-hands'),
    currentHand: -1,
    hands: [],
    bet: 0
}

const Dealer = {
    container: document.getElementById('dealer-hand'),
    hands: [],
    secondCard: null
}

const UI = {
    bank: document.getElementById('bank'),
    bankAmount: document.getElementById('bank-amount'),
    bet: document.getElementById('bet'),
    betAmount: document.getElementById('bet-amount'),
    btn: {
        chip1: document.getElementById('chip--1'),
        chip5: document.getElementById('chip--5'),
        chip10: document.getElementById('chip--10'),
        chip25: document.getElementById('chip--25'),
        chip100: document.getElementById('chip--100'),
        deal: document.getElementById('btn--deal')
    },
    chipBtns: document.querySelectorAll('.chip'),
    chipsBet: document.getElementById('bet-chips'),
    chip1Wrapper: document.getElementById('chip--1-wrapper'),
    chip1Discard: document.getElementById('chip--1-discard'),
    chip5Wrapper: document.getElementById('chip--5-wrapper'),
    chip5Discard: document.getElementById('chip--5-discard'),
    chip10Wrapper: document.getElementById('chip--10-wrapper'),
    chip10Discard: document.getElementById('chip--10-discard'),
    chip25Wrapper: document.getElementById('chip--25-wrapper'),
    chip25Discard: document.getElementById('chip--25-discard'),
    chip100Wrapper: document.getElementById('chip--100-wrapper'),
    chip100Discard: document.getElementById('chip--100-discard'),
    betChip: function(chipVal, chipWrapper, chipDiscard) {

        UI.disableBtns(UI.chipBtns, true)
        UI.disableDealBtn(true)

        Player.bank -= chipVal
        Player.bet += chipVal
        this.updateBank()
        this.updateBet()

        // create HTML for bet chip
        chipWrapper.insertAdjacentHTML('afterbegin', `<div class="chip-bet chip-bet--${chipVal}">${chipVal}</div>`)
        let chip = chipWrapper.firstElementChild

        // make container if this type of chip hasn't been bet yet
        if (this.chipsBet.querySelector(`#bet-chip--${chipVal}-wrapper`) == null) {
            this.chipsBet.insertAdjacentHTML('beforeend', `<div id="bet-chip--${chipVal}-wrapper" class="bet-chip-wrapper bet-chip-wrapper-expanding"></div>`)
        }

        // animate bet chip wrappers
        // document.querySelector(`#bet-chip--${chipVal}-wrapper`).classList.add('bet-chip-wrapper-expanding')

        // move the chip and callback
        this.moveElement(chip, this.chipsBet.querySelector(`#bet-chip--${chipVal}-wrapper`), 'bet-chip-animation', () => {
            if (document.querySelector('.bet-chip-wrapper-expanding')) {
                document.querySelector('.bet-chip-wrapper-expanding').classList.remove('bet-chip-wrapper-expanding')
            }
            UI.disableBtns(UI.chipBtns, false)
            UI.disableDealBtn(false)
            if (Player.bet > 0) {
                UI.disableDealBtn(false)
            }
        })

        // when bet chip is clicked
        chip.addEventListener('click', () => {

            // disable chip btns
            UI.disableBtns(UI.chipBtns, true)
            UI.disableBetChips()
            UI.disableDealBtn(true)

            Player.bank += chipVal
            Player.bet -= chipVal
            UI.updateBank()
            UI.updateBet()

            // if only 1 of this chip remains animate wrapper closed
            if (document.querySelector(`#bet-chip--${chipVal}-wrapper`).children.length == 1) {
                document.querySelector(`#bet-chip--${chipVal}-wrapper`).addEventListener('transitionend', () => {
                    document.querySelector(`#bet-chip--${chipVal}-wrapper`).remove()
                    UI.disableBtns(UI.chipBtns, false)
                    UI.enableBetChips()
                    if (Player.bet > 0) {
                        UI.disableDealBtn(false)
                    }
                })
                document.querySelector(`#bet-chip--${chipVal}-wrapper`).style.width = 0
                // document.querySelector(`#bet-chip--${chipVal}-wrapper`).classList.add('bet-chip-wrapper-shrinking')
            }

            // move bet chip to bottom bar then do stuff after
            UI.moveElement(chip, chipDiscard, 'bet-chip-animation', () => {

                UI.disableBtns(UI.chipBtns, false)
                UI.enableBetChips()
                if (Player.bet > 0) { 
                    UI.disableDealBtn(false)
                }
                // remove chip
                chip.remove()
            })
        })

    },
    disableBtns: (btns, bool) => {
        btns.forEach(btn => {
            btn.disabled = bool
        })
    },
    disableBetChips: () => {
        let betChips = document.querySelectorAll('.chip-bet')
        betChips.forEach(betChip => {
            betChip.classList.add('disable-clicks')
        })
    },
    disableDealBtn: (bool) => {
        UI.btn.deal.disabled = bool
    },
    enableBetChips: () => {
        let betChipWrapper1 = document.querySelector('#bet-chip--1-wrapper')
        if (betChipWrapper1) {
            betChipWrapper1.lastElementChild.classList.remove('disable-clicks')
        }
        let betChipWrapper5 = document.querySelector('#bet-chip--5-wrapper')
        if (betChipWrapper5) {
            betChipWrapper5.lastElementChild.classList.remove('disable-clicks')
        }
        let betChipWrapper10 = document.querySelector('#bet-chip--10-wrapper')
        if (betChipWrapper10) {
            betChipWrapper10.lastElementChild.classList.remove('disable-clicks')
        }
        let betChipWrapper25 = document.querySelector('#bet-chip--25-wrapper')
        if (betChipWrapper25) {
            betChipWrapper25.lastElementChild.classList.remove('disable-clicks')
        }
        let betChipWrapper100 = document.querySelector('#bet-chip--100-wrapper')
        if (betChipWrapper100) {
            betChipWrapper100.lastElementChild.classList.remove('disable-clicks')
        }
    },
    moveElement: function(el, container, className, callback) {

        let firstPos = el.getBoundingClientRect()
        container.appendChild(el)
        let lastPos = el.getBoundingClientRect()
        let invertX = firstPos.x - lastPos.x
        let invertY = firstPos.y - lastPos.y

        el.style.transform = `translate(${invertX}px, ${invertY}px)`

        el.addEventListener('transitionend', () => {
            el.classList.remove(className)
            callback()
        }, { once: true })

        requestAnimationFrame(() => {
            el.classList.add(className)
            el.style.transform = ''
        })
    },
    updateBank: function() {
        this.bankAmount.innerText = `${Player.bank}`
    },
    updateBet: function() {
        this.betAmount.innerText = `${Player.bet}`
    }
}

// let btns = [UI.btn.chip1, UI.btn.chip5, UI.btn.chip10, UI.btn.chip25, UI.btn.chip100]
// UI.disableBtns(btns, true)

const Game = {
    deck: [
        { name: '2', suit: 'hearts', val: 2},
        { name: '2', suit: 'diamonds', val: 2 },
        { name: '2', suit: 'spades', val: 2 },
        { name: '2', suit: 'clubs', val: 2 },
        { name: '3', suit: 'hearts', val: 3 },
        { name: '3', suit: 'diamonds', val: 3 },
        { name: '3', suit: 'spades', val: 3 },
        { name: '3', suit: 'clubs', val: 3 },
        { name: '4', suit: 'hearts', val: 4 },
        { name: '4', suit: 'diamonds', val: 4 },
        { name: '4', suit: 'spades', val: 4 },
        { name: '4', suit: 'clubs', val: 4 },
        { name: '5', suit: 'hearts', val: 5 },
        { name: '5', suit: 'diamonds', val: 5 },
        { name: '5', suit: 'spades', val: 5 },
        { name: '5', suit: 'clubs', val: 5 },
        { name: '6', suit: 'hearts', val: 6 },
        { name: '6', suit: 'diamonds', val: 6 },
        { name: '6', suit: 'spades', val: 6 },
        { name: '6', suit: 'clubs', val: 6 },
        { name: '7', suit: 'hearts', val: 7 },
        { name: '7', suit: 'diamonds', val: 7 },
        { name: '7', suit: 'spades', val: 7 },
        { name: '7', suit: 'clubs', val: 7 },
        { name: '8', suit: 'hearts', val: 8 },
        { name: '8', suit: 'diamonds', val: 8 },
        { name: '8', suit: 'spades', val: 8 },
        { name: '8', suit: 'clubs', val: 8 },
        { name: '9', suit: 'hearts', val: 9 },
        { name: '9', suit: 'diamonds', val: 9 },
        { name: '9', suit: 'spades', val: 9 },
        { name: '9', suit: 'clubs', val: 9 },
        { name: '10', suit: 'hearts', val: 10 },
        { name: '10', suit: 'diamonds', val: 10 },
        { name: '10', suit: 'spades', val: 10 },
        { name: '10', suit: 'clubs', val: 10 },
        { name: 'jack', suit: 'hearts', val: 10 },
        { name: 'jack', suit: 'diamonds', val: 10 },
        { name: 'jack', suit: 'spades', val: 10 },
        { name: 'jack', suit: 'clubs', val: 10 },
        { name: 'queen', suit: 'hearts', val: 10 },
        { name: 'queen', suit: 'diamonds', val: 10 },
        { name: 'queen', suit: 'spades', val: 10 },
        { name: 'queen', suit: 'clubs', val: 10 },
        { name: 'king', suit: 'hearts', val: 10 },
        { name: 'king', suit: 'diamonds', val: 10 },
        { name: 'king', suit: 'spades', val: 10 },
        { name: 'king', suit: 'clubs', val: 10 },
        { name: 'ace', suit: 'hearts', val: 0 },
        { name: 'ace', suit: 'diamonds', val: 0 },
        { name: 'ace', suit: 'spades', val: 0 },
        { name: 'ace', suit: 'clubs', val: 0 }
    ],
    deal: (hand) => {
        
    },
    shuffle: (cards) => {
        let newPos;
        let card;
        for (let i = cards.length -1; i > 0; i--) {
            newPos = Math.floor(Math.random() * (i + 1));
            card = cards[i];
            cards[i] = cards[newPos];
            cards[newPos] = card;
        }
        return cards;
    }
}

document.body.addEventListener('click', (e) => {
    if (e.target == UI.btn.deal) {
        // disable chip btn + deal btns
        UI.disableBtns(UI.chipBtns, true)
        UI.disableBetChips()
        UI.disableDealBtn(true)

    } else if (e.target == UI.btn.chip1) {
        if (Player.bank >= 1) {
            UI.betChip(1, UI.chip1Wrapper, UI.chip1Discard)
        } else {
            console.log('You don\'t have $1!')
        }
    } else if (e.target == UI.btn.chip5) {
        if (Player.bank >= 5) {
            UI.betChip(5, UI.chip5Wrapper, UI.chip5Discard)
        } else {
            console.log('You don\'t have $5!')
        }
    } else if (e.target == UI.btn.chip10) {
        if (Player.bank >= 10) {
            UI.betChip(10, UI.chip10Wrapper, UI.chip10Discard)
        } else {
            console.log('You don\'t have $10!');
        }
    } else if (e.target == UI.btn.chip25) {
        if (Player.bank >= 25) {
            UI.betChip(25, UI.chip25Wrapper, UI.chip25Discard)
        } else {
            console.log('You don\'t have $25!');
        }
    } else if (e.target == UI.btn.chip100) {
        if (Player.bank >= 100) {
            UI.betChip(100, UI.chip100Wrapper, UI.chip100Discard)
        } else {
            console.log('You don\'t have $100!')
        }
    }
})

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

// Calculates sum of an array of cards point values
function calccount1(cardsArray) {
    return cardsArray.reduce((total, card) => total + card.points, 0);
}