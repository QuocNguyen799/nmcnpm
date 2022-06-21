import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMinusSquare as regular_remove_question,
  faTimesCircle as regular_remove_answer
} from '@fortawesome/free-regular-svg-icons';

import { gql, useQuery, useMutation } from '@apollo/client';


const addRoomRequest = gql`
	mutation addRoom($username: String!, $time: Int, $name: String!, $description: String!, $assignment: String!) {
		addRoom(username: $username, time: $time, name: $name, description: $description, assignment: $assignment)
	}
`;

const updateRoomRequest = gql`
	mutation updateRoom($id: String!, $username: String!, $time: Int, $name: String!, $description: String!, $assignment: String!) {
		updateRoom(id: $id, username: $username, time: $time, name: $name, description: $description, assignment: $assignment)
	}
`;

var initAnswers = {
	key: 'answer' + new Date().getTime(),
	value: '',
	isCorrect: false
}
var initQuestion = {
	key: 'question' + new Date().getTime(),
	question: '',
	answers: [{...initAnswers,isCorrect: true}]
}

function CreateRoom({display, username, selectedRoom, showNextStepModal}:any) {
	const [isAlerted, setIsAlerted] = React.useState(false);
	
	const [addRoom, addRoomResult] = useMutation(addRoomRequest);
	const [updateRoom, updateRoomResult] = useMutation(updateRoomRequest);

	useEffect(()=>{
		if(selectedRoom) {
			setRoomName(selectedRoom.name);
			setDescription(selectedRoom.description);
			setTime(selectedRoom.time);
			setAssignment(JSON.parse(JSON.stringify(selectedRoom.assignment)));
		} else {
			setAssignment([{...initQuestion}])
		}
	},[display])

	function onSubmit() {
		setIsAlerted(false);
		if(selectedRoom){
			updateRoom({
				variables: Object.assign(
					{},
					{
						id: selectedRoom.id,
						username: username,
						time: parseInt(time),
						name: roomName,
						description: description,
						assignment: JSON.stringify(assignment)
					}
				)
			})
		} else {
			addRoom({
				variables: Object.assign(
					{},
					{
						username: username,
						time: parseInt(time),
						name: roomName,
						description: description,
						assignment: JSON.stringify(assignment)
					}
				)
			})
		}
	}

	React.useEffect(()=>{
		console.log(addRoomResult)
		if(addRoomResult.data && addRoomResult.data.addRoom && !isAlerted) {
			alert('Success');
			setIsAlerted(true);
			showNextStepModal();
		}
		if(addRoomResult.error) {
			alert('Error' + addRoomResult.error);
			setIsAlerted(true);
		}
	},[addRoomResult])

	React.useEffect(()=>{
		console.log(updateRoomResult)
		if(updateRoomResult.data && updateRoomResult.data.updateRoom && !isAlerted) {
			alert('Success');
			setIsAlerted(true);
			showNextStepModal();
		}
		if(updateRoomResult.error) {
			alert('Error' + updateRoomResult.error);
			setIsAlerted(true);
		}
	},[updateRoomResult])

	const [roomName, setRoomName] = React.useState('');
	const [description, setDescription] = React.useState('');
	const [time, setTime] = React.useState('');

	function onInputTime(value:any) {
		let regex = new RegExp('^(0|[1-9][0-9]*|[1-9][0-9]{0,2}(,[0-9]{3,3})*)$')
		if(value[0]!='0' && (value == '' || regex.test(value))){
			setTime(value);
			return true;
		}
		return false

	}

  const [assignment, setAssignment] = React.useState<any>([{...initQuestion}]);

	function onInputQuestion(value:any, questionIndex:any) {
		let newAssignment = Object.assign([],assignment);
		newAssignment[questionIndex].question = value;
		setAssignment(newAssignment);
	}
	function onInputAnswer(value:any, questionIndex:any, answerIndex:any) {
		console.log(assignment)
		let newAssignment = Object.assign([],assignment);
		newAssignment[questionIndex].answers[answerIndex].value = value;
		setAssignment(newAssignment);
	}
	function onSelectAnswer(questionIndex:any, answerIndex:any) {
		var newAssignment = Object.assign([],assignment);
		let {answers} = newAssignment[questionIndex];
		for (let i = 0; i < answers.length; i++) {
			i == answerIndex ? answers[i].isCorrect = true : answers[i].isCorrect = false
		}
		setAssignment(newAssignment);
		console.log(newAssignment)
	}
	function addQuestion() {
		let newAssignment = Object.assign([],assignment);
		initQuestion.key = 'question' +  new Date().getTime();
		let newInitAnswer = {...initAnswers}
		newInitAnswer.key = 'answer' +  new Date().getTime();
		initQuestion.answers = [{...newInitAnswer, isCorrect: true}]
		newAssignment.push(Object.assign({},initQuestion))
		setAssignment(newAssignment);
	}
	function deleteQuestion(indexQuestion:any) {
		let newAssignment = Object.assign([],assignment);
		newAssignment.splice(indexQuestion,1)
		setAssignment(newAssignment);
	}
	function addAnswer(indexQuestion:any) {
		let newAssignment = Object.assign([],assignment);
		let newInitAnswer = {...initAnswers}
		newInitAnswer.key = 'answer' +  new Date().getTime();
		newAssignment[indexQuestion].answers.push(newInitAnswer);
		setAssignment(newAssignment);
	}
	return (
		<div className='p-5'>
			<h1 className='mb-3'>
				{
					selectedRoom ? 'UPDATE ROOM' : 'CREATE NEW ROOM'
				}
			</h1>
			<div className="mb-3 col-7">
				<label htmlFor="key" className="form-label w-100">Key:</label>
				<input type="text" disabled value={selectedRoom ? selectedRoom.id : ''} className="form-control" id="key"/>
			</div>
			<div className="mb-3 col-7">
				<label htmlFor="roomName" className="form-label w-100">Name:</label>
				<input type="text" value={roomName} onChange={(e)=>setRoomName(e.target.value)} className="form-control" id="roomName"/>
			</div>
			<div className="mb-3 col-7">
				<label htmlFor="description" className="form-label w-100">Description:</label>
				<input type="text" value={description} onChange={(e)=>setDescription(e.target.value)} className="form-control" id="description"/>
			</div>
			<div className="mb-3 col-7">
				<label htmlFor="time" className="form-label w-100">Time( seconds):</label>
				<input type="text" value={time} onChange={(e)=>onInputTime(e.target.value)} className="form-control" id="time"/>
			</div>
			<div className="mb-3">
				<label className="form-label w-100">Assignment:</label>
				{
					assignment.map((task:any, questionIndex:any) => {
						return (
							<div className='p-4 border border-dark mb-3' key={task.key}>
								<div className='d-flex align-items-center mb-3'>
									<label htmlFor={"question"+questionIndex} className="form-label" style={{width:100}}>Question {questionIndex+1}:</label>
									<div className='flex-grow-1'>
										<input value={task.question} onChange={(e)=>onInputQuestion(e.target.value, questionIndex)} type="text" className="form-control" id={"question"+questionIndex}/>
									</div>
									<button onClick={()=>deleteQuestion(questionIndex)} className='btn btn-transparent text-end' style={{marginLeft:30}}>
										<FontAwesomeIcon icon={regular_remove_question} style={{fontSize:25}} className='text-danger'/>
									</button>
								</div>
								<hr/>
								<div className='d-flex'>
										<p className="m-0" style={{width:100}}>Answers:</p>
										<div className='flex-grow-1'>
											{
												task.answers.map((answer:any, answerIndex:any) => {
													return (
														<div className='d-flex align-items-center mb-3' key={answer.key}>
															<input checked={answer.isCorrect} onChange={(e)=>onSelectAnswer(questionIndex, answerIndex)} className="form-check-input" type="radio" name={questionIndex}/>
															<input value={answer.value} onChange={(e)=>onInputAnswer(e.target.value, questionIndex, answerIndex)} type="text" className="form-control" id="roomName" style={{marginLeft:20}}/>
															<button className='btn btn-transparent text-end' style={{marginLeft:30}}>
																<FontAwesomeIcon icon={regular_remove_answer} style={{fontSize:25}} className='text-danger'/>
															</button>
														</div>
													)
												})
											}
										</div>
								</div>
								<div className='d-flex justify-content-end mt-3' style={{paddingRight:80}}>
										<button onClick={()=>addAnswer(questionIndex)} className='btn btn-warning'>ADD ANSWER</button>
								</div>
							</div>
						)
					})
				}
			</div>
			<div className='pt-4 d-flex justify-content-between'>
				<button className='btn btn-success' onClick={()=>onSubmit()}>FINISH</button>
				<button className='btn btn-primary' onClick={()=>addQuestion()}>ADD QUESTION</button>
			</div>
		</div>
	)
}

export default CreateRoom