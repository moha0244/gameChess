/*
 * Worker Stockfish (même origine) pour le mode "Difficile".
 *
 * On charge une build single-file de Stockfish (asm.js) depuis un CDN via
 * importScripts. Cette build ne nécessite PAS d'en-têtes COOP/COEP côté
 * serveur (contrairement aux builds WASM multi-thread), donc aucun réglage
 * Next.js / Vercel n'est requis : ça marche tel quel.
 *
 * Stockfish, une fois importé dans ce worker, prend en charge lui-même
 * self.onmessage (entrée UCI) et self.postMessage (sortie UCI). On ne définit
 * donc volontairement AUCUN onmessage ici pour ne pas entrer en conflit.
 *
 * Pour changer de version, modifier SF_CDN_URL ci-dessous.
 */
var SF_CDN_URL = "https://cdn.jsdelivr.net/npm/stockfish@10.0.2/stockfish.js"

try {
  importScripts(SF_CDN_URL)
} catch (e) {
  // Si le CDN est injoignable (hors-ligne, bloqué), on prévient le thread
  // principal qui basculera sur le moteur JS de secours. (searchAB)
  self.postMessage("sf-load-error")
}
