import React, { useState } from 'react';
import { CanvasProps } from './types';

function Canvas(props: CanvasProps) {
    const { id, width = 2, height = 3 } = props;
    const [zoom, setZoom] = useState(5)

    const canvasWidth = width * zoom
    const canvasHeight = height * zoom

    const drawPixel = (props: { absoluteCoord: number, size: number, canvasSize: number }, sect = 0): number => {
        const { absoluteCoord, size, canvasSize } = props
        const mapSect = canvasSize / size

        if (absoluteCoord > sect) return drawPixel(props, sect += (canvasSize / mapSect))
        return sect - size
    }

    const drawRect = (ctx: CanvasRenderingContext2D, absolutePos: number[], size: number) => {
        const x = drawPixel({ absoluteCoord: absolutePos[0], size, canvasSize: canvasWidth })
        const y = drawPixel({ absoluteCoord: absolutePos[1], size, canvasSize: canvasHeight })

        ctx.fillStyle = "green"
        ctx.fillRect(x, y, size, size)
    };

    const handleDraw = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
        try {
            const { target, offsetX: x, offsetY: y } = e.nativeEvent
            const canvas = target as HTMLCanvasElement
            const ctx = canvas.getContext("2d")

            if (ctx) {
                drawRect(ctx, [x, y], zoom);
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <canvas
                id={id}
                style={{ background: "white" }}
                className='bg-red-400'
                width={canvasWidth}
                height={canvasHeight}
                onClick={handleDraw}
            />
            <div>
                <input
                    style={{ position: "absolute" }}
                    type="range"
                    min="1"
                    max="100"
                    value={zoom}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setZoom(Number(e.target.value));
                    }}
                />
            </div>
        </div>
    );
}

export default Canvas;
