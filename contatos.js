const URL = 'https://bakcend-fecaf-render.onrender.com/contatos'

export async function getContatos() {
    const response = await fetch (URL)
    if(!response.ok) throw new Error('Erro ao buscar contatos') //Se não estiver OK é porque deu erro. O '!' significa uma negativa no JavaScript
    return response.json()
}