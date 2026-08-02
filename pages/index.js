import { useState } from 'react';
import Form from '../components/Form';
import OptionsBot from '../components/OptionsBot';

export default function Home() {
  const [suggested, setSuggested] = useState(null);

  const handleSuggestion = (data) => {
    setSuggested(data);
  };

  return (
    <div className="container">
      {/* Ícones flutuantes decorativos */}
      <div className="floating-icon">🦷</div>
      <div className="floating-icon">✨</div>

      <div className="header">
        <h1>
          🦷 Clínica <span>Dental</span>
        </h1>
        <span className="badge">Agende online</span>
      </div>
      <p className="subtitle">Cuide do seu sorriso com agendamento rápido e assistente inteligente</p>

      <div className="grid">
        <div>
          <Form suggestedTreatment={suggested} />
        </div>
        <div>
          <OptionsBot onTreatmentSelect={handleSuggestion} />
        </div>
      </div>
    </div>
  );
}
