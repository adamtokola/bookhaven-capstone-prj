const { Sequelize, DataTypes } = require("sequelize");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || "127.0.0.1",
    dialect: "postgres",
  }
);

const User = sequelize.define(
  "User",
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { tableName: "Users", timestamps: true }
);

const Book = sequelize.define(
  "Book",
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    genre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    averageRating: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
  },
  { tableName: "Books", timestamps: true }
);

const Review = sequelize.define(
  "Review",
  {
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    bookId: {
      type: DataTypes.INTEGER,
      references: { model: "Books", key: "id" },
      onDelete: "CASCADE",
    },
    userId: {
      type: DataTypes.INTEGER,
      references: { model: "Users", key: "id" },
      onDelete: "CASCADE",
    },
  },
  { tableName: "Reviews", timestamps: true }
);

const Comment = sequelize.define(
  "Comment",
  {
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    reviewId: {
      type: DataTypes.INTEGER,
      references: { model: "Reviews", key: "id" },
      onDelete: "CASCADE",
    },
    userId: {
      type: DataTypes.INTEGER,
      references: { model: "Users", key: "id" },
      onDelete: "CASCADE",
    },
  },
  { tableName: "Comments", timestamps: true }
);

const seedAll = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection established.");

    const users = [
      {
        username: "user1",
        email: "user1@example.com",
        password: await bcrypt.hash("password1", 10),
      },
      {
        username: "user2",
        email: "user2@example.com",
        password: await bcrypt.hash("password2", 10),
      },
    ];
    const insertedUsers = await User.bulkCreate(users);

    const books = [
      { title: "Book One", author: "Author One", genre: "Fiction" },
      { title: "Book Two", author: "Author Two", genre: "Non-fiction" },
    ];
    const insertedBooks = await Book.bulkCreate(books);

    const reviews = [
      {
        rating: 5,
        comment: "Amazing book!",
        bookId: insertedBooks[0].id,
        userId: insertedUsers[0].id,
      },
      {
        rating: 4,
        comment: "Very insightful.",
        bookId: insertedBooks[1].id,
        userId: insertedUsers[1].id,
      },
    ];
    const insertedReviews = await Review.bulkCreate(reviews);

    const comments = [
      {
        content: "Totally agree!",
        reviewId: insertedReviews[0].id,
        userId: insertedUsers[1].id,
      },
      {
        content: "Couldn’t disagree more!",
        reviewId: insertedReviews[1].id,
        userId: insertedUsers[0].id,
      },
    ];
    await Comment.bulkCreate(comments);

    console.log("All data seeded successfully.");
    await sequelize.close();
  } catch (error) {
    console.error("Error seeding data:", error);
    await sequelize.close();
    process.exit(1);
  }
};

seedAll();
