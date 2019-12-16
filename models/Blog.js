const { Schema, model } = require("mongoose");
const paginate = require("mongoose-paginate-v2");

// Blog Schema Deifination
const BlogSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    body: {
      type: String,
      required: true
    },
    blogImage: {
      type: String,
      required: false
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "users"
    }
  },
  { timestamps: true }
);

BlogSchema.plugin(paginate);

module.exports = model("blogs", BlogSchema);
