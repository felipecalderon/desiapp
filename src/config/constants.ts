export const configs = {
    openaiApiKey: process.env.OPENAIKEY as string,
    wordpressKey: process.env.WP_APIKEY as string,
    wordpressSecret: process.env.WP_APISECRET as string,
    baseURL_API: process.env.BASE_API_URL as string,
    baseURL_CURRENT: process.env.BASE_CURRENT as string,

}

export const method = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE'
}