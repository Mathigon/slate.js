// =============================================================================
// Slate.js | Draggable
// (c) 2015 Mathigon
// =============================================================================



import { $body } from 'elements';
import Evented from 'evented';
import Browser from 'browser';
import { clamp } from 'utilities';


function getPosn(e) {
    let x = event.touches ? e.touches[0].clientX : e.clientX;
    let y = event.touches ? e.touches[0].clientY : e.clientY;
    return { x, y };
}

export default class Draggable extends Evented {

    constructor($el, $parent, direction = '', margin = 0) {
        super();
        let _this = this;

        this.$el = $el;
        this._posn = { x: null, y: null };
        this.move = { x: direction !== 'y', y: direction !== 'x' };

        let lastPosn;
        let width, height;

        function motionStart(e) {
            $body.on('pointerMove', motionMove);
            $body.on('pointerEnd', motionEnd);
            lastPosn = getPosn(e);
            _this.trigger('start');
        }

        function motionMove(e) {
            e.preventDefault();
            
            let newPosn = getPosn(e);
            let x = clamp(_this._posn.x + newPosn.x - lastPosn.x, 0, width);
            let y = clamp(_this._posn.y + newPosn.y - lastPosn.y, 0, height);

            lastPosn = newPosn;
            _this.position = { x, y };
        }

        function motionEnd(e) {
            $body.off('pointerMove', motionMove);
            $body.off('pointerEnd', motionEnd);
            
            let newPosn = getPosn(e);
            let noMove = (newPosn.x === lastPosn.x && newPosn.y === lastPosn.y);
            _this.trigger(noMove ? 'click' : 'end');
        }

        function resize() {
            let oldWidth = width;
            let oldHeight = height;

            width  = $parent.width  - margin * 2;
            height = $parent.height - margin * 2;

            let x = width  / oldWidth  * _this._posn.x;
            let y = height / oldHeight * _this._posn.y;
            _this.draw(x, y);
        }

        $el.on('pointerStart', motionStart);
        
        Browser.resize(resize);
        resize();
    }

    get position() {
        return this._posn;
    }

    set position(posn) {
        this.draw(posn);
        this._posn = posn;
        this.trigger('move', posn);
    }

    draw({ x, y }) {
        if (this.move.x) this.$el.css('left', Math.round(x) + 'px');
        if (this.move.y) this.$el.css('top',  Math.round(y) + 'px');
    }

}
