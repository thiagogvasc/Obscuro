export const generateColor = () => {
    const hexValues = '456789ABC'
    let color = ''
    color += '#'
    for (let i = 0; i < 6; i++) {
        const value = Math.floor(Math.random() * 9)
        color += hexValues[value]
    }

    return color
}