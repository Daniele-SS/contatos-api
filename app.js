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

// modal
const modal             = document.getElementById('modal')
const modalOverlay      = document.getElementById('modal-overlay')
const modalNome         = document.getElementById('modal-input-nome')
const modalCelular      = document.getElementById('modal-input-celular')
const modalEmail        = document.getElementById('modal-input-email')
const modalEndereco     = document.getElementById('modal-input-endereco')
const modalCidade       = document.getElementById('modal-input-cidade')
const modalFoto         = document.getElementById('modal-input-foto')
const btnModalSalvar    = document.getElementById('btn-modal-salvar')
const btnModalDeletar   = document.getElementById('btn-modal-deletar')
const btnModalFechar    = document.getElementById('btn-modal-fechar')
const modalMsgErro      = document.getElementById('modal-msg-erro')

// confirmação
const confirmOverlay    = document.getElementById('confirm-overlay')
const confirmBox        = document.getElementById('confirm-box')
const btnConfirmSim     = document.getElementById('btn-confirm-sim')
const btnConfirmNao     = document.getElementById('btn-confirm-nao')

let idEmEdicao = null

// ── helpers ───────────────────────────────────────────

function atualizarContagem() {
    contatosCount.textContent = `${listaContatos.children.length} contatos`
}

function mostrarErro(msg, alvo = msgErro) {
    alvo.textContent = msg
    alvo.hidden = false
    setTimeout(() => { alvo.hidden = true }, 4000)
}

function limparForm() {
    inputNome.value = inputCelular.value = inputEmail.value =
    inputEndereco.value = inputCidade.value = inputFoto.value = ''
}

// ── modal ─────────────────────────────────────────────

function abrirModal(contato) {
    idEmEdicao = contato.id
    modalNome.value     = contato.nome     ?? ''
    modalCelular.value  = contato.celular  ?? ''
    modalEmail.value    = contato.email    ?? ''
    modalEndereco.value = contato.endereco ?? ''
    modalCidade.value   = contato.cidade   ?? ''
    modalFoto.value     = contato.foto     ?? ''
    modalMsgErro.hidden = true
    modal.classList.add('modal--open')
    modalOverlay.classList.add('modal--open')
    modalNome.focus()
}

function fecharModal() {
    modal.classList.remove('modal--open')
    modalOverlay.classList.remove('modal--open')
    idEmEdicao = null
}

btnModalFechar.addEventListener('click', fecharModal)
modalOverlay.addEventListener('click', fecharModal)

// ── confirmação de delete ─────────────────────────────

function abrirConfirmacao() {
    return new Promise(resolve => {
        confirmOverlay.classList.add('confirm--open')
        confirmBox.classList.add('confirm--open')

        function responder(sim) {
            confirmOverlay.classList.remove('confirm--open')
            confirmBox.classList.remove('confirm--open')
            btnConfirmSim.removeEventListener('click', onSim)
            btnConfirmNao.removeEventListener('click', onNao)
            resolve(sim)
        }

        function onSim() { responder(true) }
        function onNao() { responder(false) }

        btnConfirmSim.addEventListener('click', onSim)
        btnConfirmNao.addEventListener('click', onNao)
    })
}

// ── salvar edição (PUT) ───────────────────────────────

btnModalSalvar.addEventListener('click', async () => {
    if (!modalNome.value.trim() || !modalCelular.value.trim()) {
        mostrarErro('Nome e celular são obrigatórios.', modalMsgErro)
        return
    }

    const contatoAtualizado = {
        nome:     modalNome.value.trim(),
        celular:  modalCelular.value.trim(),
        email:    modalEmail.value.trim(),
        endereco: modalEndereco.value.trim(),
        cidade:   modalCidade.value.trim(),
        foto:     modalFoto.value.trim()
    }

    btnModalSalvar.disabled = true
    btnModalSalvar.textContent = 'Salvando...'

    try {
        const atualizado = await putContato(idEmEdicao, contatoAtualizado)

        // substitui o card antigo pelo novo
        const cardAntigo = listaContatos.querySelector(`[data-id="${idEmEdicao}"]`)
        if (cardAntigo) cardAntigo.replaceWith(criarCard(atualizado))

        fecharModal()
    } catch (err) {
        mostrarErro('Erro ao atualizar contato.', modalMsgErro)
    } finally {
        btnModalSalvar.disabled = false
        btnModalSalvar.textContent = 'Salvar alterações'
    }
})

// ── deletar (DELETE) ──────────────────────────────────

btnModalDeletar.addEventListener('click', async () => {
    const confirmado = await abrirConfirmacao()
    if (!confirmado) return

    btnModalDeletar.disabled = true
    btnModalDeletar.textContent = 'Deletando...'

    try {
        await deleteContato(idEmEdicao)

        const card = listaContatos.querySelector(`[data-id="${idEmEdicao}"]`)
        if (card) card.remove()

        atualizarContagem()
        fecharModal()
    } catch (err) {
        mostrarErro('Erro ao deletar contato.', modalMsgErro)
    } finally {
        btnModalDeletar.disabled = false
        btnModalDeletar.textContent = 'Deletar contato'
    }
})

// ── criar card ────────────────────────────────────────

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

    // abre modal ao clicar no card
    card.addEventListener('click', () => abrirModal(contato))

    return card
}

// ── carregar contatos (GET) ───────────────────────────

async function carregarContatos() {
    const p = document.createElement('p')
    p.textContent = 'Carregando...'
    listaContatos.replaceChildren(p)

    try {
        const contatos = await getContatos()
        listaContatos.replaceChildren()
        contatos.forEach(c => listaContatos.appendChild(criarCard(c)))
        atualizarContagem()
    } catch (err) {
        listaContatos.replaceChildren()
        mostrarErro('Não foi possível carregar os contatos.')
    }
}

// ── novo contato (POST) ───────────────────────────────

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
        atualizarContagem()
        limparForm()
    } catch (err) {
        mostrarErro('Erro ao salvar contato.')
    } finally {
        btnSalvar.disabled = false
        btnSalvar.textContent = 'Salvar contato'
    }
})

carregarContatos()