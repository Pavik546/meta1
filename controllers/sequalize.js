const { Sequelize, DataTypes, INTEGER, } = require('sequelize');

const sequelize = new Sequelize('Question_Engine', 'root', 'Nagercoil@9488', {
    host: 'localhost',
    dialect: 'mysql',
});


const user = sequelize.define('user_information', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },

    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "Employee"
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    contactNumber: {
        type: DataTypes.STRING, // You can adjust the data type based on your needs
        allowNull: true, // Set to true if contact number is optional
    },
});


const Permission = sequelize.define('permission', {
    // name is name of permssion such as edit delete and all
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
});


const Mapping = sequelize.define('mapping', {
    roleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: user,
            key: 'id'
        }
    },
    permissionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Permission,
            key: 'id'
        }
    }
});


const campaign = sequelize.define('campaign', {
    Campaign_Name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    Start_date: {
        type: DataTypes.DATEONLY
    },
    Campaign_Description: {
        type: DataTypes.STRING
    },
    Created_by: {
        type: DataTypes.STRING
    },
    set_status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },


})

const Questionnaire = sequelize.define('Questionnaire', {
    // questionnaire_name,questionnaire_description,Start_date,set_status,Created_by
    Questionnaire_name: {
        type: DataTypes.STRING
    },
    Questionnaire_description: {
        type: DataTypes.STRING
    },
    Start_date: {
        type: DataTypes.DATEONLY
    },
    set_status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    Created_by: {
        type: DataTypes.STRING
    },
})



const Category = sequelize.define('Category', {
    CategoryName: {
        type: DataTypes.STRING,
        allowNull: false
    }
});
const QuestionType = sequelize.define('QuestionType', {
    questionTypeName: {
        type: DataTypes.STRING,
        //Single Line, Multiple line, Multiple Choice, Single Choice, Boolean accept this type of data it will be a dropdown
    },



});
const Question = sequelize.define('Questions', {
    // Questions (Question ID, Question Text, Question Type)
    QuestionID: {
        type: DataTypes.INTEGER, // Assuming it's an integer
        primaryKey: true, // This column is the primary key
        autoIncrement: true, // If it's auto-incrementing
    },
    QuestionText: {
        type: DataTypes.STRING,
        allowNull: false
    },
    QuestionType: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    question_is_deleted: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
});

// const QuestionaryQuestionMapping = sequelize.define('QuestionaryQuestionMapping', {});

user.belongsToMany(Permission, { through: Mapping, foreignKey: 'roleId' });
Permission.belongsToMany(user, { through: Mapping, foreignKey: 'permissionId' });


// questionary.belongsToMany(questions, { through: QuestionaryQuestionMapping });
// questions.belongsToMany(questionary, { through: QuestionaryQuestionMapping });

const Question_Category_Mapping = sequelize.define('Question_Category_Mapping', {
    // No additional fields needed here, as this is a junction table
});



Category.belongsToMany(Question, { through: Question_Category_Mapping });
Question.belongsToMany(Category, { through: Question_Category_Mapping });
// Question.belongsToMany(QuestionType,{through:Question_Category_Mapping})

const client_table = sequelize.define("client_table", {
    // email,action,created_by,Modified_by,Modified_date,is_active
    client_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    client_email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    contact_number: {
        type: DataTypes.STRING,
        allowNull: false
    }, client_description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    client_location: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    Created_by: {
        type: DataTypes.STRING,
        allowNull: false
        //user who created client
    },
    Modified_by: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "None"
    },
    Modified_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false

    }
})
const Form = sequelize.define('Form', {
    title: {
        type: DataTypes.STRING
    },
    form_description: {
        type: DataTypes.STRING
    }
});

const form_question_mapping = sequelize.define('form_question_mapping', {
    // Define additional fields specific to the mapping table here if needed
}, {
    primaryKey: false, // Disable the auto-generated primary key
    // timestamps: false, // Disable timestamps columns (createdAt, updatedAt)
});

Form.belongsToMany(Question, {
    through: 'form_question_mapping', // Use the name of the mapping table
    foreignKey: 'formId', // Specify the foreign key name for Form
    otherKey: 'QuestionId', // Specify the foreign key name for Question
});

Question.belongsToMany(Form, {
    through: 'form_question_mapping', // Use the name of the mapping table
    foreignKey: 'QuestionId', // Specify the foreign key name for Question
    otherKey: 'formId', // Specify the foreign key name for Form
});

const Answer = sequelize.define('Answer', {
    AnswerID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    Response: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    useremail: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: user, // Assuming 'user' is the model for user information
            key: 'email', // Use the user's email as the foreign key
        },
    },
    QuestionID: { // Correct the foreign key to reference the Question model
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Question, // Assuming 'Question' is the model for questions
            key: 'QuestionID', // Use the correct key for questions (e.g., 'id')
        },
    },
    FormId: { // Add a foreign key reference to the Form model
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Form, // Assuming 'Form' is the model for forms
            key: 'id', // Use the correct key for forms (e.g., 'id')
        }
    }
})
// Answer.belongsTo(Form, {
//     foreignKey: 'FormId',
// });

// Form.hasMany(Answer, {
//     foreignKey: 'FormId',
// });
// Answer.belongsTo(user, { foreignKey: 'useremail', targetKey: 'email' });

// Answer.belongsTo(Question, { foreignKey: 'QuestionID' });
// Question.hasMany(Answer, { foreignKey: 'QuestionID' });

// Answer.belongsTo(client_table, { foreignKey: 'ClientID' }); // Assuming you have a 'client_table' model
// // Answer.belongsTo(Question, { foreignKey: 'QuestionID' });
// // Answer.belongsTo(user, { foreignKey: 'useremail' })

//single form can have n number of question 




module.exports = { sequelize, user, Form, form_question_mapping, Permission, Answer, Mapping, campaign, Question, Questionnaire, Category, Question_Category_Mapping, QuestionType, client_table };
