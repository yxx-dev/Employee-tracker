const inquirer = require('inquirer');
const mysql = require('mysql2/promise');
let dbConnect;
const cTable = require('console.table');

//connect database
connectDb();



async function connectDb () {
  dbConnect = await mysql.createConnection({
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
        viewQuery('dep');
        break;
      case 'view all roles':
        viewQuery('role');
        break;
      case 'view all employees':
        viewQuery('emp');
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

async function viewQuery (option) {
  let rows=[];
  switch (option) {
    case 'dep':
      [rows] = await dbConnect.query('SELECT * FROM department');
      break;
    case 'role':
      [rows] = await dbConnect.query('SELECT * FROM role');
      break;
    case 'emp':
      [rows] = await dbConnect.query('SELECT * FROM employee');
      break;
    default: console.log('no data');
  }
  //display query data
  console.table(rows);
}