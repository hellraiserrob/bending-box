import React, { Component } from 'react';
import './App.css';

import Paper, { Point, Path, Rectangle, Tool } from 'paper'


/*
 * Easing Functions - inspired from http://gizma.com/easing/
 * only considering the t value for the range [0, 1] => [0, 1]
 */
const easing = {
    // no easing, no acceleration
    linear: function (t) { return t },
    // accelerating from zero velocity
    easeInQuad: function (t) { return t * t },
    // decelerating to zero velocity
    easeOutQuad: function (t) { return t * (2 - t) },
    // acceleration until halfway, then deceleration
    easeInOutQuad: function (t) { return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t },
    // accelerating from zero velocity 
    easeInCubic: function (t) { return t * t * t },
    // decelerating to zero velocity 
    easeOutCubic: function (t) { return (--t) * t * t + 1 },
    // acceleration until halfway, then deceleration 
    easeInOutCubic: function (t) { return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1 },
    // accelerating from zero velocity 
    easeInQuart: function (t) { return t * t * t * t },
    // decelerating to zero velocity 
    easeOutQuart: function (t) { return 1 - (--t) * t * t * t },
    // acceleration until halfway, then deceleration
    easeInOutQuart: function (t) { return t < .5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t },
    // accelerating from zero velocity
    easeInQuint: function (t) { return t * t * t * t * t },
    // decelerating to zero velocity
    easeOutQuint: function (t) { return 1 + (--t) * t * t * t * t },
    // acceleration until halfway, then deceleration 
    easeInOutQuint: function (t) { return t < .5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t }
}


const debounce = (func, wait, immediate) => {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};


class App extends Component {

    constructor(props) {
        super(props)

        this.points = 2;


    }

    componentDidMount() {


        this.paper = Paper.setup(this.canvas)
        this.path = new Path()
        this.path.fillColor = '#eee'

        this.center = this.path.view.center
        this.width = this.path.view.size.width
        this.height = this.path.view.size.height

        this.mousePos = this.center
        this.lastPos = this.center.y
        this.pathHeight = this.mousePos.y

        this.start = this.center.y
        this.end = this.center.y
        this.counter = 0
        

        // add a rectangle
        this.rect = new Rectangle(0, 0, this.width, this.height * .5)
        this.pathRect = new Path.Rectangle(this.rect)
        this.pathRect.fillColor = '#eee'


        this.path.segments = [];


        // this.path.add(this.paper.view.bounds.bottomLeft);
        this.path.add(0, this.center.y);

        for (var i = 1; i < this.points; i++) {
            var point = new Point((this.width) / this.points * i, this.center.y);
            this.path.add(point);
        }

        // this.path.add(this.paper.view.bounds.bottomRight);
        this.path.add(this.width, this.center.y);


        // this.path.fullySelected = true;
        this.path.smooth({ type: 'continuous' });

        this.tool = new Tool()

        

        var myEfficientFn = debounce((e) => {
             this.onMouseMove(e)
        }, 250);

        this.tool.onMouseMove = myEfficientFn



        this.paper.view.onFrame = this.onFrame

    }


    onFrame = (event) => {

        // this.path.segments[1].point.x = this.mousePos.x

        this.counter += 1

        let diff = this.lastPos - this.end

        let p = this.counter / (Math.abs(diff) + this.counter)
        let change = easing.linear(p) * 100

        // console.log(`percent: ${p}, diff: ${diff}, change: ${change}`)

        if(Math.abs(diff) > change){
            // console.log(`diff ${diff}`)
            let newY


            if(diff > 0){
                // console.log(`go up: ${diff}`)
                newY = this.lastPos - change

            }
            else {
                // console.log(`go down: ${diff}`)
                newY = this.lastPos + change
            }

            

            // console.log(`${change}`)
            // console.log(`${this.counter} / ${d}`)

            this.path.segments[1].point.y = newY
            this.lastPos = newY


        }
        else {
            this.path.segments[1].point.y = this.end
        }


        // let i = this.path.getIntersections(path2)




        // this.path.segments[1].point.y = n

        // this.progress += 1







        // let newValue = (easing.linear(percent) * this.end) * direction

        for (var i = 1; i < this.points; i++) {


            // this.path.segments[i].point.y = newValue


            /*
                  let target = catchZone ? this.mousePos.y : this.height * .5
                  let difference = Math.round((target - this.lastPos))
            
                  const increase = Math.PI / 100;
                  let change = Math.sin(this.counter);
            
            
                  if(difference > -change && difference < change){
            
                    console.log('reset')
            
                    this.path.segments[i].point.y = target   
                    this.lastPos = target
                    this.counter = 0;
            
                  } else {
            
                    console.log(difference)
            
                    let direction = difference > 0 ? 1 : -1;
            
                    let newValue = (this.lastPos + (change * direction)) ;
            
                    this.path.segments[i].point.y = newValue 
                    this.lastPos = newValue
            
                    this.counter += increase;
                  }
            
                  */


        }

        // if (percent < 1) {
        //   this.progress += 1;
        //   console.log(`progress: ${percent}`)
        // }





        // if (smooth)
        //   path.smooth({ type: 'continuous' });
    }


    onMouseMove = (event) => {

        this.mousePos = event.point

        let catchZone = (this.mousePos.y > this.height / 4 && this.mousePos.y < this.center.y + this.height / 4) ? true : false

        if (catchZone) {
            this.start = this.mousePos.y
            // this.lastPos = this.mousePos.y
        }
        
        
        this.counter = 0
        this.end = catchZone ? this.mousePos.y : this.height * .5

    }



    clear = () => {
        this.paper.project.activeLayer.removeChildren();
    }

    render() {

        return (
            <canvas ref={(canvas) => this.canvas = canvas}>test</canvas>
        );
    }
}

export default App;
