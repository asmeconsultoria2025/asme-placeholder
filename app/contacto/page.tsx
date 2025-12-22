'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { Button } from '@/app/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/app/components/ui/form';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import { useToast } from '@/app/hooks/use-toast';
import { FaMapLocationDot } from 'react-icons/fa6';
import { IoMdPaperPlane, IoIosPhonePortrait } from 'react-icons/io';
import { useState } from 'react';

const formSchema = z.object({
  name: z.string().min(2, { message: 'El nombre debe tener al menos 2 caracteres.' }),
  email: z.string().email({ message: 'Por favor, introduce un email válido.' }),
  phone: z.string().optional(),
  message: z.string().min(10, { message: 'El mensaje debe tener al menos 10 caracteres.' }),
});

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6 },
  },
};

export default function ContactoPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      message: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          source: 'contacto',
        }),
      });

      if (response.ok) {
        toast({
          title: 'Mensaje enviado',
          description: 'Gracias por contactarnos. Nos pondremos en contacto contigo pronto.',
        });
        form.reset();
      } else {
        throw new Error('Error al enviar');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Hubo un problema al enviar tu mensaje. Por favor intenta de nuevo.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="relative bg-gradient-to-b from-gray-950 via-black to-gray-950 text-gray-100 overflow-hidden">
      <div className="container mx-auto px-4 py-20 md:px-6 md:py-28">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="mx-auto max-w-3xl text-center"
        >
          <motion.h1
            variants={item}
            className="font-headline text-4xl font-bold md:text-5xl"
          >
            Contáctanos
          </motion.h1>
          <motion.p
            variants={item}
            className="mt-4 text-lg text-red-500 leading-relaxed"
          >
            ¿Listo para mejorar la seguridad de tu empresa? Envíanos un mensaje o llámanos.
          </motion.p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="mt-16 grid gap-12 md:grid-cols-2"
        >
          <motion.div
            variants={item}
            className="rounded-2xl bg-gray-900 p-8 shadow-xl"
          >
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre Completo</FormLabel>
                      <FormControl>
                        <Input className="bg-gray-950 border-gray-800" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input className="bg-gray-950 border-gray-800" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teléfono (Opcional)</FormLabel>
                      <FormControl>
                        <Input className="bg-gray-950 border-gray-800" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mensaje</FormLabel>
                      <FormControl>
                        <Textarea
                          className="bg-gray-950 border-gray-800 min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full bg-red-500 text-white hover:bg-red-600"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}
                </Button>
              </form>
            </Form>
          </motion.div>

          <motion.div variants={item} className="space-y-6">
            <h2 className="font-headline text-red-500 text-2xl font-bold">
              Información de Contacto
            </h2>

            <div className="space-y-4 text-gray-400">
              <div className="flex items-center gap-4">
                <FaMapLocationDot className="h-6 w-6 text-gray-300" />
                <span>Tijuana, Baja California, México</span>
              </div>
              <div className="flex items-center gap-4">
                <IoMdPaperPlane className="h-6 w-6 text-gray-300" />
                <a href="mailto:contacto@asmeconsultoria.com" className="hover:text-white">
                  contacto@asmeconsultoria.com
                </a>
              </div>
              <div className="flex items-center gap-4">
                <IoIosPhonePortrait className="h-6 w-6 text-gray-300" />
                <a href="tel:+526642016011" className="hover:text-white">
                  (664) 201-6011
                </a>
              </div>
            </div>

            <div className="aspect-video w-full rounded-2xl overflow-hidden border border-gray-800 shadow-xl">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d215477.5328472859!2d-117.21444410624147!3d32.4503121961237!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80d937edd6c71853%3A0x54cb32faccd8f465!2sASME!5e0!3m2!1sen!2smx!4v1761282663625!5m2!1sen!2smx"
                className="h-full w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                title="Mapa ASME"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}