import { nextui } from '@nextui-org/react'
import { Config } from 'tailwindcss/types/config'

const config: Config = {
    content: ['./src/**/*.{js,ts,jsx,tsx,mdx}', './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}'],
    darkMode: ['class'],
    plugins: [nextui()],
}

export default config
