'use strict';

const Player = {
    bank: 1000,
    handIndex: -1,
    hands: [],
    handsTrack: document.getElementById('player-hands-track'),
    bet: 0,
    createHand: (bet) => {
        let hand = {
            ui: {
                div: document.createElement('div'),
                bet: document.createElement('p'),
                chips: document.createElement('div'),
                cards: document.createElement('div'),
                cardsInner: document.createElement('div'),
                count: document.createElement('p'),
                indicator: document.createElement('div')
            },
            bet,
            cards: [],
            count: {
                acesAreOne: 0,
                acesAreEleven: 0
            }
        }

        // current hand is last hand
        if (Player.handIndex === Player.hands.length - 1) {
            Player.hands.push(hand)
        } else {
            Player.hands.splice(Player.handIndex + 1, 0, hand)
        }

        hand.ui.div.classList.add('hand')
        hand.ui.bet.classList.add('hand-bet-amount')
        hand.ui.chips.classList.add('hand-chips')
        hand.ui.cards.classList.add('hand-cards')
        hand.ui.cardsInner.classList.add('hand-cards-inner')
        hand.ui.count.classList.add('hand-card-count', 'hidden')
        hand.ui.indicator.classList.add('hand-indicator', 'opacity-0')

        hand.ui.bet.textContent = '$' + hand.bet

        hand.ui.div.appendChild(hand.ui.bet)
        hand.ui.div.appendChild(hand.ui.chips)
        hand.ui.div.appendChild(hand.ui.cards)
        hand.ui.cards.appendChild(hand.ui.cardsInner)
        hand.ui.cards.appendChild(hand.ui.count)
        hand.ui.div.appendChild(hand.ui.indicator)

        // update current hand to new hand
        Player.handIndex++

        // append to the end if new hand is the last hand
        if (Player.handIndex === Player.hands.length - 1) {
            Player.handsTrack.appendChild(hand.ui.div)
        } else {
            console.log('current hand is NOT last hand, smush between')
            // insert hand after previous
            Player.hands[Player.handIndex - 1].ui.div.after(hand.ui.div)
        }

        // slide hands
        if (Player.hands.length > 2) {
            // new hand is last hand
            if (Player.handIndex === Player.hands.length - 1) {
                Player.handsTrack.style.transform = `translateX(${(Player.hands.length - 2) * -50}%)`
                console.log('slid track')
            } else {
                // new hand is not last hand
                Player.handsTrack.style.transform = `translateX(${(Player.handIndex - 1) * -50}%)`
            }
        }
    }
}

const Dealer = {
    container: document.getElementById('dealer-hand'),
    hands: [
        {
            ui: {
                div: document.querySelector('#dealer-hand .hand'),
                cards: document.querySelector('#dealer-hand .hand-cards'),
                cardsInner: document.querySelector('#dealer-hand .hand-cards-inner'),
                count: document.querySelector('#dealer-hand .hand-card-count'),
            },
            cards: [],
            count: 0
        }
    ],
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
        deal: document.getElementById('btn--deal'),
        doubleStandHit: document.getElementById('dbl-stand-hit'),
        double: document.getElementById('btn--dbl'),
        hit: document.getElementById('btn--hit'),
        stand: document.getElementById('btn--stand'),
        splitYes: document.getElementById('btn--split-yes'),
        splitNo: document.getElementById('btn--split-no'),
        insuranceYes: document.getElementById('btn--insurance-yes'),
        insuranceNo: document.getElementById('btn--insurance-no')
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
    splitContainer: document.getElementById('split-container'),
    insuranceContainer: document.getElementById('insurance-container'),
    insurance: document.getElementById('insurance'),
    insuranceAmount: document.getElementById('insurance-amount'),
    insuranceChips: document.getElementById('insurance-chips'),
    dealerChipSpawn: document.querySelector('#dealer-chip-spawn > div'),
    messageWrapper: document.getElementById('message-wrapper'),
    messageText: document.querySelector('#message-wrapper .message-text'),
    betChip: function(chipVal, chipWrapper, chipDiscard) {

        UI.disableBtns(UI.chipBtns, true)
        UI.disableDealBtn(true)

        Player.bet += chipVal
        this.updateBank(-chipVal, 1000)
        this.updateBet()

        // create HTML for bet chip
        chipWrapper.insertAdjacentHTML('afterbegin', `<div class="chip-bet chip-bet--${chipVal}" data-chip-value="${chipVal}">${chipVal}</div>`)
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

            Player.bet -= chipVal
            UI.updateBank(chipVal, 1000)
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
    collapseChipsBet: (bool) => {
        if (bool) {
            UI.chipsBet.classList.add('collapsed')
        } else {
            for (const betChipWrap of document.querySelectorAll('.bet-chip-wrapper')) {
                betChipWrap.remove()
            }
            UI.chipsBet.classList.remove('collapsed')
        }
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
    createAndMoveChips: (numChip, startContainer, endContainer, value) => {
        for (let i = 0; i < numChip; i++) {
            startContainer.insertAdjacentHTML('afterbegin', `<div class="chip-bet chip-bet--${value}" data-chip-value="${value}">$${value}</div>`)
            let chip = startContainer.firstElementChild
            UI.moveElement(chip, endContainer, 'bet-chip-animation', () => {})
        }
    },
    enableBetChips: () => {
        let betChipWrapper1 = document.querySelector('#bet-chip--1-wrapper') || false
        if (betChipWrapper1 && betChipWrapper1.children.length > 0) {
            betChipWrapper1.lastElementChild.classList.remove('disable-clicks')
        }
        let betChipWrapper5 = document.querySelector('#bet-chip--5-wrapper') || false
        if (betChipWrapper5 && betChipWrapper5.children.length > 0) {
            betChipWrapper5.lastElementChild.classList.remove('disable-clicks')
        }
        let betChipWrapper10 = document.querySelector('#bet-chip--10-wrapper') || false
        if (betChipWrapper10 && betChipWrapper10.children.length > 0) {
            betChipWrapper10.lastElementChild.classList.remove('disable-clicks')
        }
        let betChipWrapper25 = document.querySelector('#bet-chip--25-wrapper') || false
        if (betChipWrapper25 && betChipWrapper25.children.length > 0) {
            betChipWrapper25.lastElementChild.classList.remove('disable-clicks')
        }
        let betChipWrapper100 = document.querySelector('#bet-chip--100-wrapper') || false
        if (betChipWrapper100 && betChipWrapper100.children.length > 0) {
            betChipWrapper100.lastElementChild.classList.remove('disable-clicks')
        }
    },
    fadeOut: (element) => {
        element.classList.add('fading-out')
    },
    showElement: (el, bool) => {
        if (bool) {
            el.classList.remove('hidden')
        } else {
            el.classList.add('hidden')
        }
    },
    moveElement: (el, container, className, callback) => {

        let firstPos = el.getBoundingClientRect()
        container.appendChild(el)
        let lastPos = el.getBoundingClientRect()
        let invertX = firstPos.x - lastPos.x
        let invertY = firstPos.y - lastPos.y

        el.style.transform = `translate(${invertX}px, ${invertY}px)`            

        el.addEventListener('transitionend', () => {
            el.classList.remove(className)
            el.removeAttribute('style')
            callback()
        }, { once: true })

        setTimeout(() => {
            el.classList.add(className)
            el.style.transform = 'none'
        }, 30)

    },
    playMessage: (message, animation) => {
        return new Promise(resolve => {
            const onAnimationEndCb = () => {
                UI.messageWrapper.removeEventListener('animationend', onAnimationEndCb)
                UI.messageWrapper.style.animation = 'none'
                UI.messageWrapper.classList.add('hidden')
                UI.messageText.innerText = ''
                setTimeout(() => {
                    resolve()
                }, 1)
            }
            UI.messageWrapper.classList.remove('hidden')
            UI.messageWrapper.addEventListener('animationend', onAnimationEndCb)
            UI.messageText.innerText = message
            UI.messageWrapper.style.animation = animation
        })
    },
    playAnimation: (el, animation, isAnimationRemoved = true) => {
        return new Promise(resolve => {
            const onAnimationEndCb = () => {
                el.removeEventListener('animationend', onAnimationEndCb)
                if (isAnimationRemoved) {
                    el.style.animation = 'none'
                }
                setTimeout(() => {
                    resolve()
                }, 1)
            }
            el.addEventListener('animationend', onAnimationEndCb)
            el.style.animation = animation
        })
    },
    revealDealerCard: (delay) => {
        return new Promise(resolve => {
            const onAnimationEndCb = () => {
                Dealer.secondCard.removeEventListener('animationend', onAnimationEndCb)
                Dealer.secondCard.classList.remove('card--facedown')
                Dealer.secondCard.style.animation = 'none'
                setTimeout(() => {
                    resolve()
                }, 1)
            }
            Dealer.secondCard.addEventListener('animationend', onAnimationEndCb)
            Dealer.secondCard.style.animation = `2s ${delay}s forwards reveal-card`
        })
    },
    updateBank: function(amount, duration) {
        var obj = UI.bankAmount
        var start = Player.bank
        var end = start + amount
        var range = end - start;
        // no timer shorter than 50ms (not really visible any way)
        var minTimer = 50;
        // calc step time to show all interediate values
        var stepTime = Math.abs(Math.floor(duration / range));
        
        // never go below minTimer
        stepTime = Math.max(stepTime, minTimer);
        
        // get current time and calculate desired end time
        var startTime = new Date().getTime();
        var endTime = startTime + duration;
        var timer;
      
        function run() {
            var now = new Date().getTime();
            var remaining = Math.max((endTime - now) / duration, 0);
            var value = Math.round(end - (remaining * range));
            obj.innerHTML = value;
            if (value == end) {
                clearInterval(timer);
            }
        }
        
        timer = setInterval(run, stepTime);
        run();
        Player.bank += amount
    },
    updateBet: function() {
        this.betAmount.innerText = `${Player.bet}`
    }
}

// let btns = [UI.btn.chip1, UI.btn.chip5, UI.btn.chip10, UI.btn.chip25, UI.btn.chip100]
// UI.disableBtns(btns, true)

const Game = {
    deck: [
        { name: '2', suit: 'hearts', graphic: '', value: 2, value1: 2, value2: 2, isAce: false },
        { name: '2', suit: 'diamonds', graphic: '', value: 2, value1: 2, value2: 2, isAce: false },
        { name: '2', suit: 'spades', graphic: '', value: 2, value1: 2, value2: 2, isAce: false },
        { name: '2', suit: 'clubs', graphic: '', value: 2, value1: 2, value2: 2, isAce: false },
        { name: '3', suit: 'hearts', graphic: '', value: 3, value1: 3, value2: 3, isAce: false },
        { name: '3', suit: 'diamonds', graphic: '', value: 3, value1: 3, value2: 3, isAce: false },
        { name: '3', suit: 'spades', graphic: '', value: 3, value1: 3, value2: 3, isAce: false },
        { name: '3', suit: 'clubs', graphic: '', value: 3, value1: 3, value2: 3, isAce: false },
        { name: '4', suit: 'hearts', graphic: '', value: 4, value1: 4, value2: 4, isAce: false },
        { name: '4', suit: 'diamonds', graphic: '', value: 4, value1: 4, value2: 4, isAce: false },
        { name: '4', suit: 'spades', graphic: '', value: 4, value1: 4, value2: 4, isAce: false },
        { name: '4', suit: 'clubs', graphic: '', value: 4, value1: 4, value2: 4, isAce: false },
        { name: '5', suit: 'hearts', graphic: '', value: 5, value1: 5, value2: 5, isAce: false },
        { name: '5', suit: 'diamonds', graphic: '', value: 5, value1: 5, value2: 5, isAce: false },
        { name: '5', suit: 'spades', graphic: '', value: 5, value1: 5, value2: 5, isAce: false },
        { name: '5', suit: 'clubs', graphic: '', value: 5, value1: 5, value2: 5, isAce: false },
        { name: '6', suit: 'hearts', graphic: '', value: 6, value1: 6, value2: 6, isAce: false },
        { name: '6', suit: 'diamonds', graphic: '', value: 6, value1: 6, value2: 6, isAce: false },
        { name: '6', suit: 'spades', graphic: '', value: 6, value1: 6, value2: 6, isAce: false },
        { name: '6', suit: 'clubs', graphic: '', value: 6, value1: 6, value2: 6, isAce: false },
        { name: '7', suit: 'hearts', graphic: '', value: 7, value1: 7, value2: 7, isAce: false },
        { name: '7', suit: 'diamonds', graphic: '', value: 7, value1: 7, value2: 7, isAce: false },
        { name: '7', suit: 'spades', graphic: '', value: 7, value1: 7, value2: 7, isAce: false },
        { name: '4', suit: 'spades', graphic: '', value: 4, value1: 4, value2: 4, isAce: false },
        { name: '8', suit: 'hearts', graphic: '', value: 8, value1: 8, value2: 8, isAce: false },
        { name: '8', suit: 'diamonds', graphic: '', value: 8, value1: 8, value2: 8, isAce: false },
        { name: '8', suit: 'spades', graphic: '', value: 8, value1: 8, value2: 8, isAce: false },
        { name: '8', suit: 'clubs', graphic: '', value: 8, value1: 8, value2: 8, isAce: false },
        { name: '9', suit: 'hearts', graphic: '', value: 9, value1: 9, value2: 9, isAce: false },
        { name: '9', suit: 'diamonds', graphic: '', value: 9, value1: 9, value2: 9, isAce: false },
        { name: '9', suit: 'spades', graphic: '', value: 9, value1: 9, value2: 9, isAce: false },
        { name: '9', suit: 'clubs', graphic: '', value: 9, value1: 9, value2: 9, isAce: false },
        { name: '10', suit: 'hearts', graphic: '', value: 10, value1: 10, value2: 10, isAce: false },
        { name: '10', suit: 'diamonds', graphic: '', value: 10, value1: 10, value2: 10, isAce: false },
        { name: '10', suit: 'spades', graphic: '', value: 10, value1: 10, value2: 10, isAce: false },
        { name: '10', suit: 'clubs', graphic: '', value: 10, value1: 10, value2: 10, isAce: false },
        { name: 'J', suit: 'hearts', graphic: '', value: 10, value1: 10, value2: 10, isAce: false },
        { name: 'J', suit: 'diamonds', graphic: '', value: 10, value1: 10, value2: 10, isAce: false },
        { name: 'J', suit: 'spades', graphic: '', value: 10, value1: 10, value2: 10, isAce: false }, 
        { name: 'J', suit: 'clubs', graphic: '', value: 10, value1: 10, value2: 10, isAce: false },
        { name: 'Q', suit: 'hearts', graphic: '', value: 10, value1: 10, value2: 10, isAce: false },
        { name: 'Q', suit: 'diamonds', graphic: '', value: 10, value1: 10, value2: 10, isAce: false },
        { name: 'Q', suit: 'spades', graphic: '', value: 10, value1: 10, value2: 10, isAce: false },
        { name: 'Q', suit: 'clubs', graphic: '', value: 10, value1: 10, value2: 10, isAce: false },
        { name: '7', suit: 'spades', graphic: '', value: 7, value1: 7, value2: 7, isAce: false },
        { name: 'K', suit: 'hearts', graphic: '', value: 10, value1: 10, value2: 10, isAce: false },
        { name: '4', suit: 'spades', graphic: '', value: 4, value1: 4, value2: 4, isAce: false },
        { name: 'K', suit: 'diamonds', graphic: '', value: 10, value1: 10, value2: 10, isAce: false },
        { name: 'K', suit: 'spades', graphic: '', value: 10, value1: 10, value2: 10, isAce: false },
        { name: 'K', suit: 'clubs', graphic: '', value: 10, value1: 10, value2: 10, isAce: false },
        { name: '4', suit: 'spades', graphic: '', value: 4, value1: 4, value2: 4, isAce: false }
        // { name: 'A', suit: 'hearts', graphic: '', value: 11, value1: 1, value2: 11,  isAce: true },
        // { name: 'A', suit: 'diamonds', graphic: '', value: 11, value1: 1, value2: 11,  isAce: true },
        // { name: '3', suit: 'spades', graphic: '', value: 3, value1: 3, value2: 3, isAce: false },
        // { name: 'A', suit: 'spades', graphic: '', value: 11, value1: 1, value2: 11,  isAce: true },
        // { name: '10', suit: 'clubs', graphic: '', value: 10, value1: 10, value2: 10, isAce: false },
        // { name: 'A', suit: 'spades', graphic: '', value: 11, value1: 1, value2: 11,  isAce: true },
        // // { name: 'A', suit: 'clubs', graphic: '', value: 11, value1: 1, value2: 11, isAce: true },
        // { name: '3', suit: 'spades', graphic: '', value: 3, value1: 3, value2: 3, isAce: false },
    ],
    discardedPile: [],
    deal: (hand, isCardFacedown) => {

        // move card logic from dealer to hand
        let dealtCard = Game.deck.pop()
        hand.cards.push(dealtCard)

        // generate card in DOM
        let card = document.createElement('div')

        let suitIcon = ''

        switch (dealtCard.suit) {
            case 'hearts':
                suitIcon = `<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                width="15px" height="15px" viewBox="0 0 15 15" style="enable-background:new 0 0 15 15;" xml:space="preserve">
           <path style="fill:#ff0000;fill-opacity:1;stroke:none;" d="M13.91,6.75c-1.17,2.25-4.3,5.31-6.07,6.94c-0.1903,0.1718-0.4797,0.1718-0.67,0C5.39,12.06,2.26,9,1.09,6.75
               C-1.48,1.8,5-1.5,7.5,3.45C10-1.5,16.48,1.8,13.91,6.75z"/>
           </svg>`
                break
            case 'diamonds':
                suitIcon = `<svg width="11px" height="15px" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:cc="http://creativecommons.org/ns#" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" width="127" height="175" viewBox="0 0 127 175" id="svg2" version="1.1" inkscape:version="0.91 r13725" sodipodi:docname="card diamond.svg">
                <g inkscape:label="Layer 1" inkscape:groupmode="layer" id="layer1" transform="translate(0,-877.36216)">
                  <path style="fill:#ff0000;fill-opacity:1;stroke:none" d="M 59.617823,1026.4045 C 54.076551,1017.027 35.802458,991.8393 22.320951,974.99722 15.544428,966.53149 10,959.28947 10,958.90385 c 0,-0.38562 2.498012,-3.68932 5.551138,-7.34155 14.779126,-17.67921 34.688967,-44.7342 42.813135,-58.17773 2.491067,-4.12211 4.836029,-7.13807 5.211026,-6.70213 0.374997,0.43594 3.911379,5.74741 7.858624,11.80326 8.617724,13.22128 27.37269,38.4164 38.049687,51.11535 l 7.73836,9.2038 -7.73836,9.2038 c -14.035208,16.69312 -34.03523,44.26125 -44.489713,61.32495 l -1.855601,3.0286 -3.520473,-5.9577 z" id="path5878" inkscape:connector-curvature="0"/>
                </g>
              <style xmlns="http://www.w3.org/1999/xhtml" type="text/css"></style></svg>`
                break
            case 'spades':
                suitIcon = `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" baseProfile="full" viewBox="68.547241 122.68109 537.42297 635.16461" height="15px" width="12px">
                <path d="m213.23 502.9c-195.31 199.54-5.3525 344.87 149.07 249.6.84137 49.146-37.692 95.028-61.394 138.9h166.73c-24.41-42.64-65.17-89.61-66.66-138.9 157.66 90.57 325.33-67.37 150.39-249.6-91.22-100.08-148.24-177.95-169.73-204.42-19.602 25.809-71.82 101.7-168.41 204.42z" fill-rule="evenodd" stroke="#000" stroke-width="1.3691pt" transform="translate(-40.697 -154.41)"/>
                </svg>`
                break
            case 'clubs':
                suitIcon = `<svg xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:cc="http://creativecommons.org/ns#" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" viewBox="0 0 167 175" id="svg2" version="1.1" inkscape:version="0.91 r13725" sodipodi:docname="card club.svg" height="15px" width="13px">
                <g inkscape:label="Layer 1" inkscape:groupmode="layer" id="layer1" transform="translate(0,-877.36216)">
                  <path style="fill:#000;fill-opacity:1;stroke:none" d="m 33.57277,1031.6441 c 0.0435,-2.1326 2.41976,-3.3889 10.49989,-5.5512 12.14507,-3.2503 16.36065,-5.2676 21.9679,-10.5125 9.82494,-9.1901 15.25562,-21.22154 15.97824,-35.39913 0.36906,-7.24076 0.24246,-8.32449 -0.79266,-6.78544 -0.67753,1.00737 -2.97792,4.45418 -5.11199,7.65957 -7.97032,11.97146 -22.45213,19.5535 -35.36758,18.51676 -11.83058,-0.9496 -22.13911,-8.0757 -27.153181,-18.7705 C 11.408457,976.14131 9.9993832,974.1371 10,966.29829 c 5.75e-4,-7.29956 1.467962,-9.97978 3.127761,-13.57245 2.811689,-6.08595 9.305249,-12.90321 15.075899,-15.82742 4.21005,-2.1334 5.63196,-2.36479 12.00652,-1.95387 4.40788,0.28415 9.05935,1.27178 11.91429,2.52974 2.57586,1.13499 4.86604,1.88096 5.08928,1.65771 0.22325,-0.22324 -1.01801,-3.14232 -2.75836,-6.48683 -2.89215,-5.55798 -3.613547,-9.70494 -3.17439,-14.69794 0.715189,-8.13136 3.33033,-17.06576 9.26858,-22.66644 6.210544,-5.8575 13.15934,-8.70278 24.23193,-8.29118 10.30158,0.38295 16.28183,3.51796 21.8449,9.11271 5.44231,5.4733 8.15044,13.72926 8.79339,21.42097 0.42932,5.136 -0.30242,8.80285 -3.41548,15.07978 -1.87851,3.78769 -3.11542,6.88671 -2.74868,6.88671 0.36674,0 3.19626,-1.17617 6.28782,-2.61372 14.45758,-6.72263 31.03576,-0.21065 38.04272,14.94333 1.68146,3.63649 3.04501,6.21845 3.03882,14.4789 -0.007,8.74854 -1.3142,10.67446 -3.37074,14.84042 -6.50325,13.17365 -21.57941,20.77499 -35.34793,17.82215 -11.72207,-2.5139 -21.58027,-9.5882 -28.79683,-20.66458 -2.24081,-3.43932 -4.2733,-6.25331 -4.51666,-6.25331 -0.70681,0 0.71696,12.36855 2.17672,18.90959 2.84299,12.73914 11.304859,24.30404 22.0274,30.10484 4.10231,2.2193 12.45749,4.8896 21.58822,6.8996 1.4227,0.3132 2.73765,1.3922 3.02207,2.4798 0.49967,1.9108 0.12309,1.9254 -49.67283,1.9254 -27.59697,0 -50.16972,-0.3231 -50.16165,-0.7181 z" id="path5891" inkscape:connector-curvature="0" sodipodi:nodetypes="ccssssssssssscsaasaasssscssssssscsc"/>
                </g>
              </svg>`
                break
        }

        let cardContent = `
            <div class="card__face card__face--front">
                <div class="card-info--top">
                    <div class="card-name-suit">
                        <div class="card-name">${dealtCard.name}</div>
                        <div>${suitIcon}</div>
                    </div>
                    <div class="card-name-suit">
                        <div class="card-name">${dealtCard.name}</div>
                        <div>${suitIcon}</div>
                    </div>
                </div>
                <div class="card-graphic">
                    <p>${dealtCard.name}</p>
                    <p>${dealtCard.suit}</p>
                </div>
                <div class="card-info--bottom">
                    <div class="card-name-suit">
                        <div class="card-name">${dealtCard.name}</div>
                        <div>${suitIcon}</div>
                    </div>
                    <div class="card-name-suit">
                        <div class="card-name">${dealtCard.name}</div>
                        <div>${suitIcon}</div>
                    </div>
                </div>
            </div>
            <div class="card__face card__face--back"></div>
        `

        card.insertAdjacentHTML('beforeend', cardContent)
        card.classList.add('card')
        hand.ui.cardsInner.appendChild(card)

        // return promise so card animations can run synchronously
        return new Promise(resolve => {
            const onAnimationEndCb = () => {
                card.removeEventListener('animationend', onAnimationEndCb)

                if (isCardFacedown) {
                    card.classList.remove('card--being-dealt-facedown')
                } else {
                    card.classList.remove('card--being-dealt')
                }

                let cardIndex = hand.ui.cardsInner.children.length - 1

                // if there's more than 1 card
                if (hand.ui.cardsInner.children.length > 1) {
                    for (const card of hand.ui.cardsInner.children) {
                        // offset nonitial cards
                        if (cardIndex !== 0) {
                            card.style.left = `${cardIndex * -2}rem`
                            cardIndex--
                        }
                    }

                    // recenter cardsInner wrapper
                    hand.ui.cardsInner.style.left = `${(hand.ui.cardsInner.children.length - 1) * 1}rem`
                }

                resolve()
            }

            card.addEventListener('animationend', onAnimationEndCb)

            if (isCardFacedown) {
                card.classList.add('card--being-dealt-facedown', 'card--facedown')   
            } else  {
                card.classList.add('card--being-dealt')   
            }

            
            
        })
    },
    forceCard: (hand, isCardFacedown, forcedCard) => {

        // move card logic from dealer to hand
        let dealtCard = forcedCard
        hand.cards.push(dealtCard)

        // generate card in DOM
        let card = document.createElement('div')

        let suitIcon = ''

        switch (dealtCard.suit) {
            case 'hearts':
                suitIcon = `<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                width="15px" height="15px" viewBox="0 0 15 15" style="enable-background:new 0 0 15 15;" xml:space="preserve">
           <path style="fill:#ff0000;fill-opacity:1;stroke:none;" d="M13.91,6.75c-1.17,2.25-4.3,5.31-6.07,6.94c-0.1903,0.1718-0.4797,0.1718-0.67,0C5.39,12.06,2.26,9,1.09,6.75
               C-1.48,1.8,5-1.5,7.5,3.45C10-1.5,16.48,1.8,13.91,6.75z"/>
           </svg>`
                break
            case 'diamonds':
                suitIcon = `<svg width="11px" height="15px" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:cc="http://creativecommons.org/ns#" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" width="127" height="175" viewBox="0 0 127 175" id="svg2" version="1.1" inkscape:version="0.91 r13725" sodipodi:docname="card diamond.svg">
                <g inkscape:label="Layer 1" inkscape:groupmode="layer" id="layer1" transform="translate(0,-877.36216)">
                  <path style="fill:#ff0000;fill-opacity:1;stroke:none" d="M 59.617823,1026.4045 C 54.076551,1017.027 35.802458,991.8393 22.320951,974.99722 15.544428,966.53149 10,959.28947 10,958.90385 c 0,-0.38562 2.498012,-3.68932 5.551138,-7.34155 14.779126,-17.67921 34.688967,-44.7342 42.813135,-58.17773 2.491067,-4.12211 4.836029,-7.13807 5.211026,-6.70213 0.374997,0.43594 3.911379,5.74741 7.858624,11.80326 8.617724,13.22128 27.37269,38.4164 38.049687,51.11535 l 7.73836,9.2038 -7.73836,9.2038 c -14.035208,16.69312 -34.03523,44.26125 -44.489713,61.32495 l -1.855601,3.0286 -3.520473,-5.9577 z" id="path5878" inkscape:connector-curvature="0"/>
                </g>
              <style xmlns="http://www.w3.org/1999/xhtml" type="text/css"></style></svg>`
                break
            case 'spades':
                suitIcon = `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" baseProfile="full" viewBox="68.547241 122.68109 537.42297 635.16461" height="15px" width="12px">
                <path d="m213.23 502.9c-195.31 199.54-5.3525 344.87 149.07 249.6.84137 49.146-37.692 95.028-61.394 138.9h166.73c-24.41-42.64-65.17-89.61-66.66-138.9 157.66 90.57 325.33-67.37 150.39-249.6-91.22-100.08-148.24-177.95-169.73-204.42-19.602 25.809-71.82 101.7-168.41 204.42z" fill-rule="evenodd" stroke="#000" stroke-width="1.3691pt" transform="translate(-40.697 -154.41)"/>
                </svg>`
                break
            case 'clubs':
                suitIcon = `<svg xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:cc="http://creativecommons.org/ns#" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" viewBox="0 0 167 175" id="svg2" version="1.1" inkscape:version="0.91 r13725" sodipodi:docname="card club.svg" height="15px" width="13px">
                <g inkscape:label="Layer 1" inkscape:groupmode="layer" id="layer1" transform="translate(0,-877.36216)">
                  <path style="fill:#000;fill-opacity:1;stroke:none" d="m 33.57277,1031.6441 c 0.0435,-2.1326 2.41976,-3.3889 10.49989,-5.5512 12.14507,-3.2503 16.36065,-5.2676 21.9679,-10.5125 9.82494,-9.1901 15.25562,-21.22154 15.97824,-35.39913 0.36906,-7.24076 0.24246,-8.32449 -0.79266,-6.78544 -0.67753,1.00737 -2.97792,4.45418 -5.11199,7.65957 -7.97032,11.97146 -22.45213,19.5535 -35.36758,18.51676 -11.83058,-0.9496 -22.13911,-8.0757 -27.153181,-18.7705 C 11.408457,976.14131 9.9993832,974.1371 10,966.29829 c 5.75e-4,-7.29956 1.467962,-9.97978 3.127761,-13.57245 2.811689,-6.08595 9.305249,-12.90321 15.075899,-15.82742 4.21005,-2.1334 5.63196,-2.36479 12.00652,-1.95387 4.40788,0.28415 9.05935,1.27178 11.91429,2.52974 2.57586,1.13499 4.86604,1.88096 5.08928,1.65771 0.22325,-0.22324 -1.01801,-3.14232 -2.75836,-6.48683 -2.89215,-5.55798 -3.613547,-9.70494 -3.17439,-14.69794 0.715189,-8.13136 3.33033,-17.06576 9.26858,-22.66644 6.210544,-5.8575 13.15934,-8.70278 24.23193,-8.29118 10.30158,0.38295 16.28183,3.51796 21.8449,9.11271 5.44231,5.4733 8.15044,13.72926 8.79339,21.42097 0.42932,5.136 -0.30242,8.80285 -3.41548,15.07978 -1.87851,3.78769 -3.11542,6.88671 -2.74868,6.88671 0.36674,0 3.19626,-1.17617 6.28782,-2.61372 14.45758,-6.72263 31.03576,-0.21065 38.04272,14.94333 1.68146,3.63649 3.04501,6.21845 3.03882,14.4789 -0.007,8.74854 -1.3142,10.67446 -3.37074,14.84042 -6.50325,13.17365 -21.57941,20.77499 -35.34793,17.82215 -11.72207,-2.5139 -21.58027,-9.5882 -28.79683,-20.66458 -2.24081,-3.43932 -4.2733,-6.25331 -4.51666,-6.25331 -0.70681,0 0.71696,12.36855 2.17672,18.90959 2.84299,12.73914 11.304859,24.30404 22.0274,30.10484 4.10231,2.2193 12.45749,4.8896 21.58822,6.8996 1.4227,0.3132 2.73765,1.3922 3.02207,2.4798 0.49967,1.9108 0.12309,1.9254 -49.67283,1.9254 -27.59697,0 -50.16972,-0.3231 -50.16165,-0.7181 z" id="path5891" inkscape:connector-curvature="0" sodipodi:nodetypes="ccssssssssssscsaasaasssscssssssscsc"/>
                </g>
              </svg>`
                break
        }

        let cardContent = `
            <div class="card__face card__face--front">
                <div class="card-info--top">
                    <div class="card-name-suit">
                        <div class="card-name">${dealtCard.name}</div>
                        <div>${suitIcon}</div>
                    </div>
                    <div class="card-name-suit">
                        <div class="card-name">${dealtCard.name}</div>
                        <div>${suitIcon}</div>
                    </div>
                </div>
                <div class="card-graphic">
                    <p>${dealtCard.name}</p>
                    <p>${dealtCard.suit}</p>
                </div>
                <div class="card-info--bottom">
                    <div class="card-name-suit">
                        <div class="card-name">${dealtCard.name}</div>
                        <div>${suitIcon}</div>
                    </div>
                    <div class="card-name-suit">
                        <div class="card-name">${dealtCard.name}</div>
                        <div>${suitIcon}</div>
                    </div>
                </div>
            </div>
            <div class="card__face card__face--back"></div>
        `

        card.insertAdjacentHTML('beforeend', cardContent)
        card.classList.add('card')
        hand.ui.cardsInner.appendChild(card)

        // return promise so card animations can run synchronously
        return new Promise(resolve => {
            const onAnimationEndCb = () => {
                card.removeEventListener('animationend', onAnimationEndCb)

                if (isCardFacedown) {
                    card.classList.remove('card--being-dealt-facedown')
                } else {
                    card.classList.remove('card--being-dealt')
                }

                let cardIndex = hand.ui.cardsInner.children.length - 1

                // if there's more than 1 card
                if (hand.ui.cardsInner.children.length > 1) {
                    for (const card of hand.ui.cardsInner.children) {
                        // offset nonitial cards
                        if (cardIndex !== 0) {
                            card.style.left = `${cardIndex * -2}rem`
                            cardIndex--
                        }
                    }

                    // recenter cardsInner wrapper
                    hand.ui.cardsInner.style.left = `${(hand.ui.cardsInner.children.length - 1) * 1}rem`
                }

                resolve()
            }

            card.addEventListener('animationend', onAnimationEndCb)

            if (isCardFacedown) {
                card.classList.add('card--being-dealt-facedown', 'card--facedown')   
            } else  {
                card.classList.add('card--being-dealt')   
            }

            
            
        })
    },
    dealFirstCards: async () => {
        // ace + random
        // await Game.forceCard(Player.hands[0], false, { name: 'A', suit: 'spades', graphic: '', value: 11, value1: 1, value2: 11,  isAce: true })
        // await Game.deal(Dealer.hands[0], false)
        // await Game.deal(Player.hands[0], false)
        // await Game.deal(Dealer.hands[0], true)
        // ace + ace
        // await Game.forceCard(Player.hands[0], false, { name: 'A', suit: 'spades', graphic: '', value: 11, value1: 1, value2: 11,  isAce: true })
        // await Game.deal(Dealer.hands[0], false)
        // await Game.forceCard(Player.hands[0], false, { name: 'A', suit: 'hearts', graphic: '', value: 11, value1: 1, value2: 11,  isAce: true })
        // await Game.deal(Dealer.hands[0], true)
        // random + random
        // await Game.deal(Player.hands[0], false)
        // await Game.deal(Dealer.hands[0], false)
        // await Game.deal(Player.hands[0], false)
        // await Game.deal(Dealer.hands[0], true)
        // dealer ace first card
        // await Game.deal(Player.hands[0], false)
        // await Game.forceCard(Dealer.hands[0], false, { name: 'A', suit: 'spades', graphic: '', value: 11, value1: 1, value2: 11,  isAce: true })
        // await Game.deal(Player.hands[0], false)
        // await Game.forceCard(Dealer.hands[0], true, { name: '5', suit: 'spades', graphic: '', value: 5, value1: 5, value2: 5,  isAce: false })
        // dealer ace first card, player 21
        // await Game.forceCard(Player.hands[0], false, { name: 'A', suit: 'hearts', graphic: '', value: 11, value1: 1, value2: 11,  isAce: true })
        // await Game.forceCard(Dealer.hands[0], false, { name: 'A', suit: 'spades', graphic: '', value: 11, value1: 1, value2: 11,  isAce: true })
        // await Game.forceCard(Player.hands[0], false, { name: '10', suit: 'hearts', graphic: '', value: 10, value1: 10, value2: 10,  isAce: false })
        // await Game.deal(Dealer.hands[0], true)
        // dealer 21, player random
        // await Game.deal(Player.hands[0], false)
        // await Game.forceCard(Dealer.hands[0], false, { name: 'A', suit: 'spades', graphic: '', value: 11, value1: 1, value2: 11,  isAce: true })
        // await Game.deal(Player.hands[0], false)
        // await Game.forceCard(Dealer.hands[0], true, { name: '10', suit: 'spades', graphic: '', value: 10, value1: 10, value2: 10,  isAce: false })
        // dealer 21, player 21
        // await Game.forceCard(Player.hands[0], false, { name: 'A', suit: 'hearts', graphic: '', value: 11, value1: 1, value2: 11,  isAce: true })
        // await Game.forceCard(Dealer.hands[0], false, { name: 'A', suit: 'spades', graphic: '', value: 11, value1: 1, value2: 11,  isAce: true })
        // await Game.forceCard(Player.hands[0], false, { name: '10', suit: 'hearts', graphic: '', value: 10, value1: 10, value2: 10,  isAce: false })
        // await Game.forceCard(Dealer.hands[0], true, { name: '10', suit: 'spades', graphic: '', value: 10, value1: 10, value2: 10,  isAce: false })
        // dealer ace first card, player split
        // await Game.forceCard(Player.hands[0], false, { name: '10', suit: 'spades', graphic: '', value: 10, value1: 10, value2: 10,  isAce: false })
        // await Game.forceCard(Dealer.hands[0], false, { name: 'A', suit: 'spades', graphic: '', value: 11, value1: 1, value2: 11,  isAce: true })
        // await Game.forceCard(Player.hands[0], false, { name: '10', suit: 'hearts', graphic: '', value: 10, value1: 10, value2: 10,  isAce: false })
        // await Game.deal(Dealer.hands[0], true)
        // push 17
        // await Game.forceCard(Player.hands[0], false, { name: '9', suit: 'spades', graphic: '', value: 9, value1: 9, value2: 9,  isAce: false })
        // await Game.forceCard(Dealer.hands[0], false, { name: '9', suit: 'hearts', graphic: '', value: 9, value1: 9, value2: 9,  isAce: false })
        // await Game.forceCard(Player.hands[0], false, { name: '8', suit: 'spades', graphic: '', value: 8, value1: 8, value2: 8,  isAce: false })
        // await Game.forceCard(Dealer.hands[0], true, { name: '8', suit: 'hearts', graphic: '', value: 8, value1: 8, value2: 8,  isAce: false })
        // dealer random, player split
        await Game.forceCard(Player.hands[0], false, { name: '10', suit: 'spades', graphic: '', value: 10, value1: 10, value2: 10,  isAce: false })
        await Game.deal(Dealer.hands[0], false)
        await Game.forceCard(Player.hands[0], false, { name: '10', suit: 'hearts', graphic: '', value: 10, value1: 10, value2: 10,  isAce: false })
        await Game.deal(Dealer.hands[0], true)

        Dealer.secondCard = Dealer.hands[0].ui.cardsInner.lastElementChild
    },
    discardCardLogic: (hand) => {
        // move cards to discard pile
        for (let i = 0; i < hand.cards.length; i++) {
            Game.discardedPile.push(hand.cards[i])
            hand.cards.splice(i, 1)
            i--
        }
    },
    discardCards: (hand) => {
        Game.discardCardLogic(hand)

        const cards =  Array.from(hand.ui.cardsInner.children)

        for (const card of cards) {
            card.addEventListener('transitionend', () => {
                card.remove()
            })
            card.classList.add('offscreen--discard')
        }
    },
    discardCardsWithListener: (hand) => {
        Game.discardCardLogic(hand)

        const cards =  Array.from(hand.ui.cardsInner.children)

        for (const [i, card] of cards.entries()) {
            if (i === cards.length - 1) {
                return new Promise(resolve => {
                    const onTransitionendCb = () => {
                        card.removeEventListener('transitionend', onTransitionendCb)
                        setTimeout(() => {
                            resolve()
                        }, 1)
                    }
                    card.addEventListener('transitionend', onTransitionendCb)
                    card.classList.add('offscreen--discard') 
                })
            } else {
                card.addEventListener('transitionend', () => {
                    card.remove()
                })
                card.classList.add('offscreen--discard') 
            }
        }
    },
    discardChips: (chips) => {
        for (const chip of chips) {
            chip.addEventListener('transitionend', () => {
                chip.remove()
            })
            chip.classList.add('offscreen--discard-chip') 
        }
    },
    discardChipsWithListener: (chips) => {
        for (const [i, chip] of chips.entries()) {
            if (i === chips.length - 1) {
                return new Promise(resolve => {
                    const onTransitionendCb = () => {
                        chip.remove()
                        setTimeout(() => {
                            resolve()
                        }, 1)
                    }
                    chip.addEventListener('transitionend', onTransitionendCb)
                    chip.classList.add('offscreen--discard-chip') 
                })
            } else {
                chip.addEventListener('transitionend', () => {
                    chip.remove()
                })
                chip.classList.add('offscreen--discard-chip') 
            }
        }
    },
    countHand: (hand) => {

        let containsAces = false

        // check if hand contains any aces
        for (const card of hand.cards) {
            if (card.isAce) {
                containsAces = true
                break
            }
        }

        if (containsAces) { 
            let count = 0

            let nonAceCards = hand.cards.filter((card) => {
                return card.isAce != true
            })
            let aceCards =  hand.cards.filter((card) => {
                return card.isAce == true
            })

            count = nonAceCards.reduce((total, card) => total + card.value, 0)
            let oneAceIsEleven = false

            for (const ace of aceCards) {
                // if counting an ace as 11 busts, count as 1 instead
                if (count + 11 > 21) {
                    count += 1
                } else {
                    // ace can be 11 or 1 here
                    count += 11
                    oneAceIsEleven = true
                }
            }

            // set count on hand object
            hand.count = count
            console.log(hand.count)

            // one ace is an eleven making blackjack
            if ((oneAceIsEleven && count === 21) || !oneAceIsEleven) {
                // only return the count with 21
                hand.ui.count.innerText = count
                // return count
            } else {
                if (hand == Dealer.hands[0] && count === 17) {
                    console.log('dealer has soft 17')
                    count -= 10
                    hand.count = count
                    hand.ui.count.innerText = count
                } else {
                    // -10 = counting the ace as 1 instead of 11
                    let count2 = count - 10
                    if (count > 21) {
                        hand.ui.count.innerText = `${count2}`
                    } else {
                        hand.ui.count.innerText = `${count2} / ${count}`
                        // return `${count2} / ${count}`
                    }
                }
            }

        } else {
            let count = hand.cards.reduce((total, card) => total + card.value, 0)
            hand.count = count
            hand.ui.count.innerText = count
            console.log(hand.count)
            // return count
        }
    },
    shuffle: (cards) => {
        let newPos;
        let card;
        for (let i = cards.length -1; i > 0; i--) {
            newPos = Math.floor(Math.random() * (i + 1))
            card = cards[i]
            cards[i] = cards[newPos]
            cards[newPos] = card
        }
        return cards;
    },
    dealerDraws: () => {
        // hit dealer
        if (Dealer.hands[0].count < 17) {
            Game.deal(Dealer.hands[0], false).then(() => {
                Game.countHand(Dealer.hands[0])
                // hit again
                Game.dealerDraws()
            })
        } else {
            console.log('dealer count >= 17')
            

            let animation = ''
            // set necessary animations
            if (Dealer.hands[0].count === 21) {
                animation = 'count-blackjack 1s .75s forwards'
            } else if (Dealer.hands[0].count > 21) {
                animation = 'count-bust 1s .75s forwards'
            }

            // if dealer busts or 21
            if (animation !== '') {
                UI.playAnimation(Dealer.hands[0].ui.count, animation).then(() => {
                    // check player's current hand count
                    console.log('dealer busts or 21')
                    Game.processHand()
                })
            } else {
                Game.processHand()
            }
        }
    },
    processHand: () => {
        console.log('process hand')
        // set message
        let message = ''
        // check player's current hand count
        if (Player.hands[Player.handIndex].count > 21) {
            console.log('Player hands busts, lose chips')
            message = 'Bust'
        } else if (Dealer.hands[0].count > 21) {
            console.log('Dealer busts')
            message = 'Dealer busts'
        } else if (Player.hands[Player.handIndex].count < Dealer.hands[0].count && Dealer.hands[0].count <= 21) {
            console.log('Player hands less than dealers, lose')
            message = 'Lose'
        } else if (Player.hands[Player.handIndex].count === Dealer.hands[0].count) {
            console.log('Players hand equals dealers, push')
            message = 'Push'
        } else if (Player.hands[Player.handIndex].count === 21) {
            console.log('Player 21, win')
            message = '21'
        } else {
            console.log('Players hand > dealers')
            message = 'Win'
        }

        UI.playMessage(message + '!', 'show-message 1.5s forwards').then(() => {
            // fade out bet and count
            UI.fadeOut(Player.hands[Player.handIndex].ui.bet)
            UI.fadeOut(Player.hands[Player.handIndex].ui.count)
            // move chips and cards
            let chips = Array.from(Player.hands[Player.handIndex].ui.chips.children)

            if (message === 'Bust' || message === 'Lose') {
                Game.discardChips(chips)
                Player.hands[Player.handIndex].ui.indicator.classList.add('opacity-0')
                Game.discardCards(Player.hands[Player.handIndex])
                Game.discardHand()
            } else if (message === 'Push') {
                // send chips back
                let chipsArray = Array.from(Player.hands[Player.handIndex].ui.chips.children)
                                                                            
                for (const chip of chipsArray) {
                    // move to corresponding container then remove
                    UI.moveElement(chip, document.querySelector(`#chip--${chip.dataset.chipValue}-discard`), 'bet-chip-animation', () => {
                        chip.remove()
                    })
                }

                UI.updateBank(Player.hands[Player.handIndex].bet, 1000)
                Player.hands[Player.handIndex].ui.indicator.classList.add('opacity-0')
                Game.discardCards(Player.hands[Player.handIndex])
                Game.discardHand()
            } else {
                // player wins, make chips and send to player
                console.log('make chips and send to player')

                // create won chips
                let chipsHTML  = Player.hands[Player.handIndex].ui.chips.innerHTML
                UI.dealerChipSpawn.insertAdjacentHTML('afterbegin', chipsHTML)
                
                // send chips back
                let wonChips = Array.from(UI.dealerChipSpawn.children)
                for (const chip of wonChips) {
                    // move to corresponding container then remove
                    UI.moveElement(chip, document.querySelector(`#chip--${chip.dataset.chipValue}-discard`), 'bet-chip-animation', () => {
                        chip.remove()
                    })
                }

                let handChips = Array.from(Player.hands[Player.handIndex].ui.chips.children)           
                for (const chip of handChips) {
                    // move to corresponding container then remove
                    UI.moveElement(chip, document.querySelector(`#chip--${chip.dataset.chipValue}-discard`), 'bet-chip-animation', () => {
                        chip.remove()
                    })
                }

                UI.updateBank(Player.hands[Player.handIndex].bet * 2, 1000)
                Player.hands[Player.handIndex].ui.indicator.classList.add('opacity-0')
                Game.discardCards(Player.hands[Player.handIndex])
                Game.discardHand()
            }
        })

    },
    discardHand: () => {
        // check for multiple hands
        if (Player.hands.length > 1) {
            // check if current hand is final hand
            if (Player.hands.length - 1 === Player.handIndex) {
                console.log('final hand processed')
                // reset table
                UI.playAnimation(Dealer.hands[0].ui.count, 'fading-out .5s forwards', false).then(() => {
                    Game.discardCardsWithListener(Dealer.hands[0]).then(() => {
                        // reset dealer
                        Dealer.hands[0].ui.count.innerText = ''
                        Dealer.hands[0].ui.cardsInner.removeAttribute('style')
                        Dealer.hands[0].ui.count.removeAttribute('style')
                        Dealer.hands[0].ui.count.classList.remove('fading-out')
                        Dealer.hands[0].ui.count.classList.add('hidden')
                        Dealer.hands[0].ui.cardsInner.innerHTML = ''
                        Dealer.hands[0].cards = []
                        Dealer.hands[0].count = 0
                        // reset player
                        for (const hand of Player.hands) {
                            hand.ui.div.remove()
                        }
                        Player.handIndex = -1
                        Player.hands = []
                        Player.bet = 0
                        Player.handsTrack.classList.remove('multiple-hands')
                        Player.handsTrack.removeAttribute('style')

                        UI.betAmount.innerText = '0'
                        UI.showElement(UI.bet, true)
                        UI.collapseChipsBet(false)
                        // enable & show buttons
                        UI.disableBtns(UI.chipBtns, false)  
                        UI.showElement(UI.btn.deal, true)
                    })
                })

            } else {
                console.log('more hands to process')
        
                // if not second to last hand
                if (Player.hands.length - 2 !== Player.handIndex) {
                    console.log('not second to last hand, slide hands')
                    Player.handsTrack.style.transform = `translateX(${(Player.handIndex + 1) * -50}%)`

                    // wait for slide transition
                    setTimeout(() => {
                        Player.handIndex++
                        Player.hands[Player.handIndex].ui.indicator.classList.remove('opacity-0')
                        Game.processHand()
                    }, 500);
                } else {
                    Player.handIndex++
                    Game.processHand()
                }
                 
            }
        } else {
            console.log('only 1 hand processed')
            // reset dealer
            UI.playAnimation(Dealer.hands[0].ui.count, 'fading-out .5s forwards', false).then(() => {
                Game.discardCardsWithListener(Dealer.hands[0]).then(() => {
                    // reset dealer
                    Dealer.hands[0].ui.count.innerText = ''
                    Dealer.hands[0].ui.cardsInner.removeAttribute('style')
                    Dealer.hands[0].ui.count.removeAttribute('style')
                    Dealer.hands[0].ui.count.classList.remove('fading-out')
                    Dealer.hands[0].ui.count.classList.add('hidden')
                    Dealer.hands[0].ui.cardsInner.innerHTML = ''
                    Dealer.hands[0].cards = []
                    Dealer.hands[0].count = 0
                    // reset player
                    for (const hand of Player.hands) {
                        hand.ui.div.remove()
                    }
                    Player.handIndex = -1
                    Player.hands = []
                    Player.bet = 0
                    Player.handsTrack.classList.remove('multiple-hands')
                    Player.handsTrack.removeAttribute('style')

                    UI.collapseChipsBet(false)
                    // enable & show buttons
                    UI.disableBtns(UI.chipBtns, false)  
                    UI.showElement(UI.btn.deal, true)
                })
            })
        }
    },
    playHand: () => {
        console.log('playHand')
        // BLACKJACK **********************************************************************************************
        if (Player.hands[Player.handIndex].count === 21) {

            // check if player has multiple hands
            if (Player.hands.length > 1) {
                console.log('multiple hands blackjack')
                // move to the next hand
                UI.playAnimation(Player.hands[Player.handIndex].ui.count, 'count-blackjack 1s .75s forwards')
                .then(() => {
                    Player.hands[Player.handIndex].ui.count.classList.add('green-text')
                    Game.stand()
                })
            } else {
                UI.playAnimation(Player.hands[Player.handIndex].ui.count, 'count-blackjack 1s .75s forwards')
                .then(() => {
                    Player.hands[Player.handIndex].ui.count.classList.add('green-text')
                })
                .then(() => UI.playMessage('Blackjack!', 'show-message 1.5s forwards'))
                .then(() => UI.revealDealerCard(0))
                .then(() => {

                    // count dealer hand
                    Game.countHand(Dealer.hands[0])

                    // dealer also has blackjack
                    if (Dealer.hands[0].count === 21) {

                        UI.playAnimation(Dealer.hands[0].ui.count, 'count-blackjack 1s .75s forwards')
                            .then(() => {
                                Dealer.hands[0].ui.count.classList.add('green-text')
                            })
                            .then(() => UI.playMessage('Push!', 'show-message 1.5s forwards'))                            
                            .then(() => {
                                // fade out hand bet amount & counts
                                UI.fadeOut(Player.hands[Player.handIndex].ui.bet)
                                UI.fadeOut(Player.hands[Player.handIndex].ui.count)
                                UI.playAnimation(Dealer.hands[0].ui.count, 'fading-out .5s forwards', false)
                                    .then(() => {
                                        // send chips back
                                        let chipsArray = Array.from(Player.hands[Player.handIndex].ui.chips.children)
                                                                            
                                        for (const chip of chipsArray) {
                                            // move to corresponding container then remove
                                            UI.moveElement(chip, document.querySelector(`#chip--${chip.dataset.chipValue}-discard`), 'bet-chip-animation', () => {
                                                chip.remove()
                                            })
                                        }

                                        // update bank
                                        UI.updateBank(Player.hands[Player.handIndex].bet, 1000)

                                        // discard all cards
                                        Game.discardCards(Dealer.hands[0])
                                        Game.discardCardsWithListener(Player.hands[Player.handIndex])
                                            .then(() => {
                                                // reset player
                                                Player.hands[Player.handIndex].ui.div.remove()
                                                Player.hands.pop()
                                                Player.handIndex -= 1
                                                Player.bet = 0
                                                UI.updateBet()

                                                // enable & show buttons
                                                UI.disableBtns(UI.chipBtns, false)  
                                                UI.showElement(UI.btn.deal, true)

                                                UI.collapseChipsBet(false)

                                                // reset dealer
                                                Dealer.hands[0].ui.count.innerText = ''
                                                Dealer.hands[0].ui.cardsInner.removeAttribute('style')
                                                Dealer.hands[0].ui.count.removeAttribute('style')
                                                Dealer.hands[0].ui.count.classList.remove('fading-out')
                                                Dealer.hands[0].ui.count.classList.add('hidden')
                                                
                                            })                                      
                                    })
                            })
                    } else {
                        // dealer doesn't have blackjack
                        Game.dealerDraws()
                    }
                })
            }   

        // SPLIT OPTION  
        } else if ((Player.hands[Player.handIndex].cards[0].value === Player.hands[Player.handIndex].cards[1].value) && (Player.hands[Player.handIndex].cards[0].isAce !== true)) {
            // hide deal btn
            UI.showElement(UI.btn.deal, false)
            // show split buttons
            UI.showElement(UI.splitContainer, true)
        } else {
            console.log('not 21 or split')
            // hide deal btn
            UI.showElement(UI.btn.deal, false)
            // show double stand hit btns
            UI.showElement(UI.btn.doubleStandHit, true)
        }
    },
    stand: () => {
        console.log('stand')
        // update count to single count in case of ace
        Player.hands[Player.handIndex].ui.count.innerText =  Player.hands[Player.handIndex].count
        UI.showElement(UI.btn.doubleStandHit, false)

        // if current hand is not first hand
        if (Player.handIndex !== 0) {
            // player has multiple hands
            if (Player.hands.length > 1) {
                // slide hands over if not on first two hands
                if (Player.handIndex > 1) {
                    Player.hands[Player.handIndex].ui.indicator.classList.add('opacity-0')
                    Player.handsTrack.style.transform = `translateX(${(Player.handIndex - 2) * -50}%)`
                    console.log('slid track')
                    // wait for slide transition
                    setTimeout(() => {
                        Player.handIndex--
                        Player.hands[Player.handIndex].ui.indicator.classList.remove('opacity-0')
                        Game.deal(Player.hands[Player.handIndex]).then(() => {
                            Game.countHand(Player.hands[Player.handIndex])
                            Game.playHand()
                        })
                    }, 500);
                } else {
                    Player.hands[Player.handIndex].ui.indicator.classList.add('opacity-0')
                    Player.handIndex--
                    Player.hands[Player.handIndex].ui.indicator.classList.remove('opacity-0')
                    Game.deal(Player.hands[Player.handIndex]).then(() => {
                        Game.countHand(Player.hands[Player.handIndex])
                        Game.playHand()
                    })
                }
            }
        } else {
            console.log('stand, no more hands left')

            // reveal dealer card
            UI.playMessage('Dealer\'s turn!', 'show-message 1.5s forwards').then(() => {
                UI.revealDealerCard(0).then(() => {
                    Game.countHand(Dealer.hands[0])
                    Game.dealerDraws()
                })
            }) 
        }
    },
    hit: () => {
        console.log('hit that shit')

        UI.showElement(UI.btn.doubleStandHit, false)

        Game.deal(Player.hands[Player.handIndex], false).then(() => {
            Game.countHand(Player.hands[Player.handIndex])
        })
    },
    insure: () => {
        // insurance bet is half of current bet
        // if dealer has 21 you get money back unless you have 21
        // if dealer doesn't have 21 card is not revealed and play normal hand
        UI.showElement(UI.insuranceContainer, false)
        
        // round half bet down
        let insuranceBet = Math.floor(Player.hands[0].bet / 2)
        
        let numChip1 = 0,
            numChip5 = 0,
            numChip10 = 0,
            numChip25 = 0,
            numChip100 = 0,
            remainder = insuranceBet

        // Determine smallest amount of chips to make up bet
        const countChipsForBet = () => {
            if (remainder >= 100) {
                // how many 100chips can go into remainder?
                numChip100 += Math.floor(remainder/100)
                // how much will be left over
                remainder = remainder % 100
                countChipsForBet()
            } else if (remainder >= 25) {
                numChip25 += Math.floor(remainder/25)
                remainder = remainder % 25
                countChipsForBet()
            } else if (remainder >= 10) {
                numChip10 += Math.floor(remainder/10)
                remainder = remainder % 10
                countChipsForBet()
            } else if (remainder >= 5) {
                numChip5 += Math.floor(remainder/5)
                remainder = remainder % 5
                countChipsForBet()
            } else if (remainder >= 1) {
                numChip1 += Math.floor(remainder/1)
                remainder = remainder % 1
                countChipsForBet()
            }
        }

        countChipsForBet()

        // update insurance amount
        UI.insuranceAmount.innerText = '$' + insuranceBet

        // unhide insurance
        UI.showElement(UI.insurance, true)

        // create and move chips for insurance bet
        UI.createAndMoveChips(numChip1, UI.chip1Discard, UI.insuranceChips, 1)
        UI.createAndMoveChips(numChip5, UI.chip5Discard, UI.insuranceChips, 5)
        UI.createAndMoveChips(numChip10, UI.chip10Discard, UI.insuranceChips, 10)
        UI.createAndMoveChips(numChip25, UI.chip25Discard, UI.insuranceChips, 25)
        UI.createAndMoveChips(numChip100, UI.chip100Discard, UI.insuranceChips, 100)

        // update bank
        UI.updateBank(-insuranceBet, 1000)

        // dealer has blackjack
        if (Dealer.hands[0].cards[1].value == 10) {
            // reveal dealer's second card
            UI.revealDealerCard(1.5).then(() => {
                Game.countHand(Dealer.hands[0])
                UI.playAnimation(Dealer.hands[0].ui.count, '1s .75s forwards count-blackjack')
                    .then(() => {
                        Dealer.hands[0].ui.count.classList.add('green-text')
                    })
                    .then(() => {
                        UI.playMessage('Blackjack!', 'show-message 1.5s forwards').then(() => {
                            UI.playMessage('Insurance won!', 'show-message 1.5s forwards').then(() => {
                                // fade out hand bet amount & counts
                                UI.fadeOut(Player.hands[0].ui.bet)
                                UI.fadeOut(UI.insuranceAmount)
                                UI.fadeOut(Player.hands[0].ui.count)
                                UI.playAnimation(Dealer.hands[0].ui.count, 'fading-out .5s forwards', false)
                                    .then(() => {
                                        // send chips back                                       
                                        let betChips = Array.from(Player.hands[0].ui.chips.children)
                                        let insuranceChips = Array.from(UI.insuranceChips.children)
                                        let chips = betChips.concat(insuranceChips)
                                        chips.forEach(chip => {
                                            UI.moveElement(chip, document.querySelector(`#chip--${chip.dataset.chipValue}-discard`), 'bet-chip--moving-to-hand', () => {
                                                chip.remove()
                                            })
                                        })
        
                                        // update bank
                                        UI.updateBank(Player.hands[0].bet + insuranceBet, 1000)
        
                                        // discard all cards
                                        Game.discardCards(Dealer.hands[0])
                                        Game.discardCardsWithListener(Player.hands[0])
                                            .then(() => {
                                                // reset player
                                                Player.hands[0].ui.div.remove()
                                                Player.hands.pop()
                                                Player.handIndex -= 1
                                                Player.bet = 0
                                                UI.updateBet()
        
                                                // enable & show buttons
                                                UI.disableBtns(UI.chipBtns, false)  
                                                UI.showElement(UI.btn.deal, true)
        
                                                UI.collapseChipsBet(false)
        
                                                // reset dealer
                                                Dealer.hands[0].ui.count.innerText = ''
                                                UI.insuranceAmount.innerText = ''
                                                Dealer.hands[0].ui.cardsInner.removeAttribute('style')
                                                Dealer.hands[0].ui.count.removeAttribute('style')
                                                Dealer.hands[0].ui.count.classList.remove('fading-out')
                                                UI.insuranceAmount.classList.remove('fading-out')
                                                Dealer.hands[0].ui.count.classList.add('hidden')
                                                UI.insurance.classList.add('hidden')
                                            })
                                    })
                            })
                        })

                    })
            })
        } else {
            // lose insurance bet
            UI.playAnimation(Dealer.secondCard, '1s 1.5s tilt-card').then(() => {
                UI.playMessage('Insurance lost!', '1.5s forwards show-message').then(() => {
                    UI.fadeOut(UI.insuranceAmount)

                    let chips = Array.from(UI.insuranceChips.children)
                    
                    Game.discardChipsWithListener(chips).then(() => {
                        UI.insuranceAmount.innerText = ''
                        UI.insurance.classList.add('hidden')
                        UI.showElement(UI.btn.doubleStandHit, true)
                    })
                })
            })
        }

    },
    double: () => {
        // hide double stand hit buttons
        UI.showElement(UI.btn.doubleStandHit, false)

        // grab current bet chips
        let betChips = Array.from(Player.hands[Player.handIndex].ui.chips.children)

        // count number of each type of chip
        let numChip1 = 0,
            numChip5 = 0,
            numChip10 = 0,
            numChip25 = 0,
            numChip100 = 0

        for (const chip of betChips) {
            switch (chip.dataset.chipValue) {
                case '1':
                    numChip1++
                    break;
                case '5':
                    numChip5++
                    break;
                case '10':
                    numChip10++
                    break;
                case '25':
                    numChip25++
                    break;
                case '100':
                    numChip100++
                    break;
            }
        }

        // create chips and move to bet hand chips
        UI.createAndMoveChips(numChip1, UI.chip1Discard, Player.hands[Player.handIndex].ui.chips, 1)
        UI.createAndMoveChips(numChip5, UI.chip5Discard, Player.hands[Player.handIndex].ui.chips, 5)
        UI.createAndMoveChips(numChip10, UI.chip10Discard, Player.hands[Player.handIndex].ui.chips, 10)
        UI.createAndMoveChips(numChip25, UI.chip25Discard, Player.hands[Player.handIndex].ui.chips, 25)
        UI.createAndMoveChips(numChip100, UI.chip100Discard, Player.hands[Player.handIndex].ui.chips, 100)

        // update bank and double bet
        UI.updateBank(-Player.hands[Player.handIndex].bet, 1000)
        Player.hands[Player.handIndex].bet *= 2
        Player.hands[Player.handIndex].ui.bet.innerText = '$' + Player.hands[Player.handIndex].bet

        // Deal one card to player's hand
        Game.deal(Player.hands[Player.handIndex]).then(() => {
            // update count
            Game.countHand(Player.hands[Player.handIndex])
            // no count animation has to play
            if (Player.hands[Player.handIndex].count < 21) {
                // check if player havse multiple hands
                if (Player.hands.length > 1) {
                    console.log('player has multiple hands, move to next hand')
                } else {
                    console.log('only hand. process dealer hand')
                    // reveal dealer's second card
                    UI.revealDealerCard(1.5).then(() => {
                        Game.countHand(Dealer.hands[0])
                        Game.dealerDraws()
                    })
                }
            } else {
                // check if 21 or bust for proper count animation
                let animation = ''
                if (Player.hands[Player.handIndex].count === 21) {
                    animation = 'count-blackjack 1s .75s forwards'

                } else if (Player.hands[Player.handIndex].count > 21) {
                    animation = 'count-bust 1s .75s forwards'
                }

                UI.playAnimation(Player.hands[Player.handIndex].ui.count, animation)
                    .then(() => {
                        if (animation === 'count-blackjack 1s .75s forwards') {
                            Player.hands[Player.handIndex].ui.count.classList.add('green-text')
                        } else {
                            Player.hands[Player.handIndex].ui.count.classList.add('red-text')
                        }
                    })
                    .then(() => {
                        // check if player havse multiple hands
                        if (Player.hands.length > 1) {
                            console.log('player has multiple hands, move to next hand')
                        } else {
                            // reveal dealer's second card
                            UI.revealDealerCard(1.5).then(() => {
                                Game.countHand(Dealer.hands[0])
                                Game.dealerDraws()
                            })
                        }
                    })
            }
        })
    },
    split: () => {
        console.log('split')

        UI.showElement(UI.splitContainer, false)
        UI.updateBank(-Player.hands[Player.handIndex].bet, 1000)

        // player has one hand
        if (Player.hands.length === 1) {
            Player.handsTrack.classList.add('multiple-hands')
        } else {
            // hide current hand indicator
            Player.hands[Player.handIndex].ui.indicator.classList.add('opacity-0')
            // slide hands track because there are at least 3 hands
            // Player.handsTrack.style.transform = `translateX(${(Player.hands.length - 1) * -50}%)`
        }

        // make new hand
        Player.createHand(Player.hands[Player.handIndex].bet)
        // move card of hand being split to new hand
        let newHand =  Player.hands[Player.handIndex]
        let originalHand = Player.hands[Player.handIndex - 1]
        let splitCard = originalHand.cards.pop()
        Player.hands[Player.handIndex].cards.push(splitCard)

        // count number of each chip from original hand
        let numChip1 = 0,
            numChip5 = 0,
            numChip10 = 0,
            numChip25 = 0,
            numChip100 = 0

        let originalChips = Array.from(originalHand.ui.chips.children)

        for (const chip of originalChips) {
            switch (chip.dataset.chipValue) {
                case '1':
                    numChip1++
                    break
                case '5':
                    numChip5++
                    break
                case '10':
                    numChip10++
                    break
                case '25':
                    numChip25++
                    break
                case '100':
                    numChip100++
                    break
            }
        }

        // reset card offset in original hand
        originalHand.ui.cardsInner.firstElementChild.removeAttribute('style')

        // update original hand count
        Game.countHand(originalHand)

        // create and move the chips to new hand
        UI.createAndMoveChips(numChip1, UI.chip1Discard, newHand.ui.chips, 1)
        UI.createAndMoveChips(numChip5, UI.chip5Discard, newHand.ui.chips, 5)
        UI.createAndMoveChips(numChip10, UI.chip10Discard, newHand.ui.chips, 10)
        UI.createAndMoveChips(numChip25, UI.chip25Discard, newHand.ui.chips, 25)
        UI.createAndMoveChips(numChip100, UI.chip100Discard, newHand.ui.chips, 100)

        // move card in DOM
        UI.moveElement(originalHand.ui.cardsInner.lastElementChild, newHand.ui.cardsInner, 'splitting-card', () => {
            // delay dealing card
            setTimeout(() => {
                // deal card
                Game.deal(newHand, false).then(() => {
                    // reveal indicator
                    newHand.ui.indicator.classList.remove('opacity-0')
                    // reveal count
                    Game.countHand(newHand)
                    newHand.ui.count.classList.toggle('hidden')
                    Game.countHand(newHand)
                    Game.playHand()
                })
            }, 750);
        })
    }
}

document.body.addEventListener('click', (e) => {
    e.preventDefault()

    // initial deal
    if (e.target == UI.btn.deal) {

        UI.showElement(UI.btn.deal, false)

        // disable buttons
        UI.disableBtns(UI.chipBtns, true)
        UI.disableBetChips()
        UI.disableDealBtn(true)
        UI.collapseChipsBet(true)

        // hide bet amount
        UI.showElement(UI.bet, false)

        // create hand
        Player.createHand(Player.bet)

        // get all bet chips and move to hand
        let betChips = document.querySelectorAll('.bet-chip-wrapper .chip-bet')
        betChips.forEach(chip => {
            UI.moveElement(chip, Player.hands[0].ui.chips, 'bet-chip--moving-to-hand', () => {})
        })

        // deal initial cards
        Game.dealFirstCards().then(() => {          

            // write count of dealer's first card
            if (Dealer.hands[0].cards[0].name === 'A') {
                Dealer.hands[0].ui.count.innerText = `1 / 11`
            } else {
                Dealer.hands[0].ui.count.innerText = Dealer.hands[0].cards[0].value
            }

            // count cards in player's hand
            Game.countHand(Player.hands[0])

            // show count bubbles
            Dealer.hands[0].ui.count.classList.toggle('hidden')
            Player.hands[0].ui.count.classList.toggle('hidden')

            // hide double button if player doesn't have enough money
            if (Player.bank < Player.hands[0].bet) {
                UI.showElement(UI.btn.double, false)
            } else {
                UI.showElement(UI.btn.double, true)
            }

            // Insurance check (dealer's first card is ace + player has enough $)
            if (Dealer.hands[0].cards[0].name == 'A' && Player.bank >= Math.floor(Player.hands[0].bet / 2)) {
                // offer insurance
                UI.showElement(UI.insuranceContainer, true)
            } else {
                // Play player's first hand
                Game.playHand()
            }
        })

    } else if (e.target == UI.btn.insuranceYes) {
        Game.insure()
    } else if (e.target == UI.btn.insuranceNo) {
        // hide insurance container
        UI.showElement(UI.insuranceContainer, false)
        // play hand
        Game.playHand()
    } else if (e.target == UI.btn.splitYes) {
        Game.split()
    } else if (e.target == UI.btn.splitNo) {
        // hide split container
        UI.showElement(UI.splitContainer, false)
        // show double stand hit buttons
        UI.showElement(UI.btn.doubleStandHit, true)
    } else if (e.target == UI.btn.double) {
        Game.double()
    } else if (e.target == UI.btn.stand) {
        Game.stand()
    } else if (e.target == UI.btn.hit) {
        Game.hit()
    } else if (e.target == UI.btn.chip1) {
        if (Player.bank >= 1) {
            UI.betChip(1, UI.chip1Wrapper, UI.chip1Discard)
        } else {
            console.log('You dont have $1!')
        }
    } else if (e.target == UI.btn.chip5) {
        if (Player.bank >= 5) {
            UI.betChip(5, UI.chip5Wrapper, UI.chip5Discard)
        } else {
            console.log('You dont have $5!')
        }
    } else if (e.target == UI.btn.chip10) {
        if (Player.bank >= 10) {
            UI.betChip(10, UI.chip10Wrapper, UI.chip10Discard)
        } else {
            console.log('You dont have $10!');
        }
    } else if (e.target == UI.btn.chip25) {
        if (Player.bank >= 25) {
            UI.betChip(25, UI.chip25Wrapper, UI.chip25Discard)
        } else {
            console.log('You dont have $25!');
        }
    } else if (e.target == UI.btn.chip100) {
        if (Player.bank >= 100) {
            UI.betChip(100, UI.chip100Wrapper, UI.chip100Discard)
        } else {
            console.log('You dont have $100!')
        }
    }
})

// Shuffle deck at first load
// Game.deck = Game.shuffle(Game.deck)

// shuffle the deck array
// function shuffleDeck(deck) {
//     let newPos
//     let card
//     for (let i = deck.length -1; i > 0; i--) {
//         newPos = Math.floor(Math.random() * (i + 1))
//         card = deck[i]
//         deck[i] = deck[newPos]
//         deck[newPos] = card
//     }
//     return deck;
// }

// calculates sum of an array of cards point values
// function calccount1(cardsArray) {
//     return cardsArray.reduce((total, card) => total + card.points, 0)
// }

// const testBtn = document.querySelector('.test-btn')
// const testWrap1 = document.querySelector('.test-wrap-1')
// const testWrap2 = document.querySelector('.test-wrap-2')
// const test = document.querySelector('.test')

// testBtn.addEventListener('click', () => {
//     UI.moveElement(test, testWrap2, 'bet-chip-animation', () => {
//         console.log('moved element')
//     })
// })


// let onceTransitionEnd = (el, transition) => {
//     return new Promise(resolve => {
//       const onTransitionEndCb = () => {
//         el.removeEventListener('transitionend', onTransitionEndCb);
//         resolve();
//       }
//       el.addEventListener('transitionend', onTransitionEndCb)
//       el.style.transition = transition;
//     });
//   }
  
//   let move_box_one = async () => {
//     const el = document.getElementById('div_one');
//     await onceTransitionEnd(el, 'move 3s forwards');
//   }
//   let move_box_two = async () => {
//     const el = document.getElementById('div_two');
//     await onceTransitionEnd(el, 'move 3s forwards');
//   }
  
//   let move_boxes = async () => {
//     await move_box_one();
//     await move_box_two();
//   }
//   move_boxes().then(() => console.log('boxes moved'));

// // We can declare a generic helper method for one-time animationend listening
// let onceAnimationEnd = (el, animation) => {
//     return new Promise(resolve => {
//       const onAnimationEndCb = () => {
//         el.removeEventListener('animationend', onAnimationEndCb);
//         resolve();
//       }
//       el.addEventListener('animationend', onAnimationEndCb)
//       el.style.animation = animation;
//     });
//   }
  
//   let move_box_one = async () => {
//     const el = document.getElementById('div_one');
//     await onceAnimationEnd(el, 'move 3s forwards');
//   }
//   let move_box_two = async () => {
//     const el = document.getElementById('div_two');
//     await onceAnimationEnd(el, 'move 3s forwards');
//   }
  
//   let move_boxes = async () => {
//     await move_box_one();
//     await move_box_two();
//   }
//   move_boxes().then(() => console.log('boxes moved'));