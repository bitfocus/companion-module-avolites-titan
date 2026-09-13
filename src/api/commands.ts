export type Query = Record<string, string | number | boolean>

export function scriptPath(member: string, params: Query = {}): string {
	if (!/^[A-Za-z][A-Za-z0-9]*(\.[A-Za-z][A-Za-z0-9]*)+$/.test(member)) throw new Error('Invalid API member')
	const query = new URLSearchParams(
		Object.entries(params).map(([key, value]): [string, string] => [key, String(value)]),
	)
	return `script/2/${member.replaceAll('.', '/')}${query.size ? `?${query}` : ''}`
}

export function finiteNumber(value: unknown, min: number, max: number): number {
	if ((typeof value !== 'number' && typeof value !== 'string') || String(value).trim() === '')
		throw new Error('A number is required')
	const number = Number(value)
	if (!Number.isFinite(number) || number < min || number > max)
		throw new Error(`Expected a number from ${min} to ${max}`)
	return number
}

export function handleParams(mode: unknown, value: unknown): Query {
	if (typeof value !== 'string' && typeof value !== 'number') throw new Error('A handle is required')
	const text = String(value).trim()
	switch (mode) {
		case 'userNumber':
			if (!/^\d+(?:\.\d+)?$/.test(text) || Number(text) <= 0) throw new Error('Enter a positive user number')
			return { handle_userNumber: text }
		case 'titanId':
			if (!/^\d+$/.test(text) || Number(text) <= 0) throw new Error('Enter a positive Titan ID')
			return { handle_titanId: text }
		case 'location':
			if (!/^[A-Za-z][A-Za-z0-9]*_\d+_\d+$/.test(text)) throw new Error('Enter a location such as playback_2_1')
			return { handle_location: text }
		default:
			throw new Error('Invalid handle addressing mode')
	}
}
