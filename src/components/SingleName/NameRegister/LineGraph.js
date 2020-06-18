import Chart from 'chart.js'
import styled from '@emotion/styled/macro'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

const LineGraphContainer = styled('div')`
  background-color: white;
  color: #d8d8d8;
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
  daysRemaining,
  totalDays,
  premiumInEth,
  ethUsdPremiumPrice
}) {
  const chartRef = React.createRef()
  let i
  const labels = []
  const data = []
  const pointRadius = []
  const { t } = useTranslation()
  for (i = totalDays; i > 0; i--) {
    labels.push(i)
    if (i >= daysRemaining) {
      data.push(i)
    } else {
      data.push(null)
    }
    if (i == totalDays || i == daysRemaining) {
      pointRadius.push(3)
    } else if (i > daysRemaining || i == 1) {
      pointRadius.push(0)
    } else {
      pointRadius.push(null)
    }
  }

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d')
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
          {t('linegraph.title', { premiumInEth: premiumInEth.toFixed(2) })}{' '}
          ETH($
          {ethUsdPremiumPrice.toFixed(2)})
        </Title>
        <span>
          {t('linegraph.daysRemaining', { daysRemaining, totalDays })}
        </span>
      </Legend>
      <Canvas id="myChart" ref={chartRef} />
      <Legend>
        <span>{t('linegraph.startingPrice')}: $2000</span>
        <span>{t('linegraph.endPrice')}: $0</span>
      </Legend>
    </LineGraphContainer>
  )
}
