const fs = require("fs");
const path = require("path");
const psp = require("passport");
const multer = require("multer");
const router = require("express").Router();
const { errRespHandler } = require("../functions/error-rep");

// Bring in the blog and User schema
const User = require("../models/User");
const Blog = require("../models/Blog");

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, done) => done(null, "public/uploads"),
  filename: (req, file, done) => {
    let lastIndex = file.originalname.lastIndexOf(".");
    // Get the File extension
    let extension = file.originalname.substring(lastIndex);
    done(null, `${file.fieldname}-${Date.now()}${extension}`);
  }
});

const upload = multer({ storage });

/**
 * @TYPE POST
 * @DESC To Create a Blog
 * @ROUTE '/api/blogs/'
 * @Access private
 */
router.post(
  "/",
  psp.authenticate("jwt", { session: false }),
  upload.single("blogImage"),
  async (req, res) => {
    try {
      // Blog Validation
      let { title, body } = req.body;
      if (!title) {
        return res.status(403).json({
          message: "Title of the blog cannot be empty",
          success: false
        });
      }

      if (!body) {
        return res.status(403).json({
          message: "Body of the blog cannot be empty",
          success: false
        });
      }

      let newBlog = new Blog({
        title,
        body,
        author: req.user._id
      });

      if (req.file) {
        newBlog.blogImage = req.file.path.replace("public", "");
      }

      let result = await newBlog.save();
      return res.status(201).json({
        message: "Blog is created successfully.",
        success: true,
        blog: result
      });
    } catch (err) {
      errRespHandler(res);
    }
  }
);

/**
 * @TYPE PUT
 * @DESC To Edit a Blog
 * @ROUTE '/api/blogs/:id'
 * @Access private
 */
router.put(
  "/:id",
  psp.authenticate("jwt", { session: false }),
  upload.single("blogImage"),
  async (req, res) => {
    try {
      // Check if the blog exists with the ID
      let blog = await Blog.findById(req.params.id);
      if (!blog) {
        return res.status(404).json({
          message: "Blog not found.",
          success: false
        });
      }
      // Check if the blog belongs to the user
      if (req.user._id.toString() !== blog.author.toString()) {
        return res.status(403).json({
          message: "Unauthorized.",
          success: false
        });
      }
      // Blog Validation
      let { title, body } = req.body;

      if (!title) {
        return res.status(403).json({
          message: "Title of the blog cannot be empty",
          success: false
        });
      }

      if (!body) {
        return res.status(403).json({
          message: "Body of the blog cannot be empty",
          success: false
        });
      }

      // Delete image of th blog id existsed
      if (blog.blogImage) {
        let filePath = "../public/" + blog.blogImage;
        let absPath = path.join(__dirname, filePath);
        console.log(absPath);
        await fs.unlinkSync(absPath);
      }

      blog.title = title;
      blog.body = body;

      if (req.file) {
        blog.blogImage = req.file.path.replace("public", "");
      }

      let result = await blog.save();

      return res.status(201).json({
        message: "Blog is edited successfully.",
        success: true,
        blog: result
      });
    } catch (err) {
      console.log(err);
      errRespHandler(res);
    }
  }
);

/**
 * @TYPE DELETE
 * @DESC To Delete a Blog
 * @ROUTE '/api/users/register'
 * @Access private
 */
router.delete(
  "/:id",
  psp.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
    } catch (err) {
      errRespHandler(res);
    }
  }
);

/**
 * @TYPE GET
 * @DESC To Get all the blogs arranged and paginated by created at field in ascending order
 * @ROUTE '/api/blogs/'
 * @Access public
 */
router.get("/", async (req, res) => {
  try {
  } catch (err) {
    errRespHandler(res);
  }
});

/**
 * @TYPE GET
 * @DESC To Get a particular blog
 * @ROUTE '/api/blogs/:id'
 * @Access public
 */
router.get("/:id", async (req, res) => {
  try {
  } catch (err) {
    errRespHandler(res);
  }
});

/**
 * @TYPE GET
 * @DESC To Get a particular blog by query field
 * @ROUTE '/api/blogs?query={keyword}'
 * @Access public
 */
router.get("/", async (req, res) => {
  try {
  } catch (err) {
    errRespHandler(res);
  }
});

module.exports = router;
