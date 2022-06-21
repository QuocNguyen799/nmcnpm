const CosmosClient = require('@azure/cosmos').CosmosClient;
const config = {
	endpoint: 'https://localhost:8081',
	key: 'C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==',
	databaseID: 'CSDLNC',
	containerID: {
        rooms: 'rooms',
        users: 'users',
        submissions: 'submissions'
    }
}
const {endpoint, key, databaseID, containerID} = config;
const client = new CosmosClient({endpoint, key});
const database = client.database(databaseID);
const roomContainer = database.container(containerID.rooms);
const userContainer = database.container(containerID.users);
const submissionContainer = database.container(containerID.submissions);

async function getRoomById(id) {
    let querySpec = {
        query: `SELECT * from c where c.id ="${id}"`
    }
	const { resources: items } = await roomContainer.items.query(querySpec).fetchAll();
    return items[0];
}

async function getRoomsByUsername(username) {
    let querySpec = {
        query: `SELECT * from c where c.username ="${username}"`
    }
	const { resources: items } = await roomContainer.items.query(querySpec).fetchAll();
    return items;
}

async function signIn(username, password) {
    let querySpec = {
        query: `SELECT * from c where c.username ="${username}" and c.password="${password}"`
    }
	const { resources: items } = await userContainer.items.query(querySpec).fetchAll();
    return items.length > 0;
}

async function getSubmissionsByRoomID(roomID) {
    let querySpec = {
        query: `SELECT * from c where c.roomID ="${roomID}"`
    }
	const { resources: items } = await submissionContainer.items.query(querySpec).fetchAll();
    return items;
}

async function addRoom(room) {
	await roomContainer.items.upsert(room);
}

async function deleteRoom(roomID) {
	await roomContainer.item(roomID).delete();
}

async function signUp(username, password) {
    let querySpec = {
        query: `SELECT * from c where c.username ="${username}"`
    }
	const { resources: items } = await userContainer.items.query(querySpec).fetchAll();
    if(items.length > 0) {
        return false;
    }
	await userContainer.items.upsert({username, password});
    return true;
}

async function submitAssignment(assignment) {
	await submissionContainer.items.upsert(assignment);
}

async function updateRoom(room) {
	await roomContainer.item(room.id).replace(room);
}

module.exports = {
    getRoomById,
    getRoomsByUsername,
    signIn,
    getSubmissionsByRoomID,
    addRoom,
    deleteRoom,
    signUp,
    submitAssignment,
    updateRoom
}