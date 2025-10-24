import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export function RouteLoading() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center min-h-screen bg-background"
        >
            <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{
                    duration: 0.5,
                    ease: "easeOut"
                }}
                className="flex flex-col items-center space-y-4"
            >
                {/* Spinner animado */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                >
                    <Loader2 className="h-12 w-12 text-primary" />
                </motion.div>

                {/* Texto com animação */}
                <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-center space-y-2"
                >
                    <h3 className="text-lg font-semibold text-foreground">
                        Carregando página...
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        Preparando a experiência para você
                    </p>
                </motion.div>

                {/* Barra de progresso animada */}
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{
                        duration: 1.5,
                        ease: "easeInOut"
                    }}
                    className="w-48 h-1 bg-muted rounded-full overflow-hidden"
                >
                    <motion.div
                        initial={{ x: "-100%" }}
                        animate={{ x: "100%" }}
                        transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="h-full w-1/3 bg-gradient-to-r from-primary to-primary/60 rounded-full"
                    />
                </motion.div>
            </motion.div>
        </motion.div>
    );
}
