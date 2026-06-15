import { useCallback, useEffect, useRef } from "react"

/*
 * Hook qui pilote le worker Stockfish via le protocole UCI.
 */

export type StockfishOptions = {
  skillLevel?: number // 0-20 (20 = pleine force)
  movetime?: number // temps de réflexion en ms
  depth?: number // alternative : profondeur fixe
}

export function useStockfish(enabled: boolean) {
  const workerRef = useRef<Worker | null>(null)
  const failedRef = useRef(false)
  const pendingResolve = useRef<((move: string | null) => void) | null>(null)

  useEffect(() => {
    if (!enabled || typeof window === "undefined") return

    let worker: Worker
    try {
      worker = new Worker("/stockfish/sf-worker.js")
    } catch {
      failedRef.current = true
      return
    }
    workerRef.current = worker
    failedRef.current = false

    const settle = (move: string | null) => {
      if (pendingResolve.current) {
        pendingResolve.current(move)
        pendingResolve.current = null
      }
    }

    const onMessage = (e: MessageEvent) => {
      const line = typeof e.data === "string" ? e.data : ""

      if (line === "sf-load-error") {
        failedRef.current = true
        settle(null)
        return
      }
      if (line === "uciok") {
        worker.postMessage("isready")
        return
      }
      if (line.startsWith("bestmove")) {
        const best = line.split(" ")[1]
        settle(best && best !== "(none)" ? best : null)
      }
    }

    const onError = () => {
      failedRef.current = true
      settle(null)
    }

    worker.addEventListener("message", onMessage)
    worker.addEventListener("error", onError)
    worker.postMessage("uci")

    return () => {
      worker.removeEventListener("message", onMessage)
      worker.removeEventListener("error", onError)
      try {
        worker.postMessage("quit")
      } catch {
        /* noop */
      }
      worker.terminate()
      workerRef.current = null
      pendingResolve.current = null
    }
  }, [enabled])

  const getBestMove = useCallback(
    (fen: string, opts: StockfishOptions = {}): Promise<string | null> => {
      const worker = workerRef.current
      if (!worker || failedRef.current) return Promise.resolve(null)

      const { skillLevel = 20, movetime = 1000, depth } = opts

      return new Promise((resolve) => {
        // Le worker traite une requête à la fois : on annule la précédente.
        if (pendingResolve.current) pendingResolve.current(null)
        pendingResolve.current = resolve

        worker.postMessage(`setoption name Skill Level value ${skillLevel}`)
        worker.postMessage("ucinewgame")
        worker.postMessage(`position fen ${fen}`)
        worker.postMessage(
          depth ? `go depth ${depth}` : `go movetime ${movetime}`
        )

        // Garde-fou : si rien ne revient (CDN lent/bloqué), on libère.
        const guardMs = depth ? 8000 : movetime + 4000
        setTimeout(() => {
          if (pendingResolve.current === resolve) {
            pendingResolve.current = null
            resolve(null)
          }
        }, Math.max(guardMs, 6000))
      })
    },
    []
  )

  return { getBestMove }
}
