'use strict'

import { getContatos, postContato, putContato, deleteContato } from './contatos.js'

const inputNome     = document.getElementById('input-nome')
const inputCelular  = document.getElementById('input-celular')
const inputEmail    = document.getElementById('input-email')
const inputEndereco = document.getElementById('input-endereco')
const inputCidade   = document.getElementById('input-cidade')
const inputFoto     = document.getElementById('input-foto')
const btnSalvar     = document.getElementById('btn-salvar')
const listaContatos = document.getElementById('lista-contatos')
const msgErro       = document.getElementById('msg-erro')
const contatosCount = document.getElementById('contatos-count')

function criarCard(contato) {
    const card = document.createElement('div')
    card.classList.add('contact-card')
    card.dataset.id = contato.id

    let avatarEl
    if (contato.foto) {
        avatarEl = document.createElement('img')
        avatarEl.classList.add('avatar')
        avatarEl.src = contato.foto
        avatarEl.alt = contato.nome

    } else {
        avatarEl = document.createElement('div')
        avatarEl.classList.add('avatar-placeholder')
        avatarEl.textContent = contato.nome.slice(0, 2).toUpperCase()
    }

    const nome = document.createElement('span')
    nome.classList.add('card-name')
    nome.textContent = contato.nome

    const telefone = document.createElement('span')
    telefone.classList.add('card-phone')
    telefone.textContent = contato.celular

    const cidade = document.createElement('span')
    cidade.classList.add('card-city')
    cidade.textContent = contato.cidade ?? ''

    card.append(avatarEl, nome, telefone, cidade)
    return card
}

async function carregarContatos() {
    const p = document.createElement('p')
    p.textContent = 'Carregando...'
    listaContatos.replaceChildren(p)

    try {
        const contatos = await getContatos()
        listaContatos.replaceChildren()
        contatos.forEach(c => listaContatos.appendChild(criarCard(c)))
        contatosCount.textContent = `${contatos.length} contatos`
    } catch (err) {
        listaContatos.replaceChildren()
        mostrarErro('Não foi possível carregar os contatos.')
    }
}

function mostrarErro(msg) {
    msgErro.textContent = msg
    msgErro.hidden = false
    setTimeout(() => { msgErro.hidden = true }, 4000)
}

function limparForm() {
    inputNome.value     = ''
    inputCelular.value  = ''
    inputEmail.value    = ''
    inputEndereco.value = ''
    inputCidade.value   = ''
    inputFoto.value     = ''
}

btnSalvar.addEventListener('click', async () => {
    if (!inputNome.value.trim() || !inputCelular.value.trim()) {
        mostrarErro('Nome e celular são obrigatórios.')
        return
    }

    const novoContato = {
        nome:     inputNome.value.trim(),
        celular:  inputCelular.value.trim(),
        email:    inputEmail.value.trim(),
        endereco: inputEndereco.value.trim(),
        cidade:   inputCidade.value.trim(),
        foto:     inputFoto.value.trim()
    }

    btnSalvar.disabled   = true
    btnSalvar.textContent = 'Salvando...'

    try {
        const criado = await postContato(novoContato)
        listaContatos.prepend(criarCard(criado))
        contatosCount.textContent = `${listaContatos.children.length} contatos`
        limparForm()
    } catch (err) {
        mostrarErro('Erro ao salvar contato.')
    } finally {
        btnSalvar.disabled    = false
        btnSalvar.textContent = 'Salvar contato'
    }
})

carregarContatos()