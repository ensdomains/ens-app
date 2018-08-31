import React, { Fragment, Component } from 'react'
import { findDOMNode } from 'react-dom'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import styled from 'react-emotion'
import { SubDomainStateFields } from '../../graphql/fragments'
import ReactTransitionGroup from 'react-transition-group-plus'
import { TweenMax, TimelineMax, Linear, Sine } from 'gsap/umd/TweenMax'
import DomainItemDefault from '../DomainItem/DomainItem'
import Loader from '../Loader'
import { H2 } from '../Typography/Basic'

const SubDomainItem = styled(DomainItemDefault)`
  margin-bottom: 4px;
`

const animationStates = {
  beforeEnter: { x: -100, scale: 1, opacity: 0 },
  idle: { x: 0, scale: 1, opacity: 1 },
  afterLeave: { x: 100, scale: 1, opacity: 0 }
}

class SubDomainNode extends Component {
  //static animationStates = animationStates
  componentDidMount() {
    const el = findDOMNode(this)

    this.timeline = new TimelineMax()
      .pause()
      .add(
        TweenMax.to(
          el,
          1,
          Object.assign({}, animationStates.beforeEnter, {
            ease: Linear.easeNone
          })
        )
      )
      .add('beforeEnter')
      .add(
        TweenMax.to(
          el,
          1,
          Object.assign({}, animationStates.idle, {
            ease: Linear.easeNone,
            delay: this.props.newIndex
          })
        )
      )
      .add('idle')
      .add(
        TweenMax.to(
          el,
          1,
          Object.assign({}, animationStates.afterLeave, {
            ease: Linear.easeNone
          })
        )
      )
      .add('afterLeave')

    this.timeline.seek('beforeEnter')
  }

  componentWillAppear(callback) {
    this.timeline.seek('idle')
    callback()
  }

  componentWillEnter(callback) {
    const el = findDOMNode(this)

    this.timeline.seek('beforeEnter')
    TweenMax.killTweensOf(this.timeline)
    TweenMax.to(this.timeline, this.props.enterDuration, {
      time: this.timeline.getLabelTime('idle'),
      onComplete: callback,
      ease: Sine.easeOut
    })
  }

  componentWillLeave(callback) {
    const className = this.props.className
    this.timeline.pause()
    TweenMax.killTweensOf(this.timeline)
    TweenMax.to(this.timeline, this.props.leaveDuration, {
      time: this.timeline.getLabelTime('afterLeave'),
      onComplete: callback,
      ease: Sine.easeIn
    })
  }
  render() {
    const { node } = this.props
    if (!node.available) {
      return <SubDomainItem domain={node} isSubDomain={true} />
    }
    return <SubDomainItem domain={node} isSubDomain={true} />
  }
}

const GET_SUBDOMAIN_STATE = gql`
  query getSubDomainState {
    subDomainState {
      ...SubDomainStateFields
    }
  }

  ${SubDomainStateFields}
`

const alphabeticalAndAvailable = (a, b) => {
  if (a.available && b.available) {
    if (a.domain > b.domain) {
      return 1
    } else {
      return -1
    }
  } else if (a.available) {
    return -1
  } else if (b.available) {
    return 1
  } else {
    if (a.domain > b.domain) {
      return 1
    } else {
      return -1
    }
  }
}

export class SubDomainsContainer extends Component {
  state = {
    subdomains: []
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      this.props.subDomainState &&
      this.props.subDomainState.length !== prevProps.subDomainState.length
    ) {
      this.setState({
        subdomains: this.props.subDomainState
      })
    }
  }
  render() {
    const subDomainState = this.props.subDomainState
    let index = 0
    return (
      <Fragment>
        <H2>Subdomains</H2>
        {subDomainState.length > 0 ? (
          <ReactTransitionGroup
            component="ul"
            transitionMode="out-in"
            style={{ padding: 0 }}
          >
            {[...subDomainState].sort(alphabeticalAndAvailable).map(node => {
              let found = subDomainState.find(element => {
                return (
                  element.label + '.' + element.domain ===
                  node.label + '.' + node.domain
                )
              })

              let newIndex = index

              if (found) {
                index++
              }
              return (
                <SubDomainNode
                  newIndex={found ? index : ''}
                  node={node}
                  key={node.label + '.' + node.domain}
                  enterDuration={1}
                />
              )
            })}
          </ReactTransitionGroup>
        ) : (
          <Loader />
        )}
      </Fragment>
    )
  }
}

class SubDomainResults extends Component {
  render() {
    return (
      <Query query={GET_SUBDOMAIN_STATE} fetchPolicy="no-cache">
        {({ data: { subDomainState }, loading }) => {
          if (loading) return <div>Loading...</div>
          return <SubDomainsContainer subDomainState={subDomainState} />
        }}
      </Query>
    )
  }
}

export default SubDomainResults
