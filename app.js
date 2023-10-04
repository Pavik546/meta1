const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require('./controllers/sequalize'); // add sequlize file from controller
const routes = require('./routes/route');
const cors = require('cors');


const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const app = express();
const port = 3001;
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
sequelize.sync() //sync model from sequlize file in controller
    .then(() => { console.log('Database and tables created!'); })
    .catch(err => { console.error('Error syncing the database:', err); });
    const swaggerOptions = {
        swaggerDefinition: {
          openapi:'3.0.0',
          info: {
            title:'Questionnaire Engine API',
            description: 'Questionnaire Engine API Documentation',
            version: '1.0.0',
          },
        },
        apis: ['./swagger.js'], 
      };
      const swaggerSpec = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));      

app.post('/user/create', routes);
app.post('/user/login', routes);
app.post('/user/requestPasswordReset', routes);
app.post('/user/resetPassword', routes);
app.post('/user/verifyOtp', routes);
app.patch('/user/:id',routes);

app.post('/Questionnaire/create', routes);
app.get('/Questionnaire', routes);//default for all Questionnaire
app.get('/Questionnaire/:id', routes);
app.put('/Questionnaire/update/:id', routes);
app.delete('/Questionnaire/delete/:id', routes);

app.post('/Campaign/create', routes);
app.get('/Campaign', routes);  //default for all campaign 
app.get('/Campaign/:id', routes);
app.patch('/Campaign/update/:id', routes);
app.delete('/Campaign/delete/:id', routes);
app.patch('/campaign/deactivate/:id',routes);


app.post('/Question/create', routes);
app.get('/Question', routes);
app.put('/Question/update/:id', routes);
app.delete('/Question/delete/:id', routes);


app.post('/QuestionType/create', routes);
app.get('/QuestionTypes', routes);//all question type
app.patch('/QuestionType/update/:id', routes);
app.delete('/QuestionType/delete/:id', routes);

app.post('/client/create', routes);
app.get('/client', routes);
app.patch('/client/update/:id', routes);
app.patch('/client/deactivate/:id', routes);
app.delete('/client/delete/:id', routes);
app.get('/client/:id',routes)





app.post('/permission/create', routes);

app.post('/category/create', routes);
app.get('/category', routes);//get all category
app.patch('/category/update/:id', routes);
app.delete('/category/delete/:id', routes);

app.post('/category/question/create', routes); //mapping category with questions
app.get('/category/question/', routes);//find all category question



app.post('/form/create',routes)
app.get('/form',routes)
app.get('/form/:id',routes)
app.delete('/form/:id',routes)
app.patch('/form/:id',routes)











app.post('/answer/submit/:id', routes);
app.get('/answer/:id', routes);//get answer by client IDs
app.get('/form/answer/user/:id',routes)


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    // console.log(req)
});
