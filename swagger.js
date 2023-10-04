/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The unique identifier for the user.
 *         username:
 *           type: string
 *           description: The username of the user.
 *         email:
 *           type: string
 *           description: The email address of the user.
 *         role:
 *           type: string
 *           description: The role of the user.
 *         contactNumber:
 *           type: string
 *           description: The contact number of the user.
 *       example:
 *         id: 1
 *         username: john_doe
 *         email: john.doe@example.com
 *         role: user
 *         contactNumber: +1234567890
 */

/**
 * @swagger
 * /user/create:
 *   post:
 *     summary: Create a new user
 *     description: Create a new user with the provided data.
 *     tags:
 *       - Users
 *     requestBody:
 *       description: User object to be created
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       '201':
 *         description: Successfully created a new user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '400':
 *         description: Bad request, invalid data provided
 *       '409':
 *         description: User with this email already exists
 *       '500':
 *         description: An error occurred while creating the user
 */


/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Authenticate a user and get access tokens
 *     description: Authenticate a user with email and password, and receive access tokens.
 *     tags:
 *       - Users
 *     requestBody:
 *       description: User credentials for authentication
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email address of the user.
 *               password:
 *                 type: string
 *                 description: The user's password.
 *             example:
 *               email: john.doe@example.com
 *               password: securePassword123
 *     responses:
 *       '200':
 *         description: Login successful, returns access tokens
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message.
 *                 accessToken:
 *                   type: string
 *                   description: An access token for the authenticated user.
 *                 refreshToken:
 *                   type: string
 *                   description: A refresh token for the authenticated user.
 *       '401':
 *         description: Invalid credentials (email or password)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: An error message.
 *       '500':
 *         description: An error occurred while logging in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: An error message.
 */

/**
 * @swagger
 * /user/requestPasswordReset:
 *   post:
 *     summary: Request a password reset OTP
 *     description: Request a password reset OTP (One-Time Password) for the specified email address.
 *     tags:
 *       - Users
 *     requestBody:
 *       description: Email data for password reset request
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email address for which a password reset OTP will be requested.
 *             example:
 *               email: john.doe@example.com
 *     responses:
 *       '200':
 *         description: Password reset OTP sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message.
 *       '404':
 *         description: User not found (email not registered)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: An error message.
 *       '500':
 *         description: An error occurred while requesting a password reset
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: An error message.
 */

/**
 * @swagger
 * /user/resetPassword:
 *   post:
 *     summary: Reset a user's password using a token
 *     description: Reset a user's password using a valid token and new password.
 *     tags:
 *       - Users
 *     requestBody:
 *       description: User data for password reset
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email address of the user.
 *               token:
 *                 type: string
 *                 description: The password reset token.
 *               newPassword:
 *                 type: string
 *                 description: The new password for the user.
 *               otp:
 *                 type: string
 *                 description: The OTP (One-Time Password) used for verification.
 *             example:
 *               email: john.doe@example.com
 *               token: valid-reset-token
 *               newPassword: newSecurePassword123
 *               otp: 123456
 *     responses:
 *       '200':
 *         description: Password reset successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message.
 *       '401':
 *         description: Invalid or expired token or OTP
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: An error message.
 *       '404':
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: An error message.
 *       '500':
 *         description: An error occurred while resetting the password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: An error message.
 */
/**
 * @swagger
 * /user/verifyOtp:
 *   post:
 *     summary: Verify an OTP (One-Time Password)
 *     description: Verify an OTP for a specific email address.
 *     tags:
 *       - Users
 *     requestBody:
 *       description: Email and OTP data for verification
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email address for which OTP verification will be performed.
 *               otp:
 *                 type: string
 *                 description: The OTP (One-Time Password) to be verified.
 *             example:
 *               email: john.doe@example.com
 *               otp: 123456
 *     responses:
 *       '200':
 *         description: OTP verification successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message.
 *       '401':
 *         description: Email not found or OTP invalid/expired
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: An error message.
 *       '500':
 *         description: An error occurred while verifying the OTP
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: An error message.
 */
/**
 * @swagger
 * /user/{id}:
 *   patch:
 *     summary: Update user information
 *     description: Update the email and role of a user with the specified ID.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the user to update.
 *     requestBody:
 *       description: User data to update
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The updated email address of the user.
 *               role:
 *                 type: string
 *                 description: The updated role of the user.
 *             example:
 *               email: new.email@example.com
 *               role: admin
 *     responses:
 *       '200':
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message.
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       '404':
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: An error message.
 *       '500':
 *         description: An error occurred while updating the user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: An error message.
 */


/**
 * @swagger
 * /Questionnaire/Create:
 *   post:
 *     summary: Create a new questionnaire
 *     description: Create a new questionnaire with the provided data.
 *     tags:
 *       - Questionnaires
 *     requestBody:
 *       description: Questionnaire data to be created
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Questionnaire_name:
 *                 type: string
 *                 description: The name of the questionnaire.
 *               Questionnaire_description:
 *                 type: string
 *                 description: The description of the questionnaire.
 *               Start_date:
 *                 type: string
 *                 description: The start date of the questionnaire.
 *               set_status:
 *                 type: string
 *                 description: The status of the questionnaire.
 *               Created_by:
 *                 type: string
 *                 description: The creator of the questionnaire.
 *             example:
 *               Questionnaire_name: Sample Questionnaire
 *               Questionnaire_description: This is a sample questionnaire.
 *               Start_date: 2023-09-07
 *               Created_by: John Doe
 *     responses:
 *       '201':
 *         description: Questionnaire created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message.
 *                 Questionnaires:
 *                   type: object
 *                   description: The created questionnaire object.
 *       '500':
 *         description: An error occurred while creating the questionnaire
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: An error message.
 */

/**
 * @swagger
 * /Questionnaire:
 *   get:
 *     summary: Get all questionnaires
 *     description: Retrieve a list of all questionnaires.
 *     tags:
 *       - Questionnaires
 *     responses:
 *       '200':
 *         description: List of questionnaires retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 questionnaire:
 *                   type: array
 *                   description: An array of questionnaire objects.
 *                   items:
 *                     $ref: '#/components/schemas/Questionnaire'
 *       '500':
 *         description: An error occurred while fetching questionnaires
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: An error message.
 */

/**
 * @swagger
 * /Questionnaire/{id}:
 *   get:
 *     summary: Get a questionnaire by ID
 *     description: Retrieve a questionnaire by its unique ID.
 *     tags:
 *       - Questionnaires
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the questionnaire to retrieve.
 *     responses:
 *       '200':
 *         description: Questionnaire retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 questionnaire:
 *                   $ref: '#/components/schemas/Questionnaire'
 *       '404':
 *         description: Questionnaire not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: An error message.
 *       '500':
 *         description: An error occurred while fetching the questionnaire
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: An error message.
 */

/**
 * @swagger
 * /Questionnaire/update/{id}:
 *   patch:
 *     summary: Update a questionnaire by ID
 *     description: Update a questionnaire's details by its unique ID.
 *     tags:
 *       - Questionnaires
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the questionnaire to update.
 *     requestBody:
 *       description: Updated questionnaire data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Questionnaire_name:
 *                 type: string
 *                 description: The updated name of the questionnaire.
 *               Questionnaire_description:
 *                 type: string
 *                 description: The updated description of the questionnaire.
 *               Start_date:
 *                 type: string
 *                 description: The updated start date of the questionnaire.
 *               Created_by:
 *                 type: string
 *                 description: The updated creator of the questionnaire.
 *             example:
 *               Questionnaire_name: Updated Questionnaire
 *               Questionnaire_description: This is an updated questionnaire.
 *               Start_date: 2023-09-07
 *               Created_by: John Doe
 *     responses:
 *       '200':
 *         description: Questionnaire updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message.
 *                 Questionaires:
 *                   $ref: '#/components/schemas/Questionnaire'
 *       '404':
 *         description: Questionnaire not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: An error message.
 *       '500':
 *         description: An error occurred while updating the questionnaire
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: An error message.
 */

/**
 * @swagger
 * /Questionnaire/delete/{id}:
 *   delete:
 *     summary: Delete a questionnaire by ID
 *     description: Delete a questionnaire by its unique ID.
 *     tags:
 *       - Questionnaires
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the questionnaire to delete.
 *     responses:
 *       '200':
 *         description: Questionnaire deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message.
 *       '404':
 *         description: Questionnaire not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: An error message.
 *       '500':
 *         description: An error occurred while deleting the questionnaire
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: An error message.
 */




/**
 * @swagger
 * /Campaign/create:
 *   post:
 *     summary: Create a new campaign
 *     description: Create a new campaign with the provided data.
 *     tags:
 *       - Campaigns
 *     requestBody:
 *       description: Campaign data to be created
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Campaign_Name:
 *                 type: string
 *                 description: The name of the campaign.
 *               Start_date:
 *                 type: string
 *                 description: The start date of the campaign.
 *               Campaign_Description:
 *                 type: string
 *                 description: The description of the campaign.
 *               Created_by:
 *                 type: string
 *                 description: The creator of the campaign.
 *             example:
 *               Campaign_Name: New Campaign
 *               Start_date: 2023-09-07
 *               Campaign_Description: This is a new campaign.
 *               Created_by: John Doe
 *     responses:
 *       '201':
 *         description: Campaign created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message.
 *                 campaign:
 *                   $ref: '#/components/schemas/Campaign'
 *       '500':
 *         description: An error occurred while creating the campaign
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: An error message.
 */
/**
 * @swagger
 * /Campaign:
 *   get:
 *     summary: Get all campaigns
 *     description: Retrieve a list of all campaigns.
 *     tags:
 *       - Campaigns
 *     responses:
 *       '200':
 *         description: List of campaigns retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 campaigns:
 *                   type: array
 *                   description: An array of campaign objects.
 *                   items:
 *                     $ref: '#/components/schemas/Campaign'
 *       '500':
 *         description: An error occurred while fetching or caching campaigns
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: An error message.
 */


/**
 * @swagger
 * /Campaign/{id}:
 *   get:
 *     summary: Get a campaign by ID
 *     description: Retrieve a campaign by its unique ID. If cached, the cached data is returned; otherwise, it fetches from the database.
 *     tags:
 *       - Campaigns
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the campaign to retrieve.
 *     responses:
 *       '200':
 *         description: Campaign retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 campaign:
 *                   $ref: '#/components/schemas/Campaign'
 *       '404':
 *         description: Campaign not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: An error message.
 *       '500':
 *         description: An error occurred while fetching or caching the campaign
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: An error message.
 */


/**
 * @swagger
 * /Campaign/update/{id}:
 *   patch:
 *     summary: Update a campaign by ID
 *     description: Update a campaign's details by its unique ID.
 *     tags:
 *       - Campaigns
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the campaign to update.
 *     requestBody:
 *       description: Updated campaign data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Campaign_Name:
 *                 type: string
 *                 description: The updated name of the campaign.
 *               Start_date:
 *                 type: string
 *                 description: The updated start date of the campaign.
 *               Campaign_Description:
 *                 type: string
 *                 description: The updated description of the campaign.
 *               Created_by:
 *                 type: string
 *                 description: The updated creator of the campaign.
 *             example:
 *               Campaign_Name: Updated Campaign
 *               Start_date: 2023-09-07
 *               Campaign_Description: This is an updated campaign.
 *               Created_by: John Doe
 *     responses:
 *       '200':
 *         description: Campaign updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates whether the update was successful.
 *                 message:
 *                   type: string
 *                   description: A success message.
 *       '404':
 *         description: Campaign not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates whether the campaign was found.
 *                 message:
 *                   type: string
 *                   description: An error message.
 *       '500':
 *         description: An error occurred while updating the campaign
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates whether the update was successful.
 *                 message:
 *                   type: string
 *                   description: An error message.
 */

/**
 * @swagger
 * /Campaign/delete/{id}:
 *   delete:
 *     summary: Delete a campaign by ID
 *     description: Delete a campaign by its unique ID.
 *     tags:
 *       - Campaigns
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the campaign to delete.
 *     responses:
 *       '200':
 *         description: Campaign deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates whether the campaign was deleted successfully.
 *                 message:
 *                   type: string
 *                   description: A success message.
 *       '404':
 *         description: Campaign not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates whether the campaign was found.
 *                 message:
 *                   type: string
 *                   description: An error message.
 *       '500':
 *         description: An error occurred while deleting the campaign
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates whether an error occurred during deletion.
 *                 message:
 *                   type: string
 *                   description: An error message.
 */

/**
 * @swagger
 * /campaign/deactivate/{id}:
 *   patch:
 *     summary: Deactivate a campaign
 *     description: Deactivate a campaign by setting its status to 0.
 *     tags:
 *       - Campaigns
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the campaign to deactivate
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Campaign deactivated successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Campaign deactivated
 *       404:
 *         description: Campaign not found
 *         content:
 *           application/json:
 *             example:
 *               message: Campaign not found
 *       500:
 *         description: An error occurred while deactivating the campaign
 *         content:
 *           application/json:
 *             example:
 *               error: Failed to deactivate Campaign
 */





/**
 * @swagger
 * /Question/create:
 *   post:
 *     summary: Create a new question
 *     description: Create a new question with the provided data.
 *     tags:
 *       - Questions
 *     requestBody:
 *       description: Question data to be created
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               QuestionText:
 *                 type: string
 *                 description: The text of the question.
 *               QuestionType:
 *                 type: string
 *                 description: The type of the question.
 *             example:
 *               QuestionText: What is your favorite color?
 *               QuestionType: Multiple Choice
 *     responses:
 *       '201':
 *         description: Question created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message.
 *                 question:
 *                   $ref: '#/components/schemas/Question'
 *       '500':
 *         description: An error occurred while creating the question
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: An error message.
 */

/**
 * @swagger
 * /Question:
 *   get:
 *     summary: Get all questions
 *     description: Retrieve all questions. If cached, the cached data is returned; otherwise, it fetches from the database.
 *     tags:
 *       - Questions
 *     responses:
 *       '200':
 *         description: Questions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 questions:
 *                   type: array
 *                   description: An array of questions.
 *                   items:
 *                     $ref: '#/components/schemas/Question'
 *       '500':
 *         description: An error occurred while finding or caching questions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: An error message.
 */


/**
 * @swagger
 * /Question/update/{id}:
 *   put:
 *     summary: Update a question by ID
 *     description: Update a question's data by its unique ID.
 *     tags:
 *       - Questions
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the question to update.
 *     requestBody:
 *       description: Updated question data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               QuestionText:
 *                 type: string
 *                 description: The updated text of the question.
 *               QuestionType:
 *                 type: string
 *                 description: The updated type of the question.
 *             example:
 *               QuestionText: What is your favorite color?
 *               QuestionType: Multiple Choice
 *     responses:
 *       '200':
 *         description: Question updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates whether the question was updated successfully.
 *                 message:
 *                   type: string
 *                   description: A success message.
 *       '404':
 *         description: Question not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates whether the question was found.
 *                 message:
 *                   type: string
 *                   description: An error message.
 *       '500':
 *         description: An error occurred while updating the question
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates whether an error occurred during the update.
 *                 message:
 *                   type: string
 *                   description: An error message.
 */


/**
 * @swagger
 * /Question/delete/{id}:
 *   delete:
 *     summary: Delete a question by ID
 *     description: Delete a question by its unique ID.
 *     tags:
 *       - Questions
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the question to delete.
 *     responses:
 *       '200':
 *         description: Question deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates whether the question was deleted successfully.
 *                 message:
 *                   type: string
 *                   description: A success message.
 *       '404':
 *         description: Question not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates whether the question was found.
 *                 message:
 *                   type: string
 *                   description: An error message.
 *       '500':
 *         description: An error occurred while deleting the question
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates whether an error occurred during the deletion.
 *                 message:
 *                   type: string
 *                   description: An error message.
 */



/**
 * @swagger
 * /QuestionType/create:
 *   post:
 *     summary: Create a new question type
 *     description: Create a new question type with the specified name.
 *     tags:
 *       - Question Types
 *     requestBody:
 *       description: New question type data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/QuestionType'
 *     responses:
 *       '201':
 *         description: Question type created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message.
 *                 questionType:
 *                   $ref: '#/components/schemas/QuestionType'
 *       '500':
 *         description: An error occurred while creating the question type
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: An error message.
 */


/**
 * @swagger
 * /QuestionType/update/{id}:
 *   patch:
 *     summary: Update a question type by ID
 *     description: Update a question type's name by its unique ID.
 *     tags:
 *       - Question Types
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the question type to update.
 *     requestBody:
 *       description: Updated question type data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               questionTypeName:
 *                 type: string
 *                 description: The updated name of the question type.
 *             example:
 *               questionTypeName: New Question Type Name
 *     responses:
 *       '200':
 *         description: Question type updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates whether the question type was updated successfully.
 *                 message:
 *                   type: string
 *                   description: A success message.
 *       '404':
 *         description: Question type not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates whether the question type was found.
 *                 message:
 *                   type: string
 *                   description: An error message.
 *       '500':
 *         description: An error occurred while updating the question type
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates whether an error occurred during the update.
 *                 message:
 *                   type: string
 *                   description: An error message.
 */


/**
 * @swagger
 * /QuestionType/delete/{id}:
 *   delete:
 *     summary: Delete a question type by ID
 *     description: Delete a question type by its unique ID.
 *     tags:
 *       - Question Types
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the question type to delete.
 *     responses:
 *       '200':
 *         description: Question type deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates whether the question type was deleted successfully.
 *                 message:
 *                   type: string
 *                   description: A success message.
 *       '404':
 *         description: Question type not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates whether the question type was found.
 *                 message:
 *                   type: string
 *                   description: An error message.
 *       '500':
 *         description: An error occurred while deleting the question type
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates whether an error occurred during the delete.
 *                 message:
 *                   type: string
 *                   description: An error message.
 */


/**
 * @swagger
 * /QuestionTypes:
 *   get:
 *     summary: Get all question types
 *     description: Retrieve a list of all question types.
 *     tags:
 *       - Question Types
 *     responses:
 *       '200':
 *         description: List of question types retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 questionTypes:
 *                   type: array
 *                   description: List of question types.
 *                   items:
 *                     $ref: '#/components/schemas/QuestionType'
 *       '500':
 *         description: An error occurred while fetching question types
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: An error message.
 */



/**
 * @swagger
 * /client/create:
 *   post:
 *     summary: Create a new client
 *     description: Create a new client with the provided information.
 *     tags:
 *       - Clients
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               client_name:
 *                 type: string
 *                 description: The name of the client.
 *               client_email:
 *                 type: string
 *                 format: email
 *                 description: The email address of the client.
 *               contact_number:
 *                 type: string
 *                 description: The contact number of the client.
 *               client_description:
 *                 type: string
 *                 description: Description of the client.
 *               client_location:
 *                 type: string
 *                 description: The location of the client.
 *               Created_by:
 *                 type: string
 *                 description: The creator of the client.
 *     responses:
 *       '201':
 *         description: Client created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates whether the client was created successfully.
 *                 message:
 *                   type: string
 *                   description: A success message.
 *                 data:
 *                   type: object
 *                   description: The created client data.
 *       '500':
 *         description: An error occurred while creating the client
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: An error message.
 */


/**
 * @swagger
 * /client:
 *   get:
 *     summary: Retrieve all clients
 *     description: Retrieve a list of all clients. This endpoint may return cached data.
 *     tags:
 *       - Clients
 *     responses:
 *       '200':
 *         description: List of clients retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Client'
 *       '500':
 *         description: An error occurred while finding or caching clients
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates whether the operation was successful.
 *                 message:
 *                   type: string
 *                   description: An error message.
 */
/**
 * @swagger
 * /client/update/{id}:
 *   patch:
 *     summary: Update an existing client
 *     description: Update an existing client's information by ID.
 *     tags:
 *       - Clients
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the client to update.
 *         schema:
 *           type: integer
 *       - in: body
 *         name: body
 *         required: true
 *         description: Updated client information.
 *         schema:
 *           $ref: '#/components/schemas/Client'
 *     responses:
 *       '200':
 *         description: Client updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Client'
 *       '404':
 *         description: Client not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates whether the operation was successful.
 *                 message:
 *                   type: string
 *                   description: Error message.
 *       '500':
 *         description: An error occurred while updating the client
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates whether the operation was successful.
 *                 message:
 *                   type: string
 *                   description: Error message.
 */

/**
 * @swagger
 * /client/deactivate/{id}:
 *   patch:
 *     summary: Deactivate a client
 *     description: Deactivate a client by setting its `is_active` property to 0.
 *     tags:
 *       - Clients
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the client to deactivate.
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Client status updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Status update message.
 *       '404':
 *         description: Client not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message.
 *       '500':
 *         description: Failed to update client
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message.
 */

/**
 * @swagger
 * /client/delete/{id}:
 *   patch:
 *     summary: Delete a client
 *     description: Delete a client by setting its `is_deleted` property to 1.
 *     tags:
 *       - Clients
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the client to delete.
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Client deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Deletion message.
 *       '404':
 *         description: Client not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message.
 *       '500':
 *         description: Failed to delete client
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message.
 */
/**
 * @swagger
 * /category/create:
 *   post:
 *     summary: Create a new category
 *     description: Create a new category with the specified name.
 *     tags:
 *       - Categories
 *     requestBody:
 *       description: Category data to create.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               CategoryName:
 *                 type: string
 *                 description: The name of the category.
 *             required:
 *               - CategoryName
 *     responses:
 *       '201':
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message.
 *                 category:
 *                   $ref: '#/components/schemas/Category'
 *       '500':
 *         description: An error occurred while creating the category
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 */


/**
 * @swagger
 * /category:
 *   get:
 *     summary: Get all categories
 *     description: Retrieve all categories.
 *     tags:
 *       - Categories
 *     responses:
 *       '200':
 *         description: List of all categories
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 categories:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Category'
 *       '500':
 *         description: An error occurred while finding or caching categories
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 */


/**
 * @swagger
 * /category/update/{id}:
 *   patch:
 *     summary: Update a category by ID
 *     description: Update an existing category by its ID with the specified data.
 *     tags:
 *       - Categories
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the category to update.
 *         required: true
 *         schema:
 *           type: integer
 *       - in: body
 *         name: category
 *         description: Category data to update.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             CategoryName:
 *               type: string
 *               description: The new name for the category.
 *           required:
 *             - CategoryName
 *     responses:
 *       '200':
 *         description: Category updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the update was successful.
 *                 message:
 *                   type: string
 *                   description: Success message.
 *       '404':
 *         description: Category not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the category was not found.
 *                 message:
 *                   type: string
 *                   description: Error message.
 *       '500':
 *         description: An error occurred while updating the category
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if an error occurred.
 *                 message:
 *                   type: string
 *                   description: Error message.
 */

/**
 * @swagger
 * /category/delete/{id}:
 *   delete:
 *     summary: Delete a category by ID
 *     description: Delete an existing category by its ID.
 *     tags:
 *       - Categories
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the category to delete.
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Category deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the category was deleted successfully.
 *                 message:
 *                   type: string
 *                   description: Success message.
 *       '404':
 *         description: Category not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the category was not found.
 *                 message:
 *                   type: string
 *                   description: Error message.
 *       '500':
 *         description: An error occurred while deleting the category
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if an error occurred.
 *                 message:
 *                   type: string
 *                   description: Error message.
 */

/**
 * @swagger
 * /form/create:
 *     post:
 *       summary: Create a new form
 *       description: Create a new form and associate it with existing questions.
 *       tags:
 *         - Form
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 title:
 *                   type: string
 *                   description: The title of the form.
 *                 form_description:
 *                   type: string
 *                   description: Description of the form.
 *                 questions:
 *                   type: array
 *                   items:
 *                     type: integer
 *                   description: An array of question IDs to associate with the form.
 *       responses:
 *         '201':
 *           description: Form created successfully.
 *         '400':
 *           description: Bad request. Invalid input data.
 *         '404':
 *           description: Not found. Some of the specified question IDs do not exist.
 *         '500':
 *           description: Internal Server Error. An error occurred while processing the request.
 * components:
 *   schemas:
 *     Form:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: A message indicating the result of the form creation.
 *       example:
 *         message: Form created successfully
 *     Question:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The unique identifier for the question.
 *         text:
 *           type: string
 *           description: The text of the question.
 *       example:
 *         id: 1
 *         text: What is your name?
 */
/**
 * @swagger
 * paths:
 *   /form:
 *     get:
 *       summary: Retrieve a list of all forms with associated questions
 *       description: Retrieve a list of all forms and their associated questions.
 *       tags:
 *         - Form
 *       responses:
 *         '200':
 *           description: A list of forms with associated questions.
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/FormWithQuestions'
 *         '404':
 *           description: Not found. No forms are available.
 *         '500':
 *           description: Internal Server Error. An error occurred while processing the request.
 * components:
 *   schemas:
 *     FormWithQuestions:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The unique identifier for the form.
 *         title:
 *           type: string
 *           description: The title of the form.
 *         form_description:
 *           type: string
 *           description: Description of the form.
 *         Questions:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Question'
 *       example:
 *         id: 1
 *         title: Sample Form
 *         form_description: This is a sample form.
 *         Questions:
 *           - id: 1
 *             QuestionText: What is your name?
 *             QuestionType: Text
 *           - id: 2
 *             QuestionText: How old are you?
 *             QuestionType: Number
 *     Question:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The unique identifier for the question.
 *         QuestionText:
 *           type: string
 *           description: The text of the question.
 *         QuestionType:
 *           type: string
 *           description: The type of the question.
 *       example:
 *         id: 1
 *         QuestionText: What is your name?
 *         QuestionType: Text
 */

/**
 * @swagger
 * paths:
 *   /form/{id}:
 *     get:
 *       summary: Retrieve a form by its ID with associated questions
 *       description: Retrieve a form and its associated questions by providing its unique ID.
 *       tags:
 *         - Form
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: The unique identifier of the form to retrieve.
 *           schema:
 *             type: integer
 *       responses:
 *         '200':
 *           description: Form with associated questions retrieved successfully.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/FormWithQuestions'
 *         '404':
 *           description: Not found. The specified form was not found.
 *         '500':
 *           description: Internal Server Error. An error occurred while processing the request.
 */


/**
 * @swagger
 * paths:
 *   /form/{id}:
 *     delete:
 *       summary: Delete a form by ID
 *       description: Delete a form by its unique ID.
 *       tags:
 *         - Form
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: integer
 *           description: The unique identifier for the form to delete.
 *       responses:
 *         '200':
 *           description: Form deleted successfully.
 *         '404':
 *           description: Not found. The specified form ID was not found.
 *         '500':
 *           description: Internal Server Error. An error occurred while processing the request.
 */
/**
 * @swagger
 * paths:
 *   /form/{id}:
 *     patch:
 *       summary: Update a form by ID
 *       description: Update a form by its unique ID with new title and form_description.
 *       tags:
 *         - Form
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: integer
 *           description: The unique identifier for the form to update.
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 title:
 *                   type: string
 *                   description: The new title for the form.
 *                 form_description:
 *                   type: string
 *                   description: The new description for the form.
 *       responses:
 *         '200':
 *           description: Form updated successfully.
 *         '400':
 *           description: Bad request. Invalid input data.
 *         '404':
 *           description: Not found. The specified form ID was not found.
 *         '500':
 *           description: Internal Server Error. An error occurred while processing the request.
 */

