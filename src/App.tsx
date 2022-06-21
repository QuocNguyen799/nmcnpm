import React from 'react';
import './App.css';
import { db } from './firebase-config'
import { collection, getDocs } from 'firebase/firestore'

function App() {
  const [nhanVien, setNhanVien] = React.useState<any>();
  const nhanVienCollectionRef = collection(db, 'NhanVien')
  const getNhanVien = async () => {
    const data = await getDocs(nhanVienCollectionRef);
    setNhanVien(data.docs.map((doc) => ({...doc.data(), MaNV: doc.id})));
  }

  React.useEffect(()=>{
    getNhanVien();
  },[])
  return (
    <div className="App">
      {
        nhanVien && nhanVien.map((nv:any, index:any) => {
          return <h1 key={nv.MaNV}>{nv.TenNV}</h1>
        })
      }
    </div>
  );
}

export default App;
