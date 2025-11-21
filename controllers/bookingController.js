const { Booking, Product } = require("../models");
const {
  getPaginationParams,
  getPaginationMeta,
} = require("../utils/pagination");
const { normalizePhoneNumber } = require("../utils/phoneUtils");

// ✅ CREATE BOOKING
exports.createBooking = async (req, res) => {
  try {
    const {
      productId,
      fullName,
      Phone,
      startDate,
      endDate,
      driver,
      paymentStatus,
    } = req.body;

    // Validation
    if (!productId || !fullName || !Phone || !startDate || !endDate) {
      return res.status(400).json({
        error:
          "productId, fullName, Phone, startDate, and endDate are required",
      });
    }

    // Check product
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Normalize phone number (local format)
    const normalizedPhone = normalizePhoneNumber(Phone);
    if (!normalizedPhone) {
      return res.status(400).json({ error: "Invalid phone number" });
    }

    // Create booking
    await Booking.create({
      productId,
      fullName,
      Phone: normalizedPhone,
      startDate,
      endDate,
      driver,
      paymentStatus: paymentStatus || "Pending",
    });


    res.status(201).json({
      message: "Booking created successfully",
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ GET ALL BOOKINGS (with pagination)
exports.getAllBookings = async (req, res) => {
  try {
    const { page, limit, offset } = getPaginationParams(req);

    const { rows: bookings, count: totalCount } = await Booking.findAndCountAll({
      // include: [{ model: Product, attributes: ["id", "title", "pricePerDay"] }],
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    const meta = getPaginationMeta(page, limit, totalCount);

    res.status(200).json({ bookings, meta });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ GET BOOKING BY ID
exports.getBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findByPk(id, {
      // include: [{ model: Product, attributes: ["id", "title", "pricePerDay", "description"] }],
    });

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ UPDATE BOOKING
exports.updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, Phone, startDate, endDate, driver, paymentStatus } = req.body;

    const booking = await Booking.findByPk(id);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    const updateData = {};

    if (fullName !== undefined) updateData.fullName = fullName;

    if (Phone !== undefined) {
      const normalizedPhone = normalizePhoneNumber(Phone);
      if (!normalizedPhone) {
        return res.status(400).json({ error: "Invalid phone number" });
      }
      updateData.Phone = normalizedPhone;
    }

    if (startDate !== undefined) updateData.startDate = startDate;
    if (endDate !== undefined) updateData.endDate = endDate;
    if (driver !== undefined){
      const validStatuses = ["yes", "no"];
      if (!validStatuses.includes(driver)){
        return res.status(400).json({
          error: "Invalide driver status. must be one of: yes or no"
        });
      }
      updateData.driver = driver;
    }
    if (paymentStatus !== undefined) {
      const validStatuses = ["Pending", "Paid", "Confirmed", "Refunded"];
      if (!validStatuses.includes(paymentStatus)) {
        return res.status(400).json({
          error: "Invalid payment status. Must be one of: Pending, Paid, Confirmed, Refunded",
        });
      }
      updateData.paymentStatus = paymentStatus;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: "No fields to update" });
    }

    await booking.update(updateData);
    res.status(200).json({
      message: "Booking updated successfully",
    });
  } catch (error) {
    console.error("Error updating booking:", error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ DELETE BOOKING
exports.deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findByPk(id);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    await booking.destroy();
    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
