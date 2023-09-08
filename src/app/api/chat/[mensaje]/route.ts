import { NextResponse } from "next/server"
import { iniciaChat } from "../../../../utils/chatFlow";

export const GET = async (_request: Request, { params }: { params: { mensaje: string } }) => {
    try {		
		// if(!mensaje) return NextResponse.json({error: 'Debe ingresar un mensaje'})
		const chat = await iniciaChat(params.mensaje)
		return NextResponse.json(chat);
	} catch (error) {
		return NextResponse.json(error)
	}
}