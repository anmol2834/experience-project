
import './Address.css'
import { motion } from "framer-motion"

function Address() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className='address-container'
        >
            Address
        </motion.div>
    )
}

export default Address;