import { heroui } from "@heroui/react"
import { Config } from 'tailwindcss/types/config'

const config: Config = {
    content: ['./src/**/*.{js,ts,jsx,tsx,mdx}', "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"],
    darkMode: ['class'],
    plugins: [heroui()],
}

export default config
