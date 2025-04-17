import { SignedXml } from 'xml-crypto'
import forge from 'node-forge'
import { readFileSync } from 'node:fs'

const pfxPath = 'ruta/al/certificado.pfx'
const pfxPassword = 'CONTRASEÑA_DEL_PFX'

// Leer el archivo PFX
const pfxBuffer = readFileSync(pfxPath)

// Convertir el buffer a base64 y luego a DER
const p12Base64 = pfxBuffer.toString('base64')
const p12Der = forge.util.decode64(p12Base64)
const p12Asn1 = forge.asn1.fromDer(p12Der)

// Extraer la información del PFX
const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, false, pfxPassword)

// Extraer la clave privada
const keyBags = p12.getBags({ bagType: forge.pki.oids.pkcs8ShroudedKeyBag })
if (!keyBags[forge.pki.oids.pkcs8ShroudedKeyBag] || typeof keyBags[forge.pki.oids.pkcs8ShroudedKeyBag] === 'undefined') {
    throw new Error('No se encontró la clave privada en el PFX.')
}
const keyObj = keyBags[forge.pki.oids.pkcs8ShroudedKeyBag]![0]
const privateKeyPem = forge.pki.privateKeyToPem(keyObj.key!)

// Extraer el certificado público
const certBags = p12.getBags({ bagType: forge.pki.oids.certBag })
if (!certBags[forge.pki.oids.certBag] || certBags[forge.pki.oids.certBag]!.length === 0) {
    throw new Error('No se encontró el certificado en el PFX.')
}
const certObj = certBags[forge.pki.oids.certBag]![0]
const certificatePem = forge.pki.certificateToPem(certObj.cert!)

// Configurar la firma del XML con xml-crypto
const sig = new SignedXml()

// Agregar la referencia al nodo a firmar. En este ejemplo se firma el nodo <DTE> completo.
// Es importante ajustar esta referencia al nodo específico que requiere la firma el SII.
sig.addReference({
    xpath: "//*[local-name(.)='DTE']",
    transforms: ['http://www.w3.org/2000/09/xmldsig#enveloped-signature', 'http://www.w3.org/TR/2001/REC-xml-c14n-20010315'],
    digestAlgorithm: 'http://www.w3.org/2000/09/xmldsig#sha1',
})

// Asignar la clave privada para la firma.
sig.privateKey = privateKeyPem

// Configurar el nodo KeyInfo para incluir el certificado.
sig.keyInfoAttributes = {
    getKeyInfo: `<X509Data>${certificatePem}</X509Data>`,
}

// // Ejecutar la firma; en este ejemplo, se inserta el nodo <Signature> como hijo de <DTE>.
// sig.computeSignature(xmlSinFirmar, {
//   location: { reference: "//*[local-name(.)='DTE']", action: "append" }
// });

// // Obtener el XML firmado.
// const xmlFirmado = sig.getSignedXml();

// console.log("XML Firmado:\n", xmlFirmado);
