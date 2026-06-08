import { motion } from "framer-motion";

type PageTransitionProps = {
  children: React.ReactNode;
};

export function PageTransition({ children }: PageTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
