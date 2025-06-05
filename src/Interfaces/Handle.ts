export interface Handle {
	type: string
	legend: string
	titanId: number
	userNumber: HandleUserNumber
}

export interface HandleUserNumber {
	hashCode: string
	userNumbers: number[]
}
