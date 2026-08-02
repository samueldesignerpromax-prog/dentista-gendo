import { useState, useEffect } from 'react';

export default function Form({ suggestedTreatment }) {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    date: '',
    time: '',
    treatment: suggestedTreatment?.treatment || '',
    price: suggestedTreatment?.price || '',
  });
  const [success, setSuccess] = useState(false);
  const [appointments, setAppointments] = useState([]);

  // Carregar agendamentos salvos
  useEffect(() => {
    const saved = localStorage.getItem('appointments');
    if (saved) setAppointments(JSON.parse(saved));
  }, []);

  // Atualizar quando sugestão mudar
  useEffect(() => {
    if (suggestedTreatment) {
      setForm(prev => ({
        ...prev,
        treatment: suggestedTreatment.treatment || '',
        price: suggestedTreatment.price || '',
      }));
    }
  }, [suggestedTreatment]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.date || !form.time || !form.treatment) {
      alert('Preencha todos os campos obrigatórios.');
      return;
    }
    const newApp = { ...form, id: Date.now() };
    const updated = [...appointments, newApp];
    setAppointments(updated);
    localStorage.setItem('appointments', JSON.stringify(updated));
    setSuccess(true);
    setTimeout(() => setSuccess(false), 4000);
    // Limpar formulário (exceto tratamento/valor)
    setForm(prev => ({
      ...prev,
      name: '',
      phone: '',
      date: '',
      time: '',
    }));
  };

  const removeAppointment = (id) => {
    const filtered = appointments.filter(app => app.id !== id);
    setAppointments(filtered);
    localStorage.setItem('appointments', JSON.stringify(filtered));
  };

  // Preços fixos para demonstração
  const treatments = [
    { label: 'Limpeza Profissional', price: 120 },
    { label: 'Clareamento a Laser', price: 450 },
    { label: 'Restauração com Resina', price: 300 },
    { label: 'Extração Simples', price: 200 },
    { label: 'Consulta + Avaliação', price: 150 },
  ];

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nome completo *</label>
          <input type="text" name="name" value={form.name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Telefone</label>
          <input type="tel" name="phone" value={form.phone} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Data *</label>
          <input type="date" name="date" value={form.date} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Horário *</label>
          <input type="time" name="time" value={form.time} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Tratamento *</label>
          <select name="treatment" value={form.treatment} onChange={handleChange} required>
            <option value="">Selecione</option>
            {treatments.map((t, i) => (
              <option key={i} value={t.label}>{t.label} – R$ {t.price.toFixed(2)}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Valor (R$)</label>
          <input type="number" step="0.01" name="price" value={form.price} onChange={handleChange} readOnly />
        </div>
        <button type="submit" className="btn">Agendar</button>
      </form>

      {success && <div className="success">✅ Agendamento realizado com sucesso!</div>}

      <div className="appointments-list">
        <h3>📋 Meus Agendamentos</h3>
        {appointments.length === 0 ? (
          <p style={{ color: '#4a6a7f', fontSize: '14px' }}>Nenhum agendamento ainda.</p>
        ) : (
          appointments.map(app => (
            <div key={app.id} className="appointment-item">
              <div className="info">
                <span className="name">{app.name}</span>
                <span className="details">{app.treatment} – R$ {app.price} • {app.date} às {app.time}</span>
              </div>
              <button className="remove-btn" onClick={() => removeAppointment(app.id)}>✕</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
