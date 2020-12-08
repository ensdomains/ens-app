import React, { Component } from 'react'
import styled from '@emotion/styled/macro'
import { modulate } from '../../utils/utils'
import mq from 'mediaQuery'

const BaseContainer = styled('div')`
  position: relative;
  font-size: 52px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 250px;
  overflow: hidden;

  ${mq.medium` 
    height: 100%;
  `};

  .background {
    background: white;
    overflow: hidden;
    position: absolute;
    left: 0;
    top: 0;
  }

  .bg-string {
    font-family: Overpass Mono;
    position: relative;
    color: #5284ff;
    font-size: 26px;
    font-weight: 300;
    line-height: 1em;
    text-wrap: nowrap;
    opacity: 0.1;

    ${mq.medium` 
      font-size: 52px;
    `};
  }

  .hook {
    margin: 0 auto 0;
    padding-top: 45px;
    position: relative;
    width: 100%;
    text-align: center;

    h2 {
      color: #2b2b2b;
      background: rgba(255, 255, 255, 0.7);
      font-size: 16px;
      font-weight: 500;
      padding: 0 5px 0;
      margin-bottom: 0;
      display: inline-block;
      position: relative;
      vertical-align: text-bottom;
      z-index: 2;
      ${mq.medium`
        font-size: 30px;
      `};
    }

    p {
      margin-top: 0;
      color: #2b2b2b;
      background: rgba(255, 255, 255, 0.7);
      font-weight: 300;
      font-size: 26px;
      display: inline-block;
      vertical-align: text-top;
      ${mq.medium` 
        font-size: 52px;
        
      `};
    }
  }

  .explanation {
    display: none;
    font-size: 20px;
    background: #ffffff;
    box-shadow: 2px 8px 25px 2px rgba(136, 149, 169, 0.12);
    border-radius: 20px;
    font-weight: 300;
    line-height: 1.4em;
    text-align: center;
    position: relative;
    top: -15%;
    padding: 70px;
    max-width: 50%;
    margin: 0 auto 0;
    ${mq.medium`
      display: block
    `};
    img {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
    }

    .top {
      top: 0;
    }

    .bottom {
      bottom: 0;
    }
  }

  .explanation-mobile {
    background: white;
    font-size: 18px;
    width: 80%;
    margin: 0 auto 30px;
    padding: 50px 30px;
    display: block;
    position: relative;
    box-shadow: 0 5px 20px 2px rgba(223, 223, 223, 0.5);
    border-radius: 20px;

    ${mq.medium`
      display: none
    `};

    strong {
      font-weight: 500;
    }

    .side {
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
    }
  }
`

const hexStrings = [
  '3629BFA0637872Ca3E64bDa247D9Ea12D1F21358d2fe36a24a843ec72dd86f50554cd395dd4da9e5e6583e44770b13284fb3cb5e',
  'xd2fe36a24a843ec72dd86f50554cd395dd4da9e5e6583e44770b13284fb3cb5e3629bfa0637872ca3e64bda247d9ea12d1f21358',
  'xe65D7702E401B7febBDBB6CD21a3eB98b0F2C066d2fe36a24a843ec72dd86f50554cd395dd4da9e5e6583e44770b13284fb3cb5e',
  '3629BFA0637872Ca3E64bDa247D9Ea12D1F21358d2fe36a24a843ec72dd86f50554cd395dd4da9e5e6583e44770b13284fb3cb5e',
  '080e4d78e2884a1ea17e653cc2a311c5855f9acd560f43fa37eb463f91da27a6e65D7702E401B7febBDBB6CD21a3eB98b0F2C066',
  'FC18Cbc391dE84dbd87dB83B20935D3e89F5dd91080e4d78e2884a1ea17e653cc2a311c5855f9acd560f43fa37eb463f91da27a6',
  '3629BFA0637872Ca3E64bDa247D9Ea12D1F21358d2fe36a24a843ec72dd86f50554cd395dd4da9e5e6583e44770b13284fb3cb5e',
  'xd2fe36a24a843ec72dd86f50554cd395dd4da9e5e6583e44770b13284fb3cb5e3629bfa0637872ca3e64bda247d9ea12d1f21358',
  'xe65D7702E401B7febBDBB6CD21a3eB98b0F2C066d2fe36a24a843ec72dd86f50554cd395dd4da9e5e6583e44770b13284fb3cb5e',
  '3629BFA0637872Ca3E64bDa247D9Ea12D1F21358d2fe36a24a843ec72dd86f50554cd395dd4da9e5e6583e44770b13284fb3cb5e'
]

class Explainer extends Component {
  constructor(props) {
    super(props)
    this.explainer = React.createRef()
    hexStrings.forEach((_, i) => {
      this['string' + i] = React.createRef()
    })
  }

  componentDidMount() {
    window.addEventListener('scroll', this.scroll)

    this.interval = setInterval(() => {
      if (this.didScroll === true) {
        this.didScroll = false
        this.handleScroll()
      }
    }, 50)
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.scroll)

    clearInterval(this.interval)
  }

  scroll = () => {
    this.didScroll = true
  }

  handleScroll = () => {
    let bodyHeight = document.body.clientHeight
    let explainer = this.explainer.current
    let explainerOffsetTop = explainer.offsetTop - bodyHeight
    let explainerOffsetBottom = explainer.offsetTop + bodyHeight + bodyHeight

    let scrollRange1 = [explainerOffsetTop, explainerOffsetBottom]
    // let scrollRange2 = [0, 200]
    const left = modulate(window.pageYOffset, scrollRange1, [-800, 0], true)
    const left2 = modulate(window.pageYOffset, scrollRange1, [-400, 0], true)
    const left3 = modulate(window.pageYOffset, scrollRange1, [-600, 0], true)
    const left4 = modulate(window.pageYOffset, scrollRange1, [-250, 0], true)

    this.string0.current.style.transform = 'translateX(' + left + 'px)'
    this.string1.current.style.transform = 'translateX(' + left2 + 'px)'
    this.string2.current.style.transform = 'translateX(' + left4 + 'px)'
    this.string3.current.style.transform = 'translateX(' + left2 + 'px)'
    this.string4.current.style.transform = 'translateX(' + left + 'px)'
    this.string5.current.style.transform = 'translateX(' + left3 + 'px)'
    this.string6.current.style.transform = 'translateX(' + left2 + 'px)'
    this.string7.current.style.transform = 'translateX(' + left + 'px)'
    this.string8.current.style.transform = 'translateX(' + left3 + 'px)'
    this.string9.current.style.transform = 'translateX(' + left + 'px)'
  }

  render() {
    return (
      <BaseContainer ref={this.explainer}>
        <div className="background">
          {hexStrings.map((s, i) => (
            <div key={i} className="bg-string" ref={this['string' + i]}>
              {s}
            </div>
          ))}
        </div>
        <div className="hook">
          <p>alice.mywallet.eth</p>
        </div>
      </BaseContainer>
    )
  }
}

export default Explainer
