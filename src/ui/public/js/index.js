let planoDeContas = [];
let currentClassification = {};

// Função debounce para evitar múltiplas requisições rápidas
function debounce(func, wait) {
    let timeout;
    return function (...args) {
        const later = () => {
            clearTimeout(timeout);
            func.apply(this, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Função para inicializar Select2 com AJAX
function addTooltip(selectId) {
    $('#' + selectId).on('select2:select', function (e) {
        const selectedData = e.params.data;
        const rendered = $('#' + selectId)
            .next('.select2-container')
            .find('.select2-selection__rendered');
        rendered.attr('title', selectedData.text);
    });
}

// Atualizar a função initializeSelect2 para incluir a adição de tooltips
function initializeSelect2(selectId, apiUrl, idField, textField) {
    $('#' + selectId).select2({
        placeholder: 'Selecione ou digite para buscar',
        allowClear: true,
        width: '100%',
        ajax: {
            url: apiUrl,
            dataType: 'json',
            delay: 250, // Delay para evitar múltiplas requisições
            data: debounce(function (params) {
                return {
                    q: params.term, // termo de busca
                };
            }, 300), // Debounce de 300ms
            processResults: function (data) {
                return {
                    results: data.map((item) => ({
                        id: item[idField],
                        text: `${item[idField]} - ${item[textField]}`,
                    })),
                };
            },
            cache: true,
        },
    });

    // Adicionar tooltips
    addTooltip(selectId);
}

// Inicializar Select2 com AJAX para CNAE Principal, CNAE de Entrada e NCM do Item
$(document).ready(function () {
    initializeSelect2('cnaePrincipal', '/api/cnae', 'cod', 'desc');
    initializeSelect2('cnaeEntrada', '/api/cnae', 'cod', 'desc');
    initializeSelect2('ncmItem', '/api/ncm', 'codigo', 'descricao');
    // Carregar dados JSON ao iniciar
    loadJSONData();
});

// Função para carregar os dados JSON necessários ao iniciar
async function loadJSONData() {
    try {
        // Mostrar a tela de carregamento
        document.getElementById('loading-overlay').classList.add('active');

        // Carrega o Plano de Contas
        const planoResponse = await fetch('/api/plano-de-contas');
        if (!planoResponse.ok) throw new Error('Erro ao carregar o Plano de Contas');
        planoDeContas = await planoResponse.json();

        // Função recursiva para obter todas as contas de último nível
        function obterContasDeUltimoNivel(contas) {
            let contasDeUltimoNivel = [];
            contas.forEach((conta) => {
                if (!conta.subcontas || conta.subcontas.length === 0) {
                    contasDeUltimoNivel.push(conta);
                } else {
                    contasDeUltimoNivel = contasDeUltimoNivel.concat(
                        obterContasDeUltimoNivel(conta.subcontas)
                    );
                }
            });
            return contasDeUltimoNivel;
        }

        // Obter todas as contas de último nível
        const ultimoNivelContas = obterContasDeUltimoNivel(planoDeContas);

        // Preenche as opções de reclassificação com as contas de último nível
        populateReclassificationSelectOptions(
            'reclassifyDebitSelect',
            ultimoNivelContas,
            'codigo',
            'descricao'
        );
        populateReclassificationSelectOptions(
            'reclassifyCreditSelect',
            ultimoNivelContas,
            'codigo',
            'descricao'
        );

        // Inicializa o Select2 para os selects de reclassificação
        initializeReclassificationSelect2('reclassifyDebitSelect');
        initializeReclassificationSelect2('reclassifyCreditSelect');
    } catch (error) {
        console.error('Erro ao carregar os dados:', error);
        showMessage('Erro ao carregar os dados. Tente novamente mais tarde.', 'danger');
    } finally {
        // Esconder a tela de carregamento
        document.getElementById('loading-overlay').classList.remove('active');
    }
}

// Função para preencher as opções de reclassificação
function populateReclassificationSelectOptions(selectId, data, valueField, textField) {
    const selectElement = document.getElementById(selectId);
    selectElement.innerHTML = ''; // Limpa as opções existentes
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Selecione uma opção';
    selectElement.appendChild(defaultOption);

    data.forEach((item) => {
        const option = document.createElement('option');
        option.value = item[valueField];
        option.textContent = `${item[valueField]} - ${item[textField]}`;
        selectElement.appendChild(option);
    });
}

// Função para inicializar Select2 nos selects de reclassificação
function initializeReclassificationSelect2(selectId) {
    $('#' + selectId).select2({
        placeholder: 'Selecione ou digite para buscar',
        allowClear: true,
        width: '100%',
        dropdownParent: $('#feedback-modal'), // Anexa o dropdown ao modal
    });
}

// Função para classificar a conta contábil
async function classify() {
    const cnaePrincipal = $('#cnaePrincipal').val();
    const cnaeEntrada = $('#cnaeEntrada').val();
    const ncmItem = $('#ncmItem').val();

    if (!cnaePrincipal || !cnaeEntrada || !ncmItem) {
        showMessage('Por favor, preencha todos os campos antes de classificar.', 'danger');
        return;
    }

    // Mostrar a tela de carregamento
    document.getElementById('loading-overlay').classList.add('active');

    try {
        const response = await fetch('/api/classify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ cnaePrincipal, cnaeEntrada, ncmItem }),
        });

        if (!response.ok) {
            throw new Error('Erro na resposta da classificação.');
        }

        const result = await response.json();
        console.log(JSON.stringify(result, null, 2));
        const outputDiv = document.getElementById('output');
        currentClassification = result;

        // Extrai as contas e as confianças do resultado
        const debitAccount = result?.contaDebito || 'Conta não encontrada';
        const creditAccount = result?.contaCredito || 'Conta não encontrada';
        const debitConfidence = (result?.confidences?.contaDebito * 100).toFixed(2) || '0.00';
        const creditConfidence = (result?.confidences?.contaCredito * 100).toFixed(2) || '0.00';

        // Atualiza o conteúdo da div de saída com as informações obtidas
        outputDiv.innerHTML = `
            <p><strong>CNAE Principal:</strong> ${cnaePrincipal}</p>
            <p><strong>CNAE de Entrada:</strong> ${cnaeEntrada}</p>
            <p><strong>NCM do Item:</strong> ${ncmItem}</p>
            <p><span class="suggested-account">Conta Débito:</span> ${debitAccount} <span style="color: #999;">(Confiabilidade: ${debitConfidence}%)</span></p>
            <p><span class="suggested-account">Conta Crédito:</span> ${creditAccount} <span style="color: #999;">(Confiabilidade: ${creditConfidence}%)</span></p>

            <!-- Inputs hidden para armazenar as contas de débito e crédito -->
            <input type="hidden" id="hiddenDebitAccount" value="${debitAccount}">
            <input type="hidden" id="hiddenCreditAccount" value="${creditAccount}">
        `;

        // Exibe os botões de feedback
        document.querySelector('.feedback-buttons').style.display = 'flex';
    } catch (error) {
        console.error('Erro ao classificar:', error);
        showMessage('Erro ao classificar. Tente novamente.', 'danger');
    } finally {
        // Esconder a tela de carregamento
        document.getElementById('loading-overlay').classList.remove('active');
    }
}

// Função para exibir mensagens ao usuário
function showMessage(message, type = 'info') {
    const messageDiv = document.getElementById('message');
    messageDiv.style.display = 'block';

    // Mapear tipos para classes do Bootstrap
    let alertClass = 'alert-info';

    if (type === 'success') {
        alertClass = 'alert-success';
    } else if (type === 'danger' || type === 'error') {
        alertClass = 'alert-danger';
    } else if (type === 'warning') {
        alertClass = 'alert-warning';
    }

    messageDiv.innerHTML = `<div class="alert ${alertClass}" role="alert">${message}</div>`;
    // Auto esconder após 5 segundos
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 5000);
}

// Função para submeter a reclassificação
async function submitReclassification() {
    const correctDebitCategory = $('#reclassifyDebitSelect').val();
    const correctCreditCategory = $('#reclassifyCreditSelect').val();

    if (!correctDebitCategory || !correctCreditCategory) {
        showMessage('Por favor, selecione as contas corretas para débito e crédito.', 'danger');
        return;
    }

    const cnaePrincipal = $('#cnaePrincipal').val();
    const cnaeEntrada = $('#cnaeEntrada').val();
    const ncmItem = $('#ncmItem').val();

    // Mostrar a tela de carregamento
    document.getElementById('loading-overlay').classList.add('active');

    try {
        const response = await fetch('/api/give-feedback', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                cnaePrincipal,
                cnaeEntrada,
                ncmItem,
                correctDebitCategory,
                correctCreditCategory,
            }),
        });

        if (!response.ok) {
            throw new Error('Erro ao enviar reclassificação.');
        }

        showMessage('Reclassificação enviada com sucesso!', 'success');
        closeModal();
        // Esconder os botões de feedback após reclassificação
        document.querySelector('.feedback-buttons').style.display = 'none';
        // Limpar a saída
        document.getElementById('output').innerHTML = '';
    } catch (error) {
        console.error('Erro ao enviar reclassificação:', error);
        showMessage('Erro ao enviar reclassificação. Tente novamente.', 'danger');
    } finally {
        // Esconder a tela de carregamento
        document.getElementById('loading-overlay').classList.remove('active');
    }
}

// Função para enviar feedback correto
async function sendCorrectFeedback() {
    // Captura os valores dos campos de CNAE e NCM selecionados
    const cnaePrincipal = $('#cnaePrincipal').val();
    const cnaeEntrada = $('#cnaeEntrada').val();
    const ncmItem = $('#ncmItem').val();

    // Captura as contas de débito e crédito dos inputs hidden
    const correctDebitCategory = $('#hiddenDebitAccount').val();
    const correctCreditCategory = $('#hiddenCreditAccount').val();

    // Verifica se os campos estão preenchidos
    if (
        !cnaePrincipal ||
        !cnaeEntrada ||
        !ncmItem ||
        !correctDebitCategory ||
        !correctCreditCategory
    ) {
        showMessage('Por favor, preencha todos os campos antes de enviar o feedback.', 'danger');
        return;
    }

    // Mostrar a tela de carregamento
    document.getElementById('loading-overlay').classList.add('active');

    try {
        // Envia os dados de feedback ao backend usando uma requisição POST
        const response = await fetch('/api/give-feedback', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                cnaePrincipal,
                cnaeEntrada,
                ncmItem,
                correctDebitCategory,
                correctCreditCategory,
            }),
        });

        // Verifica se a requisição foi bem-sucedida
        if (!response.ok) {
            throw new Error('Erro ao enviar feedback de correção.');
        }

        // Mostra uma mensagem de sucesso após o envio do feedback
        showMessage('Feedback enviado com sucesso! Obrigado.', 'success');
        // Esconder os botões de feedback após o feedback positivo
        document.querySelector('.feedback-buttons').style.display = 'none';
        // Limpar a saída de resultados
        document.getElementById('output').innerHTML = '';
    } catch (error) {
        console.error('Erro ao enviar feedback de correção:', error);
        showMessage('Erro ao enviar feedback. Tente novamente.', 'danger');
    } finally {
        // Esconder a tela de carregamento
        document.getElementById('loading-overlay').classList.remove('active');
    }
}

// Função para lidar com o feedback do usuário
function giveFeedback(isCorrect) {
    if (isCorrect) {
        sendCorrectFeedback();
    } else {
        openModal();
    }
}

// Funções para abrir e fechar o modal usando Bootstrap
function openModal() {
    $('#feedback-modal').modal('show');
}

function closeModal() {
    $('#feedback-modal').modal('hide');
}
