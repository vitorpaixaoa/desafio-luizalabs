// PKCE (S256) helpers
// Ref: RFC 7636

async function sha256(input: string): Promise<ArrayBuffer> {
  const encoder = new TextEncoder()
  const data = encoder.encode(input)
  return await crypto.subtle.digest('SHA-256', data)
}

function base64UrlEncode(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

export function generateRandomString(length = 64): string {
  const array = new Uint8Array(length)
  crypto.getRandomValues(array)
  return Array.from(array, (b) => ('0' + b.toString(16)).slice(-2)).join('')
}

export async function generateCodeChallengeS256(verifier: string): Promise<string> {
  const hashed = await sha256(verifier)
  return base64UrlEncode(hashed)
}

export async function generateVerifierAndChallenge(): Promise<{
  codeVerifier: string
  codeChallenge: string
}> {
  const codeVerifier = generateRandomString(64)
  const codeChallenge = await generateCodeChallengeS256(codeVerifier)
  return { codeVerifier, codeChallenge }
}


