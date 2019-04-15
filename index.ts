import insertText from 'insert-text-textarea';

function indentTextarea(el: HTMLTextAreaElement): void {
	const {selectionStart, selectionEnd, value} = el;
	const linesCount = value.slice(selectionStart, selectionEnd).match(/^|\n/g)!.length;

	if (linesCount > 1) {
		// Select full first line to replace everything at once
		const firstLineStart = value.lastIndexOf('\n', selectionStart) + 1;
		el.setSelectionRange(firstLineStart, selectionEnd);

		const newSelection = el.value.slice(firstLineStart, selectionEnd);
		const indentedText = newSelection.replace(
			/^|\n/g, // Match all line starts
			'$&\t'
		);

		// Replace newSelection with indentedText
		insertText(el, indentedText);

		// Restore selection position, including the indentation
		el.setSelectionRange(selectionStart + 1, selectionEnd + linesCount);
	} else {
		insertText(el, '\t');
	}
}

function watchListener(event: KeyboardEvent): void {
	if (event.key === 'Tab' && !event.shiftKey) {
		indentTextarea(event.target as HTMLTextAreaElement);
		event.preventDefault();
	}
}

type WatchableElements =
	| string
	| HTMLTextAreaElement
	| Iterable<HTMLTextAreaElement>;

function watchField(elements: WatchableElements): void {
	if (typeof elements === 'string') {
		elements = document.querySelectorAll(elements);
	} else if (elements instanceof HTMLTextAreaElement) {
		elements = [elements];
	}

	for (const element of elements) {
		element.addEventListener('keydown', watchListener);
	}
}

indentTextarea.watch = watchField;

module.exports = indentTextarea;
export default indentTextarea;
