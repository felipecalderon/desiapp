import { openai } from '@/app/api/utils/openai';

export const iniciaChat = async (mensaje: string) => {
    try {
        const completion = await openai.chat.completions.create({
            messages: [{ role: 'user', content: mensaje }],
            model: 'gpt-3.5-turbo',
        });
        return completion.choices
    } catch (error) {
        throw {
            error: 'Problema al iniciar chat'
        }
    }
}