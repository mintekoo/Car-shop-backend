const path = require('path');
const fs = require("fs");
const { Blog, User, Category } = require("../models/index");
const { getPaginationParams, getPaginationMeta } = require('../utils/pagination');

// CREATE BLOG
exports.createBlog = async (req, res) => {
  try {
    const { title, slug, content, authorId, categoryId, isPublished } =
      req.body;

    if (!title || !content || !authorId) {
      return res
        .status(400)
        .json({ error: "Title, content, and authorId are required" });
    }

    // Check if author exists
    const author = await User.findByPk(authorId);
    if (!author) {
      return res.status(404).json({ error: "Author not found" });
    }

    // Check if category exists if provided
    if (categoryId) {
      const category = await Category.findByPk(categoryId);
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
    }

    // ✅ Handle uploaded files (via multer)
    const image = req.file
      ? path.join('uploads', 'blogs', req.file.filename)
      : null;

    const blog = await Blog.create({
      title,
      slug: slug || title.toLowerCase().replace(/ /g, "-"),
      content,
      image,
      authorId,
      categoryId,
      isPublished: isPublished || false,
    });

    res.status(201).json({
      message: "Blog created successfully",
      blog,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET ALL BLOGS
exports.getAllBlogs = async (req, res) => {
  try {
    // 1️⃣ Extract pagination parameters
    const { page, limit, offset } = getPaginationParams(req);

    // 2️⃣ Fetch blogs with pagination
    const { rows: blogs, count: totalCount } = await Blog.findAndCountAll({
      // include: [
      //   {
      //     model: User,
      //     // as: 'Author',
      //     attributes: ["id", "firstName", "lastName", "email"],
      //   },
      //   {
      //     model: Category,
      //     attributes: ["id", "name", "description"],
      //   },
      // ],
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    // 3️⃣ Generate pagination metadata
    const meta = getPaginationMeta(page, limit, totalCount);

    // 4️⃣ Return paginated results
    res.status(200).json({ blogs, meta });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET PUBLISHED BLOGS
exports.getPublishedBlogs = async (req, res) => {
  try {
    const blogs = await Blog.findAll({
      where: { isPublished: true },
      // include: [
      //   {
      //     model: User,
      //     // as: 'Author',
      //     attributes: ["id", "firstName", "lastName", "email"],
      //   },
      //   {
      //     model: Category,
      //     attributes: ["id", "name", "description"],
      //   },
      // ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET BLOG BY ID
exports.getBlogById = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findByPk(id, {
      // include: [
      //   {
      //     model: User,
      //     // as: 'Author',
      //     attributes: ["id", "firstName", "lastName", "email"],
      //   },
      //   {
      //     model: Category,
      //     attributes: ["id", "name", "description"],
      //   },
      // ],
    });

    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET BLOGS BY AUTHOR
exports.getBlogsByAuthor = async (req, res) => {
  try {
    const { authorId } = req.params;

    const author = await User.findByPk(authorId);
    if (!author) {
      return res.status(404).json({ error: "Author not found" });
    }

    const blogs = await Blog.findAll({
      where: { authorId },
      include: [
        {
          model: User,
          // as: 'Author',
          attributes: ["id", "firstName", "lastName", "email"],
        },
        {
          model: Category,
          attributes: ["id", "name", "description"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET BLOGS BY CATEGORY
exports.getBlogsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    const blogs = await Blog.findAll({
      where: { categoryId },
      include: [
        {
          model: User,
          // as: 'Author',
          attributes: ["id", "firstName", "lastName", "email"],
        },
        {
          model: Category,
          attributes: ["id", "name", "description"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE BLOG
exports.updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, slug, content, authorId, categoryId, isPublished } = req.body;

    const blog = await Blog.findByPk(id);
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    // Validate author & category if provided
    if (authorId) {
      const author = await User.findByPk(authorId);
      if (!author) return res.status(404).json({ error: "Author not found" });
    }

    if (categoryId) {
      const category = await Category.findByPk(categoryId);
      if (!category) return res.status(404).json({ error: "Category not found" });
    }

    // 3️⃣ Handle image upload
    let imagePath = blog.image;
    if (req.file) {
      imagePath = path.join("uploads", "blogs", req.file.filename);

      // Delete old image if it exists
      if (blog.image && fs.existsSync(blog.image)) {
        try {
          fs.unlinkSync(blog.image);
        } catch (err) {
          console.warn(" Failed to delete old image:", err.message);
        }
      }
    }

    // 4️⃣ Update blog fields
    await blog.update({
      title: title ?? blog.title,
      slug: slug ?? blog.slug,
      content: content ?? blog.content,
      image: imagePath,
      authorId: authorId ?? blog.authorId,
      categoryId: categoryId ?? blog.categoryId,
      isPublished:
        isPublished !== undefined ? isPublished : blog.isPublished,
    });

    // // 5️⃣ Fetch updated blog with relations
    // const updatedBlog = await Blog.findByPk(id, {
    //   include: [
    //     {
    //       model: User,
    //       attributes: ["id", "firstName", "lastName", "email"],
    //     },
    //     {
    //       model: Category,
    //       attributes: ["id", "name", "description"],
    //     },
    //   ],
    // });

    res.status(200).json({
      message: "Blog updated successfully",
      // blog: updatedBlog,
    });
  } catch (error) {
    console.error(" Update Blog Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// DELETE BLOG
exports.deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findByPk(id);
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    await blog.destroy();
    res.status(200).json({
      message: "Blog deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// TOGGLE BLOG PUBLISH STATUS
exports.togglePublishStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findByPk(id);
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    await blog.update({ isPublished: !blog.isPublished });

    res.status(200).json({
      message: `Blog ${
        blog.isPublished ? "published" : "unpublished"
      } successfully`,
      blog,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
