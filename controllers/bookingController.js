const { Booking, Product, User } = require("../models/index");
const {
  getPaginationParams,
  getPaginationMeta,
} = require("../utils/pagination");

// CREATE BOOKING
exports.createBooking = async (req, res) => {
  try {
    const {
      productId,
      renterId,
      ownerId,
      startDate,
      endDate,
      totalPrice,
      status,
      paymentStatus,
    } = req.body;

    if (
      !productId ||
      !renterId ||
      !ownerId ||
      !startDate ||
      !endDate ||
      !totalPrice
    ) {
      return res
        .status(400)
        .json({
          error:
            "productId, renterId, ownerId, startDate, endDate, and totalPrice are required",
        });
    }

    // Check if product exists
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Check if renter exists
    const renter = await User.findByPk(renterId);
    if (!renter) {
      return res.status(404).json({ error: "Renter not found" });
    }

    // Check if owner exists
    const owner = await User.findByPk(ownerId);
    if (!owner) {
      return res.status(404).json({ error: "Owner not found" });
    }

    const booking = await Booking.create({
      productId,
      renterId,
      ownerId,
      startDate,
      endDate,
      totalPrice,
      status: status || "Pending",
      paymentStatus: paymentStatus || "Pending",
    });

    const bookingWithRelations = await Booking.findByPk(booking.id, {
      include: [
        {
          model: Product,
          attributes: ["id", "title", "pricePerDay"],
        },
        {
          model: User,
          // as: 'Renter',
          attributes: ["id", "firstName", "lastName", "email"],
        },
        {
          model: User,
          // as: 'Owner',
          attributes: ["id", "firstName", "lastName", "email"],
        },
      ],
    });

    res.status(201).json({
      message: "Booking created successfully",
      booking: bookingWithRelations,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET ALL BOOKINGS
exports.getAllBookings = async (req, res) => {
  try {
    // 1. Extract pagination parameters
    const { page, limit, offset } = getPaginationParams(req);

    // 2. Fetch bookings with pagination
    const { rows: bookings, count: totalCount } = await Booking.findAndCountAll(
      {
        include: [
          {
            model: Product,
            attributes: ["id", "title", "pricePerDay"],
          },
          {
            model: User,
            attributes: ["id", "firstName", "lastName", "email"],
          },
          {
            model: User,
            attributes: ["id", "firstName", "lastName", "email"],
          },
        ],
        order: [["createdAt", "DESC"]],
        limit,
        offset,
      }
    );

    // 3. Generate pagination metadata
    const meta = getPaginationMeta(page, limit, totalCount);

    // 4. Return response
    res.status(200).json({ bookings, meta });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET BOOKING BY ID
exports.getBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findByPk(id, {
      include: [
        {
          model: Product,
          attributes: ["id", "title", "pricePerDay", "description"],
        },
        {
          model: User,
          // as: 'Renter',
          attributes: ["id", "firstName", "lastName", "email", "phone"],
        },
        {
          model: User,
          // as: 'Owner',
          attributes: ["id", "firstName", "lastName", "email", "phone"],
        },
      ],
    });

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE BOOKING
exports.updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { startDate, endDate, totalPrice, status, paymentStatus } = req.body;

    // Find booking by ID
    const booking = await Booking.findByPk(id);

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Build update object with only provided fields
    const updateData = {};

    if (startDate !== undefined) updateData.startDate = startDate;
    if (endDate !== undefined) updateData.endDate = endDate;
    if (totalPrice !== undefined) updateData.totalPrice = totalPrice;
    if (status !== undefined) updateData.status = status;
    if (paymentStatus !== undefined) updateData.paymentStatus = paymentStatus;

    // Check if there's anything to update
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: "No fields to update" });
    }

    // Validate dates if provided
    if (updateData.startDate && updateData.endDate) {
      const start = new Date(updateData.startDate);
      const end = new Date(updateData.endDate);

      if (start >= end) {
        return res
          .status(400)
          .json({ error: "End date must be after start date" });
      }

      // Check if dates are in the future for new bookings
      if (booking.status === "Pending" && start < new Date()) {
        return res
          .status(400)
          .json({ error: "Start date must be in the future" });
      }
    }

    // Validate status transitions
    if (updateData.status) {
      const validStatuses = ["Pending", "Confirmed", "Cancelled", "Completed"];
      if (!validStatuses.includes(updateData.status)) {
        return res.status(400).json({
          error:
            "Invalid status. Must be one of: Pending, Confirmed, Cancelled, Completed",
        });
      }

      // Business logic for status transitions
      if (booking.status === "Cancelled" && updateData.status !== "Cancelled") {
        return res
          .status(400)
          .json({ error: "Cannot change status from Cancelled" });
      }

      if (booking.status === "Completed" && updateData.status !== "Completed") {
        return res
          .status(400)
          .json({ error: "Cannot change status from Completed" });
      }
    }

    // Validate payment status
    if (updateData.paymentStatus) {
      const validPaymentStatuses = ["Pending", "Paid", "Refunded"];
      if (!validPaymentStatuses.includes(updateData.paymentStatus)) {
        return res.status(400).json({
          error:
            "Invalid payment status. Must be one of: Pending, Paid, Refunded",
        });
      }
    }

    // Validate total price
    if (
      updateData.totalPrice !== undefined &&
      (typeof updateData.totalPrice !== "number" || updateData.totalPrice < 0)
    ) {
      return res.status(400).json({ error: "Valid total price is required" });
    }

    // Update booking
    await booking.update(updateData);

    // Get updated booking with relations
    const updatedBooking = await Booking.findByPk(id, {
      include: [
        {
          model: User,
          // as: 'Renter',
          attributes: ["id", "firstName", "lastName", "email", "phone"],
        },
        {
          model: User,
          // as: 'Owner',
          attributes: ["id", "firstName", "lastName", "email", "phone"],
        },
        {
          model: Product,
          attributes: ["id", "title", "model", "make", "pricePerDay"],
        },
      ],
    });

    res.status(200).json({
      message: "Booking updated successfully",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error("Error updating booking:", error);

    if (error.name === "SequelizeValidationError") {
      const validationErrors = error.errors.map((err) => ({
        field: err.path,
        message: err.message,
      }));
      return res.status(400).json({
        error: "Validation error",
        details: validationErrors,
      });
    }

    res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
};

// DELETE BOOKING
exports.deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findByPk(id);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    await booking.destroy();
    res.status(200).json({
      message: "Booking deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
