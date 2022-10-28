const participantes = document.querySelector('.participantes');
const btn_menu = document.querySelector('.menu');
const chat = document.querySelector('.chat');
const campo = document.querySelector('.campo');
const btn_enviar = document.querySelector('.btn_enviar');
const ativos = document.querySelector('.ativos');
var mensagens;

var ultimaMensagem;
var penultimaMensagem;
var numeroParticipantes = 0;
var destinatario = 'Todos';
var tipo = 'message';

var usuario = {
    name: ''
}
usuario.name = localStorage.getItem('user');
localStorage.removeItem('user');

var mensagem = {
    from: "",
    to: "Todos",
    text: "",
    type: "message"
}

function enviarMensagem() {
    const promessa = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', mensagem);
    promessa.then(buscarMSG());
    promessa.catch(() => { window.location.href = 'login.html' });
}

btn_enviar.addEventListener('click', () => {
    if (campo.value != '') {
        mensagem.from = usuario.name;
        mensagem.text = campo.value;
        mensagem.to = destinatario;
        mensagem.type = tipo;
        enviarMensagem();
    }

})

function escolher(elm) {
    const part = document.querySelectorAll('.participante')
    part.forEach(i => {
        i.children[2].classList.add('escondido');
    })
    elm.children[2].classList.remove('escondido');
    destinatario = elm.children[1].innerHTML;
}

function escolherTipo(elm){
    const part = document.querySelectorAll('.tipo')
    part.forEach(i => {
        i.children[2].classList.add('escondido');
    })
    elm.children[2].classList.remove('escondido');
    destinatario = elm.children[1].innerHTML;

    if(elm.children[1].innerHTML == 'Reservadamente'){
    tipo = 'private_message';
    }
    else {
        tipo = 'message'
    }
}

//Buscando Participantes
function buscarParticipantes() {
    const promise = axios.get('https://mock-api.driven.com.br/api/v6/uol/participants');
    promise.then(response => {
        const data = response.data;

        if (data.length != numeroParticipantes) {
            ativos.innerHTML = `
            <div class="on participante" onclick="escolher(this)">
                <img class="perfil" src="img/Vector.png" alt="todos">
                <p>Todos</p>
                <img class="escondido" src="img/check.png">
            </div>
            `;


            data.forEach(elm => {
                ativos.innerHTML += `
                <div class="on participante" onclick="escolher(this)">
                        <img class="perfil" src="img/perfil.png" alt="todos">
                        <p>${elm.name}</p>
                        <img class="escondido " src="img/check.png">
                </div>
            `
            });
            numeroParticipantes = data.length;
        }
    })
}


//Enviando status para permanecer online
setInterval(() => {
    axios.post('https://mock-api.driven.com.br/api/v6/uol/status', usuario);

}, 5000);

function fecharMenu() {
    participantes.classList.toggle('hidden');
}

//Função que busca mensagens
function renderizarMSGS(data) {
    chat.innerHTML = '';

    data.forEach(element => {
        if (element.type == "status") {
            chat.innerHTML += `
                <section class="msg status" >
                    ${element.time} <span> ${element.from} </span> ${element.text}
                </section>
            `
        }
        else if (element.type == "message") {
            chat.innerHTML += `
                <section class="msg" >
                    ${element.time} <span> ${element.from} </span> para <span>${element.to}</span> ${element.text}
                </section>
            `
        }
        else if (usuario.name == element.to || element.from == usuario.name) {
            chat.innerHTML += `
                <section class="msg reservada" >
                    ${element.time} <span> ${element.from} </span> reservadamente para <span>${element.to}</span> ${element.text}
                </section>
            `
        }
    });

    //Indicando ultima mensagem para scroll automatico
    mensagens = document.querySelectorAll('.msg');
    if (mensagens[mensagens.length - 2].classList.contains('ultima')) {
        mensagens[mensagens.length - 2].classList.remove('ultima');
    }
    mensagens[mensagens.length - 1].classList.add('ultima');

    ultimaMensagem = document.querySelector('.ultima');
}

//Buncando mensagens
function buscarMSG() {
    const promise = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    promise.then(response => {
        const data = response.data;

        renderizarMSGS(data);

        ultimaMensagem.scrollIntoView();
    });
}

buscarMSG();
buscarParticipantes();
setInterval(buscarMSG, 3000);
setInterval(buscarParticipantes, 1000);

