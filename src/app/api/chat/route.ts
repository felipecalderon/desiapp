import { NextResponse } from 'next/server';
import { configs } from '@/app/api/utils/openai';
import { openai } from '@/app/api/utils/openai';
import { iniciaChat } from '../utils/chatFlow';
export const GET = async () => {
	const chat = await iniciaChat('hola como estás')

	console.log(chat);

	return NextResponse.json(chat);
};
