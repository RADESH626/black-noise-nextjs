'use client'
import { motion } from 'framer-motion';
import FormLogin from "@/components/layout/general/forms/FormLogin";
import LoginInfoSection from '@/components/login/LoginInfoSection';

function Login() {
  // Variants for the main container (the rounded box)
  const containerVariants = {
    hidden: { opacity: 0, rotateY: 180 }, // Start invisible and half-rotated
    visible: {
      opacity: 1,
      rotateY: 0, // Rotate to its normal position (360 degrees total from 180)
      transition: {
        duration: 1.2, // A longer duration for a smooth, noticeable spin
        ease: "easeInOut", // Smooth start and end
        when: "beforeChildren", // Animate this first, then its children
      }
    }
  };

  // Variants for the inner form section (slides in after the container rotates)
  const formSectionVariants = {
    hidden: { opacity: 0, x: -50 }, // Start invisible and slightly to the left
    visible: {
      opacity: 1,
      x: 0, // Slide to its natural position
      transition: {
        duration: 0.7, // Duration for the form section's slide
        ease: "easeOut",
        delay: 0.5 // Add a delay so it starts after the main rotation begins
      }
    }
  };

  // NEW: Variants for the white overlay fade-out
  const overlayVariants = {
    hidden: { opacity: 1, backgroundColor: "#FFFFFF" }, // Starts fully opaque white
    visible: {
      opacity: 0, // Fades out completely
      transition: {
        delay: 0.2, // Start fading out shortly after page load
        duration: 0.6, // How long the fade out lasts
        ease: "easeOut",
        display: "none" // Hide the element completely after animation
      }
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-5 bg-[linear-gradient(to_bottom_right,#000000,#0A1828,_#000000)]">
      {/* NEW: White overlay */}
      <motion.div
        className="fixed inset-0 z-50 pointer-events-none" // Covers the whole screen, on top of everything
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
      />

      <motion.div
        className="rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.2)] overflow-hidden text-[#ffffff]"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex flex-row justify-center">
          <motion.div
            className="p-10 bg-[#000000] flex-1 bg-gradient-to-l from-[#000000] to-[#1a1a1a]"
            variants={formSectionVariants}
          >
            <h2 className="text-3xl font-bold mb-8 text-bn-highlight text-center">Iniciar Sesión</h2>
            <FormLogin />
          </motion.div>

          <LoginInfoSection />
        </div>
      </motion.div>
    </main>
  );
}

export default Login;