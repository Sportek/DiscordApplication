export function getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
}
export function getRandomNumberBetweenTwo(max: number, min: number){
    return Math.floor(Math.random() * (max-min) + min);
}
export function getNumberToLimit(number: number, max: number, denominator: number){
    return Math.trunc(number/max * 10)
}