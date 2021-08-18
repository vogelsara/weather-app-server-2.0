export function average(array: Array<number>) {
    if (array.length === 0) return 0
    const total = array.reduce<number>(
        (accumulator, currentElement) => accumulator + currentElement,
        0
    );
    return total / array.length
}

export function median(array: Array<number>) {
    if (array.length === 0) return 0

    array = array.slice().sort(function (a, b) {
        return a - b
    })

    var half = Math.floor(array.length / 2)

    if (array.length % 2) return array[half]

    return (array[half - 1] + array[half]) / 2.0
}