export interface Handle {
	type: string
	legend: string
	titanId: number
	userNumber: HandleUserNumber
	icon?: string | null
}

export interface HandleUserNumber {
	hashCode: string
	userNumbers: number[]
}
