const { useState,useEffect, useRef } = require("react");
// peerjs acting as intermediate server, handling all the webrtc request
const usePeer=()=>{
    const [peer, setPeer] = useState(null);
    const [myId, setMyId] = useState('');
    const isPeerSet = useRef(false)
    useEffect(()=>{
        if(isPeerSet.current) return;
        isPeerSet.current=true;
        (
            // importing a package here inside useEffect
            async function initPeer(){
                const myPeer = new (await import('peerjs')).default()
                setPeer(myPeer)

                myPeer.on('open',(id)=>{
                    console.log(`your peerid is ${id}`)
                    setMyId(id)
                })
            }
        )()
    },[])
    return {
        peer,
        myId
    }
}

export default usePeer;