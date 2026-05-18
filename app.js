'use strict'

import { getContatos, postContato, putContato, deleteContato } from './contatos.js'

const form = document.getElementById('form-contato')
const inputNome     = document.getElementById('input-nome')
const inputCelular  = document.getElementById('input-celular')
const inputEmail    = document.getElementById('input-email')
const inputEndereco = document.getElementById('input-endereco')
const inputCidade   = document.getElementById('input-cidade')
const inputFoto     = document.getElementById('input-foto')
const btnSalvar     = document.getElementById('btn-salvar')
const listaContatos = document.getElementById('lista-contatos')
const msgErro       = document.getElementById('msg-erro')

function criarCard(contato) {
    const card = document.createElement('div')
    card.classList.add('contact-card')
    card.dataset.id = contato.id

    const avatar = contato.foto
        ? `<img class="avatar" src="${contato.foto}" alt="${contato.nome}" />`
        : `<div class="avatar-placeholder">${contato.nome.slice(0, 2).toUpperCase()}</div>`

    card.innerHTML = `
        ${avatar}
        <span class="card-name">${contato.nome}</span>
        <span class="card-phone">${contato.celular}</span>
        <span class="card-city">${contato.cidade ?? ''}</span>
    `
    return card
}

async function carregarContatos() {
    listaContatos.innerHTML = '<p style="color: var(--color-text-secondary); font-size:13px">Carregando...</p>'
    try {
        const contatos = await getContatos()
        listaContatos.innerHTML = ''
        contatos.forEach(c => listaContatos.appendChild(criarCard(c)))
    } catch (err) {
        listaContatos.innerHTML = ''
        mostrarErro('Não foi possível carregar os contatos.')
    }
}

function mostrarErro(msg) {
    msgErro.textContent = msg
    msgErro.hidden = false
    setTimeout(() => { msgErro.hidden = true }, 4000)
}

function limparForm() {
    inputNome.value = ''
    inputCelular.value = ''
    inputEmail.value = ''
    inputEndereco.value = ''
    inputCidade.value = ''
    inputFoto.value = ''
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

    btnSalvar.disabled = true
    btnSalvar.textContent = 'Salvando...'

    try {
        const criado = await postContato(novoContato)
        listaContatos.prepend(criarCard(criado))
        limparForm()
    } catch (err) {
        mostrarErro('Erro ao salvar contato.')
    } finally {
        btnSalvar.disabled = false
        btnSalvar.textContent = 'Salvar contato'
    }
})

carregarContatos()