const participantes = document.querySelector('.participantes');
const btn_menu = document.querySelector('.menu');

var usuario = {
    name: ''
}
usuario.name = localStorage.getItem('user');
localStorage.removeItem('user');

//Enviando status
setInterval(() => {
    const promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', usuario);
    
}, 5000);

function fecharMenu() {
    participantes.classList.toggle('hidden');
}

