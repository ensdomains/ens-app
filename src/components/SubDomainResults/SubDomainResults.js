import React, { Fragment, Component } from 'react'
import { findDOMNode } from 'react-dom'
import { Query } from '@apollo/client/react/components'
import { gql } from '@apollo/client'
import styled from '@emotion/styled/macro'
import ReactTransitionGroup from 'react-transition-group-plus'
import { TweenMax, TimelineMax, Linear, Sine } from 'gsap/umd/TweenMax'

import { SubDomainStateFields } from '../../graphql/fragments'
import { GET_SUBDOMAIN_FAVOURITES } from '../../graphql/queries'
import DomainItem from '../DomainItem/DomainItem'
import Loader from '../Loader'
import { H2 as DefaultH2 } from '../Typography/Basic'

const animationStates = {
  beforeEnter: { x: -100, scale: 1, opacity: 0 },
  idle: { x: 0, scale: 1, opacity: 1 },
  afterLeave: { x: 100, scale: 1, opacity: 0 }
}

const H2 = styled(DefaultH2)`
  margin-top: 50px;
`

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
    this.timeline.seek('beforeEnter')
    TweenMax.killTweensOf(this.timeline)
    TweenMax.to(this.timeline, this.props.enterDuration, {
      time: this.timeline.getLabelTime('idle'),
      onComplete: callback,
      ease: Sine.easeOut
    })
  }

  componentWillLeave(callback) {
    this.timeline.pause()
    TweenMax.killTweensOf(this.timeline)
    TweenMax.to(this.timeline, this.props.leaveDuration, {
      time: this.timeline.getLabelTime('afterLeave'),
      onComplete: callback,
      ease: Sine.easeIn
    })
  }

  isFavourite() {
    return (
      this.props.subDomainFavourites.filter(
        domain => this.props.node.name === domain.name
      ).length > 0
    )
  }

  render() {
    const { node } = this.props
    if (!node.available) {
      return (
        <DomainItem
          domain={node}
          isSubDomain={true}
          isFavourite={this.isFavourite()}
        />
      )
    }
    return (
      <DomainItem
        domain={node}
        isSubDomain={true}
        isFavourite={this.isFavourite()}
      />
    )
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

  render() {
    const { subDomainState, subDomainFavourites } = this.props
    let index = 0
    return (
      <Fragment>
        <H2>Subdomains</H2>
        {subDomainState && subDomainState.length > 0 ? (
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

              if (found) {
                index++
              }
              return (
                <SubDomainNode
                  newIndex={found ? index : ''}
                  node={node}
                  key={node.label + '.' + node.domain}
                  enterDuration={1}
                  subDomainFavourites={subDomainFavourites}
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
      <Query query={GET_SUBDOMAIN_FAVOURITES}>
        {({ data: { subDomainFavourites } = {}, loading: loading2 }) => (
          <Query query={GET_SUBDOMAIN_STATE}>
            {({ data, loading }) => {
              const { subDomainState } = data
              if (loading || loading2) return <div>Loading...</div>
              return (
                <SubDomainsContainer
                  subDomainState={subDomainState}
                  subDomainFavourites={subDomainFavourites}
                />
              )
            }}
          </Query>
        )}
      </Query>
    )
  }
}

export default SubDomainResults
