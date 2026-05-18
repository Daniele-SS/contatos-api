const URL = 'https://bakcend-fecaf-render.onrender.com/contatos'

export async function getContatos() {
    const response = await fetch (URL)

    //Primeira opção para criar o if else
    // if(!response.ok) throw new Error('Erro ao buscar contatos') //Se não estiver OK é porque deu erro. O '!' significa uma negativa no JavaScript
    // return response.json()

    //Segunda opção para criar o if else
    if(!response.ok) {
        return response.json()
    } else {
        throw new Error('Erro ao buscar contatos')
    }
}


export async function postContato(contato) {
    const options = {
        method : 'POST',
        headers: {
            'Content-Type': 'apllication/json'
        },
        body: JSON.stringify(contato)
    }
}