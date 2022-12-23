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
                let yplace = 200 + y * 70;
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