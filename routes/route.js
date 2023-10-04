const express = require('express');
const jwtMiddleware = require('../middleware/jwttoken');

const { Update_question, delete_question, createQuestion, Find_all_Question } = require('../controllers/question_controller')
const { form_create, find_all_form, find_form_by_id, form_delete_id,updateFormById } = require('../controllers/forms')

const { create_Client, update_existing_client, client_deactive, find_all_client, client_delete, getClientById } = require('../controllers/client_controller')

const { create_Category, find_All_Categories, update_Category, delete_Category, create_question_category, get_questions_by_category, } = require('../controllers/category_controller')

const { createCampaign, getCampaigns, getCampaignById, updateCampaign, deleteCampaign, campaign_deactivate } = require("../controllers/campaign_controller")

const { createUser, permission, createQuestionnaire, getQuestionnaireById, getQuestionnaire, updateQuestionnaire, deleteQuestionnaire, requestPasswordReset, resetPassword, loginUser, verifyOTP,
    updateUser
} = require('../controllers/user_controller');
const { deleteQuestionType, updateQuestionType, createQuestionType, getQuestionTypes } = require('../controllers/question_type')
const { submit_answers, get_answers_by_client,specific_user_answer_form } = require('../controllers/answer_controller')


const router = express.Router();
// router.use(jwtMiddleware);

router.route('/user/create').post(createUser); //signup
router.route('/user/login').post(loginUser);//log in

router.route('/user/requestPasswordReset').post(requestPasswordReset); //
router.route('/user/resetPassword').post(resetPassword);
router.route('/user/verifyOtp').post(verifyOTP);
router.route('/user/:id').patch(updateUser);

router.route('/permission/create').post(permission);

//commit changes done
router.route('/Campaign/create').post(createCampaign); //create a new campaign
router.route('/Campaign').get(getCampaigns); //featch campaign 
router.route('/Campaign/:id').get(getCampaignById); // Use .get() for fetching by ID
router.route('/Campaign/update/:id').patch(jwtMiddleware, updateCampaign)
router.route('/Campaign/delete/:id').delete(jwtMiddleware, deleteCampaign)
router.route('/campaign/deactivate/:id').patch(campaign_deactivate)




//change done
router.route('/Questionnaire/create').post(createQuestionnaire);
router.route('/Questionnaire').get(getQuestionnaire);
router.route('/Questionnaire/:id').get(getQuestionnaireById); // Use .get() for fetching by ID
router.route('/Questionnaire/update/:id').patch(updateQuestionnaire);
router.route('/Questionnaire/delete/:id').delete(deleteQuestionnaire);


// route


//CRUD operation 
router.route('/category/create').post(create_Category);
router.route('/category').get(find_All_Categories);
router.route('/category/update/:id').patch(update_Category);
router.route('/category/delete/:id').delete(delete_Category);



router.route('/category/question/create').post(create_question_category)
router.route('/category/question').get(get_questions_by_category)



// question type
router.route('/QuestionType/create').post(createQuestionType)
router.route('/QuestionTypes').get(getQuestionTypes)
router.route('/QuestionType/update/:id').patch(updateQuestionType)
router.route('/QuestionType/delete/:id').delete(deleteQuestionType)



//question crud operations
router.route('/Question/create').post(createQuestion)
router.route('/Question').get(Find_all_Question)
router.route('/Question/update/:id').put(Update_question)
router.route('/Question/delete/:id').delete(delete_question)


//client crud Operations
router.route('/client/create').post(create_Client)//create client
router.route('/client/update/:id').patch(update_existing_client) //update 
router.route('/client/deactivate/:id').patch(client_deactive) // client deactivate
router.route('/client').get(find_all_client) // find all client
router.route('/client/delete/:id').delete(client_delete)// delete
router.route('/client/:id').get(getClientById)// find by id  



//form 
router.route('/form/create').post(form_create)
router.route('/form').get(find_all_form)
router.route('/form/:id').get(find_form_by_id)
router.route('/form/:id').delete(form_delete_id)
router.route('/form/:id').patch(updateFormById)












router.route('/answer/submit/:id').post(submit_answers)
router.route('/answer/:id').get(get_answers_by_client)
router.route('/form/answer/user/:id').get(specific_user_answer_form)

module.exports = router;
