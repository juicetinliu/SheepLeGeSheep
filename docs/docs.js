let scene;
let isMobileOrTablet = is_mobile_or_tablet_view();

function setup() {
    rectMode(CENTER);
    textAlign(CENTER, CENTER);
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
    if(!isMobileOrTablet) {
        scene.interact();
    }
}

function touchStarted() {
    if(isMobileOrTablet) {
        scene.interact();
    }
}

function setupHTML(){
    main = new Main();
    
    let canvPanel = new Panel(main);
    let canv = new Canvas(canvPanel, [400, 700]);
    
    main.createHTML();
}