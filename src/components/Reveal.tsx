/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useRef } from 'react'
import { motion, useInView, useAnimation } from 'framer-motion'

interface RevealProps {
  children: React.ReactNode;
  width?: string;
}

const Reveal: React.FC<RevealProps> = ({ children, width = "100%" }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  const mainControls = useAnimation()

  useEffect(() => {
    if (isInView) {
      mainControls.start("visible")
    }
  }, [isInView, mainControls])

  return (
    <div ref={ref} style={{ width, overflow: "visible" }}>
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0 },
        }}
        initial="hidden"
        animate={mainControls}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        {children}
      </motion.div>
    </div>
  )
}

export default Reveal
