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
        // this.jsonString = '{ "cardContainers": [ { "id": 0, "x":200, "y":200, "card": 0, "isAbove": [1,2] }, { "id": 1, "x":180, "y":230, "card": 1, "isAbove": [3,4] }, { "id": 2, "x":220, "y":230, "card": 2, "isAbove": [4,5] }, { "id": 3, "x":160, "y":260, "card": 3, "isAbove": [6] }, { "id": 4, "x":200, "y":260, "card": 4, "isAbove": [6,7] }, { "id": 5, "x":240, "y":260, "card": 5, "isAbove": [7] }, { "id": 6, "x":180, "y":290, "card": 6, "isAbove": [8] }, { "id": 7, "x":220, "y":290, "card": 7, "isAbove": [8] }, { "id": 8, "x":200, "y":320, "card": 8, "isAbove": [] } ], "cards": {"randomize": false, "entries": [ { "id": 0, "type": 0 }, { "id": 1, "type": 1 }, { "id": 2, "type": 2 }, { "id": 3, "type": 2 }, { "id": 4, "type": 0 }, { "id": 5, "type": 1 }, { "id": 6, "type": 1 }, { "id": 7, "type": 2 }, { "id": 8, "type": 0 } ] } }';
            
            // '{ "cardContainers": [ { "id": 0, "x":200, "y":200, "card": 0, "isAbove": [1,2] }, { "id": 1, "x":180, "y":230, "card": 1, "isAbove": [3,4] }, { "id": 2, "x":220, "y":230, "card": 2, "isAbove": [4,5] }, { "id": 3, "x":160, "y":260, "card": 3, "isAbove": [6] }, { "id": 4, "x":200, "y":260, "card": 4, "isAbove": [6,7] }, { "id": 5, "x":240, "y":260, "card": 5, "isAbove": [7] }, { "id": 6, "x":180, "y":290, "card": 6, "isAbove": [8] }, { "id": 7, "x":220, "y":290, "card": 7, "isAbove": [8] }, { "id": 8, "x":200, "y":320, "card": 8, "isAbove": [] } ], "cards": {"randomize": true, "cardTypeCount": { "0": 3, "1": 3, "2": 3 } } }'
            
            // '{ "cardContainers": [ { "id": 0, "x":200, "y":200, "card": 0, "isAbove": [1,2,3,4] }, { "id": 1, "x":180, "y":175, "card": 1, "isAbove": [5] }, { "id": 2, "x":220, "y":175, "card": 2, "isAbove": [5] }, { "id": 3, "x":180, "y":225, "card": 3, "isAbove": [5] }, { "id": 4, "x":220, "y":225, "card": 4, "isAbove": [5] }, { "id": 5, "x":200, "y":200, "card": 5, "isAbove": [] } ], "cards": {"randomize": true, "cardTypeCount": { "0": 2, "1": 2, "2": 2 } } }'
        // this.jsonString = '{"cardContainers":[{"id":0,"x":160,"y":250,"card":0,"isAbove":[]},{"id":1,"x":200,"y":250,"card":1,"isAbove":[]},{"id":2,"x":240,"y":250,"card":2,"isAbove":[]},{"id":3,"x":240,"y":300,"card":3,"isAbove":[]},{"id":4,"x":200,"y":300,"card":4,"isAbove":[]},{"id":5,"x":160,"y":300,"card":5,"isAbove":[]},{"id":6,"x":160,"y":350,"card":6,"isAbove":[]},{"id":7,"x":200,"y":350,"card":7,"isAbove":[]},{"id":8,"x":240,"y":350,"card":8,"isAbove":[]}],"cards":{"randomize":true,"cardTypeCount":{"0":3,"1":3,"2":3}}}';

        this.jsonString = '{"cardContainers":[{"id":0,"x":160,"y":100,"card":0,"isAbove":[]},{"id":1,"x":140,"y":100,"card":1,"isAbove":[0]},{"id":2,"x":120,"y":100,"card":2,"isAbove":[1]},{"id":3,"x":100,"y":100,"card":3,"isAbove":[2]},{"id":4,"x":80,"y":100,"card":4,"isAbove":[3]},{"id":5,"x":80,"y":125,"card":5,"isAbove":[4]},{"id":6,"x":80,"y":150,"card":6,"isAbove":[5]},{"id":7,"x":80,"y":175,"card":7,"isAbove":[6]},{"id":8,"x":80,"y":200,"card":8,"isAbove":[7]},{"id":9,"x":100,"y":200,"card":9,"isAbove":[8]},{"id":10,"x":120,"y":200,"card":10,"isAbove":[9]},{"id":11,"x":100,"y":200,"card":11,"isAbove":[10]},{"id":12,"x":80,"y":200,"card":12,"isAbove":[11]},{"id":13,"x":80,"y":225,"card":13,"isAbove":[12]},{"id":14,"x":80,"y":250,"card":14,"isAbove":[13]},{"id":15,"x":80,"y":275,"card":15,"isAbove":[14]},{"id":16,"x":320,"y":300,"card":16,"isAbove":[]},{"id":17,"x":320,"y":325,"card":17,"isAbove":[16]},{"id":18,"x":320,"y":350,"card":18,"isAbove":[17]},{"id":19,"x":320,"y":375,"card":19,"isAbove":[18]},{"id":20,"x":320,"y":400,"card":20,"isAbove":[19]},{"id":21,"x":320,"y":425,"card":21,"isAbove":[20]},{"id":22,"x":320,"y":450,"card":22,"isAbove":[21]},{"id":23,"x":320,"y":475,"card":23,"isAbove":[22]},{"id":24,"x":320,"y":500,"card":24,"isAbove":[23]},{"id":25,"x":300,"y":500,"card":25,"isAbove":[24]},{"id":26,"x":280,"y":500,"card":26,"isAbove":[25]},{"id":27,"x":260,"y":500,"card":27,"isAbove":[26]},{"id":28,"x":240,"y":500,"card":28,"isAbove":[27]},{"id":29,"x":240,"y":475,"card":29,"isAbove":[28]},{"id":30,"x":240,"y":450,"card":30,"isAbove":[29]},{"id":31,"x":240,"y":425,"card":31,"isAbove":[30]},{"id":32,"x":240,"y":400,"card":32,"isAbove":[31]},{"id":33,"x":240,"y":375,"card":33,"isAbove":[32]},{"id":34,"x":240,"y":350,"card":34,"isAbove":[33]},{"id":35,"x":240,"y":325,"card":35,"isAbove":[34]},{"id":36,"x":240,"y":300,"card":36,"isAbove":[35]},{"id":37,"x":80,"y":300,"card":37,"isAbove":[15]},{"id":38,"x":220,"y":275,"card":38,"isAbove":[36]},{"id":39,"x":100,"y":325,"card":39,"isAbove":[37]},{"id":40,"x":140,"y":325,"card":40,"isAbove":[]},{"id":41,"x":140,"y":275,"card":41,"isAbove":[]},{"id":42,"x":100,"y":275,"card":42,"isAbove":[37]},{"id":43,"x":180,"y":275,"card":43,"isAbove":[]},{"id":44,"x":180,"y":325,"card":44,"isAbove":[]},{"id":45,"x":220,"y":325,"card":45,"isAbove":[36]},{"id":46,"x":260,"y":325,"card":46,"isAbove":[36]},{"id":47,"x":260,"y":275,"card":47,"isAbove":[36]},{"id":48,"x":300,"y":275,"card":48,"isAbove":[16]},{"id":49,"x":300,"y":325,"card":49,"isAbove":[18]},{"id":50,"x":300,"y":375,"card":50,"isAbove":[20]},{"id":51,"x":260,"y":375,"card":51,"isAbove":[34]},{"id":52,"x":220,"y":375,"card":52,"isAbove":[34]},{"id":53,"x":300,"y":425,"card":53,"isAbove":[22]},{"id":54,"x":300,"y":475,"card":54,"isAbove":[26]},{"id":55,"x":260,"y":475,"card":55,"isAbove":[30]},{"id":56,"x":260,"y":425,"card":56,"isAbove":[32]},{"id":57,"x":220,"y":425,"card":57,"isAbove":[32]},{"id":58,"x":220,"y":475,"card":58,"isAbove":[30]},{"id":59,"x":180,"y":475,"card":59,"isAbove":[]},{"id":60,"x":180,"y":425,"card":60,"isAbove":[]},{"id":61,"x":180,"y":375,"card":61,"isAbove":[]},{"id":62,"x":140,"y":375,"card":62,"isAbove":[]},{"id":63,"x":100,"y":375,"card":63,"isAbove":[]},{"id":64,"x":100,"y":425,"card":64,"isAbove":[]},{"id":65,"x":140,"y":425,"card":65,"isAbove":[]},{"id":66,"x":100,"y":475,"card":66,"isAbove":[]},{"id":67,"x":140,"y":475,"card":67,"isAbove":[]},{"id":68,"x":100,"y":225,"card":68,"isAbove":[14]},{"id":69,"x":100,"y":175,"card":69,"isAbove":[12]},{"id":70,"x":100,"y":125,"card":70,"isAbove":[6]},{"id":71,"x":140,"y":125,"card":71,"isAbove":[2]},{"id":72,"x":140,"y":175,"card":72,"isAbove":[10]},{"id":73,"x":140,"y":225,"card":73,"isAbove":[10]},{"id":74,"x":180,"y":225,"card":74,"isAbove":[]},{"id":75,"x":180,"y":175,"card":75,"isAbove":[]},{"id":76,"x":180,"y":125,"card":76,"isAbove":[0]},{"id":77,"x":220,"y":125,"card":77,"isAbove":[]},{"id":78,"x":220,"y":175,"card":78,"isAbove":[]},{"id":79,"x":220,"y":225,"card":79,"isAbove":[]},{"id":80,"x":260,"y":225,"card":80,"isAbove":[]},{"id":81,"x":300,"y":225,"card":81,"isAbove":[]},{"id":82,"x":300,"y":175,"card":82,"isAbove":[]},{"id":83,"x":260,"y":175,"card":83,"isAbove":[]},{"id":84,"x":260,"y":125,"card":84,"isAbove":[]},{"id":85,"x":300,"y":125,"card":85,"isAbove":[]},{"id":86,"x":280,"y":150,"card":86,"isAbove":[82,83,84,85]},{"id":87,"x":120,"y":150,"card":87,"isAbove":[69,70,71,72]},{"id":88,"x":160,"y":150,"card":88,"isAbove":[71,72,75,76]},{"id":89,"x":200,"y":150,"card":89,"isAbove":[75,76,77,78]},{"id":90,"x":240,"y":150,"card":90,"isAbove":[77,78,83,84]},{"id":91,"x":280,"y":200,"card":91,"isAbove":[80,81,82,83]},{"id":92,"x":240,"y":200,"card":92,"isAbove":[78,79,80,83]},{"id":93,"x":200,"y":200,"card":93,"isAbove":[74,75,78,79]},{"id":94,"x":160,"y":200,"card":94,"isAbove":[72,73,74,75]},{"id":95,"x":120,"y":200,"card":95,"isAbove":[68,69,72,73]},{"id":96,"x":120,"y":250,"card":96,"isAbove":[41,42,68,73]},{"id":97,"x":160,"y":250,"card":97,"isAbove":[41,43,73,74]},{"id":98,"x":200,"y":250,"card":98,"isAbove":[38,43,74,79]},{"id":99,"x":240,"y":250,"card":99,"isAbove":[38,47,79,80]},{"id":100,"x":280,"y":250,"card":100,"isAbove":[47,48,80,81]},{"id":101,"x":280,"y":300,"card":101,"isAbove":[46,47,48,49]},{"id":102,"x":240,"y":300,"card":102,"isAbove":[38,45,46,47]},{"id":103,"x":200,"y":300,"card":103,"isAbove":[38,43,44,45]},{"id":104,"x":160,"y":300,"card":104,"isAbove":[40,41,43,44]},{"id":105,"x":120,"y":300,"card":105,"isAbove":[39,40,41,42]},{"id":106,"x":120,"y":350,"card":106,"isAbove":[39,40,62,63]},{"id":107,"x":160,"y":350,"card":107,"isAbove":[40,44,61,62]},{"id":108,"x":200,"y":350,"card":108,"isAbove":[44,45,52,61]},{"id":109,"x":240,"y":350,"card":109,"isAbove":[45,46,51,52]},{"id":110,"x":280,"y":350,"card":110,"isAbove":[46,49,50,51]},{"id":111,"x":280,"y":400,"card":111,"isAbove":[50,51,53,56]},{"id":112,"x":280,"y":450,"card":112,"isAbove":[53,54,55,56]},{"id":113,"x":240,"y":450,"card":113,"isAbove":[55,56,57,58]},{"id":114,"x":240,"y":400,"card":114,"isAbove":[51,52,56,57]},{"id":115,"x":200,"y":400,"card":115,"isAbove":[52,57,60,61]},{"id":116,"x":200,"y":450,"card":116,"isAbove":[57,58,59,60]},{"id":117,"x":160,"y":450,"card":117,"isAbove":[59,60,65,67]},{"id":118,"x":120,"y":450,"card":118,"isAbove":[64,65,66,67]},{"id":119,"x":120,"y":400,"card":119,"isAbove":[62,63,64,65]},{"id":120,"x":160,"y":400,"card":120,"isAbove":[60,61,62,65]}],"cards":{"randomize":true,"cardTypeCount":{"0":21,"1":20,"2":20,"3":20,"4":20,"5":20}}}';
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