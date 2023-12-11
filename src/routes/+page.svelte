<script lang="ts">
	import { fly, slide } from 'svelte/transition';
	import { enhance } from '$app/forms'

	export let data;
	export let form;
	let htmlForm: HTMLFormElement;
	let creating = false;
	let deleting: any[] = [];

	// Invoke update action
    function invokeUpdate() {
		htmlForm.action = '?/update';
        htmlForm.requestSubmit();
    }
</script>

<div class="centered">
    <center>
        <h1>To-Do List</h1>
		<br>
    </center>

	{#if form?.error}
		<p class="error">{form.error}</p>
	{/if}

	<form method="POST" action="?/create" use:enhance={() => {
		creating = true;

		return async ({ update }) => {
			await update();
			creating = false;
		};
	}}>
		<label>
			Add Something to Do:

			<!-- ?? is nullish coalescing operator; if left val is null/undefined, return right val -->
			<input
			disabled={creating}
				name="description"
				value={form?.description ?? ''}
				autocomplete="off"
				required
			/>
		</label>
	</form>

	<ul class="todos">
		<!-- Create a new array that includes all the 'todo' items from 'data.todos' whose 'id' is not included in the 'deleting' array -->
		{#each data.todos.filter((todo) => !deleting.includes(todo.id)) as todo (todo.id)}
			<li in:fly={{ y:20 }} out:slide>
				<form bind:this={htmlForm} method="POST" action="?/delete" use:enhance={() => {
					// deleting = [...deleting, todo.id];
					// This is the callback function provided to use:enhance. 
					// It’s an asynchronous function that waits for the update function to complete, 
					// then removes the id of the current todo item from the deleting array. 
					// This could be used to update the UI immediately after a deletion, without waiting for the server to validate anything
					return async ({ update }) => {
						await update();
						// deleting = deleting.filter((id) => id !== todo.id);
					};
				}}>
					<input type="hidden" name="id" value={todo.id} />
					<input type="hidden" name="description" value={todo.description} />
					<span contenteditable="true" on:blur={invokeUpdate}>{todo.description}</span>
					<button aria-label="Mark as complete" />
				</form>
			</li>
		{/each}
	</ul>

	{#if creating}
		<span class="saving">Saving...</span>
	{/if}
</div>

<style>
	.centered {
		max-width: 25em;
		margin: 0 auto;
	}

	label {
		width: 100%;
	}

	input {
		flex: 1;
		border-color: rgba(255, 255, 255, 0.420);
	}

	span {
		flex: 1;
	}

	button {
		border: none;
		background: url(./remove.svg) no-repeat 50% 50%;
		background-size: 1rem 1rem;
		cursor: pointer;
		height: 100%;
		aspect-ratio: 1;
		opacity: 0.5;
		transition: opacity 0.2s;
	}

	button:hover {
		opacity: 1;
	}

	.saving {
		opacity: 0.5;
	}
</style>
