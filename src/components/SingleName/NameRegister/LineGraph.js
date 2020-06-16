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
  currentDays,
  premiumInEth,
  ethUsdPremiumPrice,
  startingPriceInEth
}) {
  const chartRef = React.createRef()

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d')
    console.log({ ctx })

    // ctx.style.backgroundColor = '#E9EEF6';
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: [
          28,
          27,
          26,
          25,
          24,
          23,
          22,
          21,
          20,
          19,
          18,
          17,
          16,
          15,
          14,
          13,
          12,
          11,
          10,
          9,
          8,
          7,
          6,
          5,
          4,
          3,
          2,
          1
        ],
        //Bring in data
        datasets: [
          {
            label: 'Day',
            borderWidth: 3,
            data: [
              28,
              27,
              26,
              25,
              24,
              23,
              22,
              21,
              20,
              19,
              18,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              0
            ],
            borderColor: '#2C46A6',
            backgroundColor: '#2C46A6',
            pointRadius: [
              3,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              3,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              0
            ],
            fill: false
          },
          {
            label: 'Day',
            borderWidth: 2,
            data: [
              28,
              27,
              26,
              25,
              24,
              23,
              22,
              21,
              20,
              19,
              18,
              17,
              16,
              15,
              14,
              13,
              12,
              11,
              10,
              9,
              8,
              7,
              6,
              5,
              4,
              3,
              2,
              1
            ],
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
          Buy now for {premiumInEth} ETH(${ethUsdPremiumPrice})
        </Title>
        <span>{currentDays} (out of 28) days remaining</span>
      </Legend>
      <Canvas id="myChart" ref={chartRef} />
      <Legend>
        <span>Starting price: {startingPriceInEth} ETH</span>
        <span>End price: 0 ETH</span>
      </Legend>
    </LineGraphContainer>
  )
}
