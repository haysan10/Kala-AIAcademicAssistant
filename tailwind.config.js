import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/**/*.blade.php',
        './resources/**/*.js',
        './resources/**/*.jsx',
    ],
    theme: {
        extend: {
            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            // 1. TYPOGRAPHY SYSTEM
            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            fontFamily: {
                sans: ['Inter Variable', 'Inter', ...defaultTheme.fontFamily.sans],
                display: ['Outfit Variable', 'Outfit', 'sans-serif'],
                mono: ['JetBrains Mono', ...defaultTheme.fontFamily.mono],
            },
            fontSize: {
                // Golden Ratio scale: φ ≈ 1.618
                'xs': ['0.75rem', { lineHeight: '1.5', letterSpacing: '0.01em' }],      // 12px
                'sm': ['0.875rem', { lineHeight: '1.5', letterSpacing: '0.005em' }],   // 14px
                'base': ['1rem', { lineHeight: '1.6', letterSpacing: '0' }],           // 16px
                'lg': ['1.125rem', { lineHeight: '1.6', letterSpacing: '-0.005em' }],  // 18px
                'xl': ['1.25rem', { lineHeight: '1.5', letterSpacing: '-0.01em' }],    // 20px
                '2xl': ['1.5rem', { lineHeight: '1.4', letterSpacing: '-0.015em' }],   // 24px
                '3xl': ['1.875rem', { lineHeight: '1.3', letterSpacing: '-0.02em' }],  // 30px
                '4xl': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.025em' }],  // 36px
                '5xl': ['3rem', { lineHeight: '1.1', letterSpacing: '-0.03em' }],      // 48px
                '6xl': ['3.75rem', { lineHeight: '1', letterSpacing: '-0.035em' }],    // 60px
                '7xl': ['4.5rem', { lineHeight: '1', letterSpacing: '-0.04em' }],      // 72px
            },

            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            // 2. COLOR PALETTE
            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            colors: {
                // Primary Brand Color - Elegant Monochrome
                kala: {
                    50: '#fafafa',    // Almost white
                    100: '#f5f5f5',   // Light gray
                    200: '#e5e5e5',   // Soft gray
                    300: '#d4d4d4',   // Medium light gray
                    400: '#a3a3a3',   // Medium gray
                    500: '#737373',   // Main brand gray
                    600: '#525252',   // Dark gray
                    700: '#404040',   // Darker gray
                    800: '#262626',   // Very dark gray
                    900: '#171717',   // Near black
                    950: '#0a0a0a',   // Deep black
                },

                // Surface System - Monochrome Layered backgrounds
                surface: {
                    // Dark Mode (3-layer depth system)
                    dark: {
                        100: '#1a1a1a',  // L1: Cards, Sidebar (lightest)
                        200: '#141414',  // L2: Main canvas
                        300: '#0a0a0a',  // L3: Deep background (darkest)
                        border: 'rgba(255, 255, 255, 0.08)',
                        glow: 'rgba(255, 255, 255, 0.06)',
                    },
                    // Light Mode (Minimal \u0026 Clean)
                    light: {
                        100: '#ffffff',  // L1: Cards (brightest)
                        200: '#fafafa',  // L2: Sidebar  
                        300: '#f5f5f5',  // L3: Background
                        border: 'rgba(0, 0, 0, 0.08)',
                        glow: 'rgba(0, 0, 0, 0.04)',
                    }
                },
            },

            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            // 3. SPACING (Golden Ratio φ)
            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            spacing: {
                'phi-xs': '0.382rem',    // ~6px
                'phi-sm': '0.618rem',    // ~10px
                'phi': '1rem',           // 16px (base)
                'phi-md': '1.618rem',    // ~26px
                'phi-lg': '2.618rem',    // ~42px
                'phi-xl': '4.236rem',    // ~68px
                'phi-2xl': '6.854rem',   // ~110px
                'phi-3xl': '11.09rem',   // ~178px
            },

            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            // 4. BORDER RADIUS
            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            borderRadius: {
                'phi-sm': '0.5rem',      // 8px
                'phi': '0.75rem',        // 12px
                'phi-md': '1rem',        // 16px
                'phi-lg': '1.25rem',     // 20px
                'phi-xl': '1.5rem',      // 24px
            },

            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            // 5. SHADOWS (Soft & Premium)
            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            boxShadow: {
                'cinematic': '0 20px 60px -15px rgba(0, 0, 0, 0.25), 0 8px 24px -8px rgba(0, 0, 0, 0.15)',
                'cinematic-lg': '0 30px 80px -20px rgba(0, 0, 0, 0.3), 0 12px 32px -12px rgba(0, 0, 0, 0.2)',
                'glow': '0 0 30px rgba(255, 255, 255, 0.08)',
                'glow-lg': '0 0 60px rgba(255, 255, 255, 0.12)',
                'soft': '0 2px 12px rgba(0, 0, 0, 0.04)',
                'soft-lg': '0 4px 24px rgba(0, 0, 0, 0.06)',
            },

            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            // 6. ANIMATIONS
            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            animation: {
                // Cinematic entrance
                'reveal': 'reveal 1s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                'reveal-slow': 'reveal 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',

                // Floating effect
                'float': 'float 6s ease-in-out infinite',
                'float-slow': 'float 8s ease-in-out infinite',

                // Pulse variations
                'pulse-soft': 'pulseSoft 4s ease-in-out infinite',
                'pulse-glow': 'pulseGlow 3s ease-in-out infinite',

                // Shimmer effect
                'shimmer': 'shimmer 2.5s linear infinite',
            },
            keyframes: {
                reveal: {
                    '0%': {
                        opacity: '0',
                        transform: 'translateY(30px) scale(0.95)',
                        filter: 'blur(10px)'
                    },
                    '100%': {
                        opacity: '1',
                        transform: 'translateY(0) scale(1)',
                        filter: 'blur(0)'
                    },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                pulseSoft: {
                    '0%, 100%': { opacity: '0.3' },
                    '50%': { opacity: '0.6' },
                },
                pulseGlow: {
                    '0%, 100%': {
                        boxShadow: '0 0 20px rgba(255, 255, 255, 0.1)',
                        opacity: '1',
                    },
                    '50%': {
                        boxShadow: '0 0 40px rgba(255, 255, 255, 0.15)',
                        opacity: '0.9',
                    },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-1000px 0' },
                    '100%': { backgroundPosition: '1000px 0' },
                },
            },

            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            // 7. BACKDROP BLUR
            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            backdropBlur: {
                'xs': '2px',
                'cinematic': '16px',
            },
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
    ],
};
