function indentTextarea(el: HTMLTextAreaElement): void {
	const selection = String(getSelection());
	const {selectionStart, selectionEnd, value} = el;
	const linesCount = selection.match(/^|\n/g)!.length;

	if (linesCount > 1) {
		// Select full first line to replace everything at once
		const firstLineStart = value.lastIndexOf('\n', selectionStart) + 1;
		el.setSelectionRange(firstLineStart, selectionEnd);

		const newSelection = window.getSelection().toString();
		const indentedText = newSelection.replace(
			/^|\n/g, // Match all line starts
			'$&\t'
		);

		// Replace newSelection with indentedText
		document.execCommand('insertText', false, indentedText);

		// Restore selection position, including the indentation
		el.setSelectionRange(selectionStart + 1, selectionEnd + linesCount);
	} else {
		document.execCommand('insertText', false, '\t');
	}
}

function watchListener(event: Event): void {
	const tsEvent = event as KeyboardEvent; // TODO: find a way around this ugly TypeScript workaround
	if (tsEvent.key === 'Tab' && !tsEvent.shiftKey) {
		indentTextarea(tsEvent.target as HTMLTextAreaElement);
		tsEvent.preventDefault();
	}
}

type WatchableElements =
	| string
	| HTMLTextAreaElement
	| HTMLTextAreaElement[]
	| NodeListOf<HTMLTextAreaElement>;
function watch(elements: WatchableElements): void {
	if (typeof elements === 'string') {
		elements = document.querySelectorAll(elements);
	} else if (elements instanceof HTMLTextAreaElement) {
		elements = [elements];
	}

	for (const element of elements) {
		element.addEventListener('keydown', watchListener);
	}
}

indentTextarea.watch = watch;

module.exports = indentTextarea;
export default indentTextarea;