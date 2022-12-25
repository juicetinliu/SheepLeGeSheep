let scene, editor;
let isMobileOrTablet = is_mobile_or_tablet_view();
let editMode = false;

function setup() {
    rectMode(CENTER);
    imageMode(CENTER);
    textAlign(CENTER, CENTER);

    setupHTML();
    scene = new Scene(new TemplateSceneGenerator());
    scene.setup();

    editor = new TemplateEditor();
    editor.setup();
}

function draw(){
    background(0);
    if(editMode) {
        editor.render();
    } else {
        scene.render();
    }
}

function mousePressed() {
    if(!isMobileOrTablet) {
        if(editMode) {
            editor.interact();
        } else {
            scene.interact();
        }
    }
}

function touchStarted() {
    if(isMobileOrTablet) {
        if(editMode) {
            editor.interact();
        } else {
            scene.interact();
        }
    }
}

function setupHTML() {
    main = new Main();
    
    let canvPanel = new Panel(main);
    let canv = new Canvas(canvPanel, [400, 700]);
    
    main.createHTML();
}

function keyPressed() {
    if(key === 'e' && !editMode) {
        editMode = true;
    }
}