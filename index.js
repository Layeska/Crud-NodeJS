const http = require("http");
const path = require("path");
const fs = require("fs/promises");
const PORT = 8000;

const app = http.createServer(async(request, response) => {
    const requestMethod = request.method;
    const requestURL = request.url; 
    console.log(requestURL);
    
    if(requestURL === "/apiv1/tasks") {
        const jsonPath = path.resolve("./data.json");
        const jsonFile = await fs.readFile(jsonPath, "utf-8");
        
        if(requestMethod === "GET") {
            response.setHeader("Content-Type", "application/json");
            response.writeHead("200");
            response.write(jsonFile);
        }

        if(requestMethod === 'POST') {
            request.on("data",(data) => {
                const parsed = JSON.parse(data);
                const arrayJson = JSON.parse(jsonFile);
                arrayJson.push(parsed);
                
                fs.writeFile(jsonPath, JSON.stringify(arrayJson));
                response.writeHead("201");
            });
        }

        if(requestMethod === "PUT") {
            request.on("data", (data) => {
                const parsed = JSON.parse(data);
                const aux = JSON.parse(jsonFile);
                
                const idValue = (parsed.id);

                const indexAux = aux.findIndex(item => item.id === idValue);
                aux[indexAux].status = parsed.status;                
                
                fs.writeFile(jsonPath, JSON.stringify(aux));
                response.writeHead("200");
            });
        }

        if(requestMethod === "DELETE") {
            request.on("data", (data) => {
                const parsedAux = JSON.parse(data);
                const auxDelete = JSON.parse(jsonFile);
                const valueId = parsedAux.id;

                const index = auxDelete.findIndex((element, i) => { 
                    if (element.id === valueId) { return true; }
                });

                auxDelete.splice(index, 1);
                fs.writeFile(jsonPath, JSON.stringify(auxDelete));
                response.writeHead("200");
            });
        }
        
    } else {
        response.writeHead("503");
    }

    response.end();
});

app.listen(PORT);
