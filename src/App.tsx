import { useState, useEffect, useRef } from 'react';

export default function App() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showFab, setShowFab] = useState(false);
  const [technicians, setTechnicians] = useState([
    { id: 1, nome: '', especialidade: '', regiao: '', disponibilidade: '' },
    { id: 2, nome: '', especialidade: '', regiao: '', disponibilidade: '' },
    { id: 3, nome: '', especialidade: '', regiao: '', disponibilidade: '' },
  ]);

  // Progress update logic
  const updateProgress = () => {
    const allInputs = document.querySelectorAll('input[type="text"], input[type="number"], textarea');
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    let filled = 0;
    let total = allInputs.length + (checkboxes.length > 0 ? 1 : 0);
    
    allInputs.forEach((el) => {
      if ((el as HTMLInputElement).value.trim()) filled++;
    });
    
    if (Array.from(checkboxes).some((c) => (c as HTMLInputElement).checked)) filled++;

    const pct = total === 0 ? 0 : Math.round((filled / total) * 100);
    setProgress(pct);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checkbox = e.target;
    const label = checkbox.closest('.check-item');
    if (label) {
      if (checkbox.checked) {
        label.classList.add('checked');
      } else {
        label.classList.remove('checked');
      }
    }
    updateProgress();
  };

  const addTechnician = () => {
    setTechnicians([...technicians, { id: Date.now(), nome: '', especialidade: '', regiao: '', disponibilidade: '' }]);
    setTimeout(updateProgress, 0);
  };

  const updateTechnician = (id: number, field: string, value: string) => {
    setTechnicians(prev => prev.map(t => t.id === id ? { ...t, [field]: value } : t));
    setTimeout(updateProgress, 0);
  };

  const removeTechnician = (id: number) => {
    setTechnicians(prev => prev.filter(t => t.id !== id));
    setTimeout(updateProgress, 0);
  };

  useEffect(() => {
    // Attach input listeners for progress on text inputs
    const inputs = document.querySelectorAll('input[type="text"], input[type="number"], textarea');
    inputs.forEach(el => {
      el.addEventListener('input', updateProgress);
      el.addEventListener('change', updateProgress);
    });

    // FAB scroll listener
    const handleScroll = () => {
      setShowFab(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      inputs.forEach(el => {
        el.removeEventListener('input', updateProgress);
        el.removeEventListener('change', updateProgress);
      });
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const collectData = () => {
    const data: Record<string, string> = {};

    const getVal = (id: string) => {
      const el = document.getElementById(id) as HTMLInputElement | HTMLTextAreaElement;
      return el ? el.value.trim() : '';
    };

    const getCheck = (name: string) => {
      const checked = Array.from(document.querySelectorAll(`input[name="${name}"]:checked`)).map(c => (c as HTMLInputElement).value);
      return checked.length ? checked.join(', ') : '';
    };

    // 1. Descrição do Negócio
    data['--- 1. Descrição do Negócio ---'] = '';
    data['Tempo no mercado'] = getVal('tempo_mercado');
    data['Equipe de técnicos'] = getVal('equipe_tecnicos');
    data['Cidades atendidas'] = getVal('cidades_atendidas');
    data['Descrição da empresa'] = getVal('descricao_empresa');

    // 2. Sucesso Absoluto
    data['--- 2. Sucesso Absoluto do Projeto ---'] = '';
    data['Definição de sucesso total'] = getVal('sucesso_total');
    data['Indicador de sucesso'] = getVal('indicador_sucesso');

    // 3. Volume
    data['--- 3. Volume de Atendimentos ---'] = '';
    data['Volume semanal de contatos'] = getVal('volume_semanal');
    data['Agendamentos por semana'] = getVal('agendamentos_semana');
    data['Principal canal de entrada'] = getVal('canal_entrada');

    // 4. Fluxo Ideal
    data['--- 4. Fluxo Ideal de Agendamento ---'] = '';
    data['Fluxo ideal de agendamento'] = getVal('fluxo_ideal');

    // 5. Identidade da Assistente
    data['--- 5. Identidade da Assistente ---'] = '';
    data['Nome da IA assistente'] = getVal('nome_ia');
    data['Personalidade da IA'] = getVal('personalidade');
    data['Tom de voz'] = getVal('tom_voz');
    data['Mensagem de saudação'] = getVal('saudacao');
    data['Mensagem de despedida'] = getVal('despedida');
    data['Limites da IA'] = getVal('limites_ia');

    // 6. Equipamentos
    data['--- 6. Equipamentos Atendidos ---'] = '';
    data['Equipamentos atendidos'] = getCheck('equip');
    data['Outros equipamentos'] = getVal('equip_outros');

    // 7. Serviços e Preços
    data['--- 7. Serviços, Preços e Área ---'] = '';
    data['Serviços e preços'] = getVal('servicos_precos');
    data['Contrato de manutenção'] = getVal('contrato_manutencao');
    data['Área de atendimento (bairros)'] = getVal('area_atendimento');
    data['Outras cidades'] = getVal('outras_cidades_area');
    data['Marcas atendidas'] = getVal('marcas_atendidas');
    data['Fabricante autorizado'] = getVal('fabricante_autorizada');

    // 8. Equipe e Agenda
    data['--- 8. Equipe Técnica e Agenda ---'] = '';
    data['Equipe técnica (tabela)'] = JSON.stringify(technicians.map(({id, ...rest}) => rest));
    data['Horário de funcionamento'] = getVal('horario_funcionamento');
    data['Ferramenta de agenda'] = getCheck('agenda_tool');
    data['Gestão da agenda'] = getVal('gestao_agenda');
    data['Link da agenda'] = getVal('link_agenda');

    // 9. Dados do Agendamento
    data['--- 9. Dados para Coletar no Agendamento ---'] = '';
    data['Dados a coletar no agendamento'] = getCheck('dados_agenda');
    data['Outros dados a coletar'] = getVal('dados_extras');

    // 10. Notificação
    data['--- 10. Notificação e Distribuição ---'] = '';
    data['Notificação da equipe'] = getVal('notificacao_equipe');
    data['Distribuição de chamados'] = getVal('distribuicao_chamados');
    data['Regra de prioridade'] = getVal('regra_prioridade');

    // 11. Limites e Escalada
    data['--- 11. Limites e Escalada ---'] = '';
    data['IA pode resolver sozinha'] = getCheck('ia_autonoma');
    data['Acionar humano quando'] = getCheck('acionar_humano');
    data['Outros casos para acionar humano'] = getVal('outros_acionar');
    data['Mensagem de transferência'] = getVal('msg_transferencia');

    // 12. Urgências
    data['--- 12. Urgências e Garantia ---'] = '';
    data['Palavras-chave de urgência'] = getVal('palavras_urgencia');
    data['Protocolo de urgência'] = getVal('protocolo_urgencia');
    data['Garantia dos serviços'] = getVal('garantia_servicos');
    data['Atendimento com contrato'] = getVal('atendimento_contrato');

    // 13. Diferenciais
    data['--- 13. Diferenciais e Credenciais ---'] = '';
    data['Diferenciais'] = getVal('diferenciais');
    data['Certificações'] = getVal('certificacoes');

    // 14. Exemplos
    data['--- 14. Exemplos de Conversa ---'] = '';
    data['Exemplo de conversa - agendamento'] = getVal('exemplo_agendamento');
    data['Exemplo de conversa - urgência'] = getVal('exemplo_urgencia');
    data['Scripts atuais'] = getVal('scripts_atuais');
    data['Dúvidas frequentes e respostas'] = getVal('duvidas_faq');
    data['Objeções e respostas'] = getVal('objecoes');

    // 15. Ferramentas
    data['--- 15. Ferramentas da Empresa ---'] = '';
    data['Ferramentas utilizadas'] = getCheck('ferramentas');
    data['CRM'] = getVal('crm');
    data['Sistema de OS'] = getVal('sistema_os');
    data['ERP / Sistema de gestão'] = getVal('erp');
    data['Outros sistemas'] = getVal('outros_sistemas');
    data['Controle de clientes'] = getVal('controle_clientes');

    // 16. Sazonalidade
    data['--- 16. Sazonalidade e Observações ---'] = '';
    data['Sazonalidade'] = getVal('sazonalidade');
    data['Observações livres'] = getVal('observacoes_livres');

    return data;
  };

  const submitForm = async () => {
    setIsSubmitting(true);
    setIsError(false);

    try {
      const payload = collectData();

      const response = await fetch('https://n8n-n8n.gjvjfn.easypanel.host/webhook/formulariojr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok || response.status === 200 || response.status === 201 || response.status === 204) {
        setIsSuccess(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        throw new Error('Status: ' + response.status);
      }
    } catch (err) {
      console.error(err);
      setIsError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="container">
        <div className="success-screen" style={{ display: 'block' }}>
          <div className="success-icon">✅</div>
          <h2>Briefing enviado com sucesso!</h2>
          <p>Obrigado! Suas respostas foram recebidas e a equipe já pode iniciar a configuração da IA.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="hero">
        <div className="hero-logo">JR Refrigeração</div>
        <h1>Briefing de Projeto<br /><span>Assistente Virtual de IA</span></h1>
        <p>Preencha com calma. Cada resposta ajuda a criar uma IA mais eficiente para o seu negócio.</p>
        <div className="hero-badge">Atendimento &amp; Agendamento de Assistência Técnica</div>
      </div>

      <div className="progress-wrap">
        <div className="progress-top">
          <span>Progresso</span>
          <span id="progress-pct">{progress}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" id="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      <div className="container" id="form-container">
        {/* SEÇÃO 1: NEGÓCIO */}
        <div className="section">
          <div className="section-header">
            <div className="section-num">1</div>
            <div className="section-title">Descrição do Negócio</div>
          </div>
          <div className="section-body">
            <div className="field">
              <label>Há quanto tempo a JR Refrigeração está no mercado?</label>
              <input type="text" id="tempo_mercado" placeholder="Ex: 10 anos" />
            </div>
            <div className="field">
              <label>Quantos e quais técnicos compõem a equipe hoje?</label>
              <textarea id="equipe_tecnicos" placeholder="Ex: 3 técnicos — João, Pedro e Carlos"></textarea>
            </div>
            <div className="field">
              <label>A empresa atende apenas Teresina ou também outras cidades?</label>
              <input type="text" id="cidades_atendidas" placeholder="Ex: Apenas Teresina / Teresina e Timon" />
            </div>
            <div className="field">
              <label>Descreva brevemente o que a empresa faz e para quem atende:</label>
              <textarea id="descricao_empresa" className="tall" placeholder="Conte com suas próprias palavras sobre a empresa, clientes e serviços..."></textarea>
            </div>
          </div>
        </div>

        {/* SEÇÃO 2: SUCESSO */}
        <div className="section">
          <div className="section-header">
            <div className="section-num">2</div>
            <div className="section-title">Sucesso Absoluto do Projeto</div>
          </div>
          <div className="section-body">
            <div className="field">
              <label>Como você descreveria, em uma frase, o que seria o SUCESSO TOTAL desta IA para a JR Refrigeração?</label>
              <div className="hint">Ex: "A IA consegue agendar 80% das visitas de forma autônoma, sem precisar que eu intervenha."</div>
              <textarea id="sucesso_total" placeholder="Descreva o sucesso ideal..."></textarea>
            </div>
            <div className="field">
              <label>Qual indicador / número você usaria para medir esse sucesso?</label>
              <div className="hint">Ex: quantidade de agendamentos por semana, % de leads que viram visita, tempo médio de resposta...</div>
              <input type="text" id="indicador_sucesso" placeholder="Ex: 20 agendamentos por semana" />
            </div>
          </div>
        </div>

        {/* SEÇÃO 3: VOLUME */}
        <div className="section">
          <div className="section-header">
            <div className="section-num">3</div>
            <div className="section-title">Volume de Atendimentos</div>
          </div>
          <div className="section-body">
            <div className="field">
              <label>Quantos contatos/clientes novos vocês recebem por semana (média)?</label>
              <input type="text" id="volume_semanal" placeholder="Ex: 30 contatos por semana" />
            </div>
            <div className="field">
              <label>Quantos agendamentos são realizados por semana?</label>
              <input type="text" id="agendamentos_semana" placeholder="Ex: 15 agendamentos" />
            </div>
            <div className="field">
              <label>Qual o principal canal de entrada dos clientes hoje?</label>
              <input type="text" id="canal_entrada" placeholder="Ex: WhatsApp, Instagram, indicação..." />
            </div>
          </div>
        </div>

        {/* SEÇÃO 4: FLUXO IDEAL */}
        <div className="section">
          <div className="section-header">
            <div className="section-num">4</div>
            <div className="section-title">Fluxo Ideal de Agendamento</div>
          </div>
          <div className="section-body">
            <div className="field">
              <label>Descreva o passo a passo ideal desde o contato do cliente até o técnico chegar ao local:</label>
              <div className="hint">A IA vai replicar exatamente esse fluxo. Seja bem detalhado.</div>
              <textarea id="fluxo_ideal" className="tall" placeholder="1. Cliente entra em contato...&#10;2. ...&#10;3. ..."></textarea>
            </div>
          </div>
        </div>

        {/* SEÇÃO 5: IDENTIDADE DA IA */}
        <div className="section">
          <div className="section-header">
            <div className="section-num">5</div>
            <div className="section-title">Identidade da Assistente</div>
          </div>
          <div className="section-body">
            <div className="field">
              <label>Qual nome você quer dar à sua IA assistente?</label>
              <div className="hint">Recomendamos um nome humano. Ex: Júlia, Ana, Roberto...</div>
              <input type="text" id="nome_ia" placeholder="Ex: Júlia da JR" />
            </div>
            <div className="field">
              <label>Descreva a personalidade da IA em 3 a 5 adjetivos:</label>
              <div className="hint">Ex: Simpática, ágil, prestativa, direta, profissional, acolhedora</div>
              <input type="text" id="personalidade" placeholder="Ex: Simpática, direta, profissional" />
            </div>
            <div className="field">
              <label>Tom de voz e linguagem ideal:</label>
              <div className="hint">Ex: Informal e acolhedor, como um atendente que passa segurança. Direto ao ponto, sem ser frio.</div>
              <textarea id="tom_voz" placeholder="Descreva o tom de voz ideal..."></textarea>
            </div>
            <div className="divider"></div>
            <div className="field">
              <label>Como a IA deve se apresentar na primeira mensagem ao cliente?</label>
              <div className="hint">Ex: Olá! 👋 Aqui é a Júlia, da JR Refrigeração! Como posso te ajudar hoje?</div>
              <textarea id="saudacao" placeholder="Digite a mensagem de boas-vindas..."></textarea>
            </div>
            <div className="field">
              <label>Como a IA deve se despedir ao encerrar um atendimento?</label>
              <div className="hint">Ex: Qualquer dúvida é só chamar! Nossa equipe está à disposição. 🔧</div>
              <textarea id="despedida" placeholder="Digite a mensagem de despedida..."></textarea>
            </div>
            <div className="field">
              <label>O que a IA NUNCA deve fazer ou dizer?</label>
              <div className="hint">Defina os limites para proteger a reputação da empresa.</div>
              <textarea id="limites_ia" placeholder="Ex: Nunca prometer prazo sem confirmar com equipe, nunca dar preços sem avaliação prévia..."></textarea>
            </div>
          </div>
        </div>

        {/* SEÇÃO 6: EQUIPAMENTOS */}
        <div className="section">
          <div className="section-header">
            <div className="section-num">6</div>
            <div className="section-title">Equipamentos Atendidos</div>
          </div>
          <div className="section-body">
            <div className="field">
              <label>Marque todos os equipamentos que a empresa atende:</label>
              <div className="check-grid" id="equipamentos-grid">
                <label className="check-item"><input type="checkbox" name="equip" value="Ar condicionado Split Residencial" onChange={handleCheckboxChange} /><span className="check-box"></span><span className="check-label">Split Residencial</span></label>
                <label className="check-item"><input type="checkbox" name="equip" value="Ar condicionado Split Comercial" onChange={handleCheckboxChange} /><span className="check-box"></span><span className="check-label">Split Comercial</span></label>
                <label className="check-item"><input type="checkbox" name="equip" value="Ar condicionado Cassete" onChange={handleCheckboxChange} /><span className="check-box"></span><span className="check-label">Cassete</span></label>
                <label className="check-item"><input type="checkbox" name="equip" value="Ar condicionado de Janela" onChange={handleCheckboxChange} /><span className="check-box"></span><span className="check-label">AC de Janela</span></label>
                <label className="check-item"><input type="checkbox" name="equip" value="Ar condicionado Multi-split" onChange={handleCheckboxChange} /><span className="check-box"></span><span className="check-label">Multi-split</span></label>
                <label className="check-item"><input type="checkbox" name="equip" value="Ar condicionado VRF/VRV" onChange={handleCheckboxChange} /><span className="check-box"></span><span className="check-label">VRF / VRV</span></label>
                <label className="check-item"><input type="checkbox" name="equip" value="Câmara Fria / Refrigeração Comercial" onChange={handleCheckboxChange} /><span className="check-box"></span><span className="check-label">Câmara Fria</span></label>
                <label className="check-item"><input type="checkbox" name="equip" value="Geladeira / Refrigerador" onChange={handleCheckboxChange} /><span className="check-box"></span><span className="check-label">Geladeira</span></label>
                <label className="check-item"><input type="checkbox" name="equip" value="Freezer" onChange={handleCheckboxChange} /><span className="check-box"></span><span className="check-label">Freezer</span></label>
                <label className="check-item"><input type="checkbox" name="equip" value="Lava e Seca" onChange={handleCheckboxChange} /><span className="check-box"></span><span className="check-label">Lava e Seca</span></label>
                <label className="check-item"><input type="checkbox" name="equip" value="Bebedouro" onChange={handleCheckboxChange} /><span className="check-box"></span><span className="check-label">Bebedouro</span></label>
              </div>
            </div>
            <div className="field">
              <label>Outros equipamentos atendidos (não listados acima):</label>
              <input type="text" id="equip_outros" placeholder="Ex: Climatizador, bomba de calor..." />
            </div>
          </div>
        </div>

        {/* SEÇÃO 7: SERVIÇOS & PREÇOS */}
        <div className="section">
          <div className="section-header">
            <div className="section-num">7</div>
            <div className="section-title">Serviços, Preços e Área</div>
          </div>
          <div className="section-body">
            <div className="field">
              <label>Tipos de serviços realizados e valores (se quiser informar):</label>
              <div className="hint">Preencha os serviços que realiza. Deixe em branco os que não realiza.</div>
              <textarea id="servicos_precos" className="tall" placeholder="Ex:&#10;- Instalação de Split: R$ 250&#10;- Manutenção preventiva: R$ 150&#10;- Limpeza de evaporador: R$ 120&#10;- Conserto de geladeira: a partir de R$ 80 (diagnóstico grátis)"></textarea>
            </div>
            <div className="field">
              <label>Detalhes sobre contrato de manutenção (se houver):</label>
              <textarea id="contrato_manutencao" placeholder="Ex: Contrato anual com 2 visitas preventivas por R$ 500..."></textarea>
            </div>
            <div className="divider"></div>
            <div className="field">
              <label>Quais bairros ou regiões de Teresina a empresa atende?</label>
              <textarea id="area_atendimento" placeholder="Ex: Sul, Leste, Centro, Norte... ou todos os bairros de Teresina"></textarea>
            </div>
            <div className="field">
              <label>Atende outras cidades além de Teresina? Quais?</label>
              <input type="text" id="outras_cidades_area" placeholder="Ex: Timon-MA, Parnaíba..." />
            </div>
            <div className="divider"></div>
            <div className="field">
              <label>A empresa atende equipamentos de todas as marcas ou tem restrições?</label>
              <textarea id="marcas_atendidas" placeholder="Ex: Atende todas / Não atende marca X / É autorizada das marcas Y e Z"></textarea>
            </div>
            <div className="field">
              <label>A empresa é autorizada por algum fabricante?</label>
              <input type="text" id="fabricante_autorizada" placeholder="Ex: Autorizada Samsung e LG" />
            </div>
          </div>
        </div>

        {/* SEÇÃO 8: EQUIPE E AGENDA */}
        <div className="section">
          <div className="section-header">
            <div className="section-num">8</div>
            <div className="section-title">Equipe Técnica e Agenda</div>
          </div>
          <div className="section-body">
            <div className="field">
              <label>Dados dos técnicos (nome, especialidade, região, dias/horários disponíveis):</label>
              <div className="table-wrap">
                <table id="tecnicos-table">
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>Especialidade</th>
                      <th>Região / Zona</th>
                      <th>Disponibilidade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {technicians.map((tech) => (
                      <tr key={tech.id}>
                        <td><input type="text" placeholder="Nome" value={tech.nome} onChange={(e) => updateTechnician(tech.id, 'nome', e.target.value)} /></td>
                        <td><input type="text" placeholder="AC Split, Câmara..." value={tech.especialidade} onChange={(e) => updateTechnician(tech.id, 'especialidade', e.target.value)} /></td>
                        <td><input type="text" placeholder="Sul, Norte..." value={tech.regiao} onChange={(e) => updateTechnician(tech.id, 'regiao', e.target.value)} /></td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <input type="text" placeholder="Seg-Sex 8h-18h" value={tech.disponibilidade} onChange={(e) => updateTechnician(tech.id, 'disponibilidade', e.target.value)} style={{ flex: 1 }} />
                            {technicians.length > 1 && (
                              <button type="button" onClick={() => removeTechnician(tech.id)} title="Remover técnico" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', padding: '4px' }}>
                                ❌
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button 
                  type="button" 
                  onClick={addTechnician}
                  style={{
                    marginTop: '12px',
                    background: '#e8f4f8',
                    color: '#1a6fa8',
                    border: '1px solid #d0e8f4',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '14px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  + Adicionar Técnico
                </button>
              </div>
            </div>
            <div className="field">
              <label>Horário de funcionamento da empresa:</label>
              <input type="text" id="horario_funcionamento" placeholder="Ex: Seg-Sex 8h-18h, Sáb 8h-12h" />
            </div>
            <div className="divider"></div>
            <div className="field">
              <label>Ferramenta de agenda usada hoje:</label>
              <div className="check-grid">
                <label className="check-item"><input type="checkbox" name="agenda_tool" value="Google Agenda (Google Calendar)" onChange={handleCheckboxChange} /><span className="check-box"></span><span className="check-label">Google Agenda</span></label>
                <label className="check-item"><input type="checkbox" name="agenda_tool" value="Planilha do Google" onChange={handleCheckboxChange} /><span className="check-box"></span><span className="check-label">Google Sheets</span></label>
                <label className="check-item"><input type="checkbox" name="agenda_tool" value="WhatsApp (técnico confirma)" onChange={handleCheckboxChange} /><span className="check-box"></span><span className="check-label">WhatsApp</span></label>
                <label className="check-item"><input type="checkbox" name="agenda_tool" value="Agenda manual (sem sistema)" onChange={handleCheckboxChange} /><span className="check-box"></span><span className="check-label">Agenda manual</span></label>
              </div>
            </div>
            <div className="field">
              <label>Como funciona a agenda hoje? Quem controla e como sabem a disponibilidade?</label>
              <textarea id="gestao_agenda" placeholder="Descreva o processo atual..."></textarea>
            </div>
            <div className="field">
              <label>Link do Google Calendar ou planilha de agenda (se houver):</label>
              <input type="text" id="link_agenda" placeholder="https://..." />
            </div>
          </div>
        </div>

        {/* SEÇÃO 9: DADOS DO AGENDAMENTO */}
        <div className="section">
          <div className="section-header">
            <div className="section-num">9</div>
            <div className="section-title">Dados para Coletar no Agendamento</div>
          </div>
          <div className="section-body">
            <div className="field">
              <label>Quais informações a IA deve obrigatoriamente perguntar ao cliente?</label>
              <div className="check-grid">
                <label className="check-item"><input type="checkbox" name="dados_agenda" value="Nome completo" onChange={handleCheckboxChange} /><span className="check-box"></span><span className="check-label">Nome completo</span></label>
                <label className="check-item"><input type="checkbox" name="dados_agenda" value="WhatsApp / telefone" onChange={handleCheckboxChange} /><span className="check-box"></span><span className="check-label">WhatsApp / telefone</span></label>
                <label className="check-item"><input type="checkbox" name="dados_agenda" value="Endereço completo" onChange={handleCheckboxChange} /><span className="check-box"></span><span className="check-label">Endereço completo</span></label>
                <label className="check-item"><input type="checkbox" name="dados_agenda" value="Tipo de equipamento" onChange={handleCheckboxChange} /><span className="check-box"></span><span className="check-label">Tipo de equipamento</span></label>
                <label className="check-item"><input type="checkbox" name="dados_agenda" value="Descrição do problema" onChange={handleCheckboxChange} /><span className="check-box"></span><span className="check-label">Descrição do problema</span></label>
                <label className="check-item"><input type="checkbox" name="dados_agenda" value="Marca e modelo" onChange={handleCheckboxChange} /><span className="check-box"></span><span className="check-label">Marca e modelo</span></label>
                <label className="check-item"><input type="checkbox" name="dados_agenda" value="BTUs / capacidade (AC)" onChange={handleCheckboxChange} /><span className="check-box"></span><span className="check-label">BTUs (ar condicionado)</span></label>
                <label className="check-item"><input type="checkbox" name="dados_agenda" value="Há quanto tempo com o problema" onChange={handleCheckboxChange} /><span className="check-box"></span><span className="check-label">Tempo do problema</span></label>
                <label className="check-item"><input type="checkbox" name="dados_agenda" value="Já fez manutenção antes" onChange={handleCheckboxChange} /><span className="check-box"></span><span className="check-label">Manutenção anterior</span></label>
              </div>
            </div>
            <div className="field">
              <label>Outros dados importantes a coletar:</label>
              <input type="text" id="dados_extras" placeholder="Ex: CPF para emissão de nota, fotos do equipamento..." />
            </div>
          </div>
        </div>

        {/* SEÇÃO 10: NOTIFICAÇÃO E DISTRIBUIÇÃO */}
        <div className="section">
          <div className="section-header">
            <div className="section-num">10</div>
            <div className="section-title">Notificação e Distribuição de Chamados</div>
          </div>
          <div className="section-body">
            <div className="field">
              <label>Após o agendamento confirmado, como a IA deve avisar a equipe?</label>
              <textarea id="notificacao_equipe" placeholder="Ex: Enviar mensagem no WhatsApp para o técnico responsável, registrar na planilha, enviar e-mail..."></textarea>
            </div>
            <div className="field">
              <label>Como é feita hoje a distribuição dos chamados entre os técnicos?</label>
              <div className="hint">Ex: técnico mais próximo / por ordem de chegada / responsável distribui manualmente / por especialidade</div>
              <textarea id="distribuicao_chamados" placeholder="Descreva como é feita a distribuição..."></textarea>
            </div>
            <div className="field">
              <label>Existe alguma regra de prioridade que a IA deve seguir ao designar um técnico?</label>
              <textarea id="regra_prioridade" placeholder="Ex: Urgências sempre para o técnico mais experiente, cliente VIP tem prioridade..."></textarea>
            </div>
          </div>
        </div>

        {/* SEÇÃO 11: LIMITES DA IA */}
        <div className="section">
          <div className="section-header">
            <div className="section-num">11</div>
            <div className="section-title">Limites e Escalada para Humano</div>
          </div>
          <div className="section-body">
            <div className="field">
              <label>O que a IA pode resolver sozinha? (marque os que se aplicam)</label>
              <div className="check-grid">
                <label className="check-item"><input type="checkbox" name="ia_autonoma" value="Responder dúvidas gerais sobre serviços" onChange={handleCheckboxChange} /><span className="check-box"></span><span className="check-label">Dúvidas gerais</span></label>
                <label className="check-item"><input type="checkbox" name="ia_autonoma" value="Informar área de atendimento" onChange={handleCheckboxChange} /><span className="check-box"></span><span className="check-label">Área de atendimento</span></label>
                <label className="check-item"><input type="checkbox" name="ia_autonoma" value="Informar horário de funcionamento" onChange={handleCheckboxChange} /><span className="check-box"></span><span className="check-label">Horário de funcionamento</span></label>
                <label className="check-item"><input type="checkbox" name="ia_autonoma" value="Verificar disponibilidade na agenda" onChange={handleCheckboxChange} /><span className="check-box"></span><span className="check-label">Verificar agenda</span></label>
                <label className="check-item"><input type="checkbox" name="ia_autonoma" value="Confirmar agendamento" onChange={handleCheckboxChange} /><span className="check-box"></span><span className="check-label">Confirmar agendamento</span></label>
                <label className="check-item"><input type="checkbox" name="ia_autonoma" value="Enviar lembretes automáticos" onChange={handleCheckboxChange} /><span className="check-box"></span><span className="check-label">Lembretes automáticos</span></label>
                <label className="check-item"><input type="checkbox" name="ia_autonoma" value="Informar preços fixos" onChange={handleCheckboxChange} /><span className="check-box"></span><span className="check-label">Informar preços</span></label>
                <label className="check-item"><input type="checkbox" name="ia_autonoma" value="Follow-up com leads sem resposta" onChange={handleCheckboxChange} /><span className="check-box"></span><span className="check-label">Follow-up automático</span></label>
              </div>
            </div>
            <div className="divider"></div>
            <div className="field">
              <label>Quando a IA DEVE acionar um humano? (marque os que se aplicam)</label>
              <div className="check-grid">
                <label className="check-item"><input type="checkbox" name="acionar_humano" value="Urgência / emergência (câmara fria parada, comércio em operação)" onChange={handleCheckboxChange} /><span className="check-box"></span><span className="check-label">Urgência / emergência</span></label>
                <label className="check-item"><input type="checkbox" name="acionar_humano" value="Orçamento complexo que exige avaliação técnica" onChange={handleCheckboxChange} /><span className="check-box"></span><span className="check-label">Orçamento complexo</span></label>
                <label className="check-item"><input type="checkbox" name="acionar_humano" value="Cliente insatisfeito ou reclamando de serviço anterior" onChange={handleCheckboxChange} /><span className="check-box"></span><span className="check-label">Cliente insatisfeito</span></label>
                <label className="check-item"><input type="checkbox" name="acionar_humano" value="Dúvida técnica específica" onChange={handleCheckboxChange} /><span className="check-box"></span><span className="check-label">Dúvida técnica</span></label>
                <label className="check-item"><input type="checkbox" name="acionar_humano" value="Solicitação de desconto / negociação" onChange={handleCheckboxChange} /><span className="check-box"></span><span className="check-label">Desconto / negociação</span></label>
                <label className="check-item"><input type="checkbox" name="acionar_humano" value="Cliente quer falar com o responsável" onChange={handleCheckboxChange} /><span className="check-box"></span><span className="check-label">Falar com responsável</span></label>
              </div>
            </div>
            <div className="field">
              <label>Outros casos em que a IA deve transferir para humano:</label>
              <input type="text" id="outros_acionar" placeholder="Descreva outros casos..." />
            </div>
            <div className="field">
              <label>Qual mensagem a IA deve enviar ao transferir o atendimento para humano?</label>
              <div className="hint">Ex: "Aguarde um momento, vou chamar nossa equipe para te ajudar com isso!"</div>
              <textarea id="msg_transferencia" placeholder="Digite a mensagem de transferência..."></textarea>
            </div>
          </div>
        </div>

        {/* SEÇÃO 12: URGÊNCIAS E GARANTIA */}
        <div className="section">
          <div className="section-header">
            <div className="section-num">12</div>
            <div className="section-title">Urgências, Garantia e Contratos</div>
          </div>
          <div className="section-body">
            <div className="field">
              <label>Quais palavras ou situações a IA deve interpretar como URGÊNCIA?</label>
              <div className="hint">Ex: "câmara fria parou", "freezer apagou", "geladeira do bar", "mercado aberto"...</div>
              <textarea id="palavras_urgencia" placeholder="Liste as situações de urgência..."></textarea>
            </div>
            <div className="field">
              <label>Como a IA deve tratar casos de urgência? Qual o protocolo?</label>
              <textarea id="protocolo_urgencia" placeholder="Ex: Notificar imediatamente o técnico de plantão, responder em menos de 5 minutos..."></textarea>
            </div>
            <div className="divider"></div>
            <div className="field">
              <label>Qual é a garantia oferecida nos serviços?</label>
              <textarea id="garantia_servicos" placeholder="Ex: 90 dias de garantia em mão de obra, 6 meses em peças..."></textarea>
            </div>
            <div className="field">
              <label>Como funciona o atendimento de clientes com contrato de manutenção?</label>
              <textarea id="atendimento_contrato" placeholder="Ex: Clientes com contrato têm prioridade no agendamento e desconto em peças..."></textarea>
            </div>
          </div>
        </div>

        {/* SEÇÃO 13: DIFERENCIAIS */}
        <div className="section">
          <div className="section-header">
            <div className="section-num">13</div>
            <div className="section-title">Diferenciais e Credenciais</div>
          </div>
          <div className="section-body">
            <div className="field">
              <label>Liste os 3 a 5 principais diferenciais da JR Refrigeração:</label>
              <div className="hint">Ex: Técnicos certificados, peças originais, atendimento no mesmo dia, 10 anos de experiência...</div>
              <textarea id="diferenciais" className="tall" placeholder="1. &#10;2. &#10;3. &#10;4. &#10;5. "></textarea>
            </div>
            <div className="field">
              <label>Certificações e credenciais da empresa:</label>
              <textarea id="certificacoes" placeholder="Ex: Certificado pelo PROCEL, técnicos treinados pela Samsung, membro da ABRAVA..."></textarea>
            </div>
          </div>
        </div>

        {/* SEÇÃO 14: EXEMPLOS DE CONVERSA */}
        <div className="section">
          <div className="section-header">
            <div className="section-num">14</div>
            <div className="section-title">Exemplos de Conversa e Scripts</div>
          </div>
          <div className="section-body">
            <div className="field">
              <label>Escreva um exemplo real de conversa — do primeiro contato até o agendamento confirmado:</label>
              <textarea id="exemplo_agendamento" className="tall" placeholder="Cliente: Olá, meu ar condicionado não está gelando...&#10;Atendente: ..."></textarea>
            </div>
            <div className="field">
              <label>Exemplo de como atender um cliente com problema urgente (câmara fria parada, etc.):</label>
              <textarea id="exemplo_urgencia" className="tall" placeholder="Cliente: Minha câmara fria parou de funcionar, tenho produto estragando!&#10;IA: ..."></textarea>
            </div>
            <div className="field">
              <label>Scripts, mensagens ou respostas padrão que sua equipe já usa no atendimento:</label>
              <div className="hint">Cole aqui qualquer texto que já funciona bem no dia a dia.</div>
              <textarea id="scripts_atuais" className="tall" placeholder="Cole aqui os scripts e mensagens que já usam..."></textarea>
            </div>
            <div className="field">
              <label>Principais dúvidas dos clientes e respostas corretas:</label>
              <textarea id="duvidas_faq" className="tall" placeholder="P: Qual o prazo para instalação?&#10;R: ...&#10;&#10;P: Vocês atendem em condomínio?&#10;R: ..."></textarea>
            </div>
            <div className="field">
              <label>Objeções comuns e como a IA deve responder:</label>
              <div className="hint">Quando o cliente hesitar antes de confirmar o agendamento, o que a IA deve dizer?</div>
              <textarea id="objecoes" className="tall" placeholder="Objeção: Está muito caro...&#10;IA: ...&#10;&#10;Objeção: Vou pensar e retorno...&#10;IA: ..."></textarea>
            </div>
          </div>
        </div>

        {/* SEÇÃO 15: FERRAMENTAS */}
        <div className="section">
          <div className="section-header">
            <div className="section-num">15</div>
            <div className="section-title">Ferramentas que a Empresa Já Usa</div>
          </div>
          <div className="section-body">
            <div className="field">
              <label>Marque as ferramentas que já utilizam:</label>
              <div className="check-grid">
                <label className="check-item"><input type="checkbox" name="ferramentas" value="Google Agenda (Google Calendar)" onChange={handleCheckboxChange} /><span className="check-box"></span><span className="check-label">Google Agenda</span></label>
                <label className="check-item"><input type="checkbox" name="ferramentas" value="Google Planilhas" onChange={handleCheckboxChange} /><span className="check-box"></span><span className="check-label">Google Planilhas</span></label>
                <label className="check-item"><input type="checkbox" name="ferramentas" value="Nenhum sistema formal" onChange={handleCheckboxChange} /><span className="check-box"></span><span className="check-label">Sem sistema formal</span></label>
                <label className="check-item"><input type="checkbox" name="ferramentas" value="WhatsApp Business" onChange={handleCheckboxChange} /><span className="check-box"></span><span className="check-label">WhatsApp Business</span></label>
              </div>
            </div>
            <div className="field">
              <label>CRM (se tiver), qual?</label>
              <input type="text" id="crm" placeholder="Ex: HubSpot, RD Station, Pipedrive..." />
            </div>
            <div className="field">
              <label>Sistema de Ordem de Serviço (OS), qual?</label>
              <input type="text" id="sistema_os" placeholder="Ex: Nenhum / Nome do sistema..." />
            </div>
            <div className="field">
              <label>Sistema de gestão (ERP), qual?</label>
              <input type="text" id="erp" placeholder="Ex: Omie, Bling, Totvs, nenhum..." />
            </div>
            <div className="field">
              <label>Outros sistemas utilizados:</label>
              <input type="text" id="outros_sistemas" placeholder="Ex: Trello, Notion..." />
            </div>
            <div className="field">
              <label>Como organizam o controle de clientes e ordens de serviço hoje?</label>
              <textarea id="controle_clientes" placeholder="Descreva o processo atual..."></textarea>
            </div>
          </div>
        </div>

        {/* SEÇÃO 16: SAZONALIDADE E OBSERVAÇÕES */}
        <div className="section">
          <div className="section-header">
            <div className="section-num">16</div>
            <div className="section-title">Sazonalidade e Observações Finais</div>
          </div>
          <div className="section-body">
            <div className="field">
              <label>A empresa tem alguma sazonalidade? Em quais meses ou períodos a demanda aumenta ou diminui?</label>
              <textarea id="sazonalidade" placeholder="Ex: Verão (nov-mar) é alta temporada com 3x mais chamados. Janeiro é pico máximo..."></textarea>
            </div>
            <div className="field">
              <label>Observações livres — qualquer informação importante não abordada acima:</label>
              <div className="hint">Use este espaço para compartilhar qualquer detalhe, histórico, peculiaridade ou contexto relevante.</div>
              <textarea id="observacoes_livres" className="tall" placeholder="Espaço livre para qualquer informação adicional..."></textarea>
            </div>
          </div>
        </div>

        {/* SUBMIT */}
        <div className="submit-section">
          <button className="submit-btn" id="submit-btn" onClick={submitForm} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <span>Enviando...</span>
                <div className="spinner" style={{ display: 'block' }}></div>
              </>
            ) : (
              <>
                <span id="btn-text">Enviar Briefing</span>
                <span id="btn-icon">🚀</span>
              </>
            )}
          </button>
          <div className="submit-note">Nenhuma resposta é obrigatória. Você pode enviar com o que tiver preenchido.</div>
          {isError && (
            <div className="error-msg" style={{ display: 'block' }}>
              ⚠️ Erro ao enviar. Verifique sua conexão e tente novamente.
            </div>
          )}
        </div>
      </div>

      <button 
        className="fab" 
        id="fab" 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        style={{ display: showFab ? 'flex' : 'none' }}
      >
        ↑
      </button>
    </>
  );
}
