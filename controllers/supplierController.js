const mongoose = require('mongoose');
const Supplier = require('../models/Supplier');
const PurchaseOrder = require('../models/PurchaseOrder');
const Product = require('../models/Product');
const connectDB = require('../config/db');

const ensureConnected = async () => {
  if (mongoose.connection.readyState !== 1) {
    try {
      await connectDB();
    } catch (e) {}
  }
  return mongoose.connection.readyState === 1;
};

// @desc    Get all suppliers
// @route   GET /api/suppliers
// @access  Private/Admin/Staff
const getSuppliers = async (req, res, next) => {
  try {
    await ensureConnected();
    const { search, category, status } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { contactPerson: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    if (category) {
      query.categoriesSupplied = category;
    }

    if (status) {
      query.status = status;
    }

    const suppliers = await Supplier.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: suppliers.length, data: suppliers });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single supplier details with purchase history
// @route   GET /api/suppliers/:id
// @access  Private/Admin/Staff
const getSupplierById = async (req, res, next) => {
  try {
    await ensureConnected();
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) {
      return res.status(404).json({ success: false, message: 'Supplier not found' });
    }

    const purchaseOrders = await PurchaseOrder.find({ supplier: supplier._id }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: supplier,
      purchaseOrders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new supplier
// @route   POST /api/suppliers
// @access  Private/Admin
const createSupplier = async (req, res, next) => {
  try {
    await ensureConnected();
    const { name, contactPerson, email, phone, address, categoriesSupplied, rating } = req.body;

    const supplierExists = await Supplier.findOne({ email });
    if (supplierExists) {
      return res.status(400).json({ success: false, message: 'Supplier with this email already exists' });
    }

    const supplier = await Supplier.create({
      name,
      contactPerson,
      email,
      phone,
      address,
      categoriesSupplied: categoriesSupplied || [],
      rating: rating || 5
    });

    res.status(201).json({ success: true, message: 'Supplier created successfully', data: supplier });
  } catch (error) {
    next(error);
  }
};

// @desc    Update supplier details
// @route   PUT /api/suppliers/:id
// @access  Private/Admin
const updateSupplier = async (req, res, next) => {
  try {
    await ensureConnected();
    const supplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!supplier) {
      return res.status(404).json({ success: false, message: 'Supplier not found' });
    }

    res.json({ success: true, message: 'Supplier updated successfully', data: supplier });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete supplier
// @route   DELETE /api/suppliers/:id
// @access  Private/Admin
const deleteSupplier = async (req, res, next) => {
  try {
    await ensureConnected();
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) {
      return res.status(404).json({ success: false, message: 'Supplier not found' });
    }

    await supplier.deleteOne();
    res.json({ success: true, message: 'Supplier deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a formal Purchase Order (PO)
// @route   POST /api/suppliers/purchase-orders
// @access  Private/Admin
const createPurchaseOrder = async (req, res, next) => {
  try {
    await ensureConnected();
    const { supplierId, items, expectedDeliveryDate, notes } = req.body;

    const supplier = await Supplier.findById(supplierId);
    if (!supplier) {
      return res.status(404).json({ success: false, message: 'Supplier not found' });
    }

    let totalCost = 0;
    const formattedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ success: false, message: `Product ${item.productId} not found` });
      }

      const cost = item.unitCost * item.quantityOrdered;
      totalCost += cost;

      formattedItems.push({
        product: product._id,
        productTitle: product.title,
        quantityOrdered: item.quantityOrdered,
        quantityReceived: 0,
        unitCost: item.unitCost
      });
    }

    const poNumber = `PO-${Date.now().toString().slice(-6)}`;

    const purchaseOrder = await PurchaseOrder.create({
      poNumber,
      supplier: supplier._id,
      items: formattedItems,
      totalCost,
      expectedDeliveryDate,
      notes,
      status: 'Ordered'
    });

    res.status(201).json({ success: true, message: 'Purchase Order created', data: purchaseOrder });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all Purchase Orders
// @route   GET /api/suppliers/purchase-orders
// @access  Private/Admin/Staff
const getPurchaseOrders = async (req, res, next) => {
  try {
    await ensureConnected();
    const purchaseOrders = await PurchaseOrder.find()
      .populate('supplier', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: purchaseOrders.length, data: purchaseOrders });
  } catch (error) {
    next(error);
  }
};

// @desc    Receive incoming delivery & update inventory stock automatically
// @route   PUT /api/suppliers/purchase-orders/:id/receive
// @access  Private/Admin/Staff
const receiveDelivery = async (req, res, next) => {
  try {
    await ensureConnected();
    const { itemsReceived } = req.body; // Array of { itemId, quantityReceived }
    const purchaseOrder = await PurchaseOrder.findById(req.params.id);

    if (!purchaseOrder) {
      return res.status(404).json({ success: false, message: 'Purchase Order not found' });
    }

    let allReceived = true;

    for (const itemRec of itemsReceived) {
      const item = purchaseOrder.items.id(itemRec.itemId);
      if (item) {
        const addedQty = Number(itemRec.quantityReceived);
        item.quantityReceived += addedQty;

        // Increment actual inventory stock count in Product collection
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stockCount: addedQty }
        });

        if (item.quantityReceived < item.quantityOrdered) {
          allReceived = false;
        }
      }
    }

    purchaseOrder.status = allReceived ? 'Completed' : 'Partially Received';
    if (allReceived) {
      purchaseOrder.receivedDate = new Date();
    }

    await purchaseOrder.save();

    res.json({
      success: true,
      message: 'Delivery received and inventory updated successfully',
      data: purchaseOrder
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier,
  createPurchaseOrder,
  getPurchaseOrders,
  receiveDelivery
};
