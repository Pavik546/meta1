const { use } = require('../routes/route');
const { user, sequalize, client_table, Permission, Mapping, QuestionType, campaign, Category, Questionnaire } = require('./sequalize');
const { client, redisGetAsync, redisSetAsync,redisDelAsync } = require('../middleware/redis');
const jwtMiddleware = require('../middleware/jwttoken')
const jwt = require('jsonwebtoken'); // Import jsonwebtoken library
const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator');
const bcrypt = require('bcrypt');
const { secretKey } = require('./config');

const createUser = async (req, res) => {
    try {
        const { username, email, role, password, contactNumber } = req.body; // Assuming the data is coming from the request body
        const existingUser = await user.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ message: 'User with this email already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create a new user in the database
        const newUser = await user.create({
            username,
            email,
            role,
            password: hashedPassword,
            contactNumber,
        });
        const tokenPayload = {
            userId: newUser.id,
            email: newUser.email,
            role: newUser.role,
        };
        const token = jwt.sign(tokenPayload, secretKey, { expiresIn: '1h' });
        console.log('User created with token:', token);
        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'An error occurred while creating the user' });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const existingUser = await user.findOne({ where: { email: email } });
        if (!existingUser) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        // Generate a new access token
        const tokenPayload = {
            userId: existingUser.id,
            email: existingUser.email,
            role: existingUser.role,
        };
        const accessToken = jwt.sign(tokenPayload, secretKey, { expiresIn: '5h' });

        // Refresh tokens
        const refreshToken = jwt.sign(tokenPayload, secretKey, {
            expiresIn: '7d', //  refresh token expiration time 7days
        });

        console.log('User logged in with access token:', accessToken);

        res.status(200).json({
            message: 'Login successful',
            accessToken,
            refreshToken,
        });
    } catch (error) {
        console.log('Error logging in:', error);
        res.status(500).json({ message: 'An error occurred while logging in' });
    }
};

const transporter = nodemailer.createTransport({
    service: 'Gmail', // Change this to your email service provider
    auth: {
        user: 'v3117415@gmail.com', // Your email address
        pass: 'pbbowzmyonqjwivj', // Your email password
    },
});

const generateVerificationOTP = () => {
    return otpGenerator.generate(6, { upperCase: false, specialChars: false });
};

const sendVerificationEmail = async (email, otp) => {
    try {
        const mailOptions = {
            from: 'v3117415@gmail.com', // Your email address
            to: email,
            subject: 'Password Reset OTP',
            text: `Your verification OTP for password reset is: ${otp}`,
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

const generatePasswordResetToken = (email) => {
    const otp = generateVerificationOTP();
    const token = jwt.sign({ email, type: 'password-reset', otp }, secretKey, { expiresIn: '1h' });
    console.log('Generated Token:', token);
    return token;
};

const passwordResetTokens = {};

const requestPasswordReset = async (req, res) => {
    const { email } = req.body;
    try {
        const existingUser = await user.findOne({ where: { email } });
        if (!existingUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        const resetToken = generatePasswordResetToken(email);

        passwordResetTokens[email] = { token: resetToken, otp: jwt.decode(resetToken).otp };

        console.log('Decoded Token:', jwt.decode(passwordResetTokens[email].token));
        sendVerificationEmail(email, jwt.decode(resetToken).otp);
        res.status(200).json({ message: 'Password reset Otp sent successfully' });
    } catch (error) {
        console.error('Error requesting password reset:', error);
        res.status(500).json({ message: 'An error occurred while requesting a password reset' });
    }
};

//  reset the password using the token
const resetPassword = async (req, res) => {
    const { email, token, newPassword, otp } = req.body;

    try {
        const decodedToken = jwt.decode(passwordResetTokens[email].token);
        if (!passwordResetTokens[email].token) {

            console.log("invalid or expired token pass ya fir ye")
            return res.status(401).json({ message: 'Invalid or expired token' });
        }
        if (!decodedToken || decodedToken.type !== 'password-reset') {
            console.log('Invalid or expired token yw walaa');
            return res.status(401).json({ message: 'Invalid or expired token' });
        }
        console.log(decodedToken.otp);

        const existingUser = await user.findOne({ where: { email } });
        if (!existingUser) {
            console.log('user not found')
            return res.status(404).json({ message: 'User not found' });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await existingUser.update({ password: hashedPassword });
        delete passwordResetTokens[email];
        console.log('password reset successful')
        res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ message: 'An error occurred while resetting the password' });
    }
};

const verifyOTP = async (req, res) => {
    const { email, otp } = req.body;

    try {
        if (!passwordResetTokens[email]) {
            console.log('Email not found or OTP expired');
            return res.status(401).json({ message: 'Email not found or OTP expired' });
        }
        if (passwordResetTokens[email].otp !== otp) {
            console.log('Invalid OTP');


            return res.status(401).json({ message: 'Invalid OTP' });
        }

        console.log('OTP verification successful');


        res.status(200).json({ message: 'OTP verification successful' });
    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({ message: 'An error occurred while verifying the OTP' });
    }
};

const updateUser = async (req, res) => {
    const id = req.params.id;
    const { email, role } = req.body;

    try {
        const userRecord = await user.findByPk(id);

        if (userRecord) {
            await userRecord.update({ email, role });
            res.status(200).json({ message: 'User updated successfully', user: userRecord });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'An error occurred while updating the user' });
    }
};

const deleteUser = async (req, res) => {
    const id = req.params.id;

    try {
        const userRecord = await user.findByPk(id);

        if (userRecord) {
            await userRecord.destroy();
            res.status(200).json({ message: 'User deleted successfully' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'An error occurred while deleting the user' });
    }
};



const permission = async (req, res) => {
    try {
        const { name } = req.query;

        try {
            await Permission.create({
                name
            });
            res.sendStatus(201); // Send a 201 status code 
        } catch (error) {
            res.sendStatus(500); // Send a 500 status code 
        }
    } catch (error) {
        res.status(400).json({ message: 'Bad request' }); // Send a 400 status code 
    }
};



// const admin = async (req, res) => {
//     // jwtMiddleware(req, res, async () => {
//     const { email } = req.query; // this want email to check the permssion available to the email

//     const adminRole = await user.findOne({ where: { email: email, role: 'admin' } });
//     const employeeRole = await user.findOne({ where: { email: email, role: 'employee' } });

//     const create_question_Permission = await Permission.findOne({ where: { name: 'add_question' } });
//     const edit_question_Permission = await Permission.findOne({ where: { name: 'edit_question' } });
//     const delete_question_Permission = await Permission.findOne({ where: { name: 'delete_question' } });
//     const view_question_Permission = await Permission.findOne({ where: { name: 'view_question' } });

//     if (adminRole) {
//         await adminRole.addPermission(create_question_Permission);
//         await adminRole.addPermission(edit_question_Permission);
//         await adminRole.addPermission(delete_question_Permission);
//         await adminRole.addPermission(view_question_Permission);

//         console.log('admin permission');

//         const adminPermissions = await adminRole.getPermissions();

//         const response = {
//             AdminRoleID: adminRole.id,
//             RoleName: adminRole.role,
//             Permissions: adminPermissions.map(permission => ({
//                 PermissionID: permission.id,
//                 PermissionName: permission.name
//             }))
//         };
//         const adminTokenPayload = {
//             email: email,
//             role: 'admin',
//             permissions: ['add_question', 'edit_question', 'delete_question', 'view_question']
//         };

//         const adminToken = jwt.sign(adminTokenPayload, secretKey, { expiresIn: '1h' }); // Token expires in 1 hour

//         const adminResponse = {
//             ...response, // The response you constructed earlier
//             token: adminToken
//         };

//         res.send(adminResponse);

//     } else if (employeeRole) {
//         await employeeRole.addPermission(create_question_Permission);
//         await employeeRole.addPermission(edit_question_Permission);
//         await employeeRole.addPermission(view_question_Permission);

//         console.log('employee permission');

//         const employeePermissions = await employeeRole.getPermissions();

//         const response = {
//             EmployeeRoleId: employeeRole.id,
//             EmployeeroleName: employeeRole.role,
//             Permissions: employeePermissions.map(permission => ({
//                 PermissionID: permission.id,
//                 PermissionName: permission.name
//             }))
//         };
//         const employeeTokenPayload = {
//             email: email,
//             role: 'employee',
//             permissions: ['add_question', 'edit_question', 'view_question']
//         };

//         const employeeToken = jwt.sign(employeeTokenPayload, secretKey, { expiresIn: '1h' }); // Token expires in 1 hour
//         console.log(employeeToken)

//         const employeeResponse = {
//             ...response, // The response you constructed earlier
//             token: employeeToken
//         };

//         res.send(employeeResponse);
//     }
// }


//Questionaires


const createQuestionnaire = async (req, res) => {
    try {
        const { Questionnaire_name, Questionnaire_description, Start_date, set_status, Created_by } = req.body;

        // Create a new Questionnaire record
        const newQuestionnaire = await Questionnaire.create({
            Questionnaire_name,
            Questionnaire_description,
            Start_date,
            set_status,
            Created_by,
        });
        await redisDelAsync('allQuestionnaires');

        res.status(201).json({ message: 'Questionnaire created successfully', Questionnaire: newQuestionnaire });
    } catch (error) {
        console.error('Error creating Questionnaire:', error);
        res.status(500).json({ message: 'An error occurred while creating the Questionnaire' });
    }
};

const getQuestionnaire = async (req, res) => {
    try {
        const questionnaires = await Questionnaire.findAll();
        await redisSetAsync('allQuestionnaires', JSON.stringify(questionnaires), 'EX', 3600);
        const cachedQuestionnaires = await redisGetAsync('allQuestionnaires');
        const parsedQuestionnaires = JSON.parse(cachedQuestionnaires);
        res.status(200).json({ questionnaire: parsedQuestionnaires });
    
    } catch (error) {
        console.error('Error fetching or caching questionnaires:', error);
        res.status(500).json({ message: 'An error occurred while fetching or caching questionnaires' });
    }
};

const getQuestionnaireById = async (req, res) => {
    const id = req.params.id;
    try {
        const cachedQuestionnaire = await redisGetAsync(`questionnaire:${id}`);

        if (cachedQuestionnaire) {
            const parsedQuestionnaire = JSON.parse(cachedQuestionnaire);
            res.status(200).json({ questionnaire: parsedQuestionnaire });
        } else {
            const questionnaire = await Questionnaire.findByPk(id);

            if (questionnaire) {
                await redisSetAsync(`questionnaire:${id}`, JSON.stringify(questionnaire), 'EX', 3600);

                res.status(200).json({ questionnaire });
            } else {
                res.status(404).json({ message: 'Questionnaire not found' });
            }
        }
    } catch (error) {
        console.error('Error fetching or caching questionnaire by ID:', error);
        res.status(500).json({ message: 'An error occurred while fetching or caching the questionnaire' });
    }
};

const updateQuestionnaire = async (req, res) => {
    try {
        const { Questionnaire_name, Questionnaire_description, Start_date, set_status, Created_by } = req.body;
        const id = req.params.id;

        const questionnaire = await Questionnaire.findByPk(id);

        if (questionnaire) {
            await questionnaire.update({
                Questionnaire_name,
                set_status,
                Created_by,
                Questionnaire_description,
                Start_date,
            });
            await redisDelAsync(`questionnaire:${id}`);

            res.status(200).json({ message: 'Questionnaire updated successfully', Questionnaire: questionnaire });
        } else {
            res.status(404).json({ message: 'Questionnaire not found' });
        }
    } catch (error) {
        console.error('Error updating Questionnaire:', error);
        res.status(500).json({ message: 'An error occurred while updating the Questionnaire' });
    }
};

const deleteQuestionnaire = async (req, res) => {
    try {
        const id = req.params.id;
        const questionnaire = await Questionnaire.findByPk(id);
        if (questionnaire) {
            await questionnaire.destroy();
            await redisDelAsync(`questionnaire:${id}`);
            await redisDelAsync('allQuestionnaires');
            res.status(200).json({ message: 'Questionnaire deleted successfully' });
        } else {
            res.status(404).json({ message: 'Questionnaire not found' });
        }
    } catch (error) {
        console.error('Error deleting Questionnaire:', error);
        res.status(500).json({ message: 'An error occurred while deleting the Questionnaire' });
    }
};
   
module.exports = { createUser, loginUser, updateUser, deleteUser, jwtMiddleware, requestPasswordReset, resetPassword, verifyOTP, permission, createQuestionnaire, getQuestionnaireById, getQuestionnaire, updateQuestionnaire, deleteQuestionnaire, };
