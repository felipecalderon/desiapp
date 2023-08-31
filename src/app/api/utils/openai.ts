import OpenAI from 'openai'

export const configs = {
    openaiApiKey: process.env.OPENAIKEY,
    apiKey: process.env.FIREBASE_APIKEY,
    authDomain: process.env.FIREBASE_DOMAIN,
    databaseURL: process.env.FIREBASE_URL,
    projectId: process.env.FIREBASE_ID,
    storageBucket: process.env.FIREBASE_BUCKET,
    messagingSenderId: process.env.FIREBASE_SENDERID,
    appId: process.env.FIREBASE_APPID,
    firebasePath: process.env.FIREBASE_PATHCONFIG,
    wordpressKey: process.env.WP_APIKEY,
    wordpressSecret: process.env.WP_APISECRET,
    mapBoxToken: process.env.MAPBOX_TOKEN
}

export const openai = new OpenAI({
    organization: 'org-neN2N85ruGAGBEWDtBIfepRK',
    apiKey: configs.openaiApiKey,
  });
  