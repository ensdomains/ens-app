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
  ethUsdPremiumPrice,
  startingPremiumInDai,
  handleTooltip
}) {
  const chartRef = React.createRef()
  let i
  const labels = []
  const dates = []
  const data = []
  const pointRadius = []
  const { t } = useTranslation()
  const dailyRate = startingPremiumInDai / totalDays

  useEffect(() => {
    for (i = totalDays; i >= 0; i--) {
      let todayRate = (i * dailyRate).toFixed(2)
      dates.push(`Day ${i}`)
      labels.push(todayRate)
      if (i >= daysRemaining) {
        data.push(todayRate)
      } else {
        data.push(null)
      }
      if (i == totalDays || i == daysRemaining || i == 0) {
        pointRadius.push(3)
      } else if (i > daysRemaining || i == 1) {
        pointRadius.push(0)
      } else {
        pointRadius.push(null)
      }
    }
    const ctx = chartRef.current.getContext('2d')
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: dates,
        //Bring in data
        datasets: [
          {
            label: 'Passed',
            borderWidth: 3,
            data,
            borderColor: '#2C46A6',
            backgroundColor: '#2C46A6',
            pointRadius,
            fill: false
          },
          {
            label: 'Estimate',
            borderWidth: 2,
            data: labels,
            borderColor: '#D8D8D8',
            pointBackgroundColor: '#D8D8D8',
            fill: false,
            pointRadius
          }
        ]
      },
      options: {
        animation: {
          duration: 0
        },
        tooltips: {
          enabled: true,
          mode: 'nearest',
          intersect: false,
          titleAlign: 'center',
          multiKeyBackground: '#2C46A6',
          callbacks: {
            label: function(tooltipItem, data) {
              handleTooltip(tooltipItem.yLabel)
              let label = 'Premium: $'
              label += Math.round(tooltipItem.yLabel * 100) / 100
              if (tooltipItem.datasetIndex === 1) {
                return label
              }
            }
          }
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
              ticks: { display: false, max: 2100 },
              gridLines: {
                display: false,
                drawBorder: false
              }
            }
          ]
        },
        layout: {
          padding: {
            right: 10
          }
        }
      }
    })
  }, [])

  return (
    <LineGraphContainer>
      <Legend>
        <Title>
          {t('linegraph.title', {
            premiumInEth: premiumInEth && premiumInEth.toFixed(2)
          })}{' '}
          ETH($
          {ethUsdPremiumPrice.toFixed(2)})
        </Title>
        <span>
          {t('linegraph.daysRemaining', { daysRemaining, totalDays })}
        </span>
      </Legend>
      <Canvas id="myChart" ref={chartRef} />
      <Legend>
        <span>
          {t('linegraph.startingPrice')}: ${startingPremiumInDai}{' '}
        </span>
        <span>{t('linegraph.endPrice')}: $0</span>
      </Legend>
    </LineGraphContainer>
  )
}
