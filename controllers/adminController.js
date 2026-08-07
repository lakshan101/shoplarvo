const memoryEmployees = [
  { _id: 'emp_1', name: 'Alexander Wright', email: 'alex@stylehub.com', department: 'Fashion Design', designation: 'Lead Stylist', salary: 4500.00, hireDate: '2024-01-15' },
  { _id: 'emp_2', name: 'Elena Rostova', email: 'elena@stylehub.com', department: 'Inventory & Operations', designation: 'Warehouse Manager', salary: 3800.00, hireDate: '2024-06-01' }
];

const memoryCoupons = [
  { _id: 'coup_1', code: 'STYLE25', discountPercentage: 25, expiryDate: '2026-12-31', minPurchase: 50, isActive: true },
  { _id: 'coup_2', code: 'LUXURY25', discountPercentage: 25, expiryDate: '2026-12-31', minPurchase: 100, isActive: true }
];

const getAdminStats = async (req, res) => {
  res.json({
    success: true,
    stats: {
      totalSales: 54890.00,
      totalOrders: 142,
      totalCustomers: 98,
      lowStockProducts: 3
    }
  });
};

const getEmployees = async (req, res) => {
  res.json({ success: true, count: memoryEmployees.length, employees: memoryEmployees });
};

const createEmployee = async (req, res) => {
  const newEmp = { _id: 'emp_' + Date.now(), ...req.body, hireDate: new Date().toISOString().split('T')[0] };
  memoryEmployees.unshift(newEmp);
  res.status(201).json({ success: true, message: 'Employee added successfully', employee: newEmp });
};

const getCoupons = async (req, res) => {
  res.json({ success: true, count: memoryCoupons.length, coupons: memoryCoupons });
};

const createCoupon = async (req, res) => {
  const newCoup = { _id: 'coup_' + Date.now(), ...req.body, isActive: true };
  memoryCoupons.unshift(newCoup);
  res.status(201).json({ success: true, message: 'Coupon created successfully', coupon: newCoup });
};

module.exports = {
  getAdminStats,
  getEmployees,
  createEmployee,
  getCoupons,
  createCoupon
};
