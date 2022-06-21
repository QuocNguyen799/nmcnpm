import React, { useEffect } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';

const getSubmissionsByRoomID = gql`
  query getSubmissionsByRoomID($roomID: String!) {
    getSubmissionsByRoomID(roomID: $roomID) {
      name
			answers
    }
  }
`;

function Submission({roomID, assignment}:any) {
  const { loading, error, data, refetch } = useQuery(getSubmissionsByRoomID, {
		variables: {roomID}
	})

	const [result, setResult] = React.useState<any>([])

	React.useEffect(()=>{
		if(data && data.getSubmissionsByRoomID) {
			setResult([]);
			let newResult:any = [];
			data.getSubmissionsByRoomID.map((submitedObject:any)=>{
				let totalCorrect = 0;
				submitedObject.answers.map((selected:any, index:any)=>{
					if(assignment[index].answers[selected] && assignment[index].answers[selected].isCorrect){
						totalCorrect++
					}
				})
				newResult.push({
					key: newResult.length,
					name: submitedObject.name,
					correct: `${totalCorrect} / ${assignment.length}`
				})
			})
			setResult(newResult);
		}
	},[data])

	React.useEffect(()=>{
		refetch()
	},[roomID])

  if (loading) return <h1>Loading...</h1>;
  if (error) return <p>Error :(</p>;

	return (
		<table className='table table-striped'>
			<thead>
				<tr>
					<th>Name</th>
					<th>Correct Answer</th>
				</tr>
			</thead>
			<tbody>
				{
					result.map((row:any)=>{
						return(
							<tr key={row.key}>
								<td>{row.name}</td>
								<td>{row.correct}</td>
							</tr>
						)
					})
				}
			</tbody>
		</table>
	)
}

export default Submission;