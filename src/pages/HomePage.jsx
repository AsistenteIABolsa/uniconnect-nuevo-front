import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext"
import {
  AcademicCapIcon,
  BuildingOffice2Icon,
  ArrowRightIcon,
  SparklesIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  
  LockClosedIcon,
  CheckBadgeIcon,
  InformationCircleIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";

/**
 * UniConnect — Hero principal (Variante A)
 * - Inspirado en el DemoSection compartido (fondos suaves + badge + micro-instrucción)
 * - Mobile-first, accesible, con CTAs claros y trust badges
 */
export default function HeroUniConnect() {
  const { user, logout } = useAuth()

  const getDashboardLink = () => {
    if (!user) return "/login"

    switch (user.role) {
      case "estudiante":
        return "/student"
      case "empleador":
        return "/employer"
      case "administrador":
        return "/admin"
      default:
        return "/login"
    }
  }
  
  const [tab, setTab] = useState("estudiantes");
  const isEst = tab === "estudiantes";

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background to-surface">
      {/* decoraciones de fondo */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-16 right-1/4 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-10 left-1/5 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-16 pt-20 sm:px-6 lg:px-8 lg:pb-24 lg:pt-28">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-primary backdrop-blur-sm"
          aria-label="Demo con IA Danna"
        >
          <SparklesIcon className="h-4 w-4" />
          <span className="text-sm font-medium">Impulsado por IA — Danna</span>
        </motion.div>

        {/* Headline + Sub */}
        <div className="mx-auto max-w-3xl text-center">
          <motion.h1
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, delay: 0.05 }}
  className="text-balance text-4xl font-extrabold tracking-tight text-text-primary sm:text-5xl md:text-6xl"
>
  UniConnect{" "}
  <span className="relative mx-2 inline-block px-3 py-1 rounded-xl text-transparent bg-clip-text
                   bg-gradient-to-r from-[#27F5E7] via-[#CC6CFF] to-[#FF73A1]
                   shadow-[inset_0_0_10px_rgba(255,255,255,0.3)]
                   backdrop-blur-sm">
    conecta
    {/* Capa de brillo diagonal */}
    <span className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/60 to-transparent opacity-30 mix-blend-overlay"></span>
  </span>{" "}
  talento y oportunidades
</motion.h1>


          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="mx-auto mt-4 max-w-2xl text-lg text-text-secondary"
          >
            Plataforma de empleabilidad para estudiantes, empresas y universidades. Crea tu perfil, publica vacantes y deja que 
            <span className="relative mx-2 inline-block px-3 py-1 rounded-xl text-transparent bg-clip-text
                   bg-gradient-to-r from-[#27F5E7] via-[#CC6CFF] to-[#FF73A1]
                   shadow-[inset_0_0_10px_rgba(255,255,255,0.3)]
                   backdrop-blur-sm">
               <strong>Danna</strong>     
{/* Capa de brillo diagonal */}
    <span className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/60 to-transparent opacity-30 mix-blend-overlay"></span>
  </span>{" "}
            
            te asista en segundos.
          </motion.p>
        </div>

        {/* CTAs */}
        <div>
          {user ? (
            <>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.15 }}
          className="mx-auto mt-8 flex max-w-xl flex-col items-center gap-3 sm:flex-row sm:justify-center"
        >

          <div className="flex flex-wrap gap-4 justify-center mt-6">
  {/* Ir al Dashboard */}
  <Link to={getDashboardLink()}>
    <button
      className="group inline-flex items-center gap-2 rounded-2xl border border-blue-300 
               bg</span>-cyan-50 px-6 py-3 text-sm font-semibold text-white-600 
               shadow-sm transition-all hover:bg-cyan-100 hover:border-blue-400 hover:shadow-md"
  >
      Ir al Dashboard
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="w-5 h-5 transition-transform group-hover:translate-x-1"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941"
        />
      </svg>
    </button>
  </Link>

  {/* Cerrar sesión */}
  <button
    onClick={logout}
    className="group inline-flex items-center gap-2 rounded-2xl border border-red-300 
               bg-red-50 px-6 py-3 text-sm font-semibold text-red-600 
               shadow-sm transition-all hover:bg-red-100 hover:border-</div>red-400 hover:shadow-md"
  >
    Cerrar sesión
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className="w-5 h-5 transition-transform group-hover:translate-x-0.5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25"
      />
    </svg>
  </button>
</div>


        </motion.div>
        </>
        ) : (
          <>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.15 }}
          className="mx-auto mt-8 flex max-w-xl flex-col items-center gap-3 sm:flex-row sm:justify-center"
        >
          <Link to= "/register">
          <a
            href="#registro"
            className="group inline-flex w-full items-center justify-center rounded-2xl bg-black px-6 py-3 text-sm font-semibold text-white shadow sm:w-auto"
          >
            Soy Nuevo
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" />
          </svg>
          </a>
          </Link>
          <Link to="/login">
          <a
            href="#publicar-vacante"
            className="group inline-flex w-full items-center justify-center rounded-2xl border border-black/10 bg-white px-6 py-3 text-sm font-semibold text-text-primary shadow-sm sm:w-auto"
          >
            Ya tengo una cuenta
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm1.294 6.336a6.721 6.721 0 0 1-3.17.789 6.721 6.721 0 0 1-3.168-.789 3.376 3.376 0 0 1 6.338 0Z" />
          </svg>
          </a>
          </Link>

          <a
            href="#demo-danna"
            className="group inline-flex w-full items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 px-6 py-3 text-sm font-semibold text-primary backdrop-blur-sm sm:w-auto"
          >
            Ver demo con Danna
            <ArrowRightIcon className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-0.5" />
          </a>
        </motion.div>
        </>
        )}
        </div>

      {/* Mini instrucciones opcionales (inspiradas en el otro proyecto) */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.2 }}
          className="mx-auto mt-10 max-w-2xl rounded-2xl border border-primary/20 bg-primary/10 p-4"
        >
          <p className="text-center text-sm text-text-secondary">
            ¿Listo para empezar? Haz clic en <strong>Ver demo con Danna</strong>, acepta términos y crea tu perfil o publica tu vacante.
          </p>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="mx-auto mt-10 flex max-w-4xl flex-wrap items-center justify-center gap-6"
        >
          <div className="flex items-center gap-2 text-text-muted">
            <ShieldCheckIcon className="h-5 w-5" />
            <span className="text-sm">Proceso Seguro</span>
          </div>
          <div className="flex items-center gap-2 text-text-muted">
            <LockClosedIcon className="h-5 w-5" />
            <span className="text-sm">Datos Protegidos</span>
          </div>
          <div className="flex items-center gap-2 text-text-muted">
            <CheckBadgeIcon className="h-5 w-5" />
            <span className="text-sm">Resultados Verificados</span>
          </div>
        </motion.div>
      </div>
      {/* Sección de instrucciones para IA Danna */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.2 }}
      >
        <div className="mx-auto mt-10 max-w-3xl overflow-hidden rounded-2xl">
  {/* Marco con halo sutil */}
  <div className="bg-gradient-to-r from-primary/30 via-primary/10 to-accent/30 p-[1px] rounded-2xl">
    <div className="rounded-2xl border border-white/40 bg-white/70 backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 border-b border-black/5 px-4 py-3">
        <div className="flex items-center gap-2 text-text-primary">
          <InformationCircleIcon className="h-5 w-5" />
          <p className="text-sm font-semibold">Cómo usar la IA Danna</p>
        </div>

        {/* Tabs tipo “pills” */}
        <div className="flex items-center gap-1 rounded-xl bg-black/5 p-1">
          <button
            onClick={() => setTab("estudiantes")}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all
              ${isEst
                ? "bg-gradient-to-r from-primary to-accent text-black shadow-sm"
                : "text-text-secondary hover:bg-white/60"}`}
            aria-pressed={isEst}
          >
            Estudiantes
          </button>
          <button
            onClick={() => setTab("empresas")}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all
              ${!isEst
                ? "bg-gradient-to-r from-primary to-accent text-black shadow-sm"
                : "text-text-secondary hover:bg-white/60"}`}
            aria-pressed={!isEst}
          >
            Empresas
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2">
        {/* Card 1 */}
        <div className="group rounded-xl border border-black/10 bg-white/80 p-4 shadow-sm transition-all hover:shadow-md">
          {/* Top line sutil */}
          <div className="mb-3 h-1 w-16 rounded-full bg-gradient-to-r from-primary to-accent"></div>

          <h3 className="mb-3 flex items-center gap-2 font-semibold text-text-primary">
            <SparklesIcon className="h-5 w-5 text-primary" />
            Pasos rápidos
          </h3>

          {isEst ? (
            <ul className="space-y-2 text-sm text-text-secondary">
              {[
                <>Haz clic en <strong>Ver demo con Danna</strong> o en el widget "<strong>HAZ TU PERFIL CON DANNA</strong>".</>,
                <>Acepta términos y autoriza tratamiento de datos.</>,
                <>Danna te pedirá nombre, correo registrado y será suficiente para saber tu registro.</>,
                <>Confirma tus datos y completa <em>skills</em> y preferencias.</>,
                <>En el apartado <strong>Mi Perfil</strong>, podrás editar tu información.</>,
                <>Revisa vacantes recomendadas y aplica con un clic.</>,
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircleIcon className="mt-0.5 h-4 w-4 text-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <ul className="space-y-2 text-sm text-text-secondary">
              {[
                <>Haz clic en <strong>Ver demo con Danna</strong> o "<strong>CREA TUS VACANTES CON DANNA</strong>".</>,
        
                <>Acepta términos y autoriza tratamiento de datos.</>,
                <>Danna te pedirá correo registrado y será suficiente para saber tu registro.</>,
                <>Danna solicitará nombre de la vacante, cargo y contacto.</>,
                <>Luego de creada, podras verla en el Dashboard.</>,
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircleIcon className="mt-0.5 h-4 w-4 text-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Card 2 */}
        <div className="group rounded-xl border border-black/10 bg-white/80 p-4 shadow-sm transition-all hover:shadow-md">
          <div className="mb-3 h-1 w-16 rounded-full bg-gradient-to-r from-accent to-primary"></div>

          <h3 className="mb-3 flex items-center gap-2 font-semibold text-text-primary">
            <ChatBubbleLeftRightIcon className="h-5 w-5 text-primary" />
            Mini diálogo de ejemplo
          </h3>

          {isEst ? (
            <ul className="space-y-2 text-sm text-text-secondary">
              {[
                'Danna: "Holaa! Soy Danna y te ayudaré en tu perfilamiento. ¿Con cuál correo estás registrada?"',
                'User: "karol@uni.edu.co"',
                'Danna: "¿Cuál es tu nombre?"',
                'User: "Karol Alvarez"',
                'Danna: "Perfecto. ¿Qué skills quieres destacar? (ej. React, SQL)"',
                'User: "React, Excel, Python"',
                'Danna: "Listo. Te mostraré vacantes afines. ¿Deseas aplicar ahora?"',
              ].map((t, i) => (
                <li key={i} className="relative pl-5">
                  <span className="absolute left-0 top-1.5 h-2 w-2 rounded-full bg-primary/70"></span>
                  {t}
                </li>
              ))}
            </ul>
          ) : (
            <ul className="space-y-2 text-sm text-text-secondary">
              {[
                'Danna: "Hola soy Danna, ¿publicamos una vacante nueva?"',
                'Empresa: "Estaría genial."',
                'Danna: "¿Título de la vacante y modalidad (presencial/remoto)?"',
                'Empresa: "Auxiliar contable, presencial"',
                'Danna: "Requisitos clave (3-5) y rango salarial?"',
                'Empresa: "Excel, NIIF básicas, $2-2.5M"',
                'Danna: "Vacante creada. ¿Te ayudo en algo más?"',
              ].map((t, i) => (
                <li key={i} className="relative pl-5">
                  <span className="absolute left-0 top-1.5 h-2 w-2 rounded-full bg-accent/70"></span>
                  {t}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-black/5 bg-white/70 px-4 py-3 text-center text-xs text-text-muted ">
        Disponible 24/7 • Tiempo medio de perfilado: ~2 minutos
      </div>
    </div>
  </div>
</div>

            </motion.div>

              {/* FINAL FOOTER */}
            <footer className="border-t py-6 md:py-8">
        <div className="container flex flex-col items-center justify-center gap-4 md:flex-row md:justify-between">
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary"
            >
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
            </svg>
            <span className="text-lg font-bold">UniConnect</span>
          </div>
          <p className="text-center text-sm text-text-light md:text-left">
            © 2025 UniConnect. Todos los derechos reservados.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-sm text-text-light hover:underline underline-offset-4">Términos</a>
            <a href="#" className="text-sm text-text-light hover:underline underline-offset-4">Privacidad</a>
            <a href="#" className="text-sm text-text-light hover:underline underline-offset-4">Contacto</a>
          </div>
        </div>
      </footer>

          </section>
     
  );
}

    /**
     * Variante B — Hero compacto con imagen/ilustración a la derecha
     * - Útil si tienes mockup del portal o logos de aliados
     */

/**
 * Variante B — Hero compacto con imagen/ilustración a la derecha
 * - Útil si tienes mockup del portal o logos de aliados
 */

