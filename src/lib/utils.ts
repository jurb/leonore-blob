// Turn the points returned from perfect-freehand into SVG path data.

export function getSvgPathFromStroke(stroke: [number, number][]): string {
    if (!stroke.length) return ""

    const d = stroke.reduce(
        (acc: (string | number)[], [x0, y0], i, arr) => {
            const [x1, y1] = arr[(i + 1) % arr.length]
            acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2)
            return acc
        },
        ["M", ...stroke[0], "Q"]
    )

    d.push("Z")
    return d.join(" ")
}