import React, { useEffect, useRef, useState } from 'react';
import { CanvasProps } from './types';

type zoom = { value: number, callback: null | (() => void) }
type pixel = { absolutePos: number[], color: string }

type handleDrawProps = {
    canvas: HTMLCanvasElement, absolutePos: number[]
}

function Canvas(props: CanvasProps) {
    const { id, width = 30, height = 30 } = props;
    const [zoom, setZoom] = useState<zoom>({ value: 30, callback: null })
    const [pixels, setPixels] = useState<pixel[]>([])

    const canvasRef = useRef(null)

    const canvasWidth = width * zoom.value
    const canvasHeight = height * zoom.value

    useEffect(() => {
        if (zoom.callback) zoom.callback()

    }, [zoom])

    const drawPixel = (props: { absoluteCoord: number, size: number, canvasSize: number }, sect = 0): number => {
        const { absoluteCoord, size, canvasSize } = props
        const mapSect = canvasSize / size

        if (absoluteCoord > sect) return drawPixel(props, sect += (canvasSize / mapSect))
        return sect - size
    }

    const drawRect = (ctx: CanvasRenderingContext2D, absolutePos: number[], size: number, color: string) => {
        const x = drawPixel({ absoluteCoord: absolutePos[0], size, canvasSize: canvasWidth })
        const y = drawPixel({ absoluteCoord: absolutePos[1], size, canvasSize: canvasHeight })

        ctx.fillStyle = color
        ctx.fillRect(x, y, size, size)
    }

    const restoreRects = (resize: number, prev: number, index: number = 0): void => {

        if (canvasRef.current) {
            const { absolutePos } = pixels[index]
            const diff = resize - prev
            handleDraw({ canvas: canvasRef.current, absolutePos }, () => {
                return pixels.map((px) => {
                    return { ...px, absolutePos: [px.absolutePos[0] + diff, px.absolutePos[1] + diff] }
                })
            })
        }

        if (!pixels[index + 1]) return

        restoreRects(resize, prev, index += 1)
    }

    const handleDraw = (props: handleDrawProps, onRestore: false | (() => pixel[]) = false) => {
        try {
            const { canvas, absolutePos } = props
            const ctx = canvas.getContext("2d")

            if (ctx) {
                const color = "green"

                drawRect(ctx, absolutePos, zoom.value, color)

                let updatePixels = !onRestore ? [...pixels, { absolutePos: absolutePos, color }] : onRestore()

                setPixels(updatePixels)
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleZoom = (value: number) => {
        try {
            if (canvasRef.current) {
                const canvas = canvasRef.current as HTMLCanvasElement
                const ctx = canvas.getContext("2d")

                const callback = () => {
                    if (!ctx || !pixels.length) return

                    restoreRects(value, zoom.value)
                }

                setZoom({ value, callback })
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div>
            <canvas
                id={id}
                ref={canvasRef}
                style={{ background: "white" }}
                className='bg-red-400'
                width={canvasWidth}
                height={canvasHeight}
                onClick={(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
                    const { target, offsetX, offsetY } = e.nativeEvent
                    handleDraw({ canvas: target as HTMLCanvasElement, absolutePos: [offsetX, offsetY] })
                }}
            />
            <div>
                <input
                    style={{ position: "absolute" }}
                    type="range"
                    min="30"
                    max="80"
                    value={zoom.value}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        handleZoom(Number(e.target.value))
                    }}
                />
            </div>
        </div>
    );
}

export default Canvas;
