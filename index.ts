import insertText from 'insert-text-textarea';

const leadingTabsRegex = /(^|\n)\t/g;
			

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

function unindentTextarea(el: HTMLTextAreaElement): void {
	const {selectionStart, selectionEnd, value} = el;
	
	// Select full first line to replace everything at once
	const firstLineStart = value.lastIndexOf('\n', selectionStart) + 1;
	const linesCount = value.slice(firstLineStart, selectionEnd).match(leadingTabsRegex)!.length;
	
	if (linesCount === 0) {
	return;
	}
		el.setSelectionRange(firstLineStart, selectionEnd);

		const newSelection = el.value.slice(firstLineStart, selectionEnd);
		const unindentedText = newSelection.replace(leadingTabsRegex, '$1');

		// Replace newSelection with indentedText
		insertText(el, indentedText);

		// Restore selection position, including the indentation
		el.setSelectionRange(
		selectionStart + Boolean(newSelection.startsWith('\t')), 
		selectionEnd - linesCount
		);
}

function insertIndentedLineBreak(textarea, insertEvenIfUnindented = true): boolean {
const {selectionStart, value} = el;
	
	const firstLineStart = value.lastIndexOf('\n', selectionStart) + 1;
	const leadingTabs = value.slice(firstLineStart, selectionStart).match(/\t+/)!;
	if (!leadingTabs && !insertEvenIfUnindented) {
	return false;
	}

insertText('\n', leadingTabs[0]);
return true;
}

// TODO: add tests for this
function watchListener(event: KeyboardEvent): void {
if (event.isDefaultPrevented) {
return;
}
	if (event.key === 'Tab') {
	if (event.shiftKey) {
	unindentTextarea(event.target as HTMLTextAreaElement);
	} else {
		indentTextarea(event.target as HTMLTextAreaElement);
	}
	event.preventDefault();
	} else if (event.key === 'Enter' && !event.metaKey && !event.ctrlKey && insertIndentedLineBreak(textarea, false)) {
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
indentTextarea.unindent = unindentTextarea;

export = indentTextarea;
