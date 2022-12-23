const CARD = {
    WIDTH: 40,
    HEIGHT: 50,
    CORNER_RADIUS: 5
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


    render(isHighlightable = false, isActive = true) {
        strokeWeight(1);
        stroke(0);
        if(isHighlightable && this.mouseWithin()) {
            strokeWeight(2);
            stroke(255);
        }
        switch(this.cardType) {
            case 0:
                fill(255, 255, 0);
                break;
            case 1:
                fill(0, 255, 255);
                break;
            case 2:
                fill(255, 0, 255);
                break;
            default:
                fill(255);
                break;
        }
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