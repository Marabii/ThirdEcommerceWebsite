import { useState, useEffect } from 'react'
import axiosInstance from '../../../../utils/verifyJWT'
import { Bar } from 'react-chartjs-2'
import 'chart.js/auto'
import { LoaderCircle } from 'lucide-react'

const ChartMonthlyRevenues = () => {
  const [monthlyRevenues, setMonthlyRevenues] = useState()
  const serverURL = import.meta.env.VITE_REACT_APP_SERVER

  useEffect(() => {
    const getMonthlyOrders = async () => {
      try {
        const response = await axiosInstance.get(
          `${serverURL}/api/monthly-revenues`
        )
        const data = response.data
        setMonthlyRevenues(data)
      } catch (e) {
        console.error(e)
        alert('Unable to get monthly revenues')
      }
    }
    getMonthlyOrders()
  }, [])

  const data = {
    labels: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ],
    datasets: [
      {
        label: 'Monthly Revenues',
        backgroundColor: 'rgba(34, 117, 252, 0.5)',
        borderColor: 'rgba(34, 117, 252 ,1)',
        borderWidth: 2,
        hoverBackgroundColor: 'rgba(75,192,192,0.7)',
        hoverBorderColor: 'rgba(75,192,192,1)',
        data: monthlyRevenues
      }
    ]
  }

  const options = {
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true
      },
      x: {
        beginAtZero: true
      }
    }
  }

  if (!monthlyRevenues) {
    return (
      <div>
        <LoaderCircle className="animate-spin" size={70} />
      </div>
    )
  }

  return (
    <div className="h-[400px] w-full rounded-xl bg-white p-5 pb-20 shadow-lg">
      <h2 className="mb-5 text-2xl font-bold">Revenue For The Last Year</h2>
      <Bar data={data} options={options} />
    </div>
  )
}

export default ChartMonthlyRevenues
