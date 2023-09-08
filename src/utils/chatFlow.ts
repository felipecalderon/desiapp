import { openai } from '@/utils/openai';
import { transformar_producto } from './functionsGPT'; 
import { ChatCompletion } from 'openai/resources/chat/index.mjs';
export const iniciaChat = async (mensaje: string) => {
    try {
        const primerMensaje = await openai.chat.completions.create({
            messages: [{ role: 'user', content: mensaje }],
            model: 'gpt-4',
            functions: [transformar_producto]
        });
        return procesaChat(primerMensaje)
    } catch (error) {
        console.log(error);
        throw {
            error: 'Problema al iniciar chat'
        }
    }
}

export const procesaChat = async (chat: ChatCompletion) => {
    //en caso de que se llame a una función
    if(chat.choices[0].message.function_call){
        const noParseArgs = chat.choices[0].message.function_call.arguments
        if(noParseArgs){
            const argumentos = JSON.parse(noParseArgs)
            return {
                role: 'assistant',
                content: argumentos
            }
        }
    }
    //en caso de no llamar a función, responder normalmente
    return chat.choices[0].message
}