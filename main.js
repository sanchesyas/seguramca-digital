// Configurações iniciais
const numeroSenha = document.querySelector('.parametro-senha__texto');
let tamanhoSenha = 12;
const letrasMaiusculas = 'ABCDEFGHIJKLMNOPQRSTUVXYWZ';
const letrasMinusculas = 'abcdefghijklmnopqrstuvxywz';
const numeros = '0123456789';
const simbolos = '!@#$%*()_+^&{}[]:;<>?';
const botoes = document.querySelectorAll('.parametro-senha__botao');
const campoSenha = document.querySelector('#campo-senha');
const checkbox = document.querySelectorAll('.checkbox');
const forcaSenha = document.querySelector('.forca');
const themeToggle = document.querySelector('#theme-toggle');
const copyButton = document.querySelector('#copy-button');

// Tema
let isDarkTheme = true;

themeToggle.addEventListener('click', () => {
    isDarkTheme = !isDarkTheme;
    document.body.classList.toggle('light-theme', !isDarkTheme);
    if (!isDarkTheme) {
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
});

// Cópia de senha
copyButton.addEventListener('click', () => {
    campoSenha.select();
    document.execCommand('copy');
    copyButton.innerHTML = '<i class="fas fa-check"></i>';
    setTimeout(() => {
        copyButton.innerHTML = '<i class="fas fa-copy"></i>';
    }, 2000);
});

// Botões de incremento/decremento
botoes.forEach(botao => {
    if (botao.classList.contains('decrement')) {
        botao.addEventListener('click', diminuiTamanho);
    } else {
        botao.addEventListener('click', aumentaTamanho);
    }
});

function diminuiTamanho() {
    if (tamanhoSenha > 1) {
        tamanhoSenha--;
    }
    atualizaTamanho();
}

function aumentaTamanho() {
    if (tamanhoSenha < 50) {
        tamanhoSenha++;
    }
    atualizaTamanho();
}

function atualizaTamanho() {
    numeroSenha.textContent = tamanhoSenha;
    geraSenha();
}

// Geração de senha
checkbox.forEach(checkbox => {
    checkbox.addEventListener('change', geraSenha);
});

geraSenha();

function geraSenha() {
    let alfabeto = '';
    const checkboxes = {
        maiusculo: checkbox[0].checked,
        minusculo: checkbox[1].checked,
        numero: checkbox[2].checked,
        simbolo: checkbox[3].checked
    };

    if (checkboxes.maiusculo) alfabeto += letrasMaiusculas;
    if (checkboxes.minusculo) alfabeto += letrasMinusculas;
    if (checkboxes.numero) alfabeto += numeros;
    if (checkboxes.simbolo) alfabeto += simbolos;

    if (alfabeto === '') {
        campoSenha.value = 'Nenhum caractere selecionado';
        return;
    }

    // Garanta que pelo menos um caractere de cada tipo selecionado está presente
    let senha = '';
    if (checkboxes.maiusculo) senha += getRandomCharacter(letrasMaiusculas);
    if (checkboxes.minusculo) senha += getRandomCharacter(letrasMinusculas);
    if (checkboxes.numero) senha += getRandomCharacter(numeros);
    if (checkboxes.simbolo) senha += getRandomCharacter(simbolos);

    for (let i = senha.length; i < tamanhoSenha; i++) {
        senha += getRandomCharacter(alfabeto);
    }

    campoSenha.value = senha;
    classificaSenha(alfabeto.length, checkboxes);
}

function getRandomCharacter(str) {
    return str[Math.floor(Math.random() * str.length)];
}

function classificaSenha(tamanhoAlfabeto, checkboxes) {
    const hasLower = checkboxes.minusculo;
    const hasUpper = checkboxes.maiusculo;
    const hasNumber = checkboxes.numero;
    const hasSymbol = checkboxes.simbolo;

    let entropia = tamanhoSenha * Math.log2(tamanhoAlfabeto);
    const entropiaElement = document.querySelector('.entropia');
    
    entropiaElement.textContent = `
        Força da senha: ${entropia.toFixed(2)} bits
        Tempo estimado para quebra: ${Math.floor(2 ** entropia / (1e6))} anos
    `;

    forcaSenha.style.width = `${Math.min(100, (entropia / 100) * 100)}%`;
    
    if (entropia > 100) {
        forcaSenha.classList.add('forte');
        forcaSenha.classList.remove('media', 'fraca');
    } else if (entropia > 50) {
        forcaSenha.classList.add('media');
        forcaSenha.classList.remove('forte', 'fraca');
    } else {
        forcaSenha.classList.add('fraca');
        forcaSenha.classList.remove('media', 'forte');
    }
}