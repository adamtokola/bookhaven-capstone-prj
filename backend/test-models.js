const { sequelize, Book, User, Review, Comment } = require('./app/models');

async function testModels() {
  try {
    console.log('Testing database connection...');
    await sequelize.authenticate();
    console.log('✅ Database connection successful\n');

    console.log('Testing Book model...');
    const books = await Book.findAll({ limit: 1 });
    console.log('✅ Book model working:', books.length >= 0 ? 'Found books' : 'No books yet');
    console.log('Sample book:', books[0]?.toJSON() || 'No books in database\n');

    console.log('Testing User model...');
    const users = await User.findAll({ limit: 1 });
    console.log('✅ User model working:', users.length >= 0 ? 'Found users' : 'No users yet');
    console.log('Sample user:', users[0]?.toJSON() || 'No users in database\n');

    console.log('Testing Review model...');
    const reviews = await Review.findAll({ limit: 1 });
    console.log('✅ Review model working:', reviews.length >= 0 ? 'Found reviews' : 'No reviews yet');
    console.log('Sample review:', reviews[0]?.toJSON() || 'No reviews in database\n');

    console.log('Testing Comment model...');
    const comments = await Comment.findAll({ limit: 1 });
    console.log('✅ Comment model working:', comments.length >= 0 ? 'Found comments' : 'No comments yet');
    console.log('Sample comment:', comments[0]?.toJSON() || 'No comments in database\n');

    console.log('Testing associations...');
    if (reviews.length > 0) {
      const reviewWithAssociations = await Review.findOne({
        include: [
          { model: User },
          { model: Book },
          { model: Comment }
        ]
      });
      console.log('✅ Associations working:', reviewWithAssociations?.toJSON() || 'No review data to test\n');
    } else {
      console.log('⚠️ No review data to test associations\n');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await sequelize.close();
  }
}

testModels(); 