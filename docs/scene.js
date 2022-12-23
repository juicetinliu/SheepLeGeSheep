class Scene {
    constructor(sceneGenerator = null) {
        this.allCardContainers = [];
        this.cardScoreboard = new CardScoreboard();
        this.sceneGenerator = sceneGenerator;
    }

    createScene() {
        if(this.sceneGenerator) {
            this.allCardContainers = this.sceneGenerator.generateScene();
        } else {
            this.allCardContainers = this.generateCardsLayoutDemo();
        }

        this.rankContainers();
        this.allCardContainers.sort((a, b) => a.rank - b.rank);
    }

    generateCardsLayoutDemo() {
        let cardContainers = [];

        let testContainerBottom = new CardContainer(200, 160);
        testContainerBottom.placeCard(new Card());
        cardContainers.push(testContainerBottom);

        let testContainerTopA = new CardContainer(180, 150);
        testContainerTopA.placeCard(new Card(1));
        testContainerTopA.placeAbove(testContainerBottom);
        cardContainers.push(testContainerTopA);

        let testContainerTopB = new CardContainer(220, 150);
        testContainerTopB.placeCard(new Card(1));
        testContainerTopB.placeAbove(testContainerBottom);
        cardContainers.push(testContainerTopB);

        let testContainerTopMost = new CardContainer(200, 140);
        testContainerTopMost.placeCard(new Card());
        testContainerTopMost.placeAbove(testContainerTopA);
        testContainerTopMost.placeAbove(testContainerTopB);
        cardContainers.push(testContainerTopMost);

        let testContainerTopMostMost = new CardContainer(200, 130);
        testContainerTopMostMost.placeCard(new Card(1));
        testContainerTopMostMost.placeAbove(testContainerTopMost);
        cardContainers.push(testContainerTopMostMost);

        return cardContainers;
    }

    rankContainers() {
        if(!this.allCardContainers.length) return;

        let allContainers = Array.from(this.allCardContainers);

        let currContainer = allContainers.pop();

        currContainer.isRanked = true;

        while(allContainers.length) {
            currContainer.above.forEach(cardAbove => {
                if(!cardAbove.isRanked) {
                    cardAbove.rank = currContainer.rank + 1;
                    cardAbove.isRanked = true;
                }
            });
            currContainer.below.forEach(cardBelow => {
                if(!cardBelow.isRanked) {
                    cardBelow.rank = currContainer.rank - 1;
                    cardBelow.isRanked = true;
                }
            });
            
            currContainer = allContainers.pop();
        }
    }

    render() {
        let anyCardsLeft = false;
        this.allCardContainers.forEach(container => {
            if(container.isActive) anyCardsLeft = true;
        });
        
        if(anyCardsLeft) {
            this.allCardContainers.forEach(container => {
                container.render();
            });
        } else {
            textAlign(CENTER);
            textSize(24);
            fill(255);
            text("YOU ARE 羊", width/2, 200);
        }

        this.cardScoreboard.render();
    }

    interactWithCards() {
        let interactedCard = null;
        this.allCardContainers.forEach(container => {
            if(!interactedCard) {
                let interactedContainer = container.interact();
                if(interactedContainer) {
                    interactedCard = interactedContainer.card;
                }
            }
        });

        if(interactedCard) {
            this.cardScoreboard.addCard(interactedCard);
        }
    }
}

class SceneGenerator {
    constructor() {}

    generateScene() {
        let cardContainers = [];
        return cardContainers;
    }
}

class GridSceneGenerator extends SceneGenerator {
    constructor() {
        super();
    }

    generateScene() {
        let cardContainers = [];

        for(let x = 0; x < 3; x++) {
            let xplace = 130 + x * 70;
            for(let y = 0; y < 3; y++) {
                let yplace = 100 + y * 70;
                let testContainerBottom = new CardContainer(xplace, yplace);
                cardContainers.push(testContainerBottom);

                let testContainerMiddle = new CardContainer(xplace, yplace + 5);
                testContainerMiddle.placeAbove(testContainerBottom);
                cardContainers.push(testContainerMiddle);

                let testContainerTop = new CardContainer(xplace, yplace + 10);
                testContainerTop.placeAbove(testContainerMiddle);
                cardContainers.push(testContainerTop);
            }    
        }

        let cardsToBePlaced = this.randomize27Cards();

        cardContainers.forEach(container => {
            container.placeCard(cardsToBePlaced.pop())
        });

        return cardContainers;
    }

    randomize27Cards() {
        let cardTypes = [];

        for(let i = 0; i < 3; i++) {
            for(let j = 0; j < 9; j++) {
                cardTypes.push(i);
            }
        }

        let randomizedCardTypes = [];

        while(cardTypes.length) {
            randomizedCardTypes.push(cardTypes.splice(parseInt(Math.random() * cardTypes.length), 1)[0]);
        }

        let randomized27Cards = [];

        randomizedCardTypes.forEach(cardType => {
            randomized27Cards.push(new Card(cardType));
        })

        return randomized27Cards;
    }
}

class CardContainer {
    constructor(x = 0, y = 0) {
        this.card = null;
        this.x = x;
        this.y = y;
        this.above = [];
        this.below = [];
        this.rank = 0;
        this.isRanked = false;
        this.isActive = true;
        // this.debug = true;
    }

    placeCard(card) {
        this.card = card;
        card.placeInContainer(this);
    }

    placeAbove(cardContainer) {
        this.below.push(cardContainer);
        cardContainer.above.push(this);
    }

    placeBelow(cardContainer) {
        this.above.push(cardContainer);
        cardContainer.below.push(this);
    }

    render() {
        if(this.isActive && this.card) {
            push();
            translate(this.x, this.y);
            this.card.render(this.isInteractable());
            pop();
        }
        if(this.debug) {
            push();
            translate(this.x, this.y);
            stroke(255);
            noFill();
            rect(-1, -1, CARD.WIDTH + 2, CARD.HEIGHT + 2, CARD.CORNER_RADIUS);
            pop();
        }
    }

    isInteractable() {
        if(!this.above) return true;

        if(!this.isActive) return false;

        let aboveInteractable = false;
        this.above.forEach(cardAbove => {
            if(cardAbove.isActive) {
                aboveInteractable = true;
            }
        })

        return !aboveInteractable;
    }

    interact() {
        if(this.isInteractable()) {
            if(this.card && this.card.mouseWithin()) {
                this.isActive = false;
                return this;
            }
        }
        return null;
    }
}

class CardScoreboard {
    constructor(numberOfSlots = 7) {
        this.numberOfSlots = numberOfSlots;
        this.cards = [];
        this.cardBuckets = {};

        this.spacing = 10;
        this.width = this.numberOfSlots * CARD.WIDTH + (this.numberOfSlots + 1) * this.spacing;
        this.height = CARD.HEIGHT + 2 * this.spacing;

        this.x = width/2;
        this.y = height - (this.x - this.width/2) - this.height/2;
    }

    render() {
        stroke(255);
        noFill();
        rect(this.x,this.y, this.width, this.height, CARD.CORNER_RADIUS);
        this.cards.forEach((card, index) => {
            push();
            translate((this.x - this.width/2) + this.spacing + CARD.WIDTH/2 + (index * (CARD.WIDTH + this.spacing)), this.y);
            card.render();
            pop();
        })
    }

    addCard(card) {
        this.cards.push(card);
        if(!this.cardBuckets[card.cardType]) {
            this.cardBuckets[card.cardType] = [card];
        } else {
            this.cardBuckets[card.cardType].push(card);
        }
        this.processCards();
    }

    processCards() {
        Object.entries(this.cardBuckets).forEach((cardTypeReferences) => {
            let cardType = cardTypeReferences[0];
            let cards = cardTypeReferences[1];

            if(cards.length === 3) {
                for(let i = this.cards.length - 1; i >= 0; i--) {
                    if(this.cards[i].cardType == cardType) {
                        this.cards.splice(i, 1);
                    }
                }
                this.cardBuckets[cardType] = [];
            }
        })
    }
}