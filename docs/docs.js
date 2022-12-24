let scene;
let isMobileOrTablet = is_mobile_or_tablet_view();

function setup() {
    rectMode(CENTER);
    textAlign(CENTER, CENTER);
    setupHTML();
    // scene = new Scene();
    // scene = new Scene(new GridSceneGenerator());
    // scene = new Scene(new TemplateSceneGenerator());
    scene = new Scene(new RandomSceneGenerator());
    scene.createScene();
}

function draw(){
    background(0);
    scene.render();

    fill(255);
    ellipse(mouseX, mouseY, 50, 50);
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