import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
        },
        screens: {
            xs: '475px',
            sm: '680px',
            md: '768px',
            lg: '1024px',
            xl: '1280px',
            '2xl': '1536px',
            '3xl': '1920px'
        }
    },

    plugins: [forms, require("daisyui")],
    daisyui: {
        themes: [
            {
                "light": {
                    "primary": "#73c2fb",
                    "primary-focus": "#54a0eb",
                    "primary-content": "#1f2937",
                    "secondary": "#f000b8",
                    "secondary-focus": "#bd0091",
                    "secondary-content": "#ffffff",
                    "accent": "#37cdbe",
                    "accent-focus": "#2aa79b",
                    "accent-content": "#ffffff",
                    "neutral": "#c6e4ee",
                    "neutral-focus": "#a3d7e7",
                    "neutral-content": "#1f2937",
                    "base-100": "#ffffff",
                    "base-200": "#f9fafb",
                    "base-300": "#d1d5db",
                    "base-content": "#1f2937",
                    "info": "#2094f3",
                    "success": "#009485",
                    "warning": "#ff9900",
                    "error": "#ff5724"
            }
        }, "dark"], // false: only light + dark | true: all themes | array: specific themes like this ["light", "dark", "cupcake"]
        darkTheme: "dark", // name of one of the included themes for dark mode
        darkMode: ['selector', '[data-theme="dark"]'], // selector for dark mode class
        base: true, // applies background color and foreground color for root element by default
        styled: true, // include daisyUI colors and design decisions for all components
        utils: true, // adds responsive and modifier utility classes
        prefix: "", // prefix for daisyUI classnames (components, modifiers and responsive class names. Not colors)
        logs: true, // Shows info about daisyUI version and used config in the console when building your CSS
        themeRoot: ":root", // The element that receives theme color CSS variables
    }
};
