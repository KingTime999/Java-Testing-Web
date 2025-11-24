import React, { useContext, useEffect, useState } from "react" // import necessary hooks
import { toast } from "react-hot-toast" // import toast for notifications
import { ShopContext } from "../../context/ShopContext" // import ShopContext
import { FiEye, FiEyeOff, FiUserPlus, FiX, FiEdit2, FiTrash2, FiSearch } from "react-icons/fi" // import icons for show/hide password, add user, edit and delete

// Component to display customer list (Admin)
const ListCustomer = () => {
  const { axios } = useContext(ShopContext) // get axios from context
  const [customers, setCustomers] = useState([]) // state containing customer array
  const [loading, setLoading] = useState(true) // loading state
  const [showPasswords, setShowPasswords] = useState({}) // state to track which passwords are visible
  const [showAddModal, setShowAddModal] = useState(false) // state to show/hide add customer modal
  const [showEditModal, setShowEditModal] = useState(false) // state to show/hide edit customer modal
  const [editingCustomer, setEditingCustomer] = useState(null) // state storing customer being edited
  const [searchTerm, setSearchTerm] = useState("") // state for search functionality
  
  // State for add customer form
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    gender: "",
    phone: "",
    address: ""
  })

  // fetchAllCustomers function: get customer list from server
  const fetchAllCustomers = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get("/api/user/list-all") // call API
      if (data.success) {
        setCustomers(data.data.users) // save customers to state from data.data.users
        console.log("✅ Loaded customers:", data.data.users.length)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log("❌ Fetch error:", error)
      toast.error(error.message || "Error loading customer list")
    } finally {
      setLoading(false)
    }
  }

  // Toggle password visibility for a specific customer
  const togglePasswordVisibility = (customerId) => {
    setShowPasswords(prev => ({
      ...prev,
      [customerId]: !prev[customerId]
    }))
  }

  // Function to handle input changes in form
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Function to add new customer
  const handleAddCustomer = async (e) => {
    e.preventDefault()
    
    // Validate data
    if (!formData.name || !formData.email || !formData.password) {
      toast.error("Please fill in full name, email and password")
      return
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      toast.error("Invalid email format")
      return
    }

    // Validate password length
    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters")
      return
    }

    try {
      const { data } = await axios.post("/api/user/register", formData)
      if (data.success) {
        toast.success("Customer added successfully!")
        setShowAddModal(false) // close modal
        // Reset form
        setFormData({
          name: "",
          email: "",
          password: "",
          age: "",
          gender: "",
          phone: "",
          address: ""
        })
        fetchAllCustomers() // reload list
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log("❌ Add customer error:", error)
      toast.error(error.response?.data?.message || error.message || "Error adding customer")
    }
  }

  // Function to open edit modal and load customer data
  const handleEditClick = (customer) => {
    setEditingCustomer(customer)
    setFormData({
      name: customer.name || "",
      email: customer.email || "",
      password: "", // don't load old password
      age: customer.age || "",
      gender: customer.gender || "",
      phone: customer.phone || "",
      address: customer.address || ""
    })
    setShowEditModal(true)
  }

  // Function to update customer information
  const handleUpdateCustomer = async (e) => {
    e.preventDefault()
    
    // Validate data
    if (!formData.name || !formData.email) {
      toast.error("Please fill in full name and email")
      return
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      toast.error("Invalid email format")
      return
    }

    // If new password entered, validate length
    if (formData.password && formData.password.length < 8) {
      toast.error("Password must be at least 8 characters")
      return
    }

    // Check if editingCustomer exists
    if (!editingCustomer || (!editingCustomer._id && !editingCustomer.id)) {
      toast.error("Customer ID not found. Please try again.")
      return
    }

    try {
      // Get customer ID (support both _id and id formats)
      const customerId = editingCustomer._id || editingCustomer.id
      
      // Create object containing only fields with values
      const updateData = {
        customerId: customerId,
        name: formData.name,
        email: formData.email,
        age: formData.age || undefined,
        gender: formData.gender || undefined,
        phone: formData.phone || undefined,
        address: formData.address || undefined
      }
      
      // Only add password if user entered new one
      if (formData.password) {
        updateData.password = formData.password
      }

      console.log("Sending update request with data:", updateData)
      const { data } = await axios.post("/api/user/update", updateData)
      if (data.success) {
        toast.success("Customer updated successfully!")
        setShowEditModal(false)
        setEditingCustomer(null)
        // Reset form
        setFormData({
          name: "",
          email: "",
          password: "",
          age: "",
          gender: "",
          phone: "",
          address: ""
        })
        fetchAllCustomers() // reload list
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log("❌ Update customer error:", error)
      toast.error(error.response?.data?.message || error.message || "Error updating customer")
    }
  }

  // Function to delete customer
  const handleDeleteCustomer = async (customerId, customerName) => {
    // Confirm before deleting
    if (!window.confirm(`Are you sure you want to delete customer "${customerName}"?`)) {
      return
    }

    try {
      const { data } = await axios.post("/api/user/delete", { customerId })
      if (data.success) {
        toast.success("Customer deleted successfully!")
        fetchAllCustomers() // reload list
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log("❌ Delete customer error:", error)
      toast.error(error.response?.data?.message || error.message || "Error deleting customer")
    }
  }

  useEffect(() => {
    fetchAllCustomers() // call when component mounts
  }, [])

  // Display loading spinner
  if (loading) {
    return (
      <div className="px-2 sm:px-6 py-12 m-2 h-[97vh] bg-primary overflow-y-scroll lg:w-4/5 rounded-xl flex items-center justify-center custom-scrollbar">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
          <p className="mt-3 text-gray-600">Loading customer list...</p>
        </div>
      </div>
    )
  }

  // Display message when there are no customers
  if (!loading && customers.length === 0) {
    return (
      <div className="px-2 sm:px-6 py-12 m-2 h-[97vh] bg-primary overflow-y-scroll lg:w-4/5 rounded-xl flex items-center justify-center custom-scrollbar">
        <div className="text-center bg-white p-8 rounded-xl shadow-sm">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No customers yet</h3>
          <p className="text-gray-500">Customer list will appear here when people register.</p>
        </div>
      </div>
    )
  }
  // Filter customers based on search term
  const filteredCustomers = customers.filter(customer => {
    const searchLower = searchTerm.toLowerCase()
    return !searchTerm || 
      customer.name?.toLowerCase().includes(searchLower) ||
      customer.email?.toLowerCase().includes(searchLower)
  })

  return (
    <div className="px-2 sm:px-6 py-12 m-2 h-[97vh] bg-primary lg:w-4/5 rounded-xl flex flex-col custom-scrollbar">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Customer List</h2>
        <p className="text-gray-600 text-sm mt-1">Total: {customers.length} customers</p>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by Order ID, customer name, phone or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
          />
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Showing <span className="font-semibold">{filteredCustomers.length}</span> customer(s)
          {searchTerm && ` for "${searchTerm}"`}
        </p>
      </div>

      {/* Add Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto custom-scrollbar" onClick={(e) => e.stopPropagation()}>
            {/* Modal header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Add New Customer</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Add customer form */}
            <form onSubmit={handleAddCustomer} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter full name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="example@email.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                    required
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Minimum 8 characters"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                    required
                    minLength={8}
                  />
                </div>

                {/* Age */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    placeholder="Enter age"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                    min="1"
                    max="150"
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="0123456789"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter full address"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent resize-none"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors"
                >
                  Add Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Customer Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowEditModal(false)}>
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto custom-scrollbar" onClick={(e) => e.stopPropagation()}>
            {/* Modal header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Edit Customer Information</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Edit customer form */}
            <form onSubmit={handleUpdateCustomer} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter full name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="example@email.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                    required
                  />
                </div>

                {/* Password */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Password <span className="text-gray-500">(leave blank if not changing)</span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Minimum 8 characters"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                    minLength={8}
                  />
                </div>

                {/* Age */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    placeholder="Enter age"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                    min="1"
                    max="150"
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="0123456789"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter full address"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent resize-none"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Container with fixed horizontal scrollbar */}
      <div className="overflow-x-auto overflow-y-scroll flex-1 custom-scrollbar">
        {/* Customer list as cards */}
        <div className="flex flex-col gap-4 min-w-[800px]">
        {filteredCustomers.map((customer) => (
          <div key={customer._id} className="bg-white p-4 rounded-lg shadow-sm">
            {/* Card header with Edit and Delete buttons */}
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200">
              <h4 className="text-sm font-semibold text-gray-800">ID: {customer._id ? customer._id.slice(-8) : 'N/A'}</h4>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEditClick(customer)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors text-xs font-medium"
                  title="Edit customer"
                >
                  <FiEdit2 size={14} />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDeleteCustomer(customer._id || customer.id, customer.name)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-colors text-xs font-medium"
                  title="Delete customer"
                >
                  <FiTrash2 size={14} />
                  <span>Delete</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Personal information */}
              <div>
                <h5 className="text-xs font-semibold text-gray-500 uppercase mb-2">Personal Information</h5>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Full Name:</span>
                    <span className="text-sm text-gray-900">{customer.name || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Age:</span>
                    <span className="text-sm text-gray-900">{customer.age || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Gender:</span>
                    <span className="text-sm text-gray-900">{customer.gender || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div>
                <h5 className="text-xs font-semibold text-gray-500 uppercase mb-2">Contact</h5>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Email:</span>
                    <span className="text-sm text-gray-900">{customer.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Phone:</span>
                    <span className="text-sm text-gray-900">{customer.phone || 'N/A'}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-sm font-medium text-gray-700">Address:</span>
                    <span className="text-sm text-gray-900">{customer.address || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Account */}
              <div>
                <h5 className="text-xs font-semibold text-gray-500 uppercase mb-2">Account</h5>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Username:</span>
                    <span className="text-sm text-gray-900 font-mono bg-gray-100 px-2 py-0.5 rounded">
                      {customer.email.split('@')[0]}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Password:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-900 font-mono bg-gray-100 px-2 py-0.5 rounded">
                        {showPasswords[customer._id] ? customer.password : '••••••••'}
                      </span>
                      <button
                        onClick={() => togglePasswordVisibility(customer._id)}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                        title={showPasswords[customer._id] ? "Hide password" : "Show password"}
                      >
                        {showPasswords[customer._id] ? (
                          <FiEyeOff className="text-gray-600" size={16} />
                        ) : (
                          <FiEye className="text-gray-600" size={16} />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Created:</span>
                    <span className="text-sm text-gray-900">
                      {new Date(customer.createdAt).toLocaleDateString('en-US')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        </div>
      </div>
    </div>
  )
}

export default ListCustomer
