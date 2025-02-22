const form = document.getElementById('formzinho');
const nome = document.getElementById('nome');
const email = document.getElementById('email');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
        nome: nome.value,
        email: email.value,
        id: valor
    };

    try{
        const response = await fetch('/edita-usuario', {
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
        }
    } catch (error){
        console.log('Error: ', error);
    }
});