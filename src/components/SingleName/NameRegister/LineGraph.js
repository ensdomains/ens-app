import Chart from 'chart.js'
import styled from '@emotion/styled/macro'
import React, { useEffect } from 'react'

const LineGraphContainer = styled('div')`
  background-color: white;
  padding: 1em;
`

const Legend = styled('div')`
  display: flex;
  justify-content: space-between;
  span {
    margin: 1em;
  }
`

const Canvas = styled('canvas')`
  background-color: #e9eef6;
`

const Title = styled('span')`
  font-weight: bold;
  font-size: large;
`
export default function LineGraph({
  daysPast,
  daysRemaining,
  totalDays,
  premiumInEth,
  ethUsdPremiumPrice,
  startingPriceInEth
}) {
  const chartRef = React.createRef()
  let i
  const labels = []
  const data = []
  const pointRadius = []
  for (i = totalDays; i > 0; i--) {
    labels.push(i)
    if (i == 1) {
      data.push(0)
    } else if (i >= daysPast) {
      data.push(i)
    } else {
      data.push(null)
    }
    if (i == totalDays || i == daysPast) {
      pointRadius.push(3)
    } else if (i > daysPast || i == 1) {
      pointRadius.push(0)
    } else {
      pointRadius.push(null)
    }
  }

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d')
    console.log({ ctx })

    // ctx.style.backgroundColor = '#E9EEF6';
    new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        //Bring in data
        datasets: [
          {
            label: 'Day',
            borderWidth: 3,
            data,
            borderColor: '#2C46A6',
            backgroundColor: '#2C46A6',
            pointRadius,
            fill: false
          },
          {
            label: 'Day',
            borderWidth: 2,
            data: labels,
            borderColor: '#D8D8D8',
            fill: false,
            pointStyle: 'line'
          }
        ]
      },
      options: {
        animation: {
          duration: 0
        },
        responsive: true,
        aspectRatio: 5,
        legend: {
          display: false
        },
        scales: {
          xAxes: [
            {
              ticks: { display: false },
              gridLines: {
                color: 'white',
                lineWidth: 3,
                offsetGridLines: true,
                drawBorder: false
              }
            }
          ],
          yAxes: [
            {
              ticks: { display: false },
              gridLines: {
                display: false,
                drawBorder: false
              }
            }
          ]
        },
        layout: {
          padding: {
            top: 0,
            left: -5,
            right: 0,
            bottom: 0
          }
        }
      }
    })
  })

  return (
    <LineGraphContainer>
      <Legend>
        <Title>
          Buy now for {premiumInEth} ETH(${ethUsdPremiumPrice.toFixed(2)})
        </Title>
        <span>
          {daysRemaining} (out of {totalDays}) days remaining
        </span>
      </Legend>
      <Canvas id="myChart" ref={chartRef} />
      <Legend>
        <span>Starting price: {startingPriceInEth} ETH</span>
        <span>End price: 0 ETH</span>
      </Legend>
    </LineGraphContainer>
  )
}
