const express = require('express');

const server = express();

server.use(express.json());

// Criando variável para verificar o número de requisições
let numberOfRequests = 0;
// Declarando json projects
const projects = [];

// Middleware para verificar se o id existe
function checkProjectId (req, res, next){
  const { id } = req.params
  const project = projects.find((p) => p.id==id);
  
  if (!project) {
    return res.status(400).json({ error: "Register does not exist" });
  }

  next();
};

// Middleware global para reportar o número de requisições
function logRequests (req, res, next){
  numberOfRequests++;

  console.log(`Número de requisições: ${numberOfRequests}`);

  return next();
};

server.use(logRequests);

// Rota Post para criar projetos
server.post('/projects', (req, res) => {
  const { id, title, tasks } = req.body;

  projects.push({ id, title, "tasks": tasks });

  return res.json(projects);
});

// Rota Get para listar todos os projetos
server.get('/projects', (req, res) => {
  
  return res.json(projects);

});

// Rota Put para alterar o title do projeto baseado no id
server.put('/projects/:id', checkProjectId, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find((p) => p.id == id);

  project.title = title;

  return res.json(projects);
});

// Rota para apagar projeto baseado no id
server.delete('/projects/:id', checkProjectId, (req, res) => {
  const { id } = req.params;

  const projectIndex = projects.findIndex((p) => p.id==id);
  
  projects.splice(projectIndex, 1);

  return res.json(projects);
});

// Rota para acrescentar tasks ao projeto
server.post('/projects/:id/tasks', checkProjectId, (req, res) => {
  const { id } = req.params;
  const { tasks } = req.body;

  const project = projects.find((p) => p.id == id);

  project.tasks.push(tasks);

  return res.json(projects);
});

server.listen(3000);