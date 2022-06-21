import React from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserSecret as solid_user_anonymos
} from '@fortawesome/free-solid-svg-icons';

const getRoomByID = gql`
  query getRoomByID($id: String!) {
    getRoomByID(id: $id) {
      name
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
const submitAssignment = gql`
	mutation submitAssignment($roomID: String! , $name: String! , $answers: [Int]!) {
		submitAssignment(roomID: $roomID, name: $name, answers: $answers)
	}
`;

var timer: NodeJS.Timeout;

function Room({id, studentName, hideParentModal}:any) {
	const [minutes, setMinutes] = React.useState<any>('00')
	const [seconds, setSeconds] = React.useState<any>('00')
	const [time, setTime] = React.useState<any>(null)
	const [startTimer, setStartTimer] = React.useState<any>(false);
	const [isAlerted, setIsAlerted] = React.useState<any>(false);
	const [task, setTask] = React.useState<any>(null);
	const [selection, setSelection] = React.useState<any>([]);
  const { loading, error, data } = useQuery(getRoomByID, {
		variables: {id}
	})

	React.useEffect(() => {
		if(data){
			if(data.getRoomByID){
				if(time == null){
					setSelection(new Array(data.getRoomByID.assignment.length).fill(-1));
					setTime(data.getRoomByID.time);
					setStartTimer(true);
				}
			} else {
				alert('Error: Room ID is not correct!');
			}
		}
  },[data]);

	const [submit, submitResult] = useMutation(submitAssignment);

	function submition () {
		var submitObject = Object.assign(
				{},
				{roomID: id},
				{name: studentName},
				{answers: selection}
			);
		submit({
			variables: submitObject
		})
	}

	React.useEffect(() => {
		if(submitResult.data && submitResult.data.submitAssignment && !isAlerted){
			hideParentModal();
			alert('Submit Successed!');
			setIsAlerted(true)
		}
		if(submitResult.error && !isAlerted) {
			hideParentModal();
			alert('Submit Failed!')
			setIsAlerted(true)
		}
  },[submitResult]);

	function onSelectAnswer (answerIndex:any, questionIndex:any) {
		var newSelection = [...selection];
		newSelection[questionIndex]=answerIndex;
		setSelection(newSelection);
	}

	
	React.useEffect(() => {
		if(startTimer) {
			setTimeout(() => {
				if(time > 0) {
					let min = Math.floor(time/60);
					let minString = min >= 10 ? min.toString() : '0' + min; 
					setMinutes(minString)
					let sec = time - 60 * min;
					let secString = sec >= 10 ? sec.toString() : '0' + sec; 
					setSeconds(secString)
					setTime(time-1)
				}
				if(time <= 0) {
					submition();
					clearInterval(timer)
				}
			}, 1000);
		}
	},[startTimer, time])

	function tick () {
		console.log(time)
		if(time > 0) {
			let min = Math.floor(time/60);
			let minString = min >= 10 ? min.toString() : '0' + min; 
			setMinutes(minString)
			let sec = time - 60 * min;
			let secString = sec >= 10 ? sec.toString() : '0' + sec; 
			setSeconds(secString)
			setTime(time-1)
		}
		if(time <= 0) {
			submition();
			clearInterval(timer)
		}
	}

  if (loading) return <p>Loading...</p>;
  if (error || !data.getRoomByID) {
		hideParentModal()
		return <p>Error :(</p>;
	}
	return (
		<div className='row m-0 h-100'>
			<div className='col-7'>
				<div className='p-3'>
					<div className='d-flex justify-content-center align-items-center'>
						<FontAwesomeIcon icon={solid_user_anonymos} size='2x'/>
						<p className='my-0 mx-2'><strong>{studentName}</strong></p>
					</div>
					{
						task && (
							<div>
								<h1 className='lead' style={{fontSize:30}}>Question {task.index +1}: </h1>
								<h1>{task.question}</h1>
								<div className='mt-4 ps-3'>
									{task.answers.map((answer: any, answerIndex: any) => {
										return (
											<div className="form-check" key={answer.key}>
												<input checked={answerIndex === selection[task.index]} onChange={()=>onSelectAnswer(answerIndex,task.index)} className="form-check-input" type="radio" name={"question"+task.index} id={"radio"+answerIndex}/>
												<label className="form-check-label w-100" htmlFor={"radio"+answerIndex} style={{height:50}}>
													{answer.value}
												</label>
											</div>
										)
									})}
								</div>
							</div>
						)
					}
				</div>
			</div>
			<div className='col-5 bg-warning p-3' style={{minHeight:'100vh'}}>
				<div className='d-flex justify-content-between'>
					<h1 className='lead' style={{fontSize:40}}>{data.getRoomByID.name}</h1>
					<div className='px-4'>
						<h1>{minutes}:{seconds}</h1>
						{
							submitResult.loading
							? <p>Submitting...</p>
							: <button onClick={()=>submition()} className='btn btn-success w-100'>FINISH</button>
						}
					</div>
				</div>
				<div className='p-4 w-100'>
						<div className='p-2 border-start border-dark'>
							{
								data.getRoomByID.assignment.map((task: any, index: any)=> {
									return (
										<button key={task.key} onClick={()=>{setTask(Object.assign({},task,{index: index}))}}
											className={'btn btn-light my-2 border-top-0 border-start-0 border-end-0 mx-2 ' + (selection[index] == -1 ? 'border-danger' : 'border-success')}
											style={{borderWidth:8}}>{index + 1}</button>
									);
								})
							}
						</div>
				</div>
				<div className='d-flex'>
						<p className='mr-5 lead'><strong className='mr-5'>Description: </strong></p>
						<div className='flex-grow-1 ps-3'>
							<p className='lead'>{data.getRoomByID.description}</p>
						</div>
				</div>
			</div>
		</div>
	)
}

export default Room