import React, {useState, useEffect} from 'react';
import {FaLockOpen, FaLock, FaPauseCircle, FaPlayCircle} from 'react-icons/fa';
import {getFirestore, getDoc, doc, updateDoc } from 'firebase/firestore';
import app from './Firebase';
import {Hearts} from 'react-loader-spinner'
import {password} from './env';
const App = ()=>{

  const [lock, setLock] = useState(true);
  const [pause, setPause] = useState(true);
  const [loading, setLoading] = useState(true);
  const [passwordCheck, setPasswordCheck] = useState(false);

  const db = getFirestore(app);

  useEffect(() => {
    const docRef = doc(db, "forHer", "OneYear");

    setLoading(true);
    const getData = async () => {
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setLock(docSnap.data().lock);
        setPause(docSnap.data().pause);
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    }

    getData()

    // setLoading(false);
  }, [db])

  useEffect(() => {
    const interval = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(interval);
  } , [passwordCheck])

  const playOrPause = async()=>{
    const docRef = doc(db, "forHer", "OneYear");
    await updateDoc(docRef, {
      pause: !pause
    });

    setPause(!pause);

  }
  const lockOrUnlock = async()=>{
    const docRef = doc(db, "forHer", "OneYear");
    await updateDoc(docRef, {
      lock: !lock
    })
    setLock(!lock);

    if(!lock){
      await updateDoc(docRef, {
        pause: true
      });
  
      setPause(true);
    }
  }

  const passwordCheckFunc = (e)=>{
    if(e.target.value === password){
      setPasswordCheck(true);
      return true;
    }
    return false;
  }

  const Content = ()=>{
      return(
        <>
          <div className="content">
            {lock ? <FaLockOpen size = {100} onClick = {lockOrUnlock}/> : <FaLock size = {100} onClick = {lockOrUnlock}/>}
            {pause ? <FaPlayCircle size = {100} onClick = {playOrPause}/> : <FaPauseCircle size = {100} onClick = {playOrPause}/>}
          </div>
          <h3>
            {lock ? "Locked" : 'Unlocked'}
          </h3>
          <h3>
            {pause ? "Paused" : "Playing..."}
          </h3>
        </>
      )
    }

  return (
    <div className="App">

      {
        loading ? <Hearts color = "#228B22" width = '50vw' arialLabel='loading'/> :  
        passwordCheck ? <Content/> :
        
        <>
          <input type = 'password' onChange = {(e)=>passwordCheckFunc(e)}/>
          <h3>Type the Password</h3>
        </>
      
      }

     
    </div>
  );
}

export default App;
