import Chart from 'chart.js'
import styled from '@emotion/styled/macro'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
const DAY = 60 * 60 * 24
const HOUR = 60 * 60

const LineGraphContainer = styled('div')`
  background-color: white;
  color: #d8d8d8;
  padding: 1em;
  #myChart {
    cursor: pointer;
  }
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
  startDate,
  currentDate,
  targetDate,
  endDate,
  startPremium,
  currentPremiumInEth,
  currentPremium,
  targetPremium,
  handleTooltip
}) {
  const daysPast = parseInt(currentDate.diff(startDate) / DAY / 1000)
  const totalDays = parseInt(endDate.diff(startDate) / DAY / 1000)
  const daysRemaining = totalDays - daysPast
  const totalHr = parseInt(endDate.diff(startDate) / HOUR / 1000)

  const chartRef = React.createRef()
  const labels = []
  const dates = []
  const data = []
  const pointRadius = []
  const supportLine = []
  const { t } = useTranslation()
  const [chart, setChart] = useState(false)

  for (let i = startDate.clone(); endDate.diff(i) > 0; i = i.add(1, 'hour')) {
    let diff = targetDate.diff(i) / HOUR / 1000
    let rate = diff / totalHr
    let premium = startPremium * rate
    let label = i.format('YYYY-MM-DD:HH:00')
    dates.push(label)
    labels.push(premium)
    if (
      currentDate.diff(i) >= 0 ||
      currentDate.format('YYYY-MM-DD:HH:00') === label
    ) {
      data.push(premium)
    } else {
      data.push(null)
    }
    if (
      currentDate.format('YYYY-MM-DD:HH:00') === label ||
      startDate.format('YYYY-MM-DD:HH:00') === label ||
      targetDate.format('YYYY-MM-DD:HH:00') === label ||
      targetDate === label
    ) {
      pointRadius.push(3)
    } else {
      pointRadius.push(null)
    }
    if (targetDate === label) {
      supportLine.push(2000)
    } else {
      supportLine.push(null)
    }
  }
  useEffect(() => {
    const ctx = chartRef.current.getContext('2d')
    Chart.defaults.global.tooltips.yAlign = 'top'
    Chart.defaults.global.tooltips.xAlign = 'center'
    let _chart = new Chart(ctx, {
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
            pointBackgroundColor: '#2C46A6',
            pointBorderColor: '#2C46A6',
            fill: false,
            pointRadius
          }
        ]
      },
      options: {
        events: ['click'],
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
              handleTooltip(tooltipItem)
              let label = `Premium: $${tooltipItem.yLabel.toFixed(2)}`
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
              afterFit: scale => {
                scale.height = 0
              },
              ticks: {
                maxTicksLimit: totalDays,
                callback: function() {
                  return ''
                }
              },
              gridLines: {
                zeroLineColor: '#e9eef6',
                zeroLineWidth: 3,
                color: 'white',
                lineWidth: 3,
                offsetGridLines: false,
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
          padding: {}
        }
      }
    })
    setChart(_chart)
  }, [])
  if (chart) {
    chart.data.datasets[0].pointRadius = pointRadius
    chart.data.datasets[1].pointRadius = pointRadius
    chart.update()
  }

  return (
    <LineGraphContainer>
      <Legend>
        <Title>
          {t('linegraph.title', {
            premiumInEth: currentPremiumInEth.toFixed(2)
          })}{' '}
          ETH($
          {currentPremium.toFixed(2)})
        </Title>
        <span>
          {t('linegraph.daysRemaining', { daysRemaining, totalDays })}
        </span>
      </Legend>
      <Canvas id="myChart" ref={chartRef} />
      <Legend>
        <span>
          {t('linegraph.startingPrice')}: ${startPremium}{' '}
        </span>
        <span>{t('linegraph.endPrice')}: $0</span>
      </Legend>
    </LineGraphContainer>
  )
}
