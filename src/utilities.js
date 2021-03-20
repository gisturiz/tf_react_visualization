export const drawRect = (detections, ctx) => {
    detections.forEach(prediction => {
        // Make prediction
        const [x, y, width, height] = prediction['bbox'];
        const text = prediction['class'];
    })
}