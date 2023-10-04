const { user, sequalize, Question } = require('./sequalize');
const { client, redisGetAsync, redisSetAsync,redisDelAsync } = require('../middleware/redis');
const QuestionFunctions = {
    createQuestion: async (req, res) => {
        try {
            const { QuestionText, QuestionType } = req.body;

            // Create a new question record
            const newQuestion = await Question.create({
                QuestionText,
                QuestionType,
            });
            await redisDelAsync('allQuestions');

            res.status(201).json({ message: 'Question created successfully', question: newQuestion });
        } catch (error) {
            console.error('Error creating question:', error);
            res.status(500).json({ message: 'An error occurred while creating the question' });
        }
    },
    
    Find_all_Question: async (req, res) => {
        try {
          const cachedQuestions = await redisGetAsync('allQuestions');
          
          if (cachedQuestions) {
            const parsedQuestions = JSON.parse(cachedQuestions);
            res.json({ questions: parsedQuestions });
          } else {
            const allQuestions = await Question.findAll({
              where: {
                question_is_deleted: 0 // Filter questions where question_is_deleted is 0
              }
            });
      
            const formattedQuestions = allQuestions.map((question) => ({
              id: question.id,
              QuestionText: question.QuestionText,
              QuestionType: question.QuestionType,
            }));
      
            await redisSetAsync('allQuestions', JSON.stringify(formattedQuestions), 'EX', 3600);
      
            const response = {
              questions: formattedQuestions,
            };
      
            // Return the fetched data
            res.json(response);
          }
        } catch (error) {
          console.error('Error finding or caching questions:', error);
          res.status(500).json({ message: 'An error occurred while finding or caching questions' });
        }
      },
      
    
    Update_question: async (req, res) => {
        try {
            const id = req.params.id;
            const { QuestionText, QuestionType } = req.body;
            
            // Find the question by ID and update it
            const [updateCount] = await Question.update(
                {
                    QuestionText,
                    QuestionType
                },
                {
                    where: { QuestionID:id,question_is_deleted: 0 }
                }
            );
            

            if (updateCount==0) {
                return res.status(404).json({ success: false, message: 'Question not found' });
            }
            await redisDelAsync('allQuestions');

            // Send a success response
            res.status(200).json({ success: true, message: 'Question updated successfully' });
        } catch (error) {
            console.error('Error updating question:', error);
            res.status(500).json({ success: false, message: 'An error occurred while updating the question'});
        }
    },
    delete_question: async (req, res) => {
        try {
          const id = req.params.id;
      
          // Find the question by ID
          const question = await Question.findByPk(id);
      
          if (!question) {
            return res.status(404).json({ success: false, message: 'Question not found' });
          }
      
          // Set the question_is_deleted field to 1 (or the appropriate value for deleted state)
          question.question_is_deleted = 1; // Modify this according to your database schema
      
          // Save the updated question
          await question.save();
      
          // Delete cached data if you're using Redis
          await redisDelAsync(`question:${id}`);
          await redisDelAsync('allQuestions');
      
          res.json({ success: true, message: 'Question marked as deleted successfully' });
        } catch (error) {
          console.error('Error marking question as deleted:', error);
          res.status(500).json({ success: false, message: 'An error occurred while marking the question as deleted' });
        }
      }
};

module.exports = QuestionFunctions;
