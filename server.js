const inquirer = require('inquirer');
const mysql = require('mysql2/promise');
const cTable = require('console.table');

//connect database
connectDb();



async function connectDb () {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'company'
  });
  console.log('successful database connection');

  //initiate command line queries
  inquirerInit();
}

async function inquirerInit() {
  inquirer.prompt([
    {
      type: 'list',
      name: 'initialAction',
      message: 'Select the following action to continue:',
      choices: [
        'view all departments', 
        'view all roles', 
        'view all employees', 
        'add a department', 
        'add a role', 
        'add an employee', 
        'update an employee role'
      ]
    }
  ]).then((answers) => {
    switch (answers.initialAction) {
      case 'view all departments':

        break;
      case 'view all roles':

        break;
      case 'view all employees':
        
        break;
      case 'add a department':
        
        break;
      case 'add a role':

        break;
      case 'add an employee':
      
       break;
      case 'update an employee role':

        break;
      default:
        console.log('no selection');
    }
  }).catch((err) => {
    console.error(err);
  });

}