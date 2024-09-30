let lastScrollPosition = 0;
const reclassifiedItems = new Set(); // Armazena chaves únicas de itens reclassificados

// Variáveis globais para armazenar os dados recebidos do response
let processedDataStore = [];
let unprocessedDataStore = [];

// Função para mostrar mensagens de feedback
function showFeedbackMessage(message, isError = false) {
    // Armazena a posição atual da rolagem
    const scrollY = window.scrollY;

    const feedbackMessagesDiv = document.getElementById('feedbackMessages');
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('feedback-message');
    if (isError) {
        messageDiv.classList.add('error');
        messageDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    } else {
        messageDiv.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    }
    feedbackMessagesDiv.appendChild(messageDiv);

    // Remove a mensagem após 5 segundos
    setTimeout(() => {
        if (feedbackMessagesDiv.contains(messageDiv)) {
            feedbackMessagesDiv.removeChild(messageDiv);
        }
    }, 5000);

    // Reposiciona a rolagem para evitar o scroll
    window.scrollTo(0, scrollY);
}

// Função para abrir o modal e armazenar a posição da rolagem
function openReclassificationModal(produto, contaDebito, contaCredito, ncm, cnaeEmitente, cnaeDestinatario, notaId, classificacaoId, cnaeEmitenteNome, cnaeDestinatarioNome) {
    // Verifica se o item já foi reclassificado
    const itemKey = `${ncm}-${cnaeEmitente}-${cnaeDestinatario}`;
    if (reclassifiedItems.has(itemKey)) {
        showFeedbackMessage('Este item já foi reclassificado.', true);
        return;
    }

    // Armazena a posição atual da rolagem
    lastScrollPosition = window.scrollY;

    resetModal();

    // Preencher os campos com os dados fornecidos
    document.getElementById('modalProduto').textContent = produto || 'N/A';
    document.getElementById('modalContaDebito').textContent = contaDebito || 'N/A';
    document.getElementById('modalContaCredito').textContent = contaCredito || 'N/A';
    document.getElementById('modalNCM').textContent = ncm || 'N/A';
    document.getElementById('modalCNAEEmitente').textContent = `${cnaeEmitente} - ${cnaeEmitenteNome}` || 'N/A';
    document.getElementById('modalCNAEDestinatario').textContent = `${cnaeDestinatario} - ${cnaeDestinatarioNome}` || 'N/A';

    // Armazenar IDs para uso posterior (se necessário)
    document.getElementById('reclassificationModal').dataset.notaId = notaId;
    document.getElementById('reclassificationModal').dataset.classificacaoId = classificacaoId;

    // Exibir o modal
    document.getElementById('reclassificationModal').style.display = 'block';

    // Bloqueia a rolagem do body
    lockBodyScroll();
}

// Função para resetar o modal (limpar e esconder seções desnecessárias)
function resetModal() {
    // Esconder a seção de reclassificação até que "Incorreto" seja clicado
    document.getElementById('reclassifySection').style.display = 'none';

    // Mostrar os botões de feedback novamente
    document.getElementById('feedbackMenu').style.display = 'block';

    // Limpar os selects e inputs
    document.getElementById('newDebitAccount').innerHTML = '';
    document.getElementById('newCreditAccount').innerHTML = '';

    // Esconder a tela de carregamento do modal
    document.getElementById('modalLoading').style.display = 'none';
}

// Função para bloquear a rolagem do body sem perder a posição
function lockBodyScroll() {
    document.body.style.overflow = 'hidden';  // Impede a rolagem
    document.body.style.position = 'fixed';   // Fixa o body
    document.body.style.top = `-${lastScrollPosition}px`;  // Mantém a posição da rolagem
    document.body.style.width = '100%';
}

// Função para desbloquear a rolagem e restaurar a posição
function unlockBodyScroll() {
    document.body.style.overflow = '';  // Libera a rolagem
    document.body.style.position = '';  // Remove a posição fixa
    document.body.style.top = '';       // Remove o valor de 'top'

    // Retorna a página para a posição anterior de rolagem
    window.scrollTo(0, lastScrollPosition);
}

// Mostrar a seção de reclassificação (esconde os botões de feedback)
function showReclassification() {
    document.getElementById('reclassifySection').style.display = 'block';
    document.getElementById('feedbackMenu').style.display = 'none';
    loadPlanoDeContas();
}

// Carregar plano de contas e preencher as opções
async function loadPlanoDeContas() {
    try {
        // Requisição para obter o plano de contas
        const response = await fetch('/api/plano-de-contas');
        const planoDeContas = await response.json();

        // Função recursiva para obter contas de último nível
        function obterContasDeUltimoNivel(contas) {
            let contasDeUltimoNivel = [];
            contas.forEach(conta => {
                if (!conta.subcontas || conta.subcontas.length === 0) {
                    contasDeUltimoNivel.push(conta);
                } else {
                    contasDeUltimoNivel = contasDeUltimoNivel.concat(obterContasDeUltimoNivel(conta.subcontas));
                }
            });
            return contasDeUltimoNivel;
        }

        // Obter todas as contas de último nível
        const ultimoNivelContas = obterContasDeUltimoNivel(planoDeContas);

        // Popula os selects com as contas de último nível
        populateSelectOptions('newDebitAccount', ultimoNivelContas);
        populateSelectOptions('newCreditAccount', ultimoNivelContas);

        // Atualiza o Select2
        $('.searchable-select').select2({
            placeholder: "Selecione uma conta",
            allowClear: true,
            width: 'resolve'
        });
    } catch (error) {
        console.error('Erro ao carregar o plano de contas:', error);
        showFeedbackMessage('Erro ao carregar o plano de contas.', true);
    }
}

// Função para preencher os selects com as opções
function populateSelectOptions(selectId, data) {
    const selectElement = document.getElementById(selectId);
    selectElement.innerHTML = ''; // Limpa as opções anteriores

    data.forEach(conta => {
        const option = document.createElement('option');
        option.value = conta.codigo;
        option.textContent = `${conta.codigo} - ${conta.descricao}`;
        selectElement.appendChild(option);
    });
}

// Submeter a reclassificação
async function submitReclassification() {
    debugger
    const newDebitAccount = document.getElementById('newDebitAccount').value;
    const newCreditAccount = document.getElementById('newCreditAccount').value;
    const modalProduto = document.getElementById('modalProduto').textContent;
    const modalNCM = document.getElementById('modalNCM').textContent;
    const modalCNAEEmitente = pegarCodigoCNAE(document.getElementById('modalCNAEEmitente').textContent);
    const modalCNAEDestinatario = pegarCodigoCNAE(document.getElementById('modalCNAEDestinatario').textContent);

    // Verifica se as contas de débito e crédito foram selecionadas
    if (!newDebitAccount || !newCreditAccount) {
        showFeedbackMessage('Por favor, selecione as novas contas de débito e crédito.', true);
        return;
    }

    // Exibe o carregamento dentro do modal enquanto a reclassificação está sendo enviada
    showModalLoading();

    try {
        const response = await fetch('/api/give-feedback', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                produto: modalProduto,                  // Produto do modal
                cnaePrincipal: modalCNAEEmitente,       // CNAE do Emitente
                cnaeEntrada: modalCNAEDestinatario,     // CNAE do Destinatário
                ncmItem: modalNCM,                      // NCM do produto
                correctDebitCategory: newDebitAccount,  // Nova Conta Débito
                correctCreditCategory: newCreditAccount // Nova Conta Crédito
            }),
        });

        // Processa a resposta
        const result = await response.json();

        if (response.ok) {
            showFeedbackMessage('Reclassificação enviada com sucesso!');
            closeReclassificationModal(); // Fecha o modal após o sucesso
            markReclassifiedItems(modalNCM, modalCNAEEmitente, modalCNAEDestinatario);
        } else {
            showFeedbackMessage('Erro: ' + (result.error || 'Ocorreu um erro ao enviar a reclassificação.'), true);
        }
    } catch (error) {
        console.error('Erro ao enviar reclassificação:', error);
        showFeedbackMessage('Ocorreu um erro ao enviar a reclassificação.', true);
    } finally {
        hideModalLoading(); // Esconde a animação de carregamento dentro do modal
    }
}

// Função para mostrar o carregamento dentro do modal
function showModalLoading() {
    document.getElementById('modalLoading').style.display = 'flex';
}

// Função para esconder o carregamento dentro do modal
function hideModalLoading() {
    document.getElementById('modalLoading').style.display = 'none';
}

// Marcar itens semelhantes como reclassificados
function markReclassifiedItems(ncm, cnaeEmitente, cnaeDestinatario) {
    const itemKey = `${ncm}-${cnaeEmitente}-${cnaeDestinatario}`;
    reclassifiedItems.add(itemKey);

    // Percorre todas as classificações e marca como reclassificadas
    document.querySelectorAll('.classificacao-item').forEach(item => {
        const itemNCM = item.dataset.ncm;
        const itemCNAEEmitente = item.dataset.cnaeEmitente;
        const itemCNAEDestinatario = item.dataset.cnaeDestinatario;

        if (itemNCM === ncm && itemCNAEEmitente === cnaeEmitente && itemCNAEDestinatario === cnaeDestinatario) {
            // Adiciona uma classe para estilizar itens reclassificados
            item.classList.add('reclassificado');

            // Atualiza o botão de feedback para indicar que já foi reclassificado
            const feedbackButton = item.querySelector('.btn-feedback');
            feedbackButton.textContent = 'Reclassificado';
            feedbackButton.classList.add('disabled');
            feedbackButton.innerHTML = '<i class="fas fa-ban"></i> Reclassificado';
        }
    });
}

// Função para extrair a parte antes do primeiro traço e espaço
function pegarCodigoCNAE(cnaeEmitente) {
    return cnaeEmitente.split(" - ")[0]; // Divide a string no " - " e pega a primeira parte
}

// Dar feedback correto ou incorreto
async function giveFeedback(isCorrect) {
    debugger;
    if (isCorrect) {
        // Obtém os dados do modal
        const ncm = document.getElementById('modalNCM').textContent.trim();
        const cnaeEmitente = pegarCodigoCNAE(document.getElementById('modalCNAEEmitente').textContent.trim());
        const cnaeDestinatario = pegarCodigoCNAE(document.getElementById('modalCNAEDestinatario').textContent.trim());
        const valorContaDebito = document.getElementById('modalContaDebito').textContent.trim();
        const valorContaCredito = document.getElementById('modalContaCredito').textContent.trim();

        try {
            // Mostra a animação de carregamento dentro do modal
            showModalLoading();

            // Envia os dados de feedback ao backend usando uma requisição POST
            const response = await fetch('/api/give-feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    cnaePrincipal: cnaeEmitente,
                    cnaeEntrada: cnaeDestinatario,
                    ncmItem: ncm,
                    correctDebitCategory: valorContaDebito,
                    correctCreditCategory: valorContaCredito
                })
            });

            // Processa a resposta
            if (!response.ok) {
                throw new Error('Erro ao enviar feedback.');
            }

            const result = await response.json();
            console.log(result); // Log para depuração (opcional)

            showFeedbackMessage('Feedback positivo enviado.');
            closeReclassificationModal();

            // Marca itens semelhantes como reclassificados
            markReclassifiedItems(ncm, cnaeEmitente, cnaeDestinatario);

        } catch (error) {
            console.error('Erro ao enviar o feedback:', error);
            showFeedbackMessage('Erro ao enviar o feedback.', true);
        } finally {
            // Esconde a animação de carregamento dentro do modal após a operação
            hideModalLoading();
        }
    } else {
        showReclassification();
    }
}

// Função para fechar o modal
function closeReclassificationModal() {
    document.getElementById('reclassificationModal').style.display = 'none';
    unlockBodyScroll();  // Restaura a rolagem ao fechar o modal
}

// Função para exibir os arquivos selecionados
function displaySelectedFiles() {
    const fileListDiv = document.getElementById('fileList');
    fileListDiv.innerHTML = ''; // Limpa a lista de arquivos

    const files = document.getElementById('xmlFiles').files;
    if (files.length === 0) {
        fileListDiv.innerHTML = '<p>Nenhum arquivo selecionado.</p>';
        return;
    }

    for (const file of files) {
        const fileItem = document.createElement('div');
        fileItem.classList.add('file-list-item');
        fileItem.innerHTML = `
                    <span>${file.name}</span>
                    <button onclick="removeFile('${file.name}')"><i class="fas fa-trash-alt"></i> Remover</button>
                `;
        fileListDiv.appendChild(fileItem);
    }
}

// Função para remover um arquivo da lista (opcional)
function removeFile(fileName) {
    const files = document.getElementById('xmlFiles').files;
    const dataTransfer = new DataTransfer();

    for (const file of files) {
        if (file.name !== fileName) {
            dataTransfer.items.add(file);
        }
    }

    document.getElementById('xmlFiles').files = dataTransfer.files;
    displaySelectedFiles(); // Atualiza a lista de arquivos exibidos
}

// Função para mostrar a animação de carregamento
function showLoading() {
    document.getElementById('loading').style.display = 'flex';
}

// Função para esconder a animação de carregamento
function hideLoading() {
    document.getElementById('loading').style.display = 'none';
}

// Função para fazer upload de múltiplos arquivos
async function uploadFiles() {
    const files = document.getElementById('xmlFiles').files;

    if (files.length === 0) {
        showFeedbackMessage('Por favor, selecione pelo menos um arquivo XML.', true);
        return;
    }

    showLoading();

    const formData = new FormData();
    for (const file of files) {
        formData.append('xmlFiles', file);
    }

    try {
        const response = await fetch('/api/upload-xml', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        console.log('Resultado do upload:', result); // Log de depuração

        // Armazena os dados para exportação futura
        processedDataStore = result.data || [];
        unprocessedDataStore = result.notasInvalidas || [];

        // Exibe as notas processadas
        const processedOutputDiv = document.getElementById('processed-output');
        if (processedDataStore.length > 0) {
            processedOutputDiv.innerHTML = processedDataStore.map((nota, index) => `
                        <div class="nfe-container">
                            <div class="nfe-header">
                                Nota Fiscal: ${nota.NFe[0].infNFe[0].ide.nNF}
                                <button class="toggle-btn" onclick="toggleNota(${index})"><i class="fas fa-minus-circle"></i> Minimizar</button>
                            </div>
                            <div id="nota-content-${index}" style="display: none;">
                                <p><strong>Chave da Nota:</strong> ${nota.protNFe[0].infProt.chNFe || 'N/A'}</p>
                                <p><strong>Emitente:</strong> ${nota.NFe[0].infNFe[0].emit.xNome || 'N/A'} - Atividade Principal: ${nota.emitenteEmpresaReceitaWSDTO?.atividadesPrincipais[0]?.text || 'N/A'}</p>
                                <p><strong>Destinatário:</strong> ${nota.NFe[0].infNFe[0].dest.xNome || 'N/A'} - Atividade Principal: ${nota.destinatarioEmpresaReceitaWSDTO?.atividadesPrincipais[0]?.text || 'N/A'}</p>
                                ${nota.classificacoes.map((classificacao, idx) => `
                                    <div class="nfe-sub-container classificacao-item ${reclassifiedItems.has(`${classificacao.NCM}-${classificacao.CNAEEmitente}-${classificacao.CNAEDestinatario}`) ? 'reclassificado' : ''}" data-ncm="${classificacao.NCM}" data-cnae-emitente="${classificacao.CNAEEmitente}" data-cnae-destinatario="${classificacao.CNAEDestinatario}">
                                        <p><strong>Produto:</strong> ${nota.NFe[0].infNFe[0].det[idx]?.prod.xProd || 'N/A'}</p>
                                        <p><strong>NCM:</strong> ${nota.NFe[0].infNFe[0].det[idx]?.prod.NCM || 'N/A'}</p>
                                        <p><strong>Conta Débito:</strong> ${classificacao.contaDebito} (Confiança: ${(classificacao.confidences.contaDebito * 100).toFixed(2)}%)</p>
                                        <p><strong>Conta Crédito:</strong> ${classificacao.contaCredito} (Confiança: ${(classificacao.confidences.contaCredito * 100).toFixed(2)}%)</p>
                                        <div class="nfe-links">
                                            <button class="btn-feedback ${reclassifiedItems.has(`${classificacao.NCM}-${classificacao.CNAEEmitente}-${classificacao.CNAEDestinatario}`) ? 'disabled' : ''}" 
                                                onclick="${reclassifiedItems.has(`${classificacao.NCM}-${classificacao.CNAEEmitente}-${classificacao.CNAEDestinatario}`) ? 'return false;' : `openReclassificationModal(
                                                    '${nota.NFe[0].infNFe[0].det[idx]?.prod.xProd || 'N/A'}', 
                                                    '${classificacao.contaDebito}', 
                                                    '${classificacao.contaCredito}', 
                                                    '${nota.NFe[0].infNFe[0].det[idx]?.prod.NCM || 'N/A'}', 
                                                    '${nota.emitenteEmpresaReceitaWSDTO?.atividadesPrincipais[0]?.code || 'N/A'}', 
                                                    '${nota.destinatarioEmpresaReceitaWSDTO?.atividadesPrincipais[0]?.code || 'N/A'}',
                                                    '${nota.NFe[0].infNFe[0].ide.nNF}',
                                                    '${idx}',
                                                    '${nota.emitenteEmpresaReceitaWSDTO?.atividadesPrincipais[0]?.text || 'N/A'}',
                                                    '${nota.destinatarioEmpresaReceitaWSDTO?.atividadesPrincipais[0]?.text || 'N/A'}'
                                                )`}"
                                                ${reclassifiedItems.has(`${classificacao.NCM}-${classificacao.CNAEEmitente}-${classificacao.CNAEDestinatario}`) ? 'disabled' : ''}>
                                                ${reclassifiedItems.has(`${classificacao.NCM}-${classificacao.CNAEEmitente}-${classificacao.CNAEDestinatario}`) ? '<i class="fas fa-ban"></i> Reclassificado' : '<i class="fas fa-edit"></i> Feedback contábil'}
                                            </button>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    `).join('');

            // Exibir os botões de maximizar/minimizar todas após o processamento
            document.getElementById('toggleAllButtons').style.display = 'flex';

            // Minimiza todas as notas fiscais após exibi-las
            minimizeAllNotas();
        } else {
            processedOutputDiv.innerHTML = '<p class="no-notes">Nenhuma nota fiscal processada.</p>';
            // Oculta os botões caso não haja notas processadas
            document.getElementById('toggleAllButtons').style.display = 'none';
        }

        // Exibe as notas não processadas
        const unprocessedOutputDiv = document.getElementById('unprocessed-output');
        if (unprocessedDataStore.length > 0) {
            unprocessedOutputDiv.classList.remove('no-notes');
            unprocessedOutputDiv.innerHTML = unprocessedDataStore.map((notaInvalida, index) => {
                const nota = notaInvalida.nota;
                const chaveNota = nota?.protNFe?.[0]?.infProt?.chNFe || 'N/A';
                const emitente = nota?.NFe?.[0]?.infNFe?.[0]?.emit?.xNome || 'N/A';
                const destinatario = nota?.NFe?.[0]?.infNFe?.[0]?.dest?.xNome || 'N/A';
                const numeroNota = nota?.NFe?.[0]?.infNFe?.[0]?.ide?.nNF || 'N/A';

                return `
                            <div class="nfe-container-invalid">
                                <div class="nfe-header">Nota Fiscal Inválida ${index + 1}
                                    <button class="toggle-btn" onclick="toggleNotaNaoProcessada(${index})"><i class="fas fa-plus-circle"></i> Maximizar</button>
                                </div>
                                <div id="nota-nao-processada-content-invalid-${index}" style="display: none;">
                                    <p><strong>Chave da Nota:</strong> ${chaveNota}</p>
                                    <p><strong>Emitente:</strong> ${emitente}</p>
                                    <p><strong>Destinatário:</strong> ${destinatario}</p>
                                    <p><strong>Número da Nota:</strong> ${numeroNota}</p>
                                    <p class="nfe-item"><strong>Motivo:</strong> ${notaInvalida.motivo}</p>
                                </div>
                            </div>
                        `;
            }).join('');

            // Minimiza todas as notas fiscais não processadas após exibi-las
            minimizeAllNotasNaoProcessadas();
        } else {
            unprocessedOutputDiv.innerHTML = '<p class="no-notes">Nenhuma nota fiscal inválida.</p>';
        }

        hideLoading();
        showFeedbackMessage('Arquivos enviados e processados com sucesso!');
    } catch (error) {
        console.error('Erro ao enviar os arquivos:', error);
        hideLoading();
        showFeedbackMessage('Erro ao enviar os arquivos.', true);
    }
}

// Função para alternar entre minimizar e maximizar
function toggleNota(index) {
    const contentDiv = document.getElementById(`nota-content-${index}`);
    const button = document.querySelector(`.nfe-header button[onclick="toggleNota(${index})"]`);

    if (contentDiv.style.display === 'none' || contentDiv.style.display === '') {
        contentDiv.style.display = 'block'; // Exibe o conteúdo
        button.innerHTML = '<i class="fas fa-minus-circle"></i> Minimizar'; // Atualiza o ícone e texto do botão
    } else {
        contentDiv.style.display = 'none'; // Esconde o conteúdo
        button.innerHTML = '<i class="fas fa-plus-circle"></i> Maximizar'; // Atualiza o ícone e texto do botão
    }
}

function minimizeAllNotas() {
    const notaContainers = document.querySelectorAll('.nfe-container');

    notaContainers.forEach((container, index) => {
        const contentDiv = document.getElementById(`nota-content-${index}`);
        const button = container.querySelector('button');

        // Minimiza o conteúdo e atualiza o texto do botão
        contentDiv.style.display = 'none';
        button.innerHTML = '<i class="fas fa-plus-circle"></i> Maximizar';
    });
}

function maximizeAllNotas() {
    const notaContainers = document.querySelectorAll('.nfe-container');

    notaContainers.forEach((container, index) => {
        const contentDiv = document.getElementById(`nota-content-${index}`);
        const button = container.querySelector('button');

        // Maximiza o conteúdo e atualiza o texto do botão
        contentDiv.style.display = 'block';
        button.innerHTML = '<i class="fas fa-minus-circle"></i> Minimizar';
    });
}

// Função para alternar entre minimizar e maximizar notas não processadas
function toggleNotaNaoProcessada(index) {
    const contentDiv = document.getElementById(`nota-nao-processada-content-invalid-${index}`);
    const button = document.querySelector(`.nfe-container-invalid:nth-of-type(${index + 1}) button`);

    if (contentDiv) {
        if (contentDiv.style.display === 'none' || contentDiv.style.display === '') {
            contentDiv.style.display = 'block'; // Exibe o conteúdo
            button.innerHTML = '<i class="fas fa-minus-circle"></i> Minimizar'; // Atualiza o ícone e texto do botão
        } else {
            contentDiv.style.display = 'none'; // Esconde o conteúdo
            button.innerHTML = '<i class="fas fa-plus-circle"></i> Maximizar'; // Atualiza o ícone e texto do botão
        }
    } else {
        console.error(`Elemento com ID nota-nao-processada-content-invalid-${index} não encontrado.`);
    }
}

// Função para minimizar todas as notas fiscais não processadas
function minimizeAllNotasNaoProcessadas() {
    const notaContainers = document.querySelectorAll('.nfe-container-invalid');

    notaContainers.forEach((container, index) => {
        const contentDiv = document.getElementById(`nota-nao-processada-content-invalid-${index}`);
        const button = container.querySelector('button');

        // Minimiza o conteúdo e atualiza o texto do botão
        contentDiv.style.display = 'none';
        button.innerHTML = '<i class="fas fa-plus-circle"></i> Maximizar';
    });
}

// Função para maximizar todas as notas fiscais não processadas
function maximizeAllNotasNaoProcessadas() {
    const notaContainers = document.querySelectorAll('.nfe-container-invalid');

    notaContainers.forEach((container, index) => {
        const contentDiv = document.getElementById(`nota-nao-processada-content-invalid-${index}`);
        const button = container.querySelector('button');

        // Maximiza o conteúdo e atualiza o texto do botão
        contentDiv.style.display = 'block';
        button.innerHTML = '<i class="fas fa-minus-circle"></i> Minimizar';
    });
}

// Função para exportar as notas fiscais para Excel
function exportToExcel() {
    try {
        showLoading(); // Mostra a animação de carregamento

        const processedData = [];
        const unprocessedData = [];

        // Processar Notas Fiscais Processadas
        processedDataStore.forEach(nota => {
            nota.classificacoes.forEach((classificacao, idx) => {
                processedData.push({
                    "Número da Nota": nota.NFe[0].infNFe[0].ide.nNF || 'N/A',
                    "Chave da Nota": nota.protNFe[0].infProt.chNFe || 'N/A',
                    "Emitente": nota.NFe[0].infNFe[0].emit.xNome || 'N/A',
                    "CNAE Emitente (Código)": nota.emitenteEmpresaReceitaWSDTO?.atividadesPrincipais[0]?.code || 'N/A',
                    "CNAE Emitente (Nome)": nota.emitenteEmpresaReceitaWSDTO?.atividadesPrincipais[0]?.text || 'N/A',
                    "Destinatário": nota.NFe[0].infNFe[0].dest.xNome || 'N/A',
                    "CNAE Destinatário (Código)": nota.destinatarioEmpresaReceitaWSDTO?.atividadesPrincipais[0]?.code || 'N/A',
                    "CNAE Destinatário (Nome)": nota.destinatarioEmpresaReceitaWSDTO?.atividadesPrincipais[0]?.text || 'N/A',
                    "Produto": nota.NFe[0].infNFe[0].det[idx]?.prod.xProd || 'N/A',
                    "Número do NCM": nota.NFe[0].infNFe[0].det[idx]?.prod.NCM || 'N/A',
                    "Conta Débito": classificacao.contaDebito || 'N/A',
                    "Confiança Débito (%)": classificacao.confidences.contaDebito ? (classificacao.confidences.contaDebito * 100).toFixed(2) : '0.00',
                    "Conta Crédito": classificacao.contaCredito || 'N/A',
                    "Confiança Crédito (%)": classificacao.confidences.contaCredito ? (classificacao.confidences.contaCredito * 100).toFixed(2) : '0.00'
                });
            });
        });

        // Processar Notas Fiscais Não Processadas
        unprocessedDataStore.forEach(notaInvalida => {
            const nota = notaInvalida.nota;
            unprocessedData.push({
                "Número da Nota": nota?.NFe?.[0]?.infNFe?.[0]?.ide?.nNF || 'N/A',
                "Chave da Nota": nota?.protNFe?.[0]?.infProt?.chNFe || 'N/A',
                "Emitente": nota?.NFe?.[0]?.infNFe?.[0]?.emit?.xNome || 'N/A',
                "Destinatário": nota?.NFe?.[0]?.infNFe?.[0]?.dest?.xNome || 'N/A',
                "Motivo da Invalidade": notaInvalida.motivo || 'N/A',
                "Data da Emissão": nota?.NFe?.[0]?.infNFe?.[0]?.ide?.dhEmi || 'N/A',
                "Valor Total": nota?.NFe?.[0]?.infNFe?.[0]?.total?.ICMSTot?.vNF || 'N/A'
            });
        });

        // Cria um novo workbook
        const wb = XLSX.utils.book_new();

        // Cria a primeira aba para Notas Fiscais Processadas
        const wsProcessed = XLSX.utils.json_to_sheet(processedData);
        XLSX.utils.book_append_sheet(wb, wsProcessed, 'Notas Processadas');

        // Cria a segunda aba para Notas Fiscais Não Processadas
        const wsUnprocessed = XLSX.utils.json_to_sheet(unprocessedData);
        XLSX.utils.book_append_sheet(wb, wsUnprocessed, 'Notas Não Processadas');

        // Gera o arquivo Excel e inicia o download
        XLSX.writeFile(wb, 'NotasFiscais.xlsx');

        hideLoading(); // Esconde a animação de carregamento
        showFeedbackMessage('Notas Fiscais exportadas com sucesso!');
    } catch (error) {
        console.error('Erro ao exportar para Excel:', error);
        hideLoading();
        showFeedbackMessage('Erro ao exportar para Excel.', true);
    }
}

// Inicializa o Select2 após carregar o conteúdo
document.addEventListener('DOMContentLoaded', function () {
    $('.searchable-select').select2({
        placeholder: "Selecione uma conta",
        allowClear: true,
        width: 'resolve'
    });

    // JavaScript para controlar o menu de feedback
    const feedbackButton = document.getElementById('feedbackButton');
    const feedbackMenuContent = document.getElementById('feedbackMenuContent');

    // Função para alternar a visibilidade do menu
    feedbackButton.addEventListener('click', function (event) {
        event.stopPropagation(); // Evita que o clique se propague para o documento
        feedbackMenuContent.classList.toggle('active');
        feedbackButton.classList.toggle('active');
    });

    // Fechar o menu se o usuário clicar fora dele
    document.addEventListener('click', function (event) {
        if (!feedbackMenuContent.contains(event.target) && !feedbackButton.contains(event.target)) {
            feedbackMenuContent.classList.remove('active');
            feedbackButton.classList.remove('active');
        }
    });

    // Opcional: Fechar o menu ao pressionar a tecla Esc
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            feedbackMenuContent.classList.remove('active');
            feedbackButton.classList.remove('active');
        }
    });
});

// Inicializa o Select2 com dropdownParent definido para o body
$('.searchable-select').select2({
    placeholder: "Selecione uma conta",
    allowClear: true,
    width: 'resolve',
    dropdownParent: $('body') // Anexa o dropdown diretamente ao body
});