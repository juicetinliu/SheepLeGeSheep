class Scene {
    constructor(sceneGenerator = null) {
        this.sceneButtons = [];
        this.allCardContainers = [];
        this.cardScoreboard = new CardScoreboard();
        this.sceneGenerator = sceneGenerator;

        this.resetButton = new SceneButton(this, width/2, height/2, 100, 50, CARD.CORNER_RADIUS, "RESET");
        this.resetButton.disable();
        this.resetButton.onClick(() => {
            this.reset();
            this.createScene();
        });
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

    reset() {
        this.allCardContainers = [];
        this.cardScoreboard.reset();
        this.resetButton.disable();
    }

    generateCardsLayoutDemo() {
        let cardContainers = [];

        let testContainerBottom = new CardContainer(0, 200, 160);
        testContainerBottom.placeCard(new Card(0));
        cardContainers.push(testContainerBottom);

        let testContainerTopA = new CardContainer(1, 180, 150);
        testContainerTopA.placeCard(new Card(1,1));
        testContainerTopA.placeAbove(testContainerBottom);
        cardContainers.push(testContainerTopA);

        let testContainerTopB = new CardContainer(2, 220, 150);
        testContainerTopB.placeCard(new Card(2,1));
        testContainerTopB.placeAbove(testContainerBottom);
        cardContainers.push(testContainerTopB);

        let testContainerTopMost = new CardContainer(3, 200, 140);
        testContainerTopMost.placeCard(new Card(3));
        testContainerTopMost.placeAbove(testContainerTopA);
        testContainerTopMost.placeAbove(testContainerTopB);
        cardContainers.push(testContainerTopMost);

        let testContainerTopMostMost = new CardContainer(4, 200, 130);
        testContainerTopMostMost.placeCard(new Card(4,1));
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
            textSize(24);
            fill(255);
            text("YOU ARE 羊", width/2, 200);

            this.resetButton.enable();
        }

        this.sceneButtons.forEach(button => {
            button.render();
        });

        this.cardScoreboard.render();
    }

    interact() {
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

        this.sceneButtons.forEach(button => {
            button.interact();
        });
    }
}

class CardContainer {
    constructor(id, x = 0, y = 0) {
        this.id = id;
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

    render() {
        let isInteractable = this.isInteractable();
        if(this.isActive && this.card) {
            push();
            translate(this.x, this.y);
            this.card.render(isInteractable && !isMobileOrTablet, isInteractable);
            pop();
        }
        if(this.debug) {
            push();
            translate(this.x, this.y);
            stroke(255);
            noFill();
            rect(0, 0, CARD.WIDTH + 2, CARD.HEIGHT + 2, CARD.CORNER_RADIUS);
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

    reset() {
        this.cards = [];
        this.cardBuckets = {};
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
                    if(this.cards[i].cardType === parseInt(cardType)) {
                        this.cards.splice(i, 1);
                    }
                }
                this.cardBuckets[cardType] = [];
            }
        })
    }
}