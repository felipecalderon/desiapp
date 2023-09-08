import { iniciaChat } from '@/utils/chatFlow';
import { NextResponse } from 'next/server';
export const GET = async () => {
	try {		
		// if(!mensaje) return NextResponse.json({error: 'Debe ingresar un mensaje'})
		const chat = await iniciaChat('hola como estás')
		return NextResponse.json(chat);
	} catch (error) {
		return NextResponse.json(error)
	}
};
