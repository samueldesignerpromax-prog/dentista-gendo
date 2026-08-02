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
      <h1>🦷 Clínica Dental</h1>
      <p className="subtitle">Agende sua consulta de forma rápida e inteligente</p>

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
