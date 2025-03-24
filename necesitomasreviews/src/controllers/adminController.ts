import express, { Request, Response, NextFunction } from 'express';
import User from '../models/userModel';
import Region from '../models/regionModel';
import NfcCard from '../models/nfcCardModel';
import Order from '../models/orderModel';
import DiscountCode from '../models/discountCodeModel';
import mongoose from 'mongoose';
// @ts-ignore - Para evitar el error de archivos duplicados
import CardUsage from '../models/cardUsageModel';

// La forma correcta de extender Express.Request
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }

    interface MongooseDocument {
      _id: any;
      role?: string;
      region?: any;
      createdAt?: Date;
      updatedAt?: Date;
      [key: string]: any;
    }
  }
}

// Get admin dashboard stats
export const getDashboardStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'SUPER_ADMIN' && req.user.role !== 'REGIONAL_ADMIN') {
      return res.status(403).json({ message: 'No autorizado' });
    }

    let query = {};

    // For regional admin, filter by region
    if (req.user.role === 'REGIONAL_ADMIN' && req.user.region) {
      query = { region: req.user.region };
    }

    // Get user count
    const userCount = await User.countDocuments(query);

    // Get orders count and total
    const orderQuery = req.user.role === 'REGIONAL_ADMIN' ?
      { userId: { $in: await User.find(query).distinct('_id') } } : {};

    const orderCount = await Order.countDocuments(orderQuery);
    const orderTotal = await Order.aggregate([
      { $match: orderQuery },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]);

    // Get active cards count
    const cardQuery = req.user.role === 'REGIONAL_ADMIN' ?
      { userId: { $in: await User.find(query).distinct('_id') } } : {};

    const activeCardCount = await NfcCard.countDocuments({ ...cardQuery, isActive: true });

    // Get recent orders
    const recentOrders = await Order.find(orderQuery)
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('userId', 'name email');

    // Get recent users
    const recentUsers = await User.find(query)
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email role createdAt');

    res.json({
      userCount,
      orderCount,
      orderTotal: orderTotal.length > 0 ? orderTotal[0].total : 0,
      activeCardCount,
      recentOrders,
      recentUsers
    });
  } catch (error) {
    next(error);
  }
};

// Get all users (filtered by region for regional admin)
export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { role, search } = req.query;

    // Build query
    let query: any = {};

    // For regional admin, filter by region
    if (req.user.role === 'REGIONAL_ADMIN' && req.user.region) {
      query.region = req.user.region;
    }

    // Filter by role if provided
    if (role) {
      query.role = role;
    }

    // Search by name or email
    if (search) {
      const searchRegex = new RegExp(search as string, 'i');
      query.$or = [
        { name: searchRegex },
        { email: searchRegex }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .populate('region', 'name code');

    res.json(users);
  } catch (error) {
    next(error);
  }
};

// Create a new user (admin only)
export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password, role, region } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    // For regional admin, set region to their own
    let userRegion = region;
    if (req.user.role === 'REGIONAL_ADMIN') {
      userRegion = req.user.region;
    }

    // Validate role permissions
    if (req.user.role === 'REGIONAL_ADMIN' && (role === 'SUPER_ADMIN' || role === 'REGIONAL_ADMIN')) {
      return res.status(403).json({ message: 'No autorizado para crear este tipo de usuario' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role,
      region: userRegion,
      emailVerified: true // Admin created users are auto-verified
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      region: user.region,
      createdAt: user.createdAt
    });
  } catch (error) {
    next(error);
  }
};

// Update a user
export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { name, email, role, region, isActive } = req.body;

    // Find user by ID
    const user = await User.findById(id) as any;
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Regional admin can only update users in their region
    if (req.user.role === 'REGIONAL_ADMIN') {
      // Use optional chaining and safe string conversion
      const userRegion = user.region ? user.region.toString() : undefined;
      const adminRegion = req.user.region ? req.user.region.toString() : undefined;

      if (userRegion !== adminRegion) {
        return res.status(403).json({ message: 'No autorizado' });
      }

      // Regional admin cannot change role to admin
      if (role === 'SUPER_ADMIN' || role === 'REGIONAL_ADMIN') {
        return res.status(403).json({ message: 'No autorizado para asignar este rol' });
      }
    }

    // Update user fields
    user.name = name || user.name;
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email ya está en uso' });
      }
      user.email = email;
    }

    // Super admin can change any role
    if (req.user.role === 'SUPER_ADMIN') {
      user.role = role || user.role;
      if (region) {
        user.region = region;
      }
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      region: updatedUser.region,
      updatedAt: updatedUser.updatedAt
    });
  } catch (error) {
    next(error);
  }
};

// Delete a user
export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    // Find user by ID
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Regional admin can only delete users in their region
    if (req.user.role === 'REGIONAL_ADMIN') {
      // Use optional chaining and safe string conversion
      const userRegion = user.region ? user.region.toString() : undefined;
      const adminRegion = req.user.region ? req.user.region.toString() : undefined;

      if (userRegion !== adminRegion) {
        return res.status(403).json({ message: 'No autorizado' });
      }

      // Regional admin cannot delete admins
      if (user.role === 'SUPER_ADMIN' || user.role === 'REGIONAL_ADMIN') {
        return res.status(403).json({ message: 'No autorizado para eliminar administradores' });
      }
    }

    // Super admin cannot delete themselves
    if (req.user.role === 'SUPER_ADMIN' && user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'No puedes eliminar tu propio usuario' });
    }

    // Use deleteOne instead of remove (which is deprecated)
    await User.deleteOne({ _id: user._id });

    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    next(error);
  }
};

// Get all regions
export const getRegions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const regions = await Region.find()
      .populate('createdBy', 'name');

    res.json(regions);
  } catch (error) {
    next(error);
  }
};

// Create a new region (super admin only)
export const createRegion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, code } = req.body;

    // Check if region already exists
    const existingRegion = await Region.findOne({ $or: [{ name }, { code }] });
    if (existingRegion) {
      return res.status(400).json({ message: 'La región ya existe' });
    }

    // Create region
    const region = await Region.create({
      name,
      code,
      createdBy: req.user._id
    });

    res.status(201).json(region);
  } catch (error) {
    next(error);
  }
};

// Update a region (super admin only)
export const updateRegion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { name, code } = req.body;

    // Find region by ID
    const region = await Region.findById(id);
    if (!region) {
      return res.status(404).json({ message: 'Región no encontrada' });
    }

    // Check for duplicate if changing name or code
    if ((name && name !== region.name) || (code && code !== region.code)) {
      const existingRegion = await Region.findOne({
        $or: [
          { name: name || region.name },
          { code: code || region.code }
        ],
        _id: { $ne: region._id }
      });

      if (existingRegion) {
        return res.status(400).json({ message: 'Ya existe una región con ese nombre o código' });
      }
    }

    // Update region
    region.name = name || region.name;
    region.code = code || region.code;
    const updatedRegion = await region.save();

    res.json(updatedRegion);
  } catch (error) {
    next(error);
  }
};

// Delete a region (super admin only)
export const deleteRegion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    // Find region by ID
    const region = await Region.findById(id);
    if (!region) {
      return res.status(404).json({ message: 'Región no encontrada' });
    }

    // Check if region has users
    const userCount = await User.countDocuments({ region: id });
    if (userCount > 0) {
      return res.status(400).json({ message: 'No se puede eliminar una región con usuarios asignados' });
    }

    // Use deleteOne instead of remove (which is deprecated)
    await Region.deleteOne({ _id: region._id });

    res.json({ message: 'Región eliminada correctamente' });
  } catch (error) {
    next(error);
  }
};

// Get all orders
export const getOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, startDate, endDate, search } = req.query;

    // Build query
    let query: any = {};

    // For regional admin, filter by users in their region
    if (req.user.role === 'REGIONAL_ADMIN' && req.user.region) {
      const userIds = await User.find({ region: req.user.region }).distinct('_id');
      query.userId = { $in: userIds };
    }

    // Filter by status if provided
    if (status) {
      query.status = status;
    }

    // Filter by date range
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate as string);
      }
      if (endDate) {
        query.createdAt.$lte = new Date(endDate as string);
      }
    }

    // Search by user name/email or order ID
    if (search) {
      const searchRegex = new RegExp(search as string, 'i');

      // Find users matching search
      const userIds = await User.find({
        $or: [
          { name: searchRegex },
          { email: searchRegex }
        ]
      }).distinct('_id');

      query.$or = [
        { userId: { $in: userIds } },
        { paymentId: searchRegex }
      ];
    }

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .populate('userId', 'name email')
      .populate('promoterId', 'name email');

    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// Update order status
export const updateOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Find order by ID
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }

    // For regional admin, check if order belongs to user in their region
    if (req.user.role === 'REGIONAL_ADMIN' && req.user.region) {
      const user = await User.findById(order.userId);
      // Use optional chaining and safe string conversion
      const userRegion = user?.region ? user.region.toString() : undefined;
      const adminRegion = req.user.region ? req.user.region.toString() : undefined;

      if (!user || userRegion !== adminRegion) {
        return res.status(403).json({ message: 'No autorizado' });
      }
    }

    // Update status
    order.status = status;
    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } catch (error) {
    next(error);
  }
};

// Get all NFC cards
export const getAllCards = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { isActive, userId } = req.query;

    // Build query
    let query: any = {};

    // For regional admin, filter by users in their region
    if (req.user.role === 'REGIONAL_ADMIN' && req.user.region) {
      const userIds = await User.find({ region: req.user.region }).distinct('_id');
      query.userId = { $in: userIds };
    }

    // Filter by active status if provided
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    // Filter by user ID if provided
    if (userId) {
      query.userId = userId;
    }

    const cards = await NfcCard.find(query)
      .sort({ createdAt: -1 })
      .populate('userId', 'name email');

    res.json(cards);
  } catch (error) {
    next(error);
  }
};

// Get analytics data
export const getAnalytics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { period } = req.query;
    let startDate = new Date();
    startDate.setDate(startDate.getDate() - 30); // Default to last 30 days

    // Adjust start date based on period
    if (period === 'week') {
      startDate.setDate(startDate.getDate() - 7);
    } else if (period === 'month') {
      startDate.setMonth(startDate.getMonth() - 1);
    } else if (period === 'year') {
      startDate.setFullYear(startDate.getFullYear() - 1);
    }

    // Build query based on admin type
    let userQuery: any = {};
    let orderQuery: any = { createdAt: { $gte: startDate } };
    let cardQuery: any = {};

    // For regional admin, filter by region
    if (req.user.role === 'REGIONAL_ADMIN' && req.user.region) {
      userQuery.region = req.user.region;
      const userIds = await User.find(userQuery).distinct('_id');
      orderQuery.userId = { $in: userIds };
      cardQuery.userId = { $in: userIds };
    }

    // Get user registration stats
    const userStats = await User.aggregate([
      { $match: { ...userQuery, createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Get order stats
    const orderStats = await Order.aggregate([
      { $match: orderQuery },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
          revenue: { $sum: "$totalAmount" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Get card usage stats
    const cardUsageStats = await CardUsage.aggregate([
      {
        $lookup: {
          from: 'nfccards',
          localField: 'cardId',
          foreignField: '_id',
          as: 'card'
        }
      },
      { $unwind: '$card' },
      {
        $match: {
          ...cardQuery,
          timestamp: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Get package distribution
    const packageDistribution = await Order.aggregate([
      { $match: orderQuery },
      {
        $group: {
          _id: "$packageType",
          count: { $sum: 1 },
          revenue: { $sum: "$totalAmount" }
        }
      }
    ]);

    // Get device distribution for card usage
    const deviceDistribution = await CardUsage.aggregate([
      {
        $lookup: {
          from: 'nfccards',
          localField: 'cardId',
          foreignField: '_id',
          as: 'card'
        }
      },
      { $unwind: '$card' },
      {
        $match: {
          ...cardQuery,
          timestamp: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: "$device",
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      userStats,
      orderStats,
      cardUsageStats,
      packageDistribution,
      deviceDistribution
    });
  } catch (error) {
    next(error);
  }
};