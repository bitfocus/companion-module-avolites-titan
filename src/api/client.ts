export class TitanClient {
	private readonly controller = new AbortController()
	private queue: Promise<unknown> = Promise.resolve()

	constructor(
		private readonly host: string,
		private readonly timeout = 5000,
		private readonly fetcher: typeof fetch = fetch,
	) {}

	abort(): void {
		this.controller.abort()
	}

	private async request<T>(path: string, consume: (response: Response) => Promise<T>, absolute = false): Promise<T> {
		this.controller.signal.throwIfAborted()
		const request = new AbortController()
		const abort = (): void => request.abort(this.controller.signal.reason)
		this.controller.signal.addEventListener('abort', abort, { once: true })
		const timer = setTimeout(
			() => request.abort(new DOMException('Titan request timed out', 'TimeoutError')),
			this.timeout,
		)
		try {
			const response = await this.fetcher(absolute ? path : `http://${this.host}:4430/titan/${path}`, {
				signal: request.signal,
			})
			if (!response.ok) {
				await response.body?.cancel()
				throw new Error(`Titan HTTP ${response.status}`)
			}
			return await consume(response)
		} finally {
			clearTimeout(timer)
			this.controller.signal.removeEventListener('abort', abort)
		}
	}

	async read(path: string): Promise<unknown> {
		return this.request(path, async (response) => response.json())
	}

	async image(url: string): Promise<string> {
		return this.request(url, async (response) => Buffer.from(await response.arrayBuffer()).toString('base64'), true)
	}

	// Keep multi-step actions together; never retry a command which may have fired.
	async commands(paths: string[]): Promise<void> {
		const next = this.queue.then(async () => {
			for (const path of paths) {
				await this.request(path, async (response) => response.text())
			}
		})
		this.queue = next.catch(() => undefined)
		return next
	}
}
