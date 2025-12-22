'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { ArrowRight, Calendar, Shield } from 'lucide-react';
import CitasChessBackground from '@/app/components/legal/CitasChessBackground';

export default function CitasPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const services = [
    { id: 'litigio_familiar', label: 'Litigio Familiar' },
    { id: 'litigio_penal', label: 'Litigio Penal' },
    { id: 'litigio_civil', label: 'Litigio Civil' },
    { id: 'amparos', label: 'Amparos' },
  ];

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
          source: "asme_abogados",
          service_key: svc.id,
          service_label: svc.label,
          customer_name: customerName,
          customer_email: customerEmail,
          customer_phone: customerPhone,
          participants: null,
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
          source: "legal",
        }),
      });

      if (appointmentRes.ok && emailRes.ok) {
        alert("Tu solicitud fue enviada. Te contactaremos pronto.");
        setSelected(null);
        setCustomerName("");
        setCustomerEmail("");
        setCustomerPhone("");
      } else {
        throw new Error("Error al enviar");
      }
    } catch (error) {
      alert("Hubo un error al enviar la solicitud.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen">
      <CitasChessBackground />

      <section className="relative flex flex-col justify-center min-h-screen overflow-hidden py-20">
        <div className="relative z-10 grid lg:grid-cols-2 gap-16 px-8 md:px-20 items-center max-w-7xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, type: "spring", delay: 0.2 }}
              className="inline-block"
            >
              <div className="inline-flex items-center gap-3 px-5 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                <Calendar className="h-5 w-5 text-white" />
                <span className="text-sm font-semibold text-white">Agenda tu Consulta</span>
              </div>
            </motion.div>

            <div>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-tight mb-6">
                Conecta con nuestros
                <span className="block mt-2">especialistas legales</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-300 max-w-lg leading-relaxed">
                Protege tu patrimonio, empresa y libertad con asesoría legal experta.
                Agenda una consulta estratégica con nuestros especialistas en Litigio
                Familiar, Penal, Civil y Amparos.
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex items-start gap-4 p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10"
            >
              <Shield className="h-8 w-8 text-white flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-bold text-white mb-2">
                  Confidencialidad Garantizada
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  Su información está protegida bajo el secreto profesional. Todas las
                  consultas son estrictamente confidenciales.
                </p>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.9 }}
            className="relative w-full"
          >
            <div className="relative bg-gradient-to-br from-gray-800/80 via-gray-900/70 to-gray-950/80 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-[0_20px_80px_-20px_rgba(0,0,0,0.8)] p-8 md:p-10 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full blur-3xl" />

              <div className="relative z-10">
                <div className="flex items-center justify-center gap-3 mb-8">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/20" />
                  <h2 className="text-2xl font-bold text-white">
                    Selecciona tu servicio
                  </h2>
                  <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/20" />
                </div>

                <div className="space-y-3 mb-8">
                  {services.map((s, index) => (
                    <motion.div
                      key={s.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                      onClick={() => setSelected(s.id)}
                      className={`group cursor-pointer flex justify-between items-center p-5 rounded-xl border transition-all duration-300 ${
                        selected === s.id
                          ? 'border-white/40 bg-white/10 shadow-[0_0_20px_rgba(255,255,255,0.1)]'
                          : 'border-white/10 hover:border-white/30 hover:bg-white/5'
                      }`}
                    >
                      <p className="font-semibold text-white">{s.label}</p>
                      <ArrowRight
                        className={`w-5 h-5 transition-all duration-300 ${
                          selected === s.id 
                            ? 'text-white translate-x-1' 
                            : 'text-gray-400 group-hover:translate-x-1'
                        }`}
                      />
                    </motion.div>
                  ))}
                </div>

                {selected && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.4 }}
                    className="border-t border-white/10 pt-8"
                  >
                    <h3 className="text-lg font-semibold mb-6 text-white text-center flex items-center justify-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-white" />
                      Datos de contacto
                      <div className="h-1.5 w-1.5 rounded-full bg-white" />
                    </h3>

                    <div className="space-y-4">
                      <input
                        type="text"
                        placeholder="Nombre completo"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:ring-2 focus:ring-white/20 focus:border-white/30 focus:outline-none transition-all"
                      />

                      <input
                        type="email"
                        placeholder="Correo electrónico"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:ring-2 focus:ring-white/20 focus:border-white/30 focus:outline-none transition-all"
                      />

                      <input
                        type="tel"
                        placeholder="Número de teléfono"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:ring-2 focus:ring-white/20 focus:border-white/30 focus:outline-none transition-all"
                      />

                      <motion.button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-4 rounded-xl font-bold bg-white text-black hover:bg-gray-100 shadow-[0_10px_40px_-10px_rgba(255,255,255,0.3)] transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? 'Enviando...' : 'Agendar Cita'}
                        {!isSubmitting && <Calendar className="h-5 w-5 group-hover:translate-x-1 transition-transform" />}
                      </motion.button>
                    </div>

                    <p className="text-center text-sm text-gray-400 mt-6">
                      Nos pondremos en contacto contigo en menos de 24 horas
                    </p>
                  </motion.div>
                )}

                {!selected && (
                  <p className="text-center text-gray-400 text-sm mt-6">
                    Selecciona un servicio para continuar
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}