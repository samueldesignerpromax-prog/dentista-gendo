import { useState } from 'react';

export default function OptionsBot({ onTreatmentSelect }) {
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Olá! 👋 Sou seu assistente. Qual tipo de tratamento você procura?' },
  ]);
  const [input, setInput] = useState('');
  const [step, setStep] = useState(0);

  // Árvore de opções
  const options = {
    0: {
      text: 'Escolha uma opção:',
      choices: [
        { label: '🦷 Limpeza', value: 'Limpeza' },
        { label: '🦷 Clareamento', value: 'Clareamento' },
        { label: '🦷 Restauração', value: 'Restauração' },
        { label: '🦷 Extração', value: 'Extração' },
        { label: '🦷 Outro', value: 'Outro' },
      ],
    },
    1: {
      text: 'Ótimo! Qual a urgência?',
      choices: [
        { label: '🔴 Urgente (hoje)', value: 'urgente' },
        { label: '🟡 Normal (essa semana)', value: 'normal' },
        { label: '🟢 Sem pressa', value: 'tranquilo' },
      ],
    },
    2: {
      text: 'Perfeito! Vou sugerir um tratamento baseado nas suas respostas:',
      choices: [
        { label: '✅ Confirmar sugestão', value: 'confirm' },
        { label: '🔄 Quero ver outras opções', value: 'reset' },
      ],
    },
  };

  const getSuggestion = (treatment, urgency) => {
    const map = {
      Limpeza: { value: 120, label: 'Limpeza Profissional' },
      Clareamento: { value: 450, label: 'Clareamento a Laser' },
      Restauração: { value: 300, label: 'Restauração com Resina' },
      Extração: { value: 200, label: 'Extração Simples' },
      Outro: { value: 150, label: 'Consulta + Avaliação' },
    };
    let base = map[treatment] || map['Outro'];
    if (urgency === 'urgente') base.value += 80;
    return base;
  };

  const [selectedTreatment, setSelectedTreatment] = useState(null);
  const [urgency, setUrgency] = useState(null);

  const addMessage = (from, text) => {
    setMessages(prev => [...prev, { from, text }]);
  };

  const handleChoice = (choice) => {
    // Adiciona mensagem do usuário
    addMessage('user', choice.label);

    if (step === 0) {
      setSelectedTreatment(choice.value);
      setStep(1);
      // Bot responde com opções de urgência
      setTimeout(() => {
        addMessage('bot', options[1].text);
        // As opções serão mostradas pelo render
        setMessages(prev => [...prev, { from: 'bot', choices: options[1].choices }]);
      }, 300);
    } else if (step === 1) {
      setUrgency(choice.value);
      setStep(2);
      const sug = getSuggestion(selectedTreatment, choice.value);
      setTimeout(() => {
        addMessage('bot', `${options[2].text}\n💡 Sugestão: **${sug.label}** – R$ ${sug.value.toFixed(2)}`);
        setMessages(prev => [...prev, { from: 'bot', choices: options[2].choices }]);
      }, 300);
    } else if (step === 2) {
      if (choice.value === 'confirm') {
        const sug = getSuggestion(selectedTreatment, urgency);
        addMessage('bot', `✔️ Agendamento sugerido: ${sug.label} (R$ ${sug.value.toFixed(2)}). Preencha o formulário ao lado para finalizar.`);
        // Preenche automaticamente o formulário
        if (onTreatmentSelect) {
          onTreatmentSelect({
            treatment: sug.label,
            price: sug.value,
          });
        }
        // Reinicia após um tempo
        setTimeout(() => {
          resetChat();
        }, 5000);
      } else {
        // reset
        addMessage('bot', '🔄 Vamos recomeçar!');
        setTimeout(() => {
          resetChat();
        }, 500);
      }
    }
  };

  const resetChat = () => {
    setMessages([{ from: 'bot', text: 'Olá! 👋 Sou seu assistente. Qual tipo de tratamento você procura?' }]);
    setStep(0);
    setSelectedTreatment(null);
    setUrgency(null);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    addMessage('user', input);
    setInput('');
    // Simples resposta genérica
    setTimeout(() => {
      addMessage('bot', 'Entendi! Use os botões abaixo para escolher uma opção.');
      if (step === 0) {
        setMessages(prev => [...prev, { from: 'bot', choices: options[0].choices }]);
      } else if (step === 1) {
        setMessages(prev => [...prev, { from: 'bot', choices: options[1].choices }]);
      }
    }, 400);
  };

  // Renderizar mensagens com opções
  const renderMessage = (msg, idx) => {
    if (msg.from === 'bot' && msg.choices) {
      return (
        <div key={idx} className="message bot">
          <div>{msg.text}</div>
          <div className="options-grid">
            {msg.choices.map((choice, i) => (
              <button key={i} className="option-btn" onClick={() => handleChoice(choice)}>
                {choice.label}
              </button>
            ))}
          </div>
        </div>
      );
    } else {
      return (
        <div key={idx} className={`message ${msg.from === 'bot' ? 'bot' : 'user'}`}>
          {msg.text}
        </div>
      );
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-title">💬 Assistente Dental</div>
      <div className="chat-messages">
        {messages.map((msg, idx) => renderMessage(msg, idx))}
      </div>
      <div className="chat-input-area">
        <input
          type="text"
          placeholder="Digite algo..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button onClick={handleSend}>Enviar</button>
      </div>
    </div>
  );
}
