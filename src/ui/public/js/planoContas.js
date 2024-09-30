let planoDeContas = [];
const alertModalElement = document.getElementById('alertModal');
const alertModal = new bootstrap.Modal(alertModalElement);
let isUpdating = false; // Flag para evitar recursão

// Função para determinar a configuração de dígitos por nível automaticamente
function determineDigitConfig(contas, digitConfig = {}) {
    contas.forEach(conta => {
        const segmentos = conta.codigo.split('.');
        segmentos.forEach((segment, index) => {
            const nivel = index + 1;
            const comprimento = segment.length;
            if (!digitConfig[nivel] || comprimento > digitConfig[nivel]) {
                digitConfig[nivel] = comprimento;
            }
        });
        if (conta.subcontas && conta.subcontas.length > 0) {
            determineDigitConfig(conta.subcontas, digitConfig);
        }
    });
    return digitConfig;
}

let digitConfig = {};

// Carrega o Plano de Contas do servidor
function loadPlanoDeContas() {
    // Mostrar a tela de carregamento
    document.getElementById('loading-overlay').classList.add('active');

    fetch('/api/plano-de-contas')
        .then(response => response.json())
        .then(data => {
            planoDeContas = data.PlanoDeContas || data;

            if (planoDeContas && Array.isArray(planoDeContas)) {
                // Determina a configuração de dígitos por nível automaticamente
                digitConfig = determineDigitConfig(planoDeContas);
                console.log('Configuração de Dígitos por Nível:', digitConfig);
                renderPlanoDeContas();
                updateCodigoMask();
            } else {
                displayModal('Erro', 'Erro: Dados recebidos não são um array.', ['OK'], [hideModal]);
            }
        })
        .catch(error => {
            console.error('Erro ao obter o plano de contas:', error);
            displayModal('Erro', `Erro ao obter o plano de contas: ${error.message}`, ['OK'], [hideModal]);
        }).finally(() => {
            // Esconder a tela de carregamento
            document.getElementById('loading-overlay').classList.remove('active');
        });
}

// Renderiza a Tabela do Plano de Contas
function renderPlanoDeContas(contas = planoDeContas, nivel = 0) {
    const tableBody = document.getElementById('planoDeContasTable').querySelector('tbody');

    if (nivel === 0) {
        tableBody.innerHTML = ''; // Limpa a tabela antes de renderizar
    }

    contas.forEach(conta => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td style="padding-left: ${20 * nivel}px">${conta.codigo}</td>
            <td>${conta.descricao}</td>
            <td>${conta.nivel}</td>
            <td class="action-buttons">
                <button class="btn btn-sm edit-btn" onclick="editConta('${conta.codigo}')"><i class="fa-solid fa-pencil"></i> Editar</button>
                <button class="btn btn-sm delete-btn" onclick="confirmDelete('${conta.codigo}')"><i class="fa-solid fa-trash"></i> Excluir</button>
            </td>
        `;
        tableBody.appendChild(row);

        if (conta.subcontas && conta.subcontas.length > 0) {
            renderPlanoDeContas(conta.subcontas, nivel + 1);
        }
    });
}

// Encontra uma conta pelo código
function findContaByCodigo(contas, codigo) {
    for (let conta of contas) {
        if (conta.codigo === codigo) {
            return conta;
        }
        if (conta.subcontas && conta.subcontas.length > 0) {
            const result = findContaByCodigo(conta.subcontas, codigo);
            if (result) {
                return result;
            }
        }
    }
    return null; // Retorna null se a conta não for encontrada
}

// Edita uma conta existente
function editConta(codigo) {
    const conta = findContaByCodigo(planoDeContas, codigo);

    if (conta) {
        document.getElementById('codigo').value = conta.codigo;
        document.getElementById('descricao').value = conta.descricao;
        document.getElementById('nivel').value = conta.nivel;
        document.getElementById('editIndex').value = codigo;

        // Desabilita os campos "Código" e "Nível" para edição
        document.getElementById('codigo').disabled = true;
        document.getElementById('nivel').disabled = true;

        scrollToForm();
    } else {
        displayModal('Erro', 'Conta não encontrada para edição.', ['OK'], [hideModal]);
    }
}

// Confirma a exclusão de uma conta
function confirmDelete(codigo) {
    displayModal('Confirmação', 'Tem certeza de que deseja excluir esta conta?', ['Cancelar', 'Excluir'], [
        hideModal,
        () => {
            hideModal();
            deleteConta(codigo);
        }
    ]);
}

// Deleta uma conta
function deleteConta(codigo) {
    const encodedCodigo = encodeURIComponent(codigo);

    fetch(`/api/plano-de-contas/${encodedCodigo}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    const errorMessage = data.error || 'Erro ao tentar excluir a conta.';
                    return Promise.reject(new Error(errorMessage));
                });
            }
            // Recarrega o plano de contas após exclusão bem-sucedida
            loadPlanoDeContas();
            displayModal('Sucesso', 'Conta excluída com sucesso.', ['OK'], [hideModal]);
        })
        .catch(error => {
            displayModal('Erro', error.message, ['OK'], [hideModal]);
        });
}

// Adiciona ou Atualiza uma conta
document.getElementById('contaForm').addEventListener('submit', function (e) {
    e.preventDefault();
    addConta();
});

function addConta() {
    const codigo = document.getElementById('codigo').value.trim();
    const descricao = document.getElementById('descricao').value.trim();
    const nivel = document.getElementById('nivel').value;
    const editIndex = document.getElementById('editIndex').value;

    // Validações
    if (!codigo || !descricao || !nivel) {
        displayModal('Erro', 'Todos os campos são obrigatórios.', ['OK'], [hideModal]);
        return;
    }

    if (!isValidCodigo(codigo, nivel)) {
        displayModal('Erro', 'Código inválido. Certifique-se de que o código segue o formato correto e o nível corresponde ao número de segmentos.', ['OK'], [hideModal]);
        return;
    }

    if (isDuplicateCodigo(codigo, editIndex)) {
        displayModal('Erro', 'Código já existente. Por favor, insira um código único.', ['OK'], [hideModal]);
        return;
    }

    // Verificação de hierarquia (se nível > 1)
    if (parseInt(nivel) > 1) {
        const superiorCodigo = getSuperiorCodigo(codigo);
        if (!superiorCodigo || !findContaByCodigo(planoDeContas, superiorCodigo)) {
            displayModal('Erro', 'A conta superior não existe. Adicione a conta superior primeiro.', ['OK'], [hideModal]);
            return;
        }
    }

    const novaConta = { codigo, descricao, nivel };

    fetch('/api/plano-de-contas', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(novaConta)
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    const errorMessage = data.error || 'Erro ao tentar adicionar a conta.';
                    return Promise.reject(new Error(errorMessage));
                });
            }
            return response.json();
        })
        .then(data => {
            // Recarrega o plano de contas após adicionar ou atualizar
            loadPlanoDeContas();
            if (editIndex) {
                displayModal('Sucesso', 'Conta atualizada com sucesso.', ['OK'], [hideModal]);
            } else {
                displayModal('Sucesso', 'Conta adicionada com sucesso.', ['OK'], [hideModal]);
            }
            resetForm();
        })
        .catch(error => {
            displayModal('Erro', error.message, ['OK'], [hideModal]);
        });
}

// Reseta o formulário
function resetForm() {
    document.getElementById('codigo').value = '';
    document.getElementById('descricao').value = '';
    document.getElementById('nivel').value = '';
    document.getElementById('editIndex').value = '';

    // Reabilita os campos "Código" e "Nível"
    document.getElementById('codigo').disabled = false;
    document.getElementById('nivel').disabled = false;
}

// Valida o formato do código e a correspondência com o nível
function isValidCodigo(codigo, nivel) {
    const expectedSegments = parseInt(nivel);
    const digitCounts = getDigitCounts(nivel);

    const regexSegments = digitCounts.map(count => `\\d{1,${count}}`).join('\\.');

    const regex = new RegExp(`^(${regexSegments})$`);
    return regex.test(codigo);
}

// Obtém os dígitos por segmento baseado no nível
function getDigitCounts(nivel) {
    let counts = [];
    for (let i = 1; i <= nivel; i++) {
        counts.push(digitConfig[i] || 1); // Fallback para 1 se não definido
    }
    return counts;
}

// Obtém o código superior baseado no código atual
function getSuperiorCodigo(codigo) {
    const segmentos = codigo.split('.');
    segmentos.pop(); // Remove o último segmento
    return segmentos.join('.') || null;
}

// Verifica se o código já existe (exceto no caso de edição da própria conta)
function isDuplicateCodigo(codigo, editIndex) {
    const conta = findContaByCodigo(planoDeContas, codigo);
    if (!conta) return false;
    return editIndex !== codigo;
}

// Implementa a máscara dinâmica para o campo código
function updateCodigoMask() {
    const codigoInput = document.getElementById('codigo');

    // Remove event listener anterior para evitar múltiplos
    codigoInput.removeEventListener('input', handleCodigoInput);
    codigoInput.addEventListener('input', handleCodigoInput);
}

function handleCodigoInput(e) {
    if (isUpdating) return;
    isUpdating = true;

    const nivel = document.getElementById('nivel').value;
    if (!nivel) {
        isUpdating = false;
        return;
    }

    const digitCounts = getDigitCounts(nivel);
    const maxSegments = digitCounts.length;
    const totalDigits = digitCounts.reduce((a, b) => a + b, 0);
    const maxLength = totalDigits + (maxSegments - 1); // Dots

    let value = this.value.replace(/[^0-9.]/g, ''); // Remove caracteres inválidos

    // Limita o comprimento total
    if (value.length > maxLength) {
        value = value.slice(0, maxLength);
    }

    let segmentos = value.split('.');

    // Limita o número de segmentos de acordo com o nível
    if (segmentos.length > maxSegments) {
        segmentos = segmentos.slice(0, maxSegments);
        value = segmentos.join('.');
    }

    // Aplica a máscara para cada segmento
    for (let i = 0; i < segmentos.length; i++) {
        const expectedDigits = digitCounts[i];
        if (segmentos[i].length > expectedDigits) {
            segmentos[i] = segmentos[i].slice(0, expectedDigits);
        }
    }

    // Reconstroi o valor
    value = segmentos.join('.');
    this.value = value;

    // Automatiza a seleção do nível com base no número de segmentos
    autoSelectNivel(segmentos.length);

    isUpdating = false;
}

// Automatiza a seleção do nível com base no número de segmentos
function autoSelectNivel(numSegments) {
    if (numSegments >= 1 && numSegments <= Object.keys(digitConfig).length) {
        document.getElementById('nivel').value = numSegments;
    }
}

// Gera o placeholder baseado no nível
function getPlaceholder(nivel) {
    if (!nivel) return "Ex: 1";
    const digitCounts = getDigitCounts(nivel);
    const segments = digitCounts.map(count => '0'.repeat(count)).join('.');
    return segments;
}

// Exibe o modal com conteúdo dinâmico
function displayModal(title, message, buttons, callbacks) {
    const modalTitle = document.getElementById('modalTitle');
    const modalMessage = document.getElementById('modalMessage');
    const modalFooter = document.getElementById('modalFooter');

    modalTitle.innerHTML = getModalHeaderIcon(title) + title;
    modalMessage.textContent = message;

    // Limpa os botões anteriores
    modalFooter.innerHTML = '';

    // Cria os botões dinamicamente
    buttons.forEach((btnText, index) => {
        const button = document.createElement('button');
        button.textContent = btnText;
        if (btnText.toLowerCase() === 'excluir' || btnText.toLowerCase() === 'salvar') {
            button.classList.add('btn', 'btn-danger-custom');
        } else if (btnText.toLowerCase() === 'editar' || btnText.toLowerCase() === 'ok' || btnText.toLowerCase() === 'cancelar') {
            button.classList.add('btn', 'btn-secondary-custom');
        }
        button.onclick = callbacks[index];
        modalFooter.appendChild(button);
    });

    // Não configurar auto-fechamento para Erro e Sucesso
    alertModal.show();
}

// Define o ícone do cabeçalho do modal com base no título
function getModalHeaderIcon(title) {
    switch (title.toLowerCase()) {
        case 'erro':
            return '<i class="fa-solid fa-circle-exclamation text-danger"></i> ';
        case 'sucesso':
            return '<i class="fa-solid fa-circle-check text-success"></i> ';
        case 'confirmação':
            return '<i class="fa-solid fa-question-circle text-warning"></i> ';
        default:
            return '<i class="fa-solid fa-info-circle text-primary"></i> ';
    }
}

// Esconde o modal
function hideModal() {
    alertModal.hide();
}

// Role suavemente para o formulário
function scrollToForm() {
    document.querySelector('.form-container').scrollIntoView({ behavior: 'smooth' });
}

// Evento para reformatar o campo "Código" quando o nível é alterado
document.getElementById('nivel').addEventListener('change', function () {
    const nivel = this.value;
    const codigoInput = document.getElementById('codigo');
    if (!nivel) return;

    // Atualiza o placeholder conforme o nível
    codigoInput.placeholder = `Ex: ${getPlaceholder(nivel)}`;

    // Reformatar o código atual conforme o novo nível
    const currentCodigo = codigoInput.value;
    const segmentos = currentCodigo.split('.');
    if (segmentos.length > nivel) {
        segmentos.splice(nivel);
    }
    codigoInput.value = segmentos.join('.');
});

// Inicializa a página carregando o plano de contas
loadPlanoDeContas();