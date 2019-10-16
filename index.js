const express = require('express');

const app = express();

// Habilita a leitura json do body do res
app.use(express.json());

let numOfRequest = 0;
const projects = [];

//  Imprime (console.log) uma contagem de quantas requisições foram feitas na aplicação até então
app.use(( req, res, next) => {
    numOfRequest++;
    console.log(`Requisitions: ${numOfRequest} `)

    return next();
});

// Verifica se o projeto já existe no array!
function checkProj (req, res,  next) {
    const {id} = req.params;
    const proj = projects.find(proje => proje.id == id);

// Se não encontrar o projeto retorna erro
    if (!proj) {
        return res.status(400).json({ error: 'Project not found!!!'});
    }    
// Se encontrar continua a execução do código
    return next();
}

// 1 - ROTAS

// 1.1 - POST /projects: A rota deve receber id e title dentro corpo de cadastrar um novo projeto dentro de um array no seguinte formato: { id: "1", title: 'Novo projeto', tasks: [] }; Certifique-se de enviar tanto o ID quanto o título do projeto no formato string com àspas duplas.

app.post('/projects', (req, res) => {
    const {id, title} = req.body;

    const project = {
        id,
        title,
        tasks: []
    };

    projects.push(project);

    return res.json(projects);

});

// 1.2 - GET /projects: Rota que lista todos projetos e suas tarefas;

app.get('/projects', (req, res) => {
    return res.json(projects);    
});

// 1.3 - PUT /projects/:id: A rota deve alterar apenas o título do projeto com o id presente nos parâmetros da rota;
app.put('/projects/:id', checkProj, (req, res) => {
    const {id} = req.params;
    const {title} = req.body;

    const project = projects.find(proj => proj.id == id);

    project.title = title;

    return res.json(project);

});

// 1.4 - DELETE /projects/:id: A rota deve deletar o projeto com o id presente nos parâmetros da rota;
app.delete('/projects/:id', checkProj, (req, res) => {
    const {id} = req.params;
    const projindex = projects.findIndex(proj => proj.id == id);
    
    console.log(projindex);

    projects.splice(projindex, 1);
    return res.json(projects);
   

});

// 1.5 - POST /projects/:id/tasks: A rota deve receber um campo title e armazenar uma nova tarefa no array de tarefas de um projeto específico escolhido através do id presente nos parâmetros da rota;
app.post('/projects/:id/tasks', checkProj, (req, res) => {
    const {id} = req.params;
    const {title} = req.body;

    const project = projects.find(proj => proj.id == id);
    
    console.log(project);

    project.tasks.push(title);

    return res.json(project);
});

// Configuração da porta da aplicação
app.listen(8000);