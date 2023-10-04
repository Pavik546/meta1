const { user, sequalize, Form, Category, form_question_mapping, Question_Category_Mapping, Answer, client_table, Question } = require('./sequalize');

const answerFunction = {
  submit_answers: async (req, res) => {
    try {
      const formId = req.params.id;
      const { answers, email } = req.body;
  
      if (!Array.isArray(answers) || !answers.every(answer => answer.questionId && answer.answerText)) {
        return res.status(400).json({ message: 'Invalid request data' });
      }
  
      const form = await Form.findByPk(formId);
  
      if (!form) {
        return res.status(404).json({ message: 'Form not found' });
      }
      const userRecord = await user.findOne({ where: { email } });
      if (!userRecord) {
        return res.status(404).json({ message: 'User not found for email' });
      }
  
      // Check if the user has already submitted answers for this form
      const existingAnswers = await Answer.findAll({
        where: {
          useremail: userRecord.email,
          FormId: formId,
        },
      });
  
      if (existingAnswers.length > 0) {
        return res.status(400).json({ message: 'User has already submitted answers for this form' });
      }
  
      // Process and store the answers for questions that exist in the form
      for (const answerData of answers) {
        const { questionId, answerText } = answerData;
        const hasQuestion = await form.hasQuestion(questionId);
  
        if (!hasQuestion) {
          return res.status(400).json({ message: `Question with ID ${questionId} is not associated with the form` });
        }
  
        // Create the answer and associate it with the question, user, and form
        await Answer.create({
          Response: answerText,
          useremail: userRecord.email, // Use the correct field name from your model
          QuestionID: questionId,
          FormId: formId, // Include the formId when creating the answer
        });
      }
  
      res.status(200).json({ message: 'Answers submitted successfully' });
    } catch (error) {
      console.error('Error submitting answers:', error);
      res.status(500).json({ message: 'An error occurred while submitting answers' });
    }
  },
  
  get_answers_by_client: async (req, res) => {
    const formId = req.params.id;

    try {
      const formWithAnswers = await Form.findByPk(formId, {
        include: [
          {
            model: Answer,
            attributes: ['useremail'],
            where: { FormId: formId }, // Filter answers by the form ID
          },
        ],
      });

      if (!formWithAnswers) {
        return res.status(404).json({ message: 'Form not found' });
      }

      // Extract and format the required data
      const responseData = {
        formId: formWithAnswers.id,
        usersWithAnswers: formWithAnswers.Answers.map((answer) => ({
          useremail: answer.useremail,
        })),
      };

      // Send the result as JSON response
      res.status(200).json(responseData);
    } catch (error) {
      console.error('Error getting data:', error);
      res.status(500).json({ message: 'Error getting data' });
    }
  },
  specific_user_answer_form: async (req, res) => {
    const formId = req.params.id;
    const { useremail } = req.query; // Get the user email from the query parameters

    try {
      const formWithAnswers = await Form.findByPk(formId, {
        include: [
          {
            model: Answer,
            attributes: ['Response', 'QuestionID'],
            where: {
              FormId: formId,
              useremail: useremail, // Filter answers by the user's email
            },
            include: [
              {
                model: Question,
                attributes: ['QuestionText'],
              },
            ],
          },
        ],
      });

      if (!formWithAnswers) {
        return res.status(404).json({ message: 'Form not found' });
      }

      // Extract and format the required data
      const responseData = {
        formId: formWithAnswers.id,
        useremail: useremail,
        answers: formWithAnswers.Answers.map((answer) => ({
          questionId: answer.Question.QuestionID,
          questionText: answer.Question.QuestionText,
          response: answer.Response,
        })),
      };

      // Send the result as JSON response
      res.status(200).json(responseData);
    } catch (error) {
      console.error('Error getting data:', error);
      res.status(500).json({ message: 'Error getting data' });
    }
  },

}

module.exports = answerFunction