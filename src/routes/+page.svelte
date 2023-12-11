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

					return async ({ update }) => {
						await update();
					};
				}}>
					<input type="hidden" name="id" value={todo.id} />

					<!-- Bind input value to todo.description which is binded to span's text -->
					<input type="hidden" name="description" bind:value={todo.description} />

					<!-- When span loses focus, invoke the "?/update" action -->
					<span id="todoItem" contenteditable="true" on:blur={invokeUpdate} bind:innerHTML={todo.description}>{todo.description}</span>

					<!-- Remove todo.id from deleting array upon click -->
					<button aria-label="Mark as complete" on:click={() => deleting = deleting.filter((id) => id !== todo.id)}/>
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
