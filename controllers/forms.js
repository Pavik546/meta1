const { user, sequalize, Question, Form, form_question_mapping } = require('./sequalize');
const { client, redisGetAsync, redisSetAsync } = require('../middleware/redis');
const form_function = {
  form_create: async (req, res) => {
    try {
      const { title, form_description, questions } = req.body;
      console.log(req.body);

      // Check if all question IDs exist in the Question table
      const existingQuestions = await Question.findAll({ where: { QuestionID: questions } });

      // Verify if all IDs were found
      if (existingQuestions.length !== questions.length) {
        const missingQuestionIds = questions.filter((id) =>
          !existingQuestions.some((question) => question.QuestionID === id)
        );
        return res.status(404).json({ message: `Questions not found: ${missingQuestionIds.join(', ')}` });
      }

      // Create the form
      const form = await Form.create({ title, form_description });

      // Now, associate the form with the existing questions using the form_question_mapping table
      await form.setQuestions(existingQuestions);

      res.status(201).json({ message: 'Form created successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred' });
    }
  },
  find_all_form: async (req, res) => {
    try {
      const forms = await Form.findAll({
        include: [Question], 
      });

      if (!forms) {
        return res.status(404).json({ message: 'Forms not found' });
      }

      // Create an array to store simplified form data
      const simplifiedForms = forms.map((form) => {
        const questions = form.Questions.map((question) => ({
          id: question.id,
          QuestionText: question.QuestionText, // Replace with your actual field name
          QuestionType: question.QuestionType, // Replace with your actual field name
        }));

        return {
          id: form.id,
          title: form.title,
          form_description: form.form_description,
          Questions: questions,
        };
      });

      res.status(200).json(simplifiedForms);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred' });
    }
  },

  find_form_by_id: async (req, res) => {
    try {
      const formId = req.params.id;
      console.log(formId)
      const form = await Form.findByPk(formId, {
        include: [Question], 
      });

      if (!form) {
        return res.status(404).json({ message: 'Form not found' });
      }
      const simplifiedForm = {
        id: form.id,
        title: form.title,
        form_description: form.form_description,
        Questions: form.Questions.map((question) => ({
          id: question.id,
          QuestionText: question.QuestionText, 
          QuestionType: question.QuestionType, 
        })),
      };

      res.status(200).json(simplifiedForm);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred' });
    }
  },
  form_delete_id: async (req, res) => {
    try {
      const formId = req.params.id;

      // Find the form by its ID
      const form = await Form.findByPk(formId);

      if (!form) {
        return res.status(404).json({ message: 'Form not found' });
      }

      // Delete the form
      await form.destroy();

      res.status(200).json({ message: 'Form deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred' });
    }
  },
  updateFormById: async (req, res) => {
    try {
      const formId = req.params.id;
      const { title, form_description } = req.body;
  
      // Find the form by its ID
      const form = await Form.findByPk(formId);
  
      if (!form) {
        return res.status(404).json({ message: 'Form not found' });
      }
  
      // Update form properties
      form.title = title;
      form.form_description = form_description;
  
      // Save the updated form
      await form.save();
  
      res.status(200).json({ message: 'Form updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred' });
    }
  }
}

module.exports = form_function;