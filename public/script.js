let contas = [];

function carregarContas() {
  fetch('/api/contas')
    .then(res => res.json())
    .then(data => {
      contas = data;
      atualizarLista();
    });
}

function salvarContas() {
  fetch('/api/contas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(contas)
  });
}

function adicionarConta() {
  const nome = document.getElementById('nomeConta').value;
  const valor = document.getElementById('valorConta').value;
  const vencimento = document.getElementById('vencimentoConta').value;
  const status = document.getElementById('statusConta').value;

  if (!nome || !valor || !vencimento) {
    alert('Preencha todos os campos.');
    return;
  }

  contas.push({ nome, valor, vencimento, status });
  salvarContas();
  atualizarLista();
  limparCampos();
}

function atualizarLista() {
  const container = document.getElementById('contas');
  container.innerHTML = '';
  const hoje = new Date();
  const alertas = [];

  const filtroMes = document.getElementById('filtroMes').value;
  const filtroStatus = document.getElementById('filtroStatus').value;

  contas.forEach((conta, index) => {
    const dataVenc = new Date(conta.vencimento);
    const diffDias = Math.ceil((dataVenc - hoje) / (1000 * 60 * 60 * 24));
    let alerta = '';

    if (diffDias >= 0 && diffDias <= 3 && conta.status === 'nao') {
      alerta = `<div class='alerta'>⚠️ Conta vence em ${diffDias} dia(s)!</div>`;
      alertas.push(`- ${conta.nome} vence em ${diffDias} dia(s)`);
    }

    const mesConta = conta.vencimento.slice(0, 7);
    if ((filtroMes && filtroMes !== mesConta) || (filtroStatus !== 'todos' && conta.status !== filtroStatus)) return;

    const div = document.createElement('div');
    div.classList.add('conta');
    div.innerHTML = `
      <div>
        <strong>${conta.nome}</strong><br>
        R$ ${parseFloat(conta.valor).toFixed(2)}<br>
        Vencimento: ${conta.vencimento}<br>
        Status: ${conta.status === 'pago' ? '✅ Pago' : '❌ Não pago'}
        ${alerta}
      </div>
      <div class="botoes-conta">
        ${conta.status === 'nao' ? `<button onclick="marcarComoPago(${index})">✔️ Marcar como Pago</button>` : ''}
        <button onclick="removerConta(${index})">🗑️ Remover</button>
      </div>
    `;
    container.appendChild(div);
  });

  if (alertas.length > 0) {
    alert("⚠️ Contas próximas do vencimento:\n" + alertas.join('\n'));
  }
}

function marcarComoPago(index) {
  contas[index].status = 'pago';
  salvarContas();
  atualizarLista();
}

function removerConta(index) {
  contas.splice(index, 1);
  salvarContas();
  atualizarLista();
}

function limparCampos() {
  document.getElementById('nomeConta').value = '';
  document.getElementById('valorConta').value = '';
  document.getElementById('vencimentoConta').value = '';
  document.getElementById('statusConta').value = 'nao';
}

carregarContas();