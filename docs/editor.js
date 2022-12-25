class TemplateEditor {
    constructor() {
        this.editorMode = 0; //0 - default| 1 - placingContainerMode| 2 - previewSceneMode
        this.editorButtons = [];
        this.allCardContainers = [];
        this.allCardContainersHighestRankMap = {};
        this.previewScene = new Scene(new TemplateSceneGenerator());

        this.editTemplateButton = new IconButton(this.editorButtons, width/2, height - 50, 40, 40, CARD.CORNER_RADIUS, "edit");

        this.doneEditTemplateButton = new IconButton(this.editorButtons, width/2, height - 50, 40, 40, CARD.CORNER_RADIUS, "done");

        this.editTemplateButton.onClick(() => {
            this.setupEditorMode(1);
            return true;
        });

        this.doneEditTemplateButton.onClick(() => {
            this.setupEditorMode(0);
            return true;
        });

        this.saveTemplateButton = new IconButton(this.editorButtons, width/2 + 50, height - 50, 40, 40, CARD.CORNER_RADIUS, "save");
        this.saveTemplateButton.onClick(() => {
            this.saveLayoutString();
            return true;
        });

        this.undoPlaceContainerButton = new IconButton(this.editorButtons, width/2 - 50, height - 50, 40, 40, CARD.CORNER_RADIUS, "undo");
        this.undoPlaceContainerButton.onClick(() => {
            if(!this.allCardContainers.length) return true;
            let lastCardContainerIndex = this.allCardContainers.length - 1;
            let toRemoveCardContainer = this.allCardContainers[lastCardContainerIndex];

            //Remove containers from all containers below
            toRemoveCardContainer.below.forEach(cardContainer => {
                console.log(cardContainer)
                if(cardContainer.above.length) {
                    cardContainer.above = cardContainer.above.filter(cardContainerAbove => cardContainerAbove.id != toRemoveCardContainer.id);
                }
            });

            let toRemoveCardContainerCoordKey = toRemoveCardContainer.x + "|" + toRemoveCardContainer.y;

            //Remove from the highest map too
            this.allCardContainersHighestRankMap[toRemoveCardContainerCoordKey] = this.allCardContainersHighestRankMap[toRemoveCardContainerCoordKey].filter(cardContainer => cardContainer.id != toRemoveCardContainer.id);

            //Finally remove all traces
            this.allCardContainers.splice(this.allCardContainers.length-1, 1);
            return true;
        });
        
        this.exitEditModeButton = new IconButton(this.editorButtons, width - 50, height - 50, 40, 40, CARD.CORNER_RADIUS, "exit");
        this.exitEditModeButton.onClick(() => {
            this.setupEditorMode(0);
            editMode = false;
            return true;
        });

        this.previewSceneButton = new IconButton(this.editorButtons, 50, height - 50, 40, 40, CARD.CORNER_RADIUS, "eye");
        this.previewSceneButton.onClick(() => {
            this.previewEditorScene();
            return true;
        });

        this.exitPreviewSceneButton = new IconButton(this.editorButtons, 50, height - 120, 40, 40, CARD.CORNER_RADIUS, "eyeOff");
        this.exitPreviewSceneButton.onClick(() => {
            this.setupEditorMode(0);
            return true;
        });

        this.placeX = 0, this.placeY = 0;
    }

    setup() {
        this.setupEditorMode(0);
        this.calculatePlacementBounds();
    }

    setupEditorMode(mode) {
        this.editorMode = mode;
        if(this.editorMode === 0) {
            this.editorButtons.forEach(button => {
                button.enable();
            });
            this.doneEditTemplateButton.disable();
            this.exitPreviewSceneButton.disable();
            this.undoPlaceContainerButton.disable();
        } else if(this.editorMode === 1) {
            this.editorButtons.forEach(button => {
                button.enable();
            });
            this.editTemplateButton.disable();
            this.exitPreviewSceneButton.disable();
            this.saveTemplateButton.disable();
        } else if(this.editorMode === 2) {
            this.editorButtons.forEach(button => {
                button.disable();
            });
            this.exitPreviewSceneButton.enable();
        }
    }

    previewEditorScene() {
        this.setupEditorMode(2);
        this.previewScene.sceneGenerator.loadJsonString(this.saveLayoutString());
        this.previewScene.setup();
    }

    calculatePlacementBounds() {
        this.placeMaxWidth = width - (width % CARD.WIDTH) - CARD.WIDTH;
        this.placeMaxHeight = (height - 100) - ((height - 100) % CARD.HEIGHT) - CARD.HEIGHT;


        this.placeMinX = (width - this.placeMaxWidth) / 2;
        this.placeMinY = (height - 100 - this.placeMaxHeight) / 2;
        this.placeMaxX = (width + this.placeMaxWidth) / 2;
        this.placeMaxY = (height - 100 + this.placeMaxHeight) / 2;
    }

    interact() {
        let buttonPressed = false;
        this.editorButtons.forEach(button => {
            if(!buttonPressed) {
                buttonPressed = button.interact() || buttonPressed;
            }
        });

        if(this.editorMode === 1 && !buttonPressed) {
            let placeX = parseInt(this.placeX);
            let placeY = parseInt(this.placeY);
            let id = this.allCardContainers.length;
            let newCardContainer = new CardContainer(id, placeX, placeY);
            Object.entries(this.allCardContainersHighestRankMap).forEach(cardContainerCoordEntry => {
                let cardContainerListAtCoord = cardContainerCoordEntry[1];
                if(cardContainerListAtCoord.length) {
                    let coordStringArray = cardContainerCoordEntry[0].split("|");
                    let coord = {
                        x: parseInt(coordStringArray[0]),
                        y: parseInt(coordStringArray[1])
                    }
                    
                    if(pointInRect(placeX, placeY, coord.x, coord.y, CARD.WIDTH + 2, CARD.HEIGHT + 2)) {
                        let highestCardContainerInCoord = cardContainerListAtCoord[cardContainerListAtCoord.length - 1];

                        //we also don't want to place our new container above any container that is also below any highest container under us!
                        if(newCardContainer.getMapOfAllCardContainerIdsBelow()[highestCardContainerInCoord.id]) {
                            // don't place this container below our new container since it's already contained somewhere in the tree below our new container!
                        } else {
                            Object.keys(highestCardContainerInCoord.getMapOfAllCardContainerIdsBelow()).forEach(cardContainerIdUnderHighest => {

                                let newBelowList = [];
                                newCardContainer.below.forEach(belowNew => {
                                    if(belowNew.id == cardContainerIdUnderHighest) {
                                        belowNew.above = belowNew.above.filter(cardContainerAbove => cardContainerAbove.id != newCardContainer.id);
                                    } else {
                                        newBelowList.push(belowNew);
                                    }
                                });

                                newCardContainer.below = newBelowList;
                                // also go through any containers that were previously placed – containers below the highest facing container don't need to be placed under our new container - since they'll be covered by that highest facing container - we can safely remove.
                            });

                            newCardContainer.placeAbove(highestCardContainerInCoord);
                        }
                    }
                }
            }); 

            let maxLowestRank = 0;
            newCardContainer.below.forEach(belowCardContainer => {
                maxLowestRank = max(maxLowestRank, belowCardContainer.rank);
            })
            newCardContainer.rank = maxLowestRank + 1;

            let cardContainerCoordKey = placeX + "|" + placeY;
            if(!this.allCardContainersHighestRankMap[cardContainerCoordKey]) {
                this.allCardContainersHighestRankMap[cardContainerCoordKey] = [newCardContainer];
            } else {
                this.allCardContainersHighestRankMap[cardContainerCoordKey].push(newCardContainer);
            }

            this.allCardContainers.push(newCardContainer);
        }

        if(this.editorMode === 2) {
            this.previewScene.interact();
        }
    }

    saveLayoutString() {
        let layoutString;

        let layout = {
            cardContainers: [],
            cards: {
                randomize: true,
                cardTypeCount: {},
            }
        }

        this.allCardContainers.forEach(cardContainer => {
            let cardContainersBelow = [];

            cardContainer.below.forEach(cardContainerBelow => {
                cardContainersBelow.push(cardContainerBelow.id);
            });

            layout.cardContainers.push({
                id: cardContainer.id,
                x: cardContainer.x,
                y: cardContainer.y,
                card: cardContainer.id,
                isAbove: cardContainersBelow
            });
        });

        let remainderOfCardTypes = this.allCardContainers.length % CARD.NUMBER_OF_CARD_TYPES;
        let minNumberOfEachCardType = parseInt((this.allCardContainers.length - remainderOfCardTypes) / CARD.NUMBER_OF_CARD_TYPES);
        
        for(let i = 0; i < CARD.NUMBER_OF_CARD_TYPES; i++) {
            layout.cards.cardTypeCount[i] = minNumberOfEachCardType + (remainderOfCardTypes > 0 ? 1 : 0);
            remainderOfCardTypes--;
        }

        layoutString = JSON.stringify(layout);
        console.log(layoutString);
        return layoutString;
    }
    
    run() {
        this.placeX = constrain(mouseX + this.placeMinX - (mouseX - CARD.WIDTH/4) % (CARD.WIDTH/2) - CARD.WIDTH/4, this.placeMinX + CARD.WIDTH/2, this.placeMaxX - CARD.WIDTH/2);
        this.placeY = constrain(mouseY + this.placeMinY - (mouseY - CARD.HEIGHT/4) % (CARD.HEIGHT/2) - CARD.HEIGHT/4, this.placeMinY + CARD.HEIGHT/2, this.placeMaxY - CARD.HEIGHT/2);
    }

    render() {
        this.run();

        if(this.editorMode === 1) {
            noFill();
            strokeWeight(1);
            stroke(100);
            rect(width/2, (height - 100)/2, this.placeMaxWidth, this.placeMaxHeight, CARD.CORNER_RADIUS);

            strokeWeight(2);
            for(let x = this.placeMinX + CARD.WIDTH; x < this.placeMaxX; x += CARD.WIDTH) {
                for(let y = this.placeMinY + CARD.HEIGHT; y < this.placeMaxY; y += CARD.HEIGHT) {
                    point(x, y);
                }
            }

            stroke(255);
            strokeWeight(1);
            fill(255, 100);
            rect(this.placeX, this.placeY, CARD.WIDTH + 2, CARD.HEIGHT + 2, CARD.CORNER_RADIUS);
        } else if(this.editorMode === 2) {
            this.previewScene.render();
        }

        if(this.editorMode !== 2) {
            this.allCardContainers.forEach(container => {
                container.render(null, this.editorMode !== 2);
            });
        }

        this.editorButtons.forEach(button => {
            button.render();
        });
    }
}