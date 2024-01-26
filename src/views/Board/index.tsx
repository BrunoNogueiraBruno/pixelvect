import { Canvas } from '../../components'

function Board() {
    return (
        <div>
            <div
                className='bg-red-400'
            >Board</div>
            <Canvas id="board-main-canvas" />
        </div>
    )
}

export default Board
