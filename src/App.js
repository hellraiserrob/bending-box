import React, { Component } from 'react';
import './App.css';

import Paper, { Path, Tool } from 'paper'

import Easing from './Easing'
import Debounce from './Debounce'


class App extends Component {


    bind = () => {
        window.addEventListener('resize', this.resize)
    }

    removeBind = () => {
        window.removeEventListener('resize', this.resize)
    }

    resize = () => {
        this.clear()
        this.init()
    }

    componentWillUnmount() {
        this.removeBind()
    }

    componentDidMount() {
        this.bind()
        this.init()
    }


    init = () => {

        this.paper = Paper.setup(this.canvas)

        // main path
        this.path = new Path()
        this.path.fillColor = '#eee'

        this.center = this.path.view.center
        this.width = this.path.view.size.width
        this.height = this.path.view.size.height

        this.mousePos = this.center
        this.lastPos = this.center.y
        this.cachedPos = this.center.y
        this.pathHeight = this.mousePos.y

        this.start = this.center.y
        this.end = this.center.y
        this.counter = 0


        this.path.segments = [];

        this.path.add(0, 0);
        this.path.add(this.width, 0);
        this.path.add(this.width, this.center.y);
        this.path.add(this.width - 20, this.center.y);
        this.path.add(this.width / 2, this.center.y);
        this.path.add(20, this.center.y);
        this.path.add(0, this.center.y);

        this.path.fullySelected = true;
        this.path.smooth({ type: 'continuous', from: 3, to: 5 })
        this.path.closed = true


        // hit boundaries

        const strokeColor = '#999'
        const strokeDash = [10, 10]

        this.boundaryTop = new Path()
        this.boundaryTop.strokeColor = strokeColor
        this.boundaryTop.dashArray = strokeDash

        this.boundaryTop.add(0, this.height * 0.25);
        this.boundaryTop.add(this.width, this.height * 0.25);

        this.boundaryBottom = new Path()
        this.boundaryBottom.strokeColor = strokeColor
        this.boundaryBottom.dashArray = strokeDash

        this.boundaryBottom.add(0, this.height * 0.75);
        this.boundaryBottom.add(this.width, this.height * 0.75);

        this.tool = new Tool()



        var myEfficientFn = Debounce((e) => {
            this.onMouseMove(e)
        }, 250);

        this.tool.onMouseMove = myEfficientFn
        this.paper.view.onFrame = this.onFrame

    }


    onFrame = (event) => {

        if (this.counter < this.total && this.total !== 0) {

            let p = (this.counter / this.total).toFixed(2)

            // console.log(`${p}%`)

            let change = Easing.easeOutElastic(p) * this.total

            let newY


            if (this.direction === 'up') {
                newY = Math.round(this.start - change)

            }
            else {
                newY = Math.round(this.start + change)
            }


            this.path.segments[4].point.y = newY
            this.lastPos = newY

            this.counter += 1

        }


    }


    onMouseMove = (event) => {

        this.mousePos = event.point

        let catchZone = (this.mousePos.y > this.height / 4 && this.mousePos.y < this.center.y + this.height / 4) ? true : false


        this.start = this.lastPos
        this.end = catchZone ? this.mousePos.y : this.height * .5

        this.total = Math.abs(this.start - this.end)
        this.counter = 0

        this.direction = this.end - this.start < 0 ? 'up' : 'down';

        // console.log(`lastPos: ${this.lastPos}, start: ${this.start}, end: ${this.end}, total: ${this.total}`)


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
