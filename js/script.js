const participantes = document.querySelector('.participantes');
const btn_menu = document.querySelector('.menu');
const chat = document.querySelector('.chat');

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

function renderizarMSGS(data){
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
    });
}

function buscarMSG(){
    const promise = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    promise.then(response => {
        const data = response.data;
        console.log(data);

        renderizarMSGS(data);
    });
}

buscarMSG();

