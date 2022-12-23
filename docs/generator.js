class SceneGenerator {
    constructor() {}

    generateScene() {
        let cardContainers = [];
        return cardContainers;
    }
}

class RandomSceneGenerator extends SceneGenerator { 
    constructor() {
        super();
        this.generators = [
            new GridSceneGenerator(),
            new TemplateSceneGenerator(),
        ]
        this.jsonStringTemplates = [
            '{ "cardContainers": [ { "id": 0, "x":200, "y":200, "card": 0, "isAbove": [1,2] }, { "id": 1, "x":180, "y":230, "card": 1, "isAbove": [3,4] }, { "id": 2, "x":220, "y":230, "card": 2, "isAbove": [4,5] }, { "id": 3, "x":160, "y":260, "card": 3, "isAbove": [6] }, { "id": 4, "x":200, "y":260, "card": 4, "isAbove": [6,7] }, { "id": 5, "x":240, "y":260, "card": 5, "isAbove": [7] }, { "id": 6, "x":180, "y":290, "card": 6, "isAbove": [8] }, { "id": 7, "x":220, "y":290, "card": 7, "isAbove": [8] }, { "id": 8, "x":200, "y":320, "card": 8, "isAbove": [] } ], "cards": {"randomize": false, "entries": [ { "id": 0, "type": 0 }, { "id": 1, "type": 1 }, { "id": 2, "type": 2 }, { "id": 3, "type": 2 }, { "id": 4, "type": 0 }, { "id": 5, "type": 1 }, { "id": 6, "type": 1 }, { "id": 7, "type": 2 }, { "id": 8, "type": 0 } ] } }',
            
            '{ "cardContainers": [ { "id": 0, "x":200, "y":200, "card": 0, "isAbove": [1,2] }, { "id": 1, "x":180, "y":230, "card": 1, "isAbove": [3,4] }, { "id": 2, "x":220, "y":230, "card": 2, "isAbove": [4,5] }, { "id": 3, "x":160, "y":260, "card": 3, "isAbove": [6] }, { "id": 4, "x":200, "y":260, "card": 4, "isAbove": [6,7] }, { "id": 5, "x":240, "y":260, "card": 5, "isAbove": [7] }, { "id": 6, "x":180, "y":290, "card": 6, "isAbove": [8] }, { "id": 7, "x":220, "y":290, "card": 7, "isAbove": [8] }, { "id": 8, "x":200, "y":320, "card": 8, "isAbove": [] } ], "cards": {"randomize": true, "cardTypeCount": { "0": 3, "1": 3, "2": 3 } } }',
            
            '{ "cardContainers": [ { "id": 0, "x":200, "y":300, "card": 0, "isAbove": [1,2,3,4] }, { "id": 1, "x":180, "y":275, "card": 1, "isAbove": [5] }, { "id": 2, "x":220, "y":275, "card": 2, "isAbove": [5] }, { "id": 3, "x":180, "y":325, "card": 3, "isAbove": [5] }, { "id": 4, "x":220, "y":325, "card": 4, "isAbove": [5] }, { "id": 5, "x":200, "y":300, "card": 5, "isAbove": [] } ], "cards": {"randomize": true, "cardTypeCount": { "0": 2, "1": 2, "2": 2 } } }'
        ];
    }

    generateScene() {
        let generator = this.generators[parseInt(Math.random() * this.generators.length)];

        if(generator instanceof TemplateSceneGenerator) {
            generator.loadJsonString(this.jsonStringTemplates[parseInt(Math.random() * this.jsonStringTemplates.length)]);
        }

        return generator.generateScene();
    }
}

class GridSceneGenerator extends SceneGenerator {
    constructor() {
        super();
    }

    generateScene() {
        let cardContainers = [];

        let id = 0;
        for(let x = 0; x < 3; x++) {
            let xplace = 130 + x * 70;
            for(let y = 0; y < 3; y++) {
                let yplace = 200 + y * 70;
                let testContainerBottom = new CardContainer(id, xplace, yplace);
                cardContainers.push(testContainerBottom);
                id++;

                let testContainerMiddle = new CardContainer(id, xplace, yplace + 5);
                testContainerMiddle.placeAbove(testContainerBottom);
                cardContainers.push(testContainerMiddle);
                id++;

                let testContainerTop = new CardContainer(id, xplace, yplace + 10);
                testContainerTop.placeAbove(testContainerMiddle);
                cardContainers.push(testContainerTop);
                id++;
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

        let id = 0;
        randomizedCardTypes.forEach(cardType => {
            randomized27Cards.push(new Card(id, cardType));
            id++;
        })

        return randomized27Cards;
    }
}

class TemplateSceneGenerator extends SceneGenerator {
    constructor() {
        super();
        this.jsonString = '{ "cardContainers": [ { "id": 0, "x":200, "y":200, "card": 0, "isAbove": [1,2] }, { "id": 1, "x":180, "y":230, "card": 1, "isAbove": [3,4] }, { "id": 2, "x":220, "y":230, "card": 2, "isAbove": [4,5] }, { "id": 3, "x":160, "y":260, "card": 3, "isAbove": [6] }, { "id": 4, "x":200, "y":260, "card": 4, "isAbove": [6,7] }, { "id": 5, "x":240, "y":260, "card": 5, "isAbove": [7] }, { "id": 6, "x":180, "y":290, "card": 6, "isAbove": [8] }, { "id": 7, "x":220, "y":290, "card": 7, "isAbove": [8] }, { "id": 8, "x":200, "y":320, "card": 8, "isAbove": [] } ], "cards": {"randomize": false, "entries": [ { "id": 0, "type": 0 }, { "id": 1, "type": 1 }, { "id": 2, "type": 2 }, { "id": 3, "type": 2 }, { "id": 4, "type": 0 }, { "id": 5, "type": 1 }, { "id": 6, "type": 1 }, { "id": 7, "type": 2 }, { "id": 8, "type": 0 } ] } }';
            
            // '{ "cardContainers": [ { "id": 0, "x":200, "y":200, "card": 0, "isAbove": [1,2] }, { "id": 1, "x":180, "y":230, "card": 1, "isAbove": [3,4] }, { "id": 2, "x":220, "y":230, "card": 2, "isAbove": [4,5] }, { "id": 3, "x":160, "y":260, "card": 3, "isAbove": [6] }, { "id": 4, "x":200, "y":260, "card": 4, "isAbove": [6,7] }, { "id": 5, "x":240, "y":260, "card": 5, "isAbove": [7] }, { "id": 6, "x":180, "y":290, "card": 6, "isAbove": [8] }, { "id": 7, "x":220, "y":290, "card": 7, "isAbove": [8] }, { "id": 8, "x":200, "y":320, "card": 8, "isAbove": [] } ], "cards": {"randomize": true, "cardTypeCount": { "0": 3, "1": 3, "2": 3 } } }'
            
            // '{ "cardContainers": [ { "id": 0, "x":200, "y":200, "card": 0, "isAbove": [1,2,3,4] }, { "id": 1, "x":180, "y":175, "card": 1, "isAbove": [5] }, { "id": 2, "x":220, "y":175, "card": 2, "isAbove": [5] }, { "id": 3, "x":180, "y":225, "card": 3, "isAbove": [5] }, { "id": 4, "x":220, "y":225, "card": 4, "isAbove": [5] }, { "id": 5, "x":200, "y":200, "card": 5, "isAbove": [] } ], "cards": {"randomize": true, "cardTypeCount": { "0": 2, "1": 2, "2": 2 } } }'
    }

    loadJsonString(jsonString) {
        this.jsonString = jsonString;
    }

    parseJsonStringToTemplate(json) {
        let containers = [];
        let cards = [];

        let data = JSON.parse(json);

        if(data.cards.randomize) {
            let cardTypes = [];
        
            Object.entries(data.cards.cardTypeCount).forEach(cardTypeCount => {
                for(let i = 0; i < cardTypeCount[1]; i++) {
                    cardTypes.push(cardTypeCount[0]);
                }
            })
        
            let randomizedCardTypes = [];
        
            while(cardTypes.length) {
                randomizedCardTypes.push(cardTypes.splice(parseInt(Math.random() * cardTypes.length), 1)[0]);
            }
                
            let id = 0;
            randomizedCardTypes.forEach(cardType => {
                cards.push(new Card(id, cardType));
                id++;
            })
        } else {
            data.cards.entries.forEach(cardData => {
                cards.push(new Card(cardData.id, cardData.type))
            });
        }
            
        data.cardContainers.forEach(cardContainerData => {
            let cardContainer = new CardContainer(cardContainerData.id, cardContainerData.x, cardContainerData.y);
            cardContainer.placeCard(cards[cardContainerData.card]);
            containers.push(cardContainer);
        });
        
        data.cardContainers.forEach(cardContainerData => {
            cardContainerData.isAbove.forEach(cardBelow => {
                containers[cardContainerData.id].placeAbove(containers[cardBelow]);
            })
        });

        return {
            cardContainers: containers
        }
    }

    generateScene() {
        let template = this.parseJsonStringToTemplate(this.jsonString);

        let cardContainers = Array.from(template.cardContainers);

        return cardContainers;
    }
}