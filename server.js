/*
####################################################################################
POLLAPP - Aplicação Rest Web para Polls (Questionários)
------------------------------------------------------------------------------------
Consiste em:
-> server.js (Arquivo com todo o código necessário)
-> poll.json ("banco de dados" nosql montado com simples JSON)
-------------------------------------------------------------------------------------
AUTOR: Caio Graco Bucke Brito
DATA: 13/Nov/2017
#####################################################################################
*/

var http = require('http');
var express = require('express');
var app = express();
var fs = require("fs");
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//#################################################################################
// GET ALL (Extrai todos os questionários)
//#################################################################################
app.get('/poll', function (req, res) {
   fs.readFile( __dirname + "/" + "poll.json", 'utf8', function (err, data) {
       res.end( data );
   });
})


//#################################################################################
// GET ID (Extrai questionário específico [ID])
//#################################################################################
app.get('/poll/:id', function (req, res) {
   // Leitura do arquivo atual
   fs.readFile( __dirname + "/" + "poll.json", 'utf8', function (err, data) {
       if (err)
       {
            res.writeHead(404, {'Content-Type': 'text/plain'});
            res.end("404");   
       }
       else
       {
        var polls = JSON.parse( data );
        var poll= polls["poll"+req.params.id];  
        if (poll != undefined)
        {
            res.end( JSON.stringify(poll));

            // Adiciona view
            var visitas = poll["views"]+1;
            var index = req.params.id;
            var chave = "poll"+index;

            // Preparamos o novo registro para inserção
            var poll = {
                "poll_id": index,
                "poll_description": poll["poll_description"],
                "options": [
                    {"option_id": 1, "option_description": poll["options"][0].option_description},
                    {"option_id": 2, "option_description": poll["options"][1].option_description},
                    {"option_id": 3, "option_description": poll["options"][2].option_description}  
                ],
                "votos" : {
                    "opcao1Total": 0,
                    "opcao2Total": 0,
                    "opcao3Total": 0
                    },
                "views": visitas
            }

            polls["poll"+index] = poll;
    
            datafinal = JSON.stringify(polls);
            // Gravamos os dados modificados
        fs.writeFile(__dirname + "/" + "poll.json", datafinal, function(err) {
            if(err) throw err;
        })
        }
        else
        {
          res.writeHead(404, {'Content-Type': 'text/plain'});
          res.end("404");
        }
    }
   });
})


//#################################################################################
// GET ID (Extrai o status da votacao para um questionário específico [ID])
//#################################################################################
app.get('/poll/:id/stats', function (req, res) {
   // Leitura do arquivo atual
   fs.readFile( __dirname + "/" + "poll.json", 'utf8', function (err, data) {
      var polls = JSON.parse( data );
      var poll= polls["poll"+req.params.id];  

      chave = "poll"+req.params.id;
      //console.log(poll["options"][0].option_description);

      // Gera objeto de retorno
      var chave = {
            "views" : poll["views"],
            "votes" : [
                    {"option_id": 1, "qty": poll["votos"].opcao1Total},
                    {"option_id": 2, "qty": poll["votos"].opcao2Total},
                    {"option_id": 3, "qty": poll["votos"].opcao3Total}
                ]
            }
        
      if (chave != undefined)
	      res.end( JSON.stringify(chave));
      else
      {
          res.writeHead(404, {'Content-Type': 'text/plain'});
          res.end("404");
      }

   });
})




//#################################################################################
// POST (Recebe JSON e insere na base local poll.json)
//#################################################################################
app.post('/poll', function (req, res) {

    var tamanho = 0;

   // Inicialmente lemos as enquetes atuais.
   fs.readFile( __dirname + "/" + "poll.json", 'utf8', function (err, data) {

    // Recebemos o JSON do corpo da requisição (e checamos se ele existe)
    var corpo = req.body;
    if (Object.keys(corpo).length == 0) 
    {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end("404 - É necessário enviar um corpo JSON");
    }
    else
    {
        // Se o arquivo [poll.json] existir
        if (!err) 
        {
            // Carregamos o arquivo atual como objeto JSON
            dataJson = JSON.parse( data );
        
            // Pegamos o tamanho para saber o último Poll existente
            tamanho = 0;
            tamanho = Object.keys(dataJson).length;
            tamanho++;
        }
        // Caso nao exista, tratamos como primeiro registro
        else 
            tamanho = 1;

        if (tamanho >1)
        {
            // Preparamos o novo registro para inserção
            var poll = {
                "PollPost" : {
                    "poll_id": tamanho,
                    "poll_description": corpo.poll_description,
                    "options": [
                        {"option_id": 1, "option_description": corpo.options[0]},
                        {"option_id": 2, "option_description": corpo.options[1]},
                        {"option_id": 3, "option_description": corpo.options[2]}  
                    ],
                    "votos" : {
                        "opcao1Total": 0,
                        "opcao2Total": 0,
                        "opcao3Total": 0
                    },
                    "views": 0
                }
            }
                
            dataJson["poll"+tamanho] = poll["PollPost"];
        }
        else
        {
            // Preparamos o novo registro para inserção
            var poll = {
                "poll1" : {
                    "poll_id": tamanho,
                    "poll_description": corpo.poll_description,
                    "options": [
                        {"option_id": 1, "option_description": corpo.options[0]},
                        {"option_id": 2, "option_description": corpo.options[1]},
                        {"option_id": 3, "option_description": corpo.options[2]}  
                    ],
                    "votos" : {
                        "opcao1Total": 0,
                        "opcao2Total": 0,
                        "opcao3Total": 0
                    },
                    "views": 0
                }
            }
            dataJson = poll;
        }
            
        datafinal = JSON.stringify(dataJson);

        // Gravamos os dados modificados
        fs.writeFile(__dirname + "/" + "poll.json", datafinal, function(err) {
            if(err) throw err;
            else res.end("POLL " + tamanho + " inserido com sucesso!");
        })

        // Retorno para usuário
        var resposta = {
            "poll_id": tamanho
        }       
        res.end(JSON.stringify(resposta));
    }
    });
})



//#################################################################################
// POST VOTACAO (Recebe JSON com voto e atualiza na base local poll.json)
//#################################################################################
app.post('/poll/:id/vote', function (req, res) {

    fs.readFile( __dirname + "/" + "poll.json", 'utf8', function (err, data) {
        var polls = JSON.parse( data );
        var poll= polls["poll"+req.params.id];  
    
        corpo = req.body;
        
        switch(corpo.option_id)
        {
            case 1:
                conta = poll["votos"].opcao1Total + 1;
                poll["votos"].opcao1Total = conta
                break;
            case 2:
                conta = poll["votos"].opcao2Total + 1;
                poll["votos"].opcao2Total = conta
                break;
            case 3:
                conta = poll["votos"].opcao3Total + 1;
                poll["votos"].opcao3Total = conta
                break;
        }

        polls["poll"+req.params.id] = poll;
        //console.log(poll["votos"].opcao1Total);
        datafinal = JSON.stringify(polls);

        // Gravamos os dados modificados
        fs.writeFile(__dirname + "/" + "poll.json", datafinal, function(err) {
            if(err) throw err;
        })
       
        
        res.end("FIM");
     });
       
    })


//#################################################################################
// DELETE ID (Exclui questionário específico [ID])
//#################################################################################
app.delete('/poll/:id', function (req, res) {
    
       var datafinal;

       // Lemos todo os dados inicialmente.
       fs.readFile( __dirname + "/" + "poll.json", 'utf8', function (err, data) {
           data = JSON.parse( data );
           // Exclusão
           delete data["poll" + req.params.id];
           datafinal = JSON.stringify(data);
           // Gravamos os dados modificados
           fs.writeFile(__dirname + "/" + "poll.json", datafinal, function(err) {
               if(err) throw err;
               else res.end("POLL " + req.params.id + " excluído com sucesso!");
           })


       });
       
    })
    

//#################################################################################
// SERVER
//#################################################################################
  var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Aplicativo rodando em http://localhost:%s", port)

})