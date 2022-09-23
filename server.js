const inquirer = require('inquirer');
const mysql = require('mysql2/promise');
let dbConnect;
const cTable = require('console.table');

//connect database
connectDb();

//establish database connection
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

//initialize inquirer
function inquirerInit() {
  inquirer.prompt([
    {
      type: 'rawlist',
      name: 'initialAction',
      message: 'Select the following action to continue:',
      choices: [
        'view all departments', 
        'view all roles', 
        'view all employees', 
        'add a department', 
        'add a role', 
        'add an employee', 
        'update an employee role',
        'exit'
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
        inquirerAddDep();
        break;
      case 'add a role':
        inquirerAddRole();
        break;
      case 'add an employee':
        inquirerAddEmp();
       break;
      case 'update an employee role':

        break;
      case 'exit':
        process.exit();
      default:
        console.log('no selection');
    }
  }).catch((err) => {
    console.error(err);
  });

}

//query to view database tables
async function viewQuery (option) {
  let rows=[];
  //READ queries hard coded separately to avoid sql injection
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
  //return to the selection list
  inquirerInit();
}

//prompt to enter department name
function inquirerAddDep () {
  inquirer.prompt([
    {
      type: 'input',
      name: 'depName',
      message: 'input department name:'
    }
  ]).then((answer)=>{
    addDep(answer.depName);
  }).catch((err)=>{
    console.log(err);
  })
}

//query to add department
async function addDep (name) {
  const result = await dbConnect.query(`INSERT INTO department(name) VALUES (?)`, name);
  viewQuery('dep');
  //console.log(result);
}

//prompt to enter role info
async function inquirerAddRole () {
  //retrive department names
  const [rows] = await dbConnect.query('SELECT name FROM department');
  const depNames = rows.map(x => x.name);
  inquirer.prompt([
    {
      type: 'input',
      name: 'title',
      message: 'input role name:'
    },
    {
      type: 'input',
      name: 'salary',
      message: 'input salary:'
    },
    {
      type: 'rawlist',
      name: 'department',
      message: 'select department name:',
      choices: depNames
    }
  ]).then((answer)=>{
    addRole(answer.title, answer.salary, answer.department);
  }).catch((err)=>{
    console.log(err);
  })
}

//query to add role
async function addRole (title, salary, department) {
  //convert department name to department id
  const [rows] = await dbConnect.query(`SELECT DISTINCT id FROM department WHERE name = ?`, department);
  //console.log(rows);
  const id = rows[0].id;
  //console.log(id, department);
  const result = await dbConnect.query(`INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`, [title, salary, id]);
  viewQuery('role');
}

//prompt to enter employee info
async function inquirerAddEmp () {
  //retrive role titles
  const [rows] = await dbConnect.query('SELECT title FROM role');
  const roleTitles = rows.map(x => x.title);

  inquirer.prompt([
    {
      type: 'input',
      name: 'firstName',
      message: 'input first name:'
    },
    {
      type: 'input',
      name: 'lastName',
      message: 'input last name:'
    },
    {
      type: 'rawlist',
      name: 'role',
      message: 'select role title:',
      choices: roleTitles
    },
    {
      type: 'input',
      name: 'managerId',
      message: 'input manager ID:'
    }
  ]).then((answer)=>{
    addEmp(answer.firstName, answer.lastName, answer.role, answer.managerId);
  }).catch((err)=>{
    console.log(err);
  })
}

//query to add employee
async function addEmp (firstname, lastname, role, managerId) {
  //convert role title to role id
  const [rows] = await dbConnect.query(`SELECT DISTINCT id FROM role WHERE title = ?`, role);
  //console.log(rows);
  const id = rows[0].id;
  
  //check null at managerId
  let mgrId;
  if (managerId) {
    mgrId = parseInt(managerId) 
  } else mgrId = null;

  //console.log(id, department);
  const result = await dbConnect.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`, [firstname, lastname, id, mgrId]);
  viewQuery('emp');
}