const participantes = document.querySelector('.participantes');
const btn_menu = document.querySelector('.menu');
const chat = document.querySelector('.chat');
const campo = document.querySelector('.campo');
const btn_enviar = document.querySelector('.btn_enviar');
const ativos = document.querySelector('.ativos');
const form = document.querySelector('.form');
const dest = document.querySelector('.dest');
var mensagens;

var ultimaMensagem;
var penultimaMensagem;
var numeroParticipantes = 0;
var destinatario = 'Todos';
var tipo = 'message';
var destOn = false;

var participanteOnline = [];

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

//Eviar mensagem
function enviarMensagem() {
    if (campo.value != '') {
        mensagem.from = usuario.name;
        mensagem.text = campo.value;
        mensagem.to = destinatario;
        mensagem.type = tipo;
    }

    const promessa = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', mensagem);
    promessa.then(() => { buscarMSG() });
    promessa.catch(() => { window.location.href = 'index.html' });

    campo.value = '';
}

//Escolhendo detinatario
function escolher(elm) {
    const part = document.querySelectorAll('.participante')
    part.forEach(i => {
        i.children[2].classList.add('escondido');
    })
    elm.children[2].classList.remove('escondido');
    destinatario = elm.children[1].innerHTML;
    if (destinatario === 'Todos') {
        dest.classList.add('hidden');
    }
    else {
        dest.classList.remove('hidden');
    }
}

//Ecolhendo se é publica ou privada
function escolherTipo(elm) {
    const part = document.querySelectorAll('.tipo');

    part.forEach(i => {
        i.children[2].classList.add('escondido');
    })
    elm.children[2].classList.remove('escondido');

    if (elm.children[1].innerHTML == 'Reservadamente') {
        tipo = 'private_message';
        dest.innerHTML = `
        Enviando para ${destinatario} (reservadamente)
    `
    }
    else {
        tipo = 'message'
        dest.innerHTML = `
            Enviando para ${destinatario}
        `
    }
}

//Buscando Participantes
function buscarParticipantes() {
    const promise = axios.get('https://mock-api.driven.com.br/api/v6/uol/participants');
    promise.then(response => {
        const data = response.data;
        participanteOnline = [];
        
        

        if (data.length != numeroParticipantes) {
            ativos.innerHTML = `
            <div class="on participante" onclick="escolher(this)">
                <img class="perfil" src="img/Vector.png" alt="todos">
                <p>Todos</p>
                <img class="escondido" src="img/check.png">
            </div>
            `;


            data.forEach(elm => {
                if (elm.name != usuario.name) {
                    ativos.innerHTML += `
                    <div class="on participante" onclick="escolher(this)">
                            <img class="perfil" src="img/perfil.png" alt="todos">
                            <p>${elm.name}</p>
                            <img class="escondido " src="img/check.png">
                    </div>
                `
                }
            });

            const on = document.querySelectorAll('.on');
            on.forEach(el => {
                if(el.children[1].innerHTML == destinatario){
                    el.children[2].classList.remove('escondido');
                }
                participanteOnline.push(el.children[1].innerHTML);
            })

            for(let i = 0; i < participanteOnline.length; i++){
                if(participanteOnline[i] == destinatario){
                    destOn = true;
                }
                else {
                    destOn = false;
                }
            }
            if(destOn == false){
                destinatario = 'Todos';
            }

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
                    ${element.time} <span> ${element.from} </span> para <span>${element.to}</span> : ${element.text}
                </section>
            `
        }
        else if (usuario.name == element.to || element.from == usuario.name) {
            chat.innerHTML += `
                <section class="msg reservada" >
                    ${element.time} <span> ${element.from} </span> reservadamente para <span>${element.to}</span> : ${element.text}
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


form.addEventListener('submit', (e) => {
    e.preventDefault();
    enviarMensagem();
})


buscarMSG();
buscarParticipantes();
setInterval(buscarMSG, 2000);
setInterval(buscarParticipantes, 10000);

