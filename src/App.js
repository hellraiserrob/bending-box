import React, { Component } from 'react';
import './App.css';

import Paper, { Point, Path, Rectangle, Tool } from 'paper'

import Easing from './Easing'
import Debounce from './Debounce'


class App extends Component {

    constructor(props) {
        super(props)

        this.points = 2;


    }

    componentDidMount() {


        this.paper = Paper.setup(this.canvas)
        

        
        // main path
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
        // this.rect = new Rectangle(0, 0, this.width, this.height * .5)
        // this.pathRect = new Path.Rectangle(this.rect)
        // this.pathRect.fillColor = '#eee'


        this.path.segments = [];


        // this.path.add(this.paper.view.bounds.bottomLeft);
        this.path.add(0, 0);
        this.path.add(this.width, 0);
        this.path.add(this.width, this.center.y);
        this.path.add(this.width - 20, this.center.y);
        
        
        this.path.add(this.width / 2, this.center.y);

        this.path.add(20, this.center.y);
        this.path.add(0, this.center.y);

        

        // for (var i = 1; i < this.points; i++) {
        //     var point = new Point((this.width) / this.points * i, this.center.y);
        //     this.path.add(point);
        // }

        



        // this.path.add(this.paper.view.bounds.bottomRight);



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
        }, 100);

        // this.tool.onMouseMove = myEfficientFn
        this.tool.onMouseMove = myEfficientFn



        this.paper.view.onFrame = this.onFrame

    }


    onFrame = (event) => {

        // this.path.segments[1].point.x = this.mousePos.x

        this.counter += 1

        let diff = this.lastPos - this.end

        let p = this.counter / (Math.abs(diff) + this.counter)
        let change = Easing.easeOutQuad(p) * 150

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

            this.path.segments[4].point.y = newY
            this.lastPos = newY


        }
        else {
            this.path.segments[4].point.y = this.end
            this.lastPos = this.end
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
