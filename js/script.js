const participantes = document.querySelector('.participantes');
const btn_menu = document.querySelector('.menu');
const chat = document.querySelector('.chat');
var mensagens;

var ultimaMensagem;
var penultimaMensagem;

var usuario = {
    name: ''
}
usuario.name = localStorage.getItem('user');
localStorage.removeItem('user');

//Enviando status
setInterval(() => {
    axios.post('https://mock-api.driven.com.br/api/v6/uol/status', usuario);
    
}, 5000);

function fecharMenu() {
    participantes.classList.toggle('hidden');
}

//Função que busca mensagens
function renderizarMSGS(data){
    chat.innerHTML = '';

    data.forEach(element => {
        if(element.type == "status"){
            chat.innerHTML += `
                <section class="msg status" >
                    ${element.time} <span> ${element.from} </span> ${element.text}
                </section>
            `
        }
        else if(element.type == "message"){
            chat.innerHTML += `
                <section class="msg" >
                    ${element.time} <span> ${element.from} </span> para <span>${element.to}</span> ${element.text}
                </section>
            `
        }
        else if(usuario.name == element.to){
            chat.innerHTML += `
                <section class="msg reservada" >
                    ${element.time} <span> ${element.from} </span> reservadamente para <span>${element.to}</span> ${element.text}
                </section>
            `
        }
    });

    //Indicando ultima mensagem para scroll automatico
    mensagens = document.querySelectorAll('.msg');
    if(mensagens[mensagens.length-2].classList.contains('ultima')){
        mensagens[mensagens.length-2].classList.remove('ultima');
    }
    mensagens[mensagens.length-1].classList.add('ultima');

    ultimaMensagem = document.querySelector('.ultima');
    console.log(ultimaMensagem)
}

//Buncando mensagens
function buscarMSG(){
    const promise = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    promise.then(response => {
        const data = response.data;

        renderizarMSGS(data);
        
        

        ultimaMensagem.scrollIntoView();
    });
}

buscarMSG();
setInterval(buscarMSG, 3000);

