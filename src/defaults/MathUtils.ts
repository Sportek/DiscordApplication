export function getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
}
export function getRandomNumberBetweenTwo(max: number, min: number){
    return Math.floor(Math.random() * (max-min) + min);
}

export function getRandomNumberBetweenTwoNotFloored(max: number, min: number){
    const number = Math.random() * (max-min) + min
    if(Math.random() < 0.5) return -number
    return number
}
export function getNumberToLimit(number: number, max: number, denominator: number){
    return Math.trunc(number/max * 10)
}