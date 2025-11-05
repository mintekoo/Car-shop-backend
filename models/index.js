const sequelize = require('../config/database');

// Import models
const About = require('./about');
const Blog = require('./blog');
const Booking = require('./booking');
const Category = require('./category');
const Client = require('./client');
const Contact = require('./contact');
const FAQ = require('./faq');
const Gallery = require('./gallery');
const Location = require('./location');
const Partner = require('./partner');
const Permission = require('./permission');
const Product = require('./product');
const Role = require('./role');
const Service = require('./service');
const Setting = require('./setting');
const Slider = require('./slider');
const TermAndCondition = require('./termAndCondition');
const Testimonial = require('./testimonial');
const Translation = require('./translation');
const User = require('./user');

// -------------------- RELATIONS -------------------- //

// User ↔ Role (One-to-Many)
Role.hasMany(User, { foreignKey: 'roleId' });
User.belongsTo(Role, { foreignKey: 'roleId' });

// User ↔ Product (One-to-Many)
User.hasMany(Product, { foreignKey: 'ownerId' });
Product.belongsTo(User, { foreignKey: 'ownerId' });

// Product ↔ Category (One-to-Many)
Category.hasMany(Product, { foreignKey: 'categoryId' });
Product.belongsTo(Category, { foreignKey: 'categoryId' });

// Product ↔ Location (One-to-Many)
Location.hasMany(Product, { foreignKey: 'locationId' });
Product.belongsTo(Location, { foreignKey: 'locationId' });

// User ↔ Booking (One-to-Many)
User.hasMany(Booking, { foreignKey: 'renterId' });
User.hasMany(Booking, { foreignKey: 'ownerId' });
Booking.belongsTo(User, { foreignKey: 'renterId' });
Booking.belongsTo(User, { foreignKey: 'ownerId' });

// Product ↔ Booking (One-to-Many)
Product.hasMany(Booking, { foreignKey: 'productId' });
Booking.belongsTo(Product, { foreignKey: 'productId' });

// User ↔ Blog (One-to-Many)
User.hasMany(Blog, { foreignKey: 'authorId' });
Blog.belongsTo(User, { foreignKey: 'authorId' });

// Category ↔ Blog (One-to-Many)
Category.hasMany(Blog, { foreignKey: 'categoryId' });
Blog.belongsTo(Category, { foreignKey: 'categoryId' });

// Product ↔ Gallery (One-to-Many)
Product.hasMany(Gallery, { foreignKey: 'productId' });
Gallery.belongsTo(Product, { foreignKey: 'productId' });

// User ↔ Testimonial (One-to-Many)
User.hasMany(Testimonial, { foreignKey: 'userId' });
Testimonial.belongsTo(User, { foreignKey: 'userId' });

// Role ↔ Permission (Many-to-Many)
Role.belongsToMany(Permission, { through: 'RolePermissions' });
Permission.belongsToMany(Role, { through: 'RolePermissions' });

// Translation ↔ User (Many-to-One)
Translation.belongsTo(User, { foreignKey: 'createdBy' });

// -------------------- EXPORT -------------------- //
module.exports = {
  sequelize,
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
};
