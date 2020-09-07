// Animations/EnlargeShrink.js

import React from 'react'
import { Animated } from 'react-native'

class EnlargeShrink extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      viewSize: new Animated.Value( this._getSize() )
    }
  }

  _getSize() {
    if (this.props.shouldEnlarge) { //if true
      
        return 80
    }
    return 40
  }
 
  componentDidUpdate() {
    Animated.spring(
      this.state.viewSize,
      {
        toValue: this._getSize() // 80 or 40
      }
    ).start()
  }

  render() {
    return (
        <Animated.View
          style={{ width: this.state.viewSize, height: this.state.viewSize }}>
          {this.props.children}
        </Animated.View>
    )
  }
}

export default EnlargeShrink