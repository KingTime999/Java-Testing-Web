import React, { useContext, useEffect, useState } from "react" // import necessary hooks
import { toast } from "react-hot-toast" // import toast for notifications
import { ShopContext } from "../../context/ShopContext" // import ShopContext
import { 
  FiDollarSign, 
  FiShoppingCart, 
  FiUsers, 
  FiPackage,
  FiTrendingUp,
  FiCalendar
} from "react-icons/fi" // import icons
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts" // import recharts for charts

// Component to display statistics report (Admin)
const Report = () => {
  const { axios, currency } = useContext(ShopContext) // get axios and currency from context
  const [loading, setLoading] = useState(true) // loading state
  const [reportData, setReportData] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    recentOrders: [],
    topProducts: [],
    ordersByStatus: {}
  })

  // State for charts
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()) // selected year for bar chart
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1) // selected month for pie chart
  const [selectedYearForPie, setSelectedYearForPie] = useState(new Date().getFullYear()) // selected year for pie chart
  const [monthlyRevenue, setMonthlyRevenue] = useState([]) // monthly revenue data
  const [categoryData, setCategoryData] = useState([]) // category data by month
  const [availableYears, setAvailableYears] = useState([]) // list of available years

  // Colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF6B9D']

  // Function fetchReportData: fetch report data from server
  const fetchReportData = async () => {
    try {
      setLoading(true)
      
      // Call APIs to fetch data
      const [ordersRes, customersRes, productsRes] = await Promise.all([
        axios.post("/api/order/list"),
        axios.get("/api/user/list-all"),
        axios.get("/api/product/list")
      ])

      if (ordersRes.data.success && customersRes.data.success && productsRes.data.success) {
        const orders = ordersRes.data.data.orders
        const customers = customersRes.data.data.users
        const products = productsRes.data.products

        // Calculate total revenue (only paid orders OR orders with status Done)
        const totalRevenue = orders
          .filter(order => order.isPaid || order.status === 'Done')
          .reduce((sum, order) => sum + order.amount, 0)

        // Count orders by status
        const ordersByStatus = orders.reduce((acc, order) => {
          acc[order.status] = (acc[order.status] || 0) + 1
          return acc
        }, {})

        // Get 5 most recent orders
        const recentOrders = orders
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5)

        // Calculate best-selling products (from orders)
        const productSales = {}
        orders.forEach(order => {
          order.items.forEach(item => {
            const productId = item.product?._id
            if (productId) {
              productSales[productId] = (productSales[productId] || 0) + item.quantity
            }
          })
        })

        // Sort and get top 5 products
        const topProducts = Object.entries(productSales)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([productId, quantity]) => {
            const product = products.find(p => p._id === productId)
            return { product, quantity }
          })
          .filter(item => item.product) // Remove products not found

        setReportData({
          totalRevenue,
          totalOrders: orders.length,
          totalCustomers: customers.length,
          totalProducts: products.length,
          recentOrders,
          topProducts,
          ordersByStatus
        })

        // Calculate chart data
        calculateChartData(orders, products)

        console.log("✅ Loaded report data")
      } else {
        toast.error("Failed to load report data")
      }
    } catch (error) {
      console.log("❌ Fetch report error:", error)
      toast.error(error.message || "Error loading report")
    } finally {
      setLoading(false)
    }
  }

  // Function to calculate chart data
  const calculateChartData = (orders, products) => {
    // Get list of years with orders
    const years = [...new Set(orders.map(order => new Date(order.createdAt).getFullYear()))]
      .sort((a, b) => b - a)
    setAvailableYears(years)

    // Calculate monthly revenue for selected year
    const revenueByMonth = Array.from({ length: 12 }, (_, i) => ({
      month: `Month ${i + 1}`,
      revenue: 0
    }))

    orders.forEach(order => {
      if (order.isPaid || order.status === 'Done') {
        const orderDate = new Date(order.createdAt)
        const orderYear = orderDate.getFullYear()
        const orderMonth = orderDate.getMonth()

        if (orderYear === selectedYear) {
          revenueByMonth[orderMonth].revenue += order.amount
        }
      }
    })

    setMonthlyRevenue(revenueByMonth)

    // Calculate sales by category for selected month
    const categorySales = {}

    orders.forEach(order => {
      // Only count paid orders OR orders with status Done
      if (order.isPaid || order.status === 'Done') {
        const orderDate = new Date(order.createdAt)
        const orderYear = orderDate.getFullYear()
        const orderMonth = orderDate.getMonth() + 1

        if (orderYear === selectedYearForPie && orderMonth === selectedMonth) {
          order.items.forEach(item => {
            if (item.product) {
              const category = item.product.category || 'Other'
              categorySales[category] = (categorySales[category] || 0) + item.quantity
            }
          })
        }
      }
    })

    const categoryArray = Object.entries(categorySales).map(([name, value]) => ({
      name,
      value
    }))

    setCategoryData(categoryArray)
  }

  // Effect to recalculate data when year/month changes
  useEffect(() => {
    if (reportData.totalOrders > 0) {
      // Refetch orders and products for calculation
      const refetchData = async () => {
        try {
          const [ordersRes, productsRes] = await Promise.all([
            axios.post("/api/order/list"),
            axios.get("/api/product/list")
          ])

          if (ordersRes.data.success && productsRes.data.success) {
            calculateChartData(ordersRes.data.data.orders, productsRes.data.products)
          }
        } catch (error) {
          console.log("❌ Refetch chart data error:", error)
        }
      }
      refetchData()
    }
  }, [selectedYear, selectedMonth, selectedYearForPie])

  useEffect(() => {
    fetchReportData() // call when component mounts
  }, [])

  // Display loading spinner
  if (loading) {
    return (
      <div className="px-2 sm:px-6 py-12 m-2 h-[97vh] bg-primary overflow-y-scroll lg:w-4/5 rounded-xl flex items-center justify-center custom-scrollbar">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
          <p className="mt-3 text-gray-600">Loading report...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="px-2 sm:px-6 py-12 m-2 h-[97vh] bg-primary overflow-y-scroll lg:w-4/5 rounded-xl custom-scrollbar">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Statistics Report</h2>
        <p className="text-gray-600 text-sm mt-1">Business activity overview</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Total Revenue */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Total Revenue</p>
              <h3 className="text-2xl font-bold text-gray-800">
                {currency}{reportData.totalRevenue.toLocaleString()}
              </h3>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <FiDollarSign className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Total Orders</p>
              <h3 className="text-2xl font-bold text-gray-800">{reportData.totalOrders}</h3>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <FiShoppingCart className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        {/* Total Customers */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Total Customers</p>
              <h3 className="text-2xl font-bold text-gray-800">{reportData.totalCustomers}</h3>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <FiUsers className="text-purple-600" size={24} />
            </div>
          </div>
        </div>

        {/* Total Products */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Total Products</p>
              <h3 className="text-2xl font-bold text-gray-800">{reportData.totalProducts}</h3>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <FiPackage className="text-orange-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Revenue Chart */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FiTrendingUp className="text-gray-700" size={20} />
            <h3 className="text-lg font-bold text-gray-800">Monthly Revenue</h3>
          </div>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
          >
            {availableYears.map(year => (
              <option key={year} value={year}>Year {year}</option>
            ))}
          </select>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyRevenue}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => `${currency}${value.toLocaleString()}`} />
            <Legend />
            <Bar dataKey="revenue" fill="#8884d8" name="Revenue" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Best-selling Categories by Month */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FiPackage className="text-gray-700" size={20} />
            <h3 className="text-lg font-bold text-gray-800">Best-selling Categories</h3>
          </div>
          <div className="flex gap-2">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>Month {i + 1}</option>
              ))}
            </select>
            <select
              value={selectedYearForPie}
              onChange={(e) => setSelectedYearForPie(Number(e.target.value))}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
            >
              {availableYears.map(year => (
                <option key={year} value={year}>Year {year}</option>
              ))}
            </select>
          </div>
        </div>
        {categoryData.length > 0 ? (
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
            <ResponsiveContainer width="100%" height={300} maxWidth={400}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value} products`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2">
              {categoryData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <span className="text-sm text-gray-700">{entry.name}: {entry.value} products</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No data for month {selectedMonth}/{selectedYearForPie}
          </div>
        )}
      </div>

      {/* Two columns layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders by Status */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <FiTrendingUp className="text-gray-700" size={20} />
            <h3 className="text-lg font-bold text-gray-800">Orders by Status</h3>
          </div>
          <div className="space-y-3">
            {Object.entries(reportData.ordersByStatus).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{status}</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-secondary h-2 rounded-full"
                      style={{ 
                        width: `${(count / reportData.totalOrders) * 100}%` 
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-800 min-w-[30px]">
                    {count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Best-selling Products */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <FiPackage className="text-gray-700" size={20} />
            <h3 className="text-lg font-bold text-gray-800">Top Best-selling Products</h3>
          </div>
          <div className="space-y-3">
            {reportData.topProducts.map((item, index) => (
              <div key={item.product._id} className="flex items-center gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-secondary">{index + 1}</span>
                </div>
                <img
                  src={item.product.image[0]}
                  alt={item.product.name}
                  className="w-12 h-12 object-cover rounded"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {item.product.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {currency}{item.product.offerPrice}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-800">{item.quantity}</p>
                  <p className="text-xs text-gray-500">sold</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white p-4 rounded-lg shadow-sm mt-6">
        <div className="flex items-center gap-2 mb-4">
          <FiCalendar className="text-gray-700" size={20} />
          <h3 className="text-lg font-bold text-gray-800">Recent Orders</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase py-3 px-2">
                  Order ID
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase py-3 px-2">
                  Customer
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase py-3 px-2">
                  Total
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase py-3 px-2">
                  Status
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase py-3 px-2">
                  Order Date
                </th>
              </tr>
            </thead>
            <tbody>
              {reportData.recentOrders.map((order) => (
                <tr key={order._id} className="border-b border-gray-100">
                  <td className="py-3 px-2">
                    <span className="text-xs font-mono text-gray-700">
                      ...{order._id ? order._id.slice(-8) : 'N/A'}
                    </span>
                  </td>
                  <td className="py-3 px-2">
                    <span className="text-sm text-gray-800">
                      {order.address.firstName} {order.address.lastName}
                    </span>
                  </td>
                  <td className="py-3 px-2">
                    <span className="text-sm font-semibold text-gray-800">
                      {currency}{order.amount ? order.amount.toLocaleString() : '0'}
                    </span>
                  </td>
                  <td className="py-3 px-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      order.status === 'Done' ? 'bg-emerald-100 text-emerald-700' :
                      order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                      order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                      order.status === 'Packing' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-2">
                    <span className="text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Report
