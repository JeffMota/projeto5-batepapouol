const input_name = document.querySelector('.input_name');
const btn_entr = document.querySelector('.btn_entrar');
const img_loading = document.querySelector('.loading');
const form = document.querySelector('.formu');

var usuario = { name: '' };

function entrar() {
    input_name.classList.toggle('hidden');
    img_loading.classList.toggle('hidden');

    if (input_name.value == "") {
        alert('Digite o seu nome para seus amigos te reconhecerem!');
        input_name.classList.toggle('hidden');
        img_loading.classList.toggle('hidden');
    }
    else {
        usuario.name = input_name.value;

        localStorage.setItem('user', usuario.name);

        const promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', usuario);
        promise.then(() => { window.location.href = 'chat.html' });
        promise.catch(() => {
            alert('Nome de usuário já cadastrado');
            input_name.classList.toggle('hidden');
            img_loading.classList.toggle('hidden');
        });

    }
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    entrar();
})

