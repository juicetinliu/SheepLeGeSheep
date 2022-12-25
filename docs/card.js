const CARD = {
    WIDTH: 40,
    HEIGHT: 50,
    CORNER_RADIUS: 5,
    NUMBER_OF_CARD_TYPES: 6,
}

class Card {
    constructor(id, cardType = 0) { 
        this.id = id;
        this.cardType = parseInt(cardType);
        this.cardWidth = CARD.WIDTH;
        this.cardHeight = CARD.HEIGHT;
        this.cardCorner = CARD.CORNER_RADIUS;
        this.x = 0;
        this.y = 0;
    }

    render(cardFaceProvider, isHighlightable = false, isActive = true) {
        cardFaceProvider.render(this);

        strokeWeight(2);
        stroke(0);
        if(isHighlightable && this.mouseWithin()) {
            strokeWeight(3);
            stroke(255);
        }
        noFill();
        rect(0, 0, this.cardWidth, this.cardHeight, this.cardCorner);

        if(!isActive) {
            noStroke();
            fill(0, 100);
            rect(0, 0, this.cardWidth, this.cardHeight, this.cardCorner);
        }
    }

    placeInContainer(cardContainer) {
        this.x = cardContainer.x;
        this.y = cardContainer.y;
    }

    mouseWithin() {
        return pointInRect(mouseX, mouseY, this.x, this.y, CARD.WIDTH, CARD.HEIGHT);
    }
}


class CardFaceProvider {
    constructor() {
        this.numberOfFaces = CARD.NUMBER_OF_CARD_TYPES;
    }

    setup() {
    }

    render(card) {
        fill(255);
        noStroke();
        rect(0, 0, card.cardWidth, card.cardHeight, card.cardCorner);
    }
}

class ColorFaceProvider extends CardFaceProvider {
    constructor() {
        super();
        this.colors = [color(255, 0, 0), color(0, 255, 0), color(0, 0, 255), color(255, 255, 0), color(0, 255, 255), color(255, 0, 255)];
    }

    render(card) {
        fill(this.colors[card.cardType]);
        noStroke();
        rect(0, 0, card.cardWidth, card.cardHeight, card.cardCorner);
    }
}

class ImageFaceProvider extends CardFaceProvider {
    constructor() {
        super();
        this.imageRefs = ['5', '6', '7', '8', '9', '10'];
        this.faceImages = [];
        this.doneSetup = false;
    }

    setup() {
        if(!this.doneSetup) {
            this.imageRefs.forEach(imageRef => {
                this.faceImages.push(loadImage('faces/' + imageRef + '.png'));
            });
            this.doneSetup = true;
        }
    }

    render(card) {
        let faceImage = this.faceImages[card.cardType];

        image(faceImage, 0, 0, card.cardWidth - 2, card.cardHeight - 2, 0, 0, faceImage.width, faceImage.height);
    }
}