import { motion } from 'framer-motion';
import { cn } from '@/Lib/utils';

export default function Card({
    children,
    className,
    hover = true,
    glass = false,
    onClick,
    ...props
}) {
    const CardWrapper = onClick ? motion.button : motion.div;

    return (
        <CardWrapper
            initial={false}
            whileHover={hover ? { y: -4, transition: { duration: 0.3 } } : {}}
            className={cn(
                glass ? 'card-glass' : 'card',
                onClick && 'cursor-pointer',
                className
            )}
            onClick={onClick}
            {...props}
        >
            {children}
        </CardWrapper>
    );
}
