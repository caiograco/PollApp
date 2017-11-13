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

Esse projeto foi desenvolvido conforme as especificações determinadas no processo
seletivo da Luxfacta.

Consiste numa aplicação de questionários (Polls) utilizando API RESTful.

Endereço para execução é o do localhost (http://localhost:8081). Esse endereço pode
ser facilmente mudado no código, nas últimas linhas do arquivo server.js.


////////////////////////////////
LINGUAGEM DE DESENVOLVIMENTO 
////////////////////////////////

A fim de otimizar o meu tempo (o qual é consideravalmente curto), optei por desenvolver
a solução em NODE.JS.

As bibliotecas utilizadas foram:

  "dependencies": {
    "body-parser": "^1.18.2",
    "cookie-parser": "^1.4.3",
    "express": "^4.16.2",
    "multer": "^1.3.0"
  }

Sendo assim tudo o que a aplicação necessita para rodar, seja em desktop ou servidor é
o Node.Js instalado. O arquivo package.json já traz a listagem de dependências necessárias,
sendo facilmente instaladas com o npm.


///////////////////////////////
BANCO DE DADOS. (poll.json)
///////////////////////////////

Seguindo essa tendência de facilitar a avaliação do processo seletivo e construindo uma
aplicação de pequeno porte, apenas para fins de comprovação de conhecimento técnico, optei 
por trabalhar com uma forma "caseira" de banco de dados não relacional.

Dessa maneira, essa aplicação usa "seu próprio banco de dados", que nada mais é do que um 
arquivo TXT, devidamente formatado como JSON. Para o porte dessa aplicação, seu desempenho
é ótimo e funciona muito bem.

O mesmo já vem junto da aplicação com 2 Questionários já inclusos, porém pode ser DELETADO 
tranquilamente, pois o mesmo SERÁ RECRIADO na primeira postagem do Questionário (Poll) ao 
consumir o serviço [POST] /poll.

Em caso de qualquer problema com o banco, basta EXCLUIR o arquivo POLL.JSON que, como já
dito acima, será recriado na primeira requisição POST /poll.


--------------------------------------------------------------------------------------------------

                            * * * * E N D P O I N T S * * * *
--------------------------------------------------------------------------------------------------

[GET] /poll/

-> Busca todos os questionários disponíveis (SIM, O APLICATIVO SUPORTA N POLLS NA SUA DATABASE
INTERNA) e devolve no formato JSON.


[GET] /poll/:id

-> Busca um questionário específico e devolve no formato JSON.


[GET] /poll/:id/stats

-> Retorna estatísticas sbore um questionário específico no formato JSON.

[POST] /poll 

-> Cria uma nova enquete com o JSON postado no Body.


[POST] /poll/:id/vote

-> Registra um voto para uma opção específica do questionário selecionado (ID)


[DELETE] /poll/:id 

-> Exclui um questionário específico, mantendo os demais.

=======================================####################======================================



