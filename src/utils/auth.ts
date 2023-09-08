export const createBase64Access = (
	wordpressKey: string,
	wordpressSecret: string
) => {
	const accessWP = `${wordpressKey}:${wordpressSecret}`;
	const accessBase64 = Buffer.from(accessWP, 'utf-8').toString('base64');
	return accessBase64;
};