const Player = {
    bank: 1000,
    handIndex: -1,
    hands: [],
    handsDiv: document.getElementById('player-hands'),
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

        Player.hands.push(hand)

        hand.ui.div.classList.add('hand')
        hand.ui.bet.classList.add('hand-bet-amount')
        hand.ui.chips.classList.add('hand-chips')
        hand.ui.cards.classList.add('hand-cards')
        hand.ui.cardsInner.classList.add('hand-cards-inner')
        hand.ui.count.classList.add('hand-card-count', 'hidden')
        hand.ui.indicator.classList.add('hand-indicator')

        hand.ui.div.appendChild(hand.ui.bet)
        hand.ui.div.appendChild(hand.ui.chips)
        hand.ui.div.appendChild(hand.ui.cards)
        hand.ui.cards.appendChild(hand.ui.cardsInner)
        hand.ui.cards.appendChild(hand.ui.count)
        hand.ui.div.appendChild(hand.ui.indicator)
        Player.handsDiv.appendChild(hand.ui.div)

        Player.handIndex++
    }
}