// In a real app, this data would live in a database,
// rather than in memory. But for now, we cheat.
const db = new Map();

/**
 * @param {any} userid
 */
export function getTodos(userid) {
	if (!db.get(userid)) {
		db.set(userid, [{
			id: crypto.randomUUID(),
			description: 'Learn SvelteKit'
		}]);
	}

	return db.get(userid);
}

/**
 * @param {any} userid
 * @param {any} description
 */
export function createTodo(userid, description) {
	if (description === '') {
		throw new Error('Todo must have a description!')
	}

	const todos = db.get(userid);

	// @ts-ignore
	if (todos.find((todo) => todo.description === description)) {
		throw new Error('Todos must be unique!')
	}

	todos.push({
		id: crypto.randomUUID(),
		description
	});
}

/**
 * @param {any} userid
 * @param {any} todoid
 * @param {any} description
 */
export function updateTodo(userid, todoid, description) {
	if (description === '') {
		throw new Error('Todo must have a description!')
	}

	let todos = db.get(userid);

	// @ts-ignore
	const index = todos.findIndex((todo) => todo.id === todoid);
	
	if (index !== -1) {
		todos[index].description = description
	}
	
}

/**
 * @param {any} userid
 * @param {any} todoid
 */
export function deleteTodo(userid, todoid) {
	const todos = db.get(userid);
	// @ts-ignore
	const index = todos.findIndex((todo) => todo.id === todoid);

	if (index !== -1) {
		todos.splice(index, 1);
	}
}
