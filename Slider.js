import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import './Slider.css'

class Slider extends Component {
  constructor(props) {
    super(props)
    // References to input and span DOM elements so their sizes and positions can be used for positioning the text
    this.Input = React.createRef()
    this.Span = React.createRef()
    this.state = {
      // Minimum value of the slider
      min: props.min,
      // Maximum value of the slider
      max: props.max,
      // Current value of the slider
      value: props.value,
      // Postition of the text
      left: 0,
      top: 0
    }
    this.handleResize = this.handleResize.bind(this)
  }

  // Used to keep componentDidUpdate from going into an infinite loop
  // Calling componentDidUpdate smoothens the number movement and keeps it centered
  finalUpdate = false;

  onChange(newValue) {
    // Calculate x and y values
    const x = this.calculateX(newValue);
    const y = (this.Input.current.offsetHeight / 2) - (this.Span.current.offsetHeight / 4)
    // Set the state based on the new values
    this.setState({
      value: newValue,
      left: x,
      top: y
    })
    // If there is an onchange handler call it
    if(this.props.onChange)
      this.props.onChange(this.state.value)
  }

  componentDidUpdate() {
    // If finalupdate is true return (so it doesn't go into an infinite loop)
    if (this.finalUpdate == true)
      return;
    // Calculate X
    const x = this.calculateX(this.state.value)
    // Set final update to true and set the state
    this.finalUpdate = true
    this.setState({
      left: x
    })    
  }

  handleResize() {
    this.onChange(this.state.value)
  }

  componentDidMount() {
    // Handle resizing of the window
    window.addEventListener('resize', this.handleResize)
    // Set the initial position of t
    this.onChange(this.props.value)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)
  }

  // Calculates the x position of the span
  calculateX(value) {
    // Calculate the position of the slider
    let x = (((this.Input.current.offsetWidth) / (this.state.max-this.state.min)) * this.state.value)
    // Account for the extra change due to the sliders width (Comment this out and move slider slowly to see what I mean)
    x = x - ((25 / (this.state.max-this.state.min)) * this.state.value)
    // Get the the middle of the slider
    x = x + (12.5 - this.Span.current.offsetWidth / 2)
    // Add arbitrary number to fix, should figure out better solution
    return x + 2
  }

  render() {
    return (
      <div>
        <input type="range"
          ref={this.Input}
          min={this.state.min}
          max={this.state.max}
          value={this.state.value}
          onChange={(e) => {this.finalUpdate=false;this.onChange(e.target.value)}}
          step=".1"
          className="slider"/>
        <span ref={this.Span}
          style={{color: "black",
          left: `${this.state.left}px`,
          top: `${this.state.top}px`,
          zIndex: 3,
          position: "absolute",
          pointerEvents: "none"}}>{this.state.value}</span>
      </div>
    )
  }
}

export default Slider
