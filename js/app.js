window.todoStore = {
	todos: JSON.parse(localStorage.getItem("todo-store") || "[]"),

	save() {
		localStorage.setItem("todo-store", JSON.stringify(this.todos));
	},
};

window.todoApp = () => {
	return {
		...todoStore,
		newTodo: "",
		editedTodo: null,
		filter: "all",

		get active() {
			return this.todos.filter((todo) => !todo.completed);
		},

		get completed() {
			return this.todos.filter((todo) => todo.completed);
		},

		get filteredTodos() {
			return {
				all: this.todos,
				active: this.active,
				completed: this.completed,
			}[this.filter];
		},

		get allComplete() {
			return this.todos.length === this.completed.length;
		},

		create() {
			if (!this.newTodo) return;

			this.todos.push({
				id: Date.now(),
				body: this.newTodo,
				completed: false,
			});

			this.newTodo = "";

			this.save();
		},

		edit(todo) {
			todo.cachedBody = todo.body;

			this.editedTodo = todo;
		},

		update(todo) {
			if (todo.body.trim() === "") {
				this.destroy(todo);
			}

			this.editedTodo = null;

			this.save();
		},

		cancelEdit(todo) {
			todo.body = todo.cachedBody;

			this.editedTodo = null;

			delete todo.cachedBody;
		},

		destroy(todo) {
			let position = this.todos.indexOf(todo);

			this.todos.splice(position, 1);

			this.save();
		},

		toggleAllComplete() {
			let completed = this.allComplete;

			this.todos.forEach((todo) => (todo.completed = !completed));
		},

		clearCompleted() {
			this.todos = this.active;

			this.save();
		},
	};
};
