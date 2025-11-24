import React, { useContext, useEffect, useState } from "react" // import necessary hooks
import { toast } from "react-hot-toast" // import toast for notifications
import { ShopContext } from "../../context/ShopContext" // import ShopContext to use axios and currency
import { FiEdit2, FiTrash2, FiPlus, FiX, FiSearch } from "react-icons/fi" // import icons

// Component to display order list (Admin)
const Orders = () => {
  const { currency, axios, products } = useContext(ShopContext) // get currency, axios and products from context
  const [orders, setOrders] = useState([]) // state containing array of orders
  const [loading, setLoading] = useState(true) // state to display loading status
  const [error, setError] = useState(null) // state to save error if any
  const [customers, setCustomers] = useState([]) // state containing list of customers
  
  // States for search and filter
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("All")
  
  // States cho Create Order Modal
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [createForm, setCreateForm] = useState({
    customerId: "",
    items: [],
    address: {
      firstName: "",
      lastName: "",
      email: "",
      street: "",
      city: "",
      state: "",
      zipcode: "",
      country: "",
      phone: ""
    },
    paymentMethod: "COD"
  })
  const [selectedProduct, setSelectedProduct] = useState("")
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedQuantity, setSelectedQuantity] = useState(1)
  
  // States cho Edit Order Modal
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingOrder, setEditingOrder] = useState(null)
  const [editForm, setEditForm] = useState({
    address: {
      firstName: "",
      lastName: "",
      email: "",
      street: "",
      city: "",
      state: "",
      zipcode: "",
      country: "",
      phone: ""
    },
    status: ""
  })

  // fetchAllOrders function: get list of orders from server
  const fetchAllOrders = async () => {
    try {
      setLoading(true) // start loading
      setError(null) // reset error
      console.log("🔄 Fetching orders...")
      const { data } = await axios.post("/api/order/list") // call API /api/order/list
      console.log("📦 Response:", data)
      if (data.success) {
        setOrders(data.data.orders) // save orders to state from data.data.orders
        console.log("✅ Loaded orders:", data.data.orders.length) // log number of orders
      } else {
        const errorMsg = data.message || "Unknown error"
        setError(errorMsg)
        toast.error(errorMsg) // display error if server returns success: false
        console.error("❌ API error:", errorMsg)
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || "Network error"
      setError(errorMsg)
      console.log("❌ Fetch error:", error)
      toast.error(errorMsg) // display error if request fails
    } finally {
      setLoading(false) // end loading
      console.log("✔️ Fetch completed")
    }
  }

  // fetchCustomers function: get list of customers
  const fetchCustomers = async () => {
    try {
      const { data } = await axios.get("/api/user/list-all")
      if (data.success) {
        setCustomers(data.users)
      }
    } catch (error) {
      console.log("Error fetching customers:", error)
    }
  }

  // statusHandler function: change order status (packing, shipped, delivered...)
  const statusHandler = async (e, orderId) => {
    try {
      const { data } = await axios.post("/api/order/status", {
        orderId,
        status: e.target.value, // get value from select
      })
      if (data.success) {
        await fetchAllOrders() // reload order list after update
        toast.success(data.message) // show success notification
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message) // show error notification
    }
  }

  // deleteOrder function: delete an order
  const deleteOrder = async (orderId) => {
    // Confirm before deleting
    if (!window.confirm("Are you sure you want to delete this order?")) {
      return
    }
    
    try {
      const {data} = await axios.post('/api/order/delete', {orderId})
      if(data.success){
        await fetchAllOrders() // reload list after deletion
        toast.success(data.message)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  // editOrder function: open edit order modal
  const editOrder = (orderId) => {
    const order = orders.find(o => o._id === orderId)
    if (order) {
      setEditingOrder(order)
      setEditForm({
        address: { ...order.address },
        status: order.status
      })
      setShowEditModal(true)
    }
  }

  // handleUpdateOrder function: update order
  const handleUpdateOrder = async (e) => {
    e.preventDefault()
    
    try {
      const { data } = await axios.post('/api/order/update', {
        orderId: editingOrder._id,
        address: editForm.address,
        status: editForm.status
      })
      
      if (data.success) {
        await fetchAllOrders()
        setShowEditModal(false)
        setEditingOrder(null)
        toast.success(data.message || "Order updated successfully!")
      } else {
        toast.error(data.message || "Error updating order")
      }
    } catch (error) {
      console.error("Update order error:", error)
      toast.error(error.message || "Error updating order")
    }
  }

  // handleCreateOrder function: create new order
  const handleCreateOrder = async (e) => {
    e.preventDefault()
    
    // Validation
    if (createForm.items.length === 0) {
      toast.error("Please add at least one product")
      return
    }
    if (!createForm.address.firstName || !createForm.address.lastName) {
      toast.error("Please enter customer name")
      return
    }
    if (!createForm.address.phone) {
      toast.error("Please enter phone number")
      return
    }
    if (!createForm.address.street || !createForm.address.city) {
      toast.error("Please enter full address")
      return
    }

    try {
      const { data } = await axios.post('/api/order/create-admin', {
        items: createForm.items,
        address: createForm.address,
        paymentMethod: createForm.paymentMethod
      })
      
      if (data.success) {
        await fetchAllOrders()
        setShowCreateModal(false)
        // Reset form
        setCreateForm({
          customerId: "",
          items: [],
          address: {
            firstName: "",
            lastName: "",
            email: "",
            street: "",
            city: "",
            state: "",
            zipcode: "",
            country: "",
            phone: ""
          },
          paymentMethod: "COD"
        })
        toast.success(data.message || "Order created successfully!")
      } else {
        toast.error(data.message || "Error creating order")
      }
    } catch (error) {
      console.error("Create order error:", error)
      toast.error(error.message || "Error creating order")
    }
  }

  // addProductToOrder function: add product to order
  const addProductToOrder = () => {
    if (!product) {
      toast.error("Please select a product")
      return
    }
    if (!selectedSize) {
      toast.error("Please select a size")
      return
    }
    
    const product = products.find(p => p._id === selectedProduct)
    if (product) {
      setCreateForm(prev => ({
        ...prev,
        items: [...prev.items, {
          product: selectedProduct,
          productName: product.name,
          productImage: product.image[0],
          productPrice: product.offerPrice,
          size: selectedSize,
          quantity: selectedQuantity
        }]
      }))
      // Reset
      setSelectedProduct("")
      setSelectedSize("")
      setSelectedQuantity(1)
      toast.success("Product added to order")
    }
  }

  // removeProductFromOrder function: remove product from order
  const removeProductFromOrder = (index) => {
    setCreateForm(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }))
  }

  // handleCustomerSelect function: select customer
  const handleCustomerSelect = (customerId) => {
    const customer = customers.find(c => c._id === customerId)
    if (customer) {
      setCreateForm(prev => ({
        ...prev,
        customerId: customerId,
        address: {
          firstName: customer.name.split(' ')[0] || "",
          lastName: customer.name.split(' ').slice(1).join(' ') || "",
          email: customer.email || "",
          street: customer.address || "",
          city: "",
          state: "",
          zipcode: "",
          country: "",
          phone: customer.phone || ""
        }
      }))
    }
  }

  useEffect(() => {
    fetchAllOrders() // call when component mounts to load orders
    fetchCustomers() // get list of customers
  }, [])

  // Filter orders based on search and status
  const filteredOrders = orders.filter(order => {
    // Filter by search term (order ID, customer name, phone)
    const searchLower = searchTerm.toLowerCase()
    const matchesSearch = !searchTerm || 
      order._id?.toLowerCase().includes(searchLower) ||
      order.address?.firstName?.toLowerCase().includes(searchLower) ||
      order.address?.lastName?.toLowerCase().includes(searchLower) ||
      order.address?.phone?.toLowerCase().includes(searchLower) ||
      order.address?.email?.toLowerCase().includes(searchLower)
    
    // Flexible status matching to handle variations
    let matchesStatus = filterStatus === "All"
    if (!matchesStatus && order.status) {
      const orderStatus = order.status.toLowerCase().trim()
      const filterStat = filterStatus.toLowerCase().trim()
      
      // Exact match or partial match for similar statuses
      matchesStatus = orderStatus === filterStat ||
                     orderStatus.includes(filterStat) ||
                     filterStat.includes(orderStatus)
    }
    
    return matchesSearch && matchesStatus
  })

  // Hiển thị loading spinner khi đang tải
  if (loading) {
    return (
      <div className="px-2 sm:px-6 py-12 m-2 h-[97vh] bg-primary overflow-y-scroll lg:w-4/5 rounded-xl">
        {/* Header với nút Create Order */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Order Management</h2>
        </div>

        <div className="flex items-center justify-center h-[80vh]">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <p className="mt-3 text-gray-600">Loading orders...</p>
          </div>
        </div>
      </div>
    )
  }

  // Display message when there are no orders
  if (!loading && orders.length === 0) {
    return (
      <div className="px-2 sm:px-6 py-12 m-2 h-[97vh] bg-primary overflow-y-scroll lg:w-4/5 rounded-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Order Management</h2>
        </div>

        <div className="flex items-center justify-center h-[80vh]">
          <div className="text-center bg-white p-8 rounded-xl shadow-sm">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No orders yet</h3>
            <p className="text-gray-500">Orders will appear here when customers place them.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="px-2 sm:px-6 py-12 m-2 h-[97vh] bg-primary overflow-y-scroll lg:w-4/5 rounded-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Order Management</h2>
      </div>

      {/* Search and Filter Bar */}
      <div className="mb-6 space-y-4">
        {/* Search Box */}
        <div className="relative">
          <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Order ID, customer name, phone or email..."
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
          />
        </div>

        {/* Filter Status and Count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing <span className="font-semibold">{filteredOrders.length}</span> order(s)
          </p>
          
          {/* Status Filter Dropdown */}
          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:ring-2 focus:ring-secondary focus:border-transparent cursor-pointer"
            >
              <option value="All">All Status</option>
              <option value="Order Placed">Order Placed</option>
              <option value="Packing">Packing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Done">Done</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Display message if no orders match filter */}
      {filteredOrders.length === 0 && (
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center bg-white p-8 rounded-xl shadow-sm">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No orders found</h3>
            <p className="text-gray-500">
              {searchTerm || filterStatus !== "All" 
                ? "Try adjusting your search or filter criteria." 
                : "Orders will appear here when customers place them."}
            </p>
          </div>
        </div>
      )}

      {/* Loop through each order and display */}
      {filteredOrders.map((order) => (
        <div key={order._id} className="bg-white p-3 mb-4 rounded">
          {/* Products List: products in the order */}
          {order.items.map((item, idx) => (
            <div
              key={`${order._id}-${item.product?._id || idx}`}
              className="text-gray-700 flex flex-col lg:flex-row gap-4 mb-3"
            >
              <div className="flex flex-[2] gap-x-3">
                <div className="flex items-center justify-center bg-primary rounded">
                  {/* Product image in order */}
                  <img
                    src={item.product?.image?.[0] || '/placeholder.png'}
                    alt=""
                    className="max-h-20 max-w-20 object-contain"
                  />
                </div>

                <div className="block w-full">
                  {/* Product name */}
                  <h5 className="h5 capitalize line-clamp-1">
                    {item.product?.name || 'Product name unavailable'}
                  </h5>
                  {/* Additional info: price, quantity, size */}
                  <div className="flex flex-wrap gap-3 max-sm:gap-y-1 mt-1">
                    <div className="flex items-center gap-x-2">
                      <h5 className="medium-14">Price:</h5>
                      <p>
                        {currency}
                        {item.product?.offerPrice || 0}
                      </p>
                    </div>
                    <div className="flex items-center gap-x-2">
                      <h5 className="medium-14">Quantity:</h5>
                      <p>{item.quantity}</p>
                    </div>
                    <div className="flex items-center gap-x-2">
                      <h5 className="medium-14">Size:</h5>
                      <p>{item.size}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Order Summary: order information (id, customer, address, status, date, total) */}
          <div className="flex flex-col lg:flex-row justify-between items-start gap-4 border-t border-gray-300 pt-3">
            <div className="flex flex-col gap-2 flex-1">
              <div className="flex items-center gap-x-2">
                <h5 className="medium-14">OrderId:</h5>
                <p className="text-xs break-all">{order._id}</p>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-x-2">
                  <h5 className="medium-14">Customer:</h5>
                  <p className="text-sm">
                    {order.address.firstName} {order.address.lastName}
                  </p>
                </div>
                <div className="flex items-center gap-x-2">
                  <h5 className="medium-14">Phone:</h5>
                  <p className="text-sm">{order.address.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-x-2">
                <h5 className="medium-14">Address:</h5>
                <p className="text-sm">
                  {order.address.street}, {order.address.city},{" "}
                  {order.address.state}, {order.address.country},{" "}
                  {order.address.zipcode}
                </p>
              </div>
             <div className="flex gap-4">
                <div className="flex items-center gap-x-2">
                  <h5 className="medium-14">Payment Status:</h5>
                  <p className="text-sm">
                    {order.isPaid ? "Done" : "Pending"}
                  </p>
                <div className="flex items-center gap-x-2">
                  <h5 className="medium-14">Method:</h5>
                  <p className="text-sm">{order.paymentMethod}</p>
                </div>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-x-2">
                  <h5 className="medium-14">Date:</h5>
                  <p className="text-sm">
                    {new Date(order.createdAt).toDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-x-2">
                  <h5 className="medium-14">Amount:</h5>
                  <p className="text-sm">
                     {currency}{order.amount}
                  </p>
                </div>
              </div>
            </div>

            {/* Right side: Status selector và Action buttons */}
            <div className="flex flex-col gap-3 items-end">
              {/* Select to change order status */}
              <div className="flex items-center gap-2">
                <h5 className="medium-14">Status:</h5>
                <select
                  onChange={(e) => statusHandler(e, order._id)}
                  value={order.status}
                  className="text-xs font-semibold p-1 ring-1 ring-slate-900/5 rounded max-w-36 bg-primary"
                >
                  <option value="Order Placed">Order Placed</option>
                  <option value="Packing">Packing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Done">Done</option>
                </select>
              </div>

              {/* Action buttons: Edit và Delete */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => editOrder(order._id)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors text-xs font-medium"
                  title="Edit order"
                >
                  <FiEdit2 size={14} />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => deleteOrder(order._id)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-colors text-xs font-medium"
                  title="Delete order"
                >
                  <FiTrash2 size={14} />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Create Order Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white">
              <h3 className="text-xl font-bold text-gray-800">Create New Order</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiX size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleCreateOrder} className="p-6 space-y-6">
              {/* Select Customer */}
              <div>
                <label className="block font-semibold mb-2">Select Customer (Optional)</label>
                <select
                  value={createForm.customerId}
                  onChange={(e) => handleCustomerSelect(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                >
                  <option value="">-- Enter information manually --</option>
                  {customers.map(customer => (
                    <option key={customer._id} value={customer._id}>
                      {customer.name} - {customer.email}
                    </option>
                  ))}
                </select>
              </div>

              {/* Customer Information */}
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Customer Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-1">First Name *</label>
                    <input
                      type="text"
                      value={createForm.address.firstName}
                      onChange={(e) => setCreateForm({...createForm, address: {...createForm.address, firstName: e.target.value}})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Last Name *</label>
                    <input
                      type="text"
                      value={createForm.address.lastName}
                      onChange={(e) => setCreateForm({...createForm, address: {...createForm.address, lastName: e.target.value}})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Email</label>
                    <input
                      type="email"
                      value={createForm.address.email}
                      onChange={(e) => setCreateForm({...createForm, address: {...createForm.address, email: e.target.value}})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      value={createForm.address.phone}
                      onChange={(e) => setCreateForm({...createForm, address: {...createForm.address, phone: e.target.value}})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm mb-1">Street Address *</label>
                    <input
                      type="text"
                      value={createForm.address.street}
                      onChange={(e) => setCreateForm({...createForm, address: {...createForm.address, street: e.target.value}})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">City *</label>
                    <input
                      type="text"
                      value={createForm.address.city}
                      onChange={(e) => setCreateForm({...createForm, address: {...createForm.address, city: e.target.value}})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Country</label>
                    <input
                      type="text"
                      value={createForm.address.country}
                      onChange={(e) => setCreateForm({...createForm, address: {...createForm.address, country: e.target.value}})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                    />
                  </div>
                </div>
              </div>

              {/* Add Products */}
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Add Products</h4>
                <div className="grid grid-cols-4 gap-3 mb-3">
                  <select
                    value={selectedProduct}
                    onChange={(e) => setSelectedProduct(e.target.value)}
                    className="col-span-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                  >
                    <option value="">-- Select product --</option>
                    {products.filter(p => p.inStock).map(product => (
                      <option key={product._id} value={product._id}>
                        {product.name} - {currency}{product.offerPrice}
                      </option>
                    ))}
                  </select>
                  <select
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                  >
                    <option value="">Size</option>
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                    <option value="XL">XL</option>
                    <option value="XXL">XXL</option>
                  </select>
                  <input
                    type="number"
                    min="1"
                    value={selectedQuantity}
                    onChange={(e) => setSelectedQuantity(Number(e.target.value))}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                    placeholder="Qty"
                  />
                </div>
                <button
                  type="button"
                  onClick={addProductToOrder}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
                >
                  Add Product
                </button>

                {/* Products List */}
                {createForm.items.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <h5 className="font-medium">Added products:</h5>
                    {createForm.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <img src={item.productImage} alt="" className="w-12 h-12 object-cover rounded" />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.productName}</p>
                          <p className="text-xs text-gray-600">
                            Size: {item.size} | Qty: {item.quantity} | Price: {currency}{item.productPrice}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeProductFromOrder(index)}
                          className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Payment Method */}
              <div className="border-t pt-4">
                <label className="block font-semibold mb-2">Payment Method</label>
                <select
                  value={createForm.paymentMethod}
                  onChange={(e) => setCreateForm({...createForm, paymentMethod: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                >
                  <option value="COD">COD (Cash on Delivery)</option>
                  <option value="Stripe">Stripe (Paid)</option>
                </select>
              </div>

              {/* Form Actions */}
              <div className="flex gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-secondary hover:bg-secondary/90 text-white font-medium rounded-lg transition-colors"
                >
                  Create Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Order Modal */}
      {showEditModal && editingOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white">
              <h3 className="text-xl font-bold text-gray-800">Edit Order</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiX size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleUpdateOrder} className="p-6 space-y-4">
              {/* Order ID */}
              <div>
                <label className="block font-semibold mb-1">Order ID</label>
                <input
                  type="text"
                  value={editingOrder._id}
                  disabled
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg"
                />
              </div>

              {/* Customer Address */}
              <div>
                <h4 className="font-semibold mb-3">Customer Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-1">First Name</label>
                    <input
                      type="text"
                      value={editForm.address.firstName}
                      onChange={(e) => setEditForm({...editForm, address: {...editForm.address, firstName: e.target.value}})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Last Name</label>
                    <input
                      type="text"
                      value={editForm.address.lastName}
                      onChange={(e) => setEditForm({...editForm, address: {...editForm.address, lastName: e.target.value}})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Email</label>
                    <input
                      type="email"
                      value={editForm.address.email}
                      onChange={(e) => setEditForm({...editForm, address: {...editForm.address, email: e.target.value}})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={editForm.address.phone}
                      onChange={(e) => setEditForm({...editForm, address: {...editForm.address, phone: e.target.value}})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm mb-1">Street Address</label>
                    <input
                      type="text"
                      value={editForm.address.street}
                      onChange={(e) => setEditForm({...editForm, address: {...editForm.address, street: e.target.value}})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">City</label>
                    <input
                      type="text"
                      value={editForm.address.city}
                      onChange={(e) => setEditForm({...editForm, address: {...editForm.address, city: e.target.value}})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Country</label>
                    <input
                      type="text"
                      value={editForm.address.country}
                      onChange={(e) => setEditForm({...editForm, address: {...editForm.address, country: e.target.value}})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                    />
                  </div>
                </div>
              </div>

              {/* Order Status */}
              <div>
                <label className="block font-semibold mb-1">Order Status</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                >
                  <option value="Order Placed">Order Placed</option>
                  <option value="Packing">Packing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Done">Done</option>
                </select>
              </div>

              {/* Form Actions */}
              <div className="flex gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-secondary hover:bg-secondary/90 text-white font-medium rounded-lg transition-colors"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Orders
