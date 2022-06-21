import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import { gql, useQuery, useMutation } from '@apollo/client';
import Modal from "react-bootstrap/Modal";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHandPointRight as regular_right_hand
} from '@fortawesome/free-regular-svg-icons';
import {
  faSignInAlt as solid_sign_in,
  faFolderPlus as solid_folder_plus,
  faTasks as solid_tasks,
  faUserTie as solid_user,
  faSignOutAlt as solid_sign_out
} from '@fortawesome/free-solid-svg-icons';

import Room from './components/Room';
import CreateRoom from './components/CreateRoom';
import ManageRooms from './components/ManageRooms';


const signInRequest = gql`
	mutation signIn($username: String!, $password: String!) {
		signIn(username: $username, password: $password)
	}
`;

const signUpRequest = gql`
	mutation signUp($username: String!, $password: String!) {
		signUp(username: $username, password: $password)
	}
`;

function App() {
  const [signInModalShow, setSignInModalShow] = React.useState(false);
  const [joinRoomModalShow, setJoinRoomModalShow] = React.useState(false);
  const [inRoomModalShow, setInRoomModalShow] = React.useState(false);
  const [createRoomModalShow, setCreateRoomModalShow] = React.useState(false);
  const [manageRoomModalShow, setManageRoomModalShow] = React.useState(false);

  const [signTab, setSignTab] = React.useState(0);
  const [authRequest, setAuthRequest] = React.useState(false);

  const [roomID, setRoomID] = React.useState('');
  const [studentName, setStudentName] = React.useState('');
  
	const [signIn, signInResult] = useMutation(signInRequest);
	const [signUp, signUpResult] = useMutation(signUpRequest);

  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  
  const [authenticatedUser, setAuthenticatedUser] = React.useState<any>('');
  
  const [selectedRoom, setSelectedRoom] = React.useState<any>(null);
  function goToEditModal(room:any){
    setSelectedRoom(room);
    setCreateRoomModalShow(true);
    setManageRoomModalShow(false);
  }

  React.useEffect(()=>{
    if(signInResult.data) {
      if(signInResult.data.signIn){
        setAuthenticatedUser(username);
      } else {
        alert("Error: Username or Password is not correct!")
      }
    }
  },[signInResult.data])

  React.useEffect(()=>{
    if(signUpResult.data) {
      if(signUpResult.data.signUp){
        setAuthenticatedUser(username);
      } else {
        alert("Error: Username already used!")
      }
    }
  },[signUpResult.data])

  return (
    <div className="App container-fluid">
      <div className='d-flex flex-column h-100'>
        <div className='d-flex justify-content-between align-items-center'>
          <img src='hcmue.png' className='logo rounded-circle' style={{width: '285px'}}/>
          <div className='text-center'>
            <h2>Đồ giữa kỳ môn "Nhập môn công nghệ phần mềm"</h2>
            <h3>HK2 : 2021 - 2022</h3>
            <h2>Quản lý phòng thi trắc nghiệm</h2>
            <h3>Nguyễn Kim Quốc - 43.01.104.142</h3>
          </div>
          <div className='text-center'>
            {
              authenticatedUser == ''
              ?
                <button className='btn btn-transparent text-danger' onClick={()=>{setSignInModalShow(true); setSignTab(0)}}>
                  <FontAwesomeIcon icon={solid_sign_in} size='4x'/>
                  <p><strong>SIGN IN</strong></p>
                </button>
              :
                <button className='btn btn-transparent text-secondary' onClick={()=>setAuthenticatedUser('')}>
                  <FontAwesomeIcon icon={solid_sign_out} size='4x'/>
                  <p><strong>SIGN OUT</strong></p>
                </button>
            }
          </div>
        </div>
        {
          authenticatedUser !== '' &&
          <div className='d-flex justify-content-end align-items-center mx-4 text-secondary'>
            <FontAwesomeIcon icon={solid_user} size='2x'/>
            <p className='my-0 mx-3 lead'><strong>{authenticatedUser}</strong></p>
          </div>
        }
        <div className='flex-grow-1'>
          <div className="d-flex flex-column h-100 justify-content-center text-center">
            <div className='row'>
              <div className='col-4 mx-auto'>
                <button className='btn btn-warning py-3 px-5' onClick={()=>setJoinRoomModalShow(true)}>
                  <FontAwesomeIcon icon={regular_right_hand} size='10x'/>
                  <p><strong>JOIN A ROOM</strong></p>
                </button>
              </div>
              {
                authenticatedUser !== '' &&
                <div className='col-4 mx-auto'>
                  <button className='btn btn-success py-3 px-5' onClick={()=>{setSelectedRoom(null); setCreateRoomModalShow(true)}}>
                    <FontAwesomeIcon icon={solid_folder_plus} size='10x'/>
                    <p><strong>CREATE ROOM</strong></p>
                  </button>
                </div>
              }
              {
                authenticatedUser !== '' &&
                <div className='col-4 mx-auto'>
                  <button className='btn btn-primary py-3 px-5' onClick={()=>setManageRoomModalShow(true)}>
                    <FontAwesomeIcon icon={ solid_tasks} size='10x'/>
                    <p><strong>MANAGE ROOMS</strong></p>
                  </button>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
      <Modal show={signInModalShow} onHide={()=>setSignInModalShow(false)} dialogClassName={"modal-dialog-centered"}>
        <div className="modal-content">
          <div className="modal-body">
            <div>
              <button className={'btn ' + (signTab == 0 ? 'btn-secondary' : 'btn-outline-secondary')} onClick={() => setSignTab(0)}>Sign In</button>
              <button className={'btn mx-3 ' + (signTab == 1 ? 'btn-secondary' : 'btn-outline-secondary')} onClick={() => setSignTab(1)}>Sign Up</button>
            </div>
            <div className="mt-4 mb-3">
              <label htmlFor="username" className="form-label w-100">Username:</label>
              <input onChange={(e)=>setUsername(e.target.value)} type="text" className="form-control" id="username"/>
            </div>
            <div className="mb-5">
              <label htmlFor="password" className="form-label w-100">Password:</label>
              <input onChange={(e)=>setPassword(e.target.value)} type="password" className="form-control" id="password"/>
            </div>
            <div className='d-flex justify-content-center mb-4'>
            {
              signTab == 0 &&
              <button onClick={()=>{setSignInModalShow(false); signIn({variables: {username, password}})}} className='w-50 btn btn-warning'>Sign In</button>
            }
            {
              signTab == 1 &&
              <button onClick={()=>{setSignInModalShow(false); signUp({variables: {username, password}})}} className='w-50 btn btn-success'>Sign Up</button>
            }
            </div>
          </div>
        </div>
      </Modal>
      <Modal show={joinRoomModalShow} onHide={()=>setJoinRoomModalShow(false)} dialogClassName={"modal-dialog-centered"}>
        <div className="modal-body">
            <div className="mb-3">
              <label htmlFor="roomID" className="form-label w-100">Room ID:</label>
              <input value={roomID} onChange={(e)=>setRoomID(e.target.value)} type='text' className="form-control" id="roomID"/>
            </div>
            <div className="mb-3">
              <label htmlFor="studentName" className="form-label w-100">Your name:</label>
              <input value={studentName} onChange={(e)=>setStudentName(e.target.value)} type='text' className="form-control" id="studentName"/>
            </div>
            <div className='d-flex justify-content-center'>
              <button className='btn btn-dark mt-3' onClick={()=>{setJoinRoomModalShow(false); roomID !== '' && setInRoomModalShow(true)}}>JOIN</button>
            </div>
        </div>
      </Modal>
      <Modal show={inRoomModalShow} onHide={()=>{setInRoomModalShow(false); setRoomID(''); setStudentName('');}} dialogClassName={"fullScreenModal"}>
        {
          roomID !== '' &&
          <Room id={roomID} studentName={studentName} hideParentModal={()=>{setInRoomModalShow(false); setRoomID(''); setStudentName('');}}></Room>
        }
      </Modal>
      <Modal show={createRoomModalShow} onHide={()=>setCreateRoomModalShow(false)} dialogClassName={"fullScreenModal"}>
        {
          authenticatedUser !== '' &&
          <CreateRoom display={createRoomModalShow} username={authenticatedUser} selectedRoom={selectedRoom} showNextStepModal={()=>{setCreateRoomModalShow(false); setManageRoomModalShow(true)}}></CreateRoom>
        }
      </Modal>
      <Modal show={manageRoomModalShow} onHide={()=>setManageRoomModalShow(false)} dialogClassName={"fullScreenModal"}>
        {
          authenticatedUser !== '' &&
          <ManageRooms display={manageRoomModalShow} username={authenticatedUser} goToEditModal={goToEditModal}></ManageRooms>
        }
      </Modal>
    </div>
  );
}

export default App;
