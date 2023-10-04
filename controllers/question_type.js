const { user, sequalize,  QuestionType } = require('./sequalize');
const { client, redisGetAsync, redisSetAsync,redisDelAsync } = require('../middleware/redis');

const questionTypeController = {
    createQuestionType: async (req, res) => {
        try {
            const { questionTypeName } = req.body;

            // Create a new question type record
            const newQuestionType = await QuestionType.create({
                questionTypeName
            });
            await redisDelAsync('questionTypes');

            res.status(201).json({ message: 'Question type created successfully', questionType: newQuestionType });
        } catch (error) {
            console.error('Error creating question type:', error);
            res.status(500).json({ message: 'An error occurred while creating the question type' });
        }
    },
   
    updateQuestionType: async (req, res) => {
        try {
            const id = req.params.id;
            const { questionTypeName } = req.body;
            const existingQuestionType = await QuestionType.findByPk(id);
            if (!existingQuestionType) {
                return res.status(404).json({ success: false, message: 'Question type not found' });
            }

            
            await existingQuestionType.update({
                questionTypeName
            });
            await redisDelAsync('questionTypes');

            // Send a success response
            res.json({ success: true, message: 'Question type updated successfully' });
        } catch (error) {
            console.error('Error updating question type:', error);
            res.status(500).json({ success: false, message: 'An error occurred while updating the question type' });
        }
    },

    deleteQuestionType: async (req, res) => {
        try {
            const id = req.params.id;
            const deletedCount = await QuestionType.destroy({
                where: { id }
            });

            if (deletedCount === 0) {
                return res.status(404).json({ success: false, message: 'Question type not found' });
            }
            await redisDelAsync('questionTypes');

            res.json({ success: true, message: 'Question type deleted successfully' });
        } catch (error) {
            console.error('Error deleting question type:', error);
            res.status(500).json({ success: false, message: 'An error occurred while deleting the question type' });
        }
    },
    getQuestionTypes: async (req, res) => {
        try {
            const cachedQuestionTypes = await redisGetAsync('questionTypes');
            if (cachedQuestionTypes) {
                res.status(200).json({ questionTypes: JSON.parse(cachedQuestionTypes) });
            } else {
                const questionTypes = await QuestionType.findAll();
                await redisSetAsync('questionTypes', JSON.stringify(questionTypes));
                res.status(200).json({ questionTypes });
            }
        } catch (error) {
            console.error('Error fetching question types:', error);
            res.status(500).json({ message: 'An error occurred while fetching question types' });
        }
    }
};

module.exports = questionTypeController;
