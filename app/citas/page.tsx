'use client';

import { useEffect, useState } from 'react';
import { motion, animate, useMotionValue, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function CitasPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [participants, setParticipants] = useState<number | ''>('');
  const [canBook, setCanBook] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  const services = [
    { id: 'pc', label: 'Protección Civil' },
    { id: 'cap', label: 'Capacitación' },
    { id: 'defensa', label: 'Defensa Legal' },
  ];

  const handleParticipantChange = (value: string) => {
    const num = Number(value);
    setParticipants(value === '' ? '' : num);

    if (selected === 'pc' || selected === 'cap') {
      setCanBook(num >= 5);
    } else {
      setCanBook(true);
    }
  };

  const handleSubmit = async () => {
    const svc = services.find((s) => s.id === selected);
    if (!svc || !customerName || !customerEmail) return;

    setIsSubmitting(true);

    try {
      // Send to appointments API
      const appointmentRes = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "asme",
          service_key: svc.id,
          service_label: svc.label,
          customer_name: customerName,
          customer_email: customerEmail,
          customer_phone: customerPhone,
          participants: participants || null,
          message: null,
          requested_date: null,
          requested_time: null,
          status: "pending",
        }),
      });

      // Send email notification
      const emailRes = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: customerName,
          email: customerEmail,
          phone: customerPhone,
          service: svc.label,
          participants: participants || undefined,
          source: "asme",
        }),
      });

      if (appointmentRes.ok && emailRes.ok) {
        alert("Tu solicitud fue enviada. Te contactaremos pronto.");
        setSelected(null);
        setCustomerName("");
        setCustomerEmail("");
        setCustomerPhone("");
        setParticipants('');
      } else {
        throw new Error("Error al enviar");
      }
    } catch (error) {
      alert("Hubo un error al enviar la solicitud.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const text =
    'Fortalece la seguridad, el cumplimiento y la preparación de tu organización. Agenda una reunión profesional con nuestro equipo de Protección Civil, Capacitación y Defensa Legal.';
  const count = useMotionValue(0);
  const rounded = useTransform(count, Math.round);
  const displayText = useTransform(rounded, (latest) =>
    text.slice(0, latest)
  );

  useEffect(() => {
    const controls = animate(count, text.length, {
      type: 'tween',
      duration: 10,
      ease: 'easeInOut',
    });

    return () => controls.stop();
  }, [count]);

  return (
    <section className="relative flex min-h-screen flex-col justify-center bg-gradient-to-b from-gray-950 via-black to-gray-950 overflow-hidden">
      <div className="relative z-10 grid gap-10 px-4 py-16 sm:px-8 md:grid-cols-2 md:px-20 items-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-white">
              Conecta con nuestros
              <span className="block text-red-500">especialistas</span>
            </h1>
          </div>

          <p className="max-w-md text-base sm:text-lg md:text-xl text-gray-400 leading-relaxed">
            <motion.span>{displayText}</motion.span>
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
              className="ml-1 inline-block h-5 w-[2px] bg-red-500 align-middle"
            />
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.9 }}
          className="relative mx-auto w-full max-w-md rounded-2xl bg-gray-900 border border-gray-800 p-10 shadow-xl"
        >
          <div className="absolute -top-2 left-1/2 h-[3px] w-16 -translate-x-1/2 rounded-full bg-red-500" />

          <h2 className="mb-8 flex items-center justify-center border-b border-gray-800 pb-4 text-center text-2xl font-bold text-gray-100">
            Selecciona tu servicio
          </h2>

          <div className="space-y-4">
            {services.map((s) => (
              <div
                key={s.id}
                onClick={() => {
                  setSelected(s.id);
                  setParticipants('');
                  setCanBook(s.id === 'defensa');
                }}
                className={`flex cursor-pointer items-center justify-between rounded-lg border p-5 transition-all ${
                  selected === s.id
                    ? 'border-red-500 bg-gray-950'
                    : 'border-gray-800 hover:border-red-500/40'
                }`}
              >
                <p className="font-semibold text-gray-100">{s.label}</p>
                <ArrowRight
                  className={`h-5 w-5 transition ${
                    selected === s.id ? 'text-red-500' : 'text-gray-500'
                  }`}
                />
              </div>
            ))}
          </div>

          {selected && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-8 border-t border-gray-800 pt-6"
            >
              <h3 className="mb-4 text-center text-lg font-semibold text-gray-200">
                Datos de contacto
              </h3>

              <input
                type="text"
                placeholder="Nombre completo"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="mb-3 w-full rounded-md border border-gray-800 bg-gray-950 p-3 text-gray-100 focus:ring-2 focus:ring-red-500 focus:outline-none"
              />

              <input
                type="email"
                placeholder="Correo electrónico"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="mb-3 w-full rounded-md border border-gray-800 bg-gray-950 p-3 text-gray-100 focus:ring-2 focus:ring-red-500 focus:outline-none"
              />

              <input
                type="text"
                placeholder="Número de teléfono"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="mb-6 w-full rounded-md border border-gray-800 bg-gray-950 p-3 text-gray-100 focus:ring-2 focus:ring-red-500 focus:outline-none"
              />

              {(selected === 'pc' || selected === 'cap') && (
                <div className="mb-6">
                  <label className="mb-2 block text-sm font-medium text-gray-400">
                    Número de personas para el curso:
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={participants}
                    onChange={(e) =>
                      handleParticipantChange(e.target.value)
                    }
                    className="w-full rounded-md border border-gray-800 bg-gray-950 p-3 text-gray-100 focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                  {participants !== '' && participants < 5 && (
                    <p className="mt-2 text-sm text-red-500">
                      Se requieren al menos 5 participantes para agendar.
                    </p>
                  )}
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={!canBook || isSubmitting}
                className={`w-full rounded-md py-3 font-semibold transition-all ${
                  canBook && !isSubmitting
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'cursor-not-allowed bg-gray-700 text-gray-400'
                }`}
              >
                {isSubmitting ? 'Enviando...' : 'Reservar'}
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}