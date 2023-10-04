const { client, redisGetAsync, redisSetAsync,redisDelAsync } = require('../middleware/redis');
const { user, sequalize, Category, Question_Category_Mapping,Question,Answer,client_table } = require('./sequalize');


const categoryFunctions = {
    create_Category: async (req, res) => {
        try {
            const { CategoryName } = req.body;

            // Create a new category record
            const newCategory = await Category.create({
                CategoryName
            });
            await redisDelAsync('allCategories');


            res.status(201).json({ message: 'Category created successfully', category: newCategory });
        } catch (error) {
            console.error('Error creating category:', error);
            res.status(500).json({ message: 'An error occurred while creating the category' });
        }
    },

    find_All_Categories: async (req, res) => {
        try {
           
            const cachedCategories = await redisGetAsync('allCategories');
            if (cachedCategories) {
                const parsedCategories = JSON.parse(cachedCategories);
                res.status(200).json({ categories: parsedCategories });
            } else {
                const allCategories = await Category.findAll();
                await redisSetAsync('allCategories', JSON.stringify(allCategories), 'EX', 3600);
                res.status(200).json({ categories: allCategories });
            }
        } catch (error) {
            console.error('Error finding or caching categories:', error);
            res.status(500).json({ message:  'An error occurred while finding or caching categories' });
        }
    },



    update_Category: async (req, res) => {
        try {
            const id  = req.params.id;
            const { CategoryName } = req.body;

            // Find the category by ID and update it
            const [updatedCount] = await Category.update(
                { CategoryName },
                { where: { id:id } }
            );

            if (updatedCount === 0) {
                return res.status(404).json({ success: false, message: 'Category not found' });
            }

            // Send a success response
            await redisDelAsync(`allCategories`);
            
            res.json({ success: true, message: 'Category updated successfully' });
        } catch (error) {
            console.error('Error updating category:', error);
            res.status(500).json({ success: false, message: 'An error occurred while updating the category' });
        }
    },

    delete_Category: async (req, res) => {
        try {
            const  id  =req.params.id;
            const deletedCount = await Category.destroy({
                where: { id }
            });

            if (deletedCount === 0) {
                return res.status(404).json({ success: false, message: 'Category not found' });
            }
            await redisDelAsync(`allCategories`);

            res.json({ success: true, message: 'Category deleted successfully' });
        } catch (error) {
            console.error('Error deleting category:', error);
            res.status(500).json({ success: false, message: 'An error occurred while deleting the category'});
        }
    },

    create_question_category: async (req, res) => {
        try {
            const { categoryName, questions } = req.body;
        
            // Find or create the category
            let category = await Category.findOne({
              where: { CategoryName: categoryName },
            });
        
            if (!category) {
              category = await Category.create({ CategoryName: categoryName });
            }
        
            // Create and map questions to the category
            for (const questionData of questions) {
              if (!questionData.QuestionText || !questionData.QuestionType) {
                return res.status(400).json({ error: 'QuestionText and QuestionType are required fields' });
              }
        
              // Create the question
              const newQuestion = await Question.create({
                QuestionText: questionData.QuestionText,
                QuestionType: questionData.QuestionType,
              });
        
              // Create the mapping between the question and the category
              await Question_Category_Mapping.create({
                QuestionId: newQuestion.id,
                CategoryId: category.id,
              });
            }
        
            res.json({ message: 'Category and questions mapped successfully' });
          } catch (error) {
            console.error('Error in create_category_and_map_questions:', error);
            res.status(500).json({ error: 'Internal Server Error' });
          }
    },
    
 get_questions_by_category:async (req, res) => {
    try {
      const { categoryName } = req.query;
      console.log(categoryName)
  
      // Find the category by name
      const foundCategory = await Category.findOne({
        where: { CategoryName: categoryName },
      });
  
      if (!foundCategory) {
        return res.status(404).json({ error: 'Category not found' });
      }
  
      // Use Sequelize's association to fetch questions associated with the category
      const questions = await foundCategory.getQuestions();
  
      // Send the questions associated with the category as a JSON response
      res.json({ questions });
    } catch (error) {
      console.error('Error in get_questions_by_category:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
}

module.exports = categoryFunctions;
