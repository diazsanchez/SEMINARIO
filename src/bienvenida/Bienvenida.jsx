// src/bienvenida/Bienvenida.jsx
import confetti from "canvas-confetti";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./Bienvenida.css";

// limpia token/user/role para evitar que te redirijan al dashboard
import { logout } from "../services/authService";

export default function Bienvenida() {
  const navigate = useNavigate();

  const fireConfetti = () => {
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.3 },
      scalar: 0.9,
    });
    setTimeout(
      () => confetti({ particleCount: 60, spread: 90, origin: { y: 0.6 } }),
      200
    );
  };

  const onStart = () => {
    fireConfetti();
    // ✅ Forzar ir al login siempre (sin sesión previa)
    logout();
    setTimeout(() => navigate("/login", { replace: true }), 450);
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 18, scale: 0.98 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 70, damping: 14, mass: 0.9 },
    },
  };

  const bodyVariants = {
    hidden: { opacity: 0, y: 10 },
    show: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.08, delayChildren: 0.15 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 8 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 70, damping: 12 },
    },
  };

  return (
    <div className="w-bg">
      <motion.section
        className="w-card"
        variants={cardVariants}
        initial="hidden"
        animate="show"
      >
        <motion.header
          className="w-header"
          initial={{ opacity: 0, x: -28 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 75, damping: 12, delay: 0.05 }}
        >
          <h1 className="w-title">APRENDE JUGANDO</h1>
        </motion.header>

        <motion.div
          className="w-body"
          variants={bodyVariants}
          initial="hidden"
          animate="show"
        >
          <motion.div className="w-body-intro" variants={item}>
            <p className="w-sub">
              “Tus talentos y habilidades irán mejorando con el tiempo, pero para eso has de empezar”
              <p className="w-sub">-Martin Luther King</p>
            </p>
          </motion.div>

          <div className="w-col">
            <motion.h3 variants={item}>🎮 Modos de juego</motion.h3>
            <ul>
              <motion.li variants={item}>Básico</motion.li>
              <motion.li variants={item}>Avanzado</motion.li>
            </ul>

            <motion.h3 variants={item}>🏆 Beneficios</motion.h3>
            <ul>
              <motion.li variants={item}>Gana puntos. Sube de nivel.</motion.li>
              <motion.li variants={item}>Compra tu avatar.</motion.li>
              <motion.li variants={item}>Desbloquea logros y compite en el ranking.</motion.li>
            </ul>

            <div className="w-chips">
              <motion.span
                className="w-chip w-chip1"
                whileHover={{ y: -6, scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300, damping: 16 }}
              >
                Avatar
              </motion.span>
              <motion.span
                className="w-chip w-chip2"
                whileHover={{ y: -6, scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300, damping: 16 }}
              >
                Puntos
              </motion.span>
              <motion.span
                className="w-chip w-chip3"
                whileHover={{ y: -6, scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300, damping: 16 }}
              >
                Categoría
              </motion.span>
            </div>
          </div>

          <div className="w-cta">
            <motion.button
              className="w-btn"
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.98, y: 1 }}
              transition={{ type: "spring", stiffness: 320, damping: 18 }}
              onClick={onStart}
            >
              COMENZAR
            </motion.button>
          </div>
        </motion.div>
      </motion.section>
    </div>
  );
}
