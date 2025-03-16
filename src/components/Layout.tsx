'use client';

import { motion } from "framer-motion";

const Layout = ({ children }: { children: React.ReactNode }) => (
    <motion.div
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="min-h-screen"
    >
        {children}
    </motion.div>
);


export default Layout;