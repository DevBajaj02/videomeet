import { cloneDeep } from "lodash"

const { useState } = require("react")

const usePlayer=(myId)=>{
    const [players, setPlayers]=useState({})
    const playersCopy=cloneDeep(players)       // we don't want shallow copy

    const playerHighlighted = playersCopy[myId]
    delete playersCopy[myId]

    const nonHighlighted= playersCopy
    return {players, setPlayers, playerHighlighted, nonHighlighted}
}

export default usePlayer;