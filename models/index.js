// models/indexModel.js
const { sequelize } = require("../config/database");
const Sequelize = require("sequelize");
const bcrypt = require("bcryptjs");

// Import models
const About = require("./about");
const Blog = require("./blog");
const Booking = require("./booking");
const Category = require("./category");
const Client = require("./client");
const Contact = require("./contact");
const FAQ = require("./faq");
const Gallery = require("./gallery");
const Location = require("./location");
const Partner = require("./partner");
const Permission = require("./permission");
const Product = require("./product");
const Role = require("./role");
const Service = require("./service");
const Setting = require("./setting");
const Slider = require("./slider");
const TermAndCondition = require("./termAndCondition");
const Testimonial = require("./testimonial");
const Translation = require("./translation");
const User = require("./user");

// -------------------- RELATIONS -------------------- //

function setupAssociations() {
  // User ↔ Product (One-to-Many)
  User.hasMany(Product, { foreignKey: "ownerId" });
  Product.belongsTo(User, { foreignKey: "ownerId" });

  // Product ↔ Category (One-to-Many)
  Category.hasMany(Product, { foreignKey: "categoryId" });
  Product.belongsTo(Category, { foreignKey: "categoryId" });

  // Product ↔ Location (One-to-Many)
  Location.hasMany(Product, { foreignKey: "locationId" });
  Product.belongsTo(Location, { foreignKey: "locationId" });

  // User ↔ Booking (One-to-Many)
  User.hasMany(Booking, { foreignKey: "renterId" });
  User.hasMany(Booking, { foreignKey: "ownerId" });
  Booking.belongsTo(User, { foreignKey: "renterId" });
  Booking.belongsTo(User, { foreignKey: "ownerId" });

  // Product ↔ Booking (One-to-Many)
  Product.hasMany(Booking, { foreignKey: "productId" });
  Booking.belongsTo(Product, { foreignKey: "productId" });

  // User ↔ Blog (One-to-Many)
  User.hasMany(Blog, { foreignKey: "authorId" });
  Blog.belongsTo(User, { foreignKey: "authorId" });

  // Category ↔ Blog (One-to-Many)
  Category.hasMany(Blog, { foreignKey: "categoryId" });
  Blog.belongsTo(Category, { foreignKey: "categoryId" });

  // Product ↔ Gallery (One-to-Many)
  Product.hasMany(Gallery, { foreignKey: "productId" });
  Gallery.belongsTo(Product, { foreignKey: "productId" });

  // User ↔ Testimonial (One-to-Many)
  User.hasMany(Testimonial, { foreignKey: "userId" });
  Testimonial.belongsTo(User, { foreignKey: "userId" });

  // Role ↔ Permission (Many-to-Many)
  Role.belongsToMany(Permission, { through: "RolePermissions" });
  Permission.belongsToMany(Role, { through: "RolePermissions" });

  // Translation ↔ User (Many-to-One)
  Translation.belongsTo(User, { foreignKey: "createdBy" });
}

const syncDB = async (options = { alter: false }) => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected.");

    // Setup associations
    setupAssociations();

    // Sync models in dependency order
    await Role.sync(options);
    console.log("✅ Role table synced.");

    await User.sync(options);
    console.log("✅ User table synced.");

    await Category.sync(options);
    console.log("✅ Category table synced.");

    await Location.sync(options);
    console.log("✅ Location table synced.");

    await Product.sync(options);
    console.log("✅ Product table synced.");

    await Booking.sync(options);
    console.log("✅ Booking table synced.");

    await Blog.sync(options);
    console.log("✅ Blog table synced.");

    await Gallery.sync(options);
    console.log("✅ Gallery table synced.");

    await Testimonial.sync(options);
    console.log("✅ Testimonial table synced.");

    await Permission.sync(options);
    console.log("✅ Permission table synced.");

    await About.sync(options);
    console.log("✅ About table synced.");

    await Client.sync(options);
    console.log("✅ Client table synced.");

    await Contact.sync(options);
    console.log("✅ Contact table synced.");

    await FAQ.sync(options);
    console.log("✅ FAQ table synced.");

    await Service.sync(options);
    console.log("✅ Service table synced.");

    await Setting.sync(options);
    console.log("✅ Setting table synced.");

    await Slider.sync(options);
    console.log("✅ Slider table synced.");

    await TermAndCondition.sync(options);
    console.log("✅ TermAndCondition table synced.");

    await Translation.sync(options);
    console.log("✅ Translation table synced.");

    console.log("✅ All tables synced successfully.");
  } catch (err) {
    console.error("❌ Error syncing DB:", err);
    throw err;
  }
};

// -------------------- EXPORT -------------------- //
module.exports = {
  sequelize,
  Sequelize,
  About,
  Blog,
  Booking,
  Category,
  Client,
  Contact,
  FAQ,
  Gallery,
  Location,
  Partner,
  Permission,
  Product,
  Role,
  Service,
  Setting,
  Slider,
  TermAndCondition,
  Testimonial,
  Translation,
  User,
  syncDB,
};
