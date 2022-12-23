let scene;


function setup() {
    rectMode(CENTER);
    setupHTML();
    scene = new Scene(new GridSceneGenerator());
    // scene = new Scene();
    scene.createScene();
}

function draw(){
    background(0);
    scene.render();
}

function mousePressed() {
    scene.interactWithCards();
}

function setupHTML(){
    main = new Main();
    
    let canvPanel = new Panel(main);
    let canv = new Canvas(canvPanel, [400, 700]);
    
    main.createHTML();
}
  