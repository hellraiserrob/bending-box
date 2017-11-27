import React, { Component } from 'react';
import './App.css';

import Paper, { Point, Path, Tool } from 'paper'

class App extends Component {

  constructor(props) {
    super(props)

    this.points = 4;
    
    
  }
  
  componentDidMount() {
    
    
    this.paper = Paper.setup(this.canvas)
    this.path = new Path()
    this.path.fillColor = '#eee'

    this.center = this.path.view.center 
    this.width = this.path.view.size.width
    this.height = this.path.view.size.height
    
    this.mousePos = this.center
    this.lastPos = this.center

    

    this.pathHeight = this.mousePos.y
    
    this.path.segments = [];

    // this.path.add(this.paper.view.bounds.bottomLeft);
    this.path.add(0, this.center.y);
    
    for (var i = 1; i < this.points; i++) {
      var point = new Point(this.width / this.points * i, this.center.y);
      this.path.add(point);
    }

    // this.path.add(this.paper.view.bounds.bottomRight);
    this.path.add(this.width, this.center.y);


    this.path.fullySelected = true;
    // this.path.smooth({ type: 'continuous'});
    
    this.tool = new Tool()

    this.tool.onMouseMove = this.onMouseMove
    this.paper.view.onFrame = this.onFrame
    
  }


  onFrame = (event) => {

    let catchZone = (this.mousePos.y > this.height / 2 && this.mousePos.y < this.center.y + this.height / 4) ? true : false


    this.pathHeight += (this.mousePos.y - this.center.y - this.pathHeight) / 10;
    
    for (var i = 1; i < this.points; i++) {

      // var sinSeed = event.count + (i + i % 10) * 100;
      var sinSeed = 1 * 100;
      
      var sinHeight = Math.sin(sinSeed / 200) * this.pathHeight;

      var yPos = Math.sin(sinSeed / 100) * sinHeight + this.height;

      this.path.segments[i].point.y = yPos

      if(catchZone){
        this.path.segments[i].point.y = this.mousePos.y
        this.lastPos = this.mousePos
      }
      else {
        this.path.segments[i].point.y = this.lastPos.y
      }


    }

    // if (smooth)
    //   path.smooth({ type: 'continuous' });
  }


  onMouseMove = (event) => {

    this.mousePos = event.point;

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
