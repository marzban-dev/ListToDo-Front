import React from "react";
import {motion} from "framer-motion/dist/framer-motion"

const animations = {
    initial: {opacity: 0, scale: 1.02},
    animate: {opacity: 1, scale: 1},
    exit: {opacity: 0, scale: 0.96}
};

const AnimatedPage = ({children}) => {
    return (
        <motion.div
            variants={animations}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{duration: 0.18}}
            style={{width: "100%", height: "100%"}}
        >
            {children}
        </motion.div>
    )
}

export default AnimatedPage;