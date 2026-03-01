// Copie e cole este código no nó "Code" do n8n

// 1. Pega o corpo da requisição (o JSON que veio do formulário)
const body = items[0].json.body;

// 2. Inicia a mensagem com um cabeçalho
let msg = "❄️ *NOVO BRIEFING - JR REFRIGERAÇÃO* ❄️\n";
msg += `📅 *Data:* ${new Date().toLocaleString('pt-BR')}\n`;

// 3. Itera sobre todos os campos do formulário
for (const [key, value] of Object.entries(body)) {
  
  // Se for um cabeçalho de seção (começa com "---")
  if (key.startsWith("---")) {
    // Limpa os traços e deixa em negrito/maiúsculo
    const sectionTitle = key.replace(/---/g, '').trim();
    msg += `\n\n📌 *${sectionTitle}*\n`;
    continue;
  }

  // Se for a tabela de técnicos (que vem como JSON string)
  if (key === "Equipe técnica (tabela)" && value) {
    try {
      const tecnicos = JSON.parse(value);
      msg += `\n*${key}:*\n`;
      tecnicos.forEach((t, index) => {
        msg += `  🔹 *Técnico ${index + 1}:* ${t.nome || 'Sem nome'}\n`;
        if (t.especialidade) msg += `     Esp: ${t.especialidade}\n`;
        if (t.regiao) msg += `     Região: ${t.regiao}\n`;
        if (t.disponibilidade) msg += `     Disp: ${t.disponibilidade}\n`;
      });
      continue;
    } catch (e) {
      // Se der erro no parse, exibe como texto normal
      msg += `*${key}:* ${value}\n`;
      continue;
    }
  }

  // Para campos normais
  // Se o valor estiver vazio, coloca "Não informado" ou pula (depende da preferência)
  const displayValue = value ? value : "_Não informado_";
  
  // Adiciona ao texto: *Pergunta:* Resposta
  msg += `*${key}:* ${displayValue}\n`;
}

// 4. Retorna o objeto formatado para o próximo nó (ex: Evolution API)
return [{
  json: {
    message_text: msg
  }
}];
