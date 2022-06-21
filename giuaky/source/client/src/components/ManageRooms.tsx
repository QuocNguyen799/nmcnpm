import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { gql, useQuery, useMutation } from '@apollo/client';
import {
  faPenAlt as solid_pen,
  faTrash as solid_trash
} from '@fortawesome/free-solid-svg-icons';

import Submission from './Submission';


const getRoomsByUsername = gql`
  query getRoomsByUsername($username: String!) {
    getRoomsByUsername(username: $username) {
			id
      name
			username
			time
			description
			assignment{
				key
				question
				answers{
					key
					value
					isCorrect
				}
			}
    }
  }
`;

const deleteRoomRequest = gql`
	mutation deleteRoom($id: String!) {
		deleteRoom(id: $id)
	}
`;

function ManageRooms({display, username, goToEditModal}:any) {
	const [selectedRoom, setSelectedRoom] = useState<any>(null)

  const { loading, error, data, refetch } = useQuery(getRoomsByUsername, {
		variables: {username}
	})
	
	const [deteleRoom, deleteRoomResult] = useMutation(deleteRoomRequest);

	useEffect(()=>{
		if(deleteRoomResult.data && deleteRoomResult.data.deleteRoom) {
			refetch()
		}
	},[deleteRoomResult.data])

	useEffect(()=>{
		if(display) {
			refetch()
		}
	},[display])
	
  if (loading) return <h1>Loading...</h1>;
  if (error){
		console.log(error);
		return <p>Error :(</p>;
	} 
	return (
		<div className='row m-0 h-100' style={{minHeight:'100vh'}}>
			<div className='col-5 bg-primary text-white'>
				<div className='py-3 px-5'>
					<h1>MANAGE ROOMS</h1>
					{
						data.getRoomsByUsername.map((room:any, roomIndex:any)=>{
							return(
								<div className='mt-3 p-3 bg-white w-100 d-flex' key={room.id}>
									<button onClick={()=>setSelectedRoom(room)} className='flex-grow-1 btn btn-transparent text-start'>
										<div className='d-flex'>
											<p className='m-0' style={{width:70}}><strong>Key: </strong></p>
											<p className='m-0'>{room.id}</p>
										</div>
										<div className='d-flex'>
											<p className='m-0' style={{width:70}}><strong>Name: </strong></p>
											<p className='m-0'>{room.name}</p>
										</div>
									</button>
									<button onClick={()=>goToEditModal(room)} className='btn btn-transparent border-0 text-info'>
										<FontAwesomeIcon icon={solid_pen} size='2x'/>
									</button>
									<button onClick={()=>{deteleRoom({variables:{id: room.id}})}} className='btn btn-transparent border-0 text-danger'>
										<FontAwesomeIcon icon={solid_trash} size='2x'/>
									</button>
								</div>
							)
						})
					}
				</div>
			</div>
			{
				selectedRoom &&
					<div className='col-7 p-3 lead'>
						<div className='d-flex'>
							<p style={{width:110}}><strong>Key: </strong></p>
							<p>{selectedRoom.id}</p>
						</div>
						<div className='d-flex'>
							<p style={{width:110}}><strong>Name: </strong></p>
							<p>{selectedRoom.name}</p>
						</div>
						<div className='d-flex'>
							<p style={{width:110}}><strong>Time: </strong></p>
							<p>{selectedRoom.time}( seconds)</p>
						</div>
						<div className='d-flex'>
							<p style={{width:110}}><strong>Description: </strong></p>
							<p>{selectedRoom.description}</p>
						</div>
						<div>
							<p style={{width:70}}><strong>Submissions: </strong></p>
							<Submission roomID={selectedRoom.id} assignment={selectedRoom.assignment}></Submission>
						</div>
					</div>
			}
		</div>
	)
}

export default ManageRooms