const form = document.getElementById('formzin');
const nome = document.getElementById('nome');
const email = document.getElementById('email');
const senha = document.getElementById('senha');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
        nome: nome.value,
        email: email.value,
        senha: senha.value
    };

    try{
        const response = await fetch('/registro', {
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();
        document.getElementById('message').innerHTML = result.message;
        if(result.status != 'failed'){
            nome.value = '';
            email.value= '';
            senha.value = '';
        }
    } catch (error){
        console.log('Error: ', error);
    }
});