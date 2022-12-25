class Scene {
    constructor(sceneGenerator = null) {
        this.sceneButtons = [];
        this.allCardContainers = [];
        this.cardScoreboard = new CardScoreboard();

        this.colorFaceProvider = new ColorFaceProvider();
        this.imageFaceProvider = new ImageFaceProvider();

        this.cardFaceProvider = this.colorFaceProvider;
        this.sceneGenerator = sceneGenerator;

        this.resetButton = new TextButton(this.sceneButtons, width/2, height/2, 100, 50, CARD.CORNER_RADIUS, "RESET");
        this.resetButton.disable();
        this.resetButton.onClick(() => {
            this.reset();
            this.createScene();
        });
        
        this.imageFacesButton = new IconButton(this.sceneButtons, width-50, height-120, 40, 40, CARD.CORNER_RADIUS, "face");
        this.imageFacesButton.disable();

        this.colorFacesButton = new IconButton(this.sceneButtons, width-50, height-120, 40, 40, CARD.CORNER_RADIUS, "color");
        this.colorFacesButton.enable();

        this.imageFacesButton.onClick(() => {
            this.toggleCardFaceProvider();
            return true;
        });

        this.colorFacesButton.onClick(() => {
            this.toggleCardFaceProvider();
            return true;
        });

        this.isColorFaceProvider = true;

        this.notLosing = true;
    }

    setup() {
        this.reset();
        this.colorFaceProvider.setup();
        this.imageFaceProvider.setup();
        this.createScene();
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
        this.notLosing = true;
    }

    toggleCardFaceProvider() {
        this.isColorFaceProvider = !this.isColorFaceProvider;
        if (this.isColorFaceProvider) {
            this.cardFaceProvider = this.colorFaceProvider;
            this.colorFacesButton.enable();
            this.imageFacesButton.disable();
        } else { 
            this.cardFaceProvider = this.imageFaceProvider;
            this.imageFacesButton.enable();
            this.colorFacesButton.disable();
        }
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

        let unRankedContainers = Array.from(this.allCardContainers);

        
        let toCheckContainers = [];
        let nextCheckContainers = [];

        unRankedContainers.forEach(container => {
            if(!container.above.length && container.below.length) {
                //these are the topmost containers
                container.isRanked = true;
                toCheckContainers.push(container);
            } else {
                nextCheckContainers.push(container);
            }
        });
        
        while(nextCheckContainers.length) {
            toCheckContainers.forEach(containerToCheck => {
                containerToCheck.below.forEach(cardContainerBelow => {
                    if(!cardContainerBelow.isRanked) {
                        cardContainerBelow.rank = containerToCheck.rank - 1;
                    }
                });
            });

            toCheckContainers = [];
            let tempNextCheckContainers = [];

            nextCheckContainers.forEach(containerToCheck => {
                let isAboveAllRanked = containerToCheck.above.reduce((a, b) => {return a && b.isRanked}, true);
                if(isAboveAllRanked) {
                    containerToCheck.isRanked = true;
                    toCheckContainers.push(containerToCheck);
                } else {
                    tempNextCheckContainers.push(containerToCheck);
                }
            });
            nextCheckContainers = tempNextCheckContainers;
        }
    }

    render() {
        let anyCardsLeft = false;
        this.allCardContainers.forEach(container => {
            if(container.isActive) anyCardsLeft = true;
        });

        if(this.notLosing) {
            if(anyCardsLeft) {
                this.allCardContainers.forEach(container => {
                    container.render(this.cardFaceProvider);
                });
            } else {
                textSize(24);
                fill(255);
                noStroke();
                text("YOU ARE 羊", width/2, 200);

                this.resetButton.enable();
            }
        } else {
            textSize(24);
            fill(255);
            noStroke();
            text("YOU ARE NOT 羊", width/2, 200);

            this.resetButton.enable();
        }

        this.sceneButtons.forEach(button => {
            button.render();
        });

        this.cardScoreboard.render(this.cardFaceProvider);
    }

    interact() {
        if(this.notLosing) {
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
                this.notLosing = this.cardScoreboard.addCard(interactedCard);
            }
        }

        let buttonPressed = false;
        this.sceneButtons.forEach(button => {
            if(!buttonPressed) {
                buttonPressed = button.interact() || buttonPressed;
            }
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

    getMapOfAllCardContainerIdsBelow(out = {}) {
        if(this.below.length) {
            this.below.forEach(belowContainer => {
                out[belowContainer.id] = true;
                let otherBelowIds = belowContainer.getMapOfAllCardContainerIdsBelow(out);
                out = {
                    ...out,
                    ...otherBelowIds
                }
            });
        }

        return out;
    }

    render(cardFaceProvider, showBorder = false) {
        let isInteractable = this.isInteractable();
        if(this.isActive && this.card) {
            push();
            translate(this.x, this.y);
            this.card.render(cardFaceProvider, isInteractable && !isMobileOrTablet, isInteractable);
            pop();
        }
        if(this.debug || showBorder) {
            push();
            translate(this.x, this.y);
            stroke(255);
            strokeWeight(1);
            noFill();
            rect(0, 0, CARD.WIDTH + 2, CARD.HEIGHT + 2, CARD.CORNER_RADIUS);
            if(this.debug) {
                fill(255);
                textSize(24);
                text(this.rank, 0, 0);
            }
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

    render(cardFaceProvider) {
        stroke(255);
        strokeWeight(1);
        noFill();
        rect(this.x,this.y, this.width, this.height, CARD.CORNER_RADIUS);
        this.cards.forEach((card, index) => {
            push();
            translate((this.x - this.width/2) + this.spacing + CARD.WIDTH/2 + (index * (CARD.WIDTH + this.spacing)), this.y);
            card.render(cardFaceProvider);
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

        return this.cards.length < this.numberOfSlots;
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