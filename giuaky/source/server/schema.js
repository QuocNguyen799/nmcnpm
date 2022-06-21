const graphql = require('graphql');
const {
	getRoomById,
	getRoomsByUsername,
	signIn,
	getSubmissionsByRoomID,
	addRoom,
	deleteRoom,
	signUp,
	submitAssignment,
	updateRoom
} = require('./model')

const {
	GraphQLSchema,
  GraphQLObjectType,
	GraphQLInputObjectType,
	GraphQLString,
	GraphQLInt,
	GraphQLList,
	GraphQLBoolean
} = graphql;

const AnswerType = new GraphQLObjectType({
	name: 'Answer',
	fields: () => ({
		key: { type: GraphQLString },
		value: { type: GraphQLString },
		isCorrect: { type: GraphQLBoolean }
	})
})

const AssignmentType = new GraphQLObjectType({
	name: 'Assignment',
	fields: () => ({
		key: { type: GraphQLString },
		question: { type: GraphQLString },
		answers: { type: new GraphQLList(AnswerType) }
	})
})

const RoomType = new GraphQLObjectType({
	name: 'Room',
	fields: () => ({
		id: { type: GraphQLString },
		username: { type: GraphQLString },
		time: { type: GraphQLInt },
		name: { type: GraphQLString },
		description: { type: GraphQLString },
		assignment: { type: new GraphQLList(AssignmentType) }
	})
});

const SubmissionType = new GraphQLObjectType({
	name: 'Submission',
	fields: () => ({
		id: { type: GraphQLString },
		name: { type: GraphQLString },
		roomID: { type: GraphQLString },
		answers: { type: new GraphQLList(GraphQLString) }
	})
})

const RootQuery = new GraphQLObjectType({
	name: 'RootQuery',
	fields: {
		getRoomByID: {
			type: RoomType,
			args: {id: {type:GraphQLString}},
			async resolve(parent,args){
				var result = await getRoomById(args.id);
				return result
			}
		},
		getRoomsByUsername: {
			type: new GraphQLList(RoomType),
			args: {username: {type:GraphQLString}},
			async resolve(parent,args){
				var result = await getRoomsByUsername(args.username);
				return result.reverse();
			}
		},
		getSubmissionsByRoomID: {
			type: new GraphQLList(SubmissionType),
			args: { roomID: { type: GraphQLString } },
			async resolve(parent, args){
				var result = await getSubmissionsByRoomID(args.roomID);
				return result
			}
		}
	}
});

const Mutation = new GraphQLObjectType({
	name: 'Mutation',
	fields: {
		addRoom: {
			type: GraphQLBoolean,
			args: {
				username: { type: GraphQLString },
				time: { type: GraphQLInt },
				name: { type: GraphQLString },
				description: { type: GraphQLString },
				assignment: { type: GraphQLString }
			},
			resolve(parent, args) {
				let id = new Date().getTime().toString();
				let assignment = {}
				try {
					assignment = JSON.parse(args.assignment);
				} catch(err) {
					console.log(err)
				}
				var room = Object.assign(args,{id,assignment});
				addRoom(room)
				return true
			}
		},
		deleteRoom: {
			type: GraphQLBoolean,
			args: {
				id: { type: GraphQLString }
			},
			resolve(parent, args) {
				deleteRoom(args.id)
				return true
			}
		},
		signUp: {
			type: GraphQLBoolean,
			args: {
				username: { type: GraphQLString },
				password: { type: GraphQLString }
			},
			async resolve(parent, args) {
				var result = await signUp(args.username, args.password);
				return result;
			}
		},
		signIn: {
			type: GraphQLBoolean,
			args: {
				username: {type:GraphQLString},
				password: {type:GraphQLString}
			},
			async resolve(parent,args){
				var result = await signIn(args.username, args.password);
				return result
			}
		},
		submitAssignment: {
			type: GraphQLBoolean,
			args: {
				roomID: { type: GraphQLString },
				name: { type: GraphQLString },
				answers: { type: new GraphQLList(GraphQLInt) }
			},
			resolve(parent, args) {
				let id = new Date().getTime().toString();
				var assignment = Object.assign(args, {id})
				submitAssignment(assignment)
				return true
			}
		},
		updateRoom: {
			type: GraphQLBoolean,
			args: {
				id: { type: GraphQLString },
				username: { type: GraphQLString },
				time: { type: GraphQLInt },
				name: { type: GraphQLString },
				description: { type: GraphQLString },
				assignment: { type: GraphQLString }
			},
			resolve(parent, args) {
				let assignment = {}
				try {
					assignment = JSON.parse(args.assignment);
				} catch(err) {
					console.log(err)
				}
				var room = Object.assign(args,{assignment});
				updateRoom(room)
				return true
			}
		}
	}
})

module.exports = new GraphQLSchema({
	query: RootQuery,
	mutation: Mutation
});