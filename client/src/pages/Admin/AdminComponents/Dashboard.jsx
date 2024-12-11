import ChartMonthlyRevenues from './AdminSubComponents/ChartMonthlyRevenues'
import TopProducts from './AdminSubComponents/TopProducts'
import LatestComments from './AdminSubComponents/LatestComments'

const Dashboard = () => {
  return (
    <div className="flex w-full flex-wrap items-center justify-around gap-20 rounded-xl p-5">
      <h1 className="w-fit rounded-md bg-white px-4 py-3 text-center text-2xl font-bold text-blue-600">
        Dashboard
      </h1>
      <ChartMonthlyRevenues />
      <TopProducts />
      <LatestComments />
    </div>
  )
}

export default Dashboard
