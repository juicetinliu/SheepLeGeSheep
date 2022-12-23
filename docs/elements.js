class SceneButton {
    constructor(scene, x, y, w, h, r, content) {
        scene.sceneButtons.push(this);
        this.isActive = false;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.r = r;
        this.content = content;
        this.onClickCallback = null;
    }

    onClick(callBack) {
        this.onClickCallback = callBack;
    }

    enable() {
        this.isActive = true;
    }

    disable() {
        this.isActive = false;
    }

    render() {
        if(this.isActive) {
            textSize(20);
            stroke(255);
            if(this.mouseWithin() && !isMobileOrTablet) {
                strokeWeight(2);
                fill(50);
            } else {
                strokeWeight(1);
                noFill();
            }
            rect(this.x, this.y, this.w, this.h, this.r);
            strokeWeight(1);
            fill(255);
            text(this.content, this.x, this.y);
        }
    }

    interact() {
        if(this.isActive && this.onClickCallback) {
            if(pointInRect(mouseX, mouseY, this.x, this.y, this.w, this.h)) {
                return this.onClickCallback();
            }   
        }
    }

    mouseWithin() {
        return pointInRect(mouseX, mouseY, this.x, this.y, this.w, this.h);
    }
}

function pointInRect(x, y, rx, ry, rw, rh) {
    return x > rx - rw/2 && x < rx + rw/2 && y > ry - rh/2 && y < ry + rh/2;
}