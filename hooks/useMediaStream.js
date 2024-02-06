import { useState, useEffect, useRef } from 'react';
// const  = require("react")

const useMediaStream=()=>{
    const [state, setState] = useState(null);
    const isStreamSet = useRef(false);

    useEffect(()=>{
        if(isStreamSet.current) return;
        isStreamSet.current=true;
        (
            async function initStream(){
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({
                        audio:true,
                        video:true
                    })
                    console.log("Setting stream")
                    setState(stream);
                } catch (error) {
                    console.log("Error in media navigator",error)
                }
            }
        )()
    },[])

    return {
        stream: state
    }
}

export default useMediaStream