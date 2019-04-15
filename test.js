const test = require('tape');
const indent = require('.');

function getField = (value = '', start, end) {
	const field = document.createElement('textarea');
	field.value = value;
	document.body.append(field);
	if (end !== undefined) {
		field.selectionStart = start;
		field.selectionEnd = end;
	}

	return field;
};

function getSelection (field) {
return [
field.selectionStart,
field.value.slice(field.selectionStart, field.selectionEnd)
];
}

test('insert tab in empty field', t => {
	const textarea = getField();
	t.equal(textarea.value, '');
	indent(textarea);
	t.equal(textarea.value, '\t');
	indent(textarea);
	t.equal(textarea.value, '\t\t');
	t.deepEqual(getSelection(textarea), [2, '']);
	t.end();
});

test('insert tab in filled field', t => {
	const textarea = getField('hello');
	t.equal(textarea.value, 'hello');
	indent(textarea);
	t.equal(textarea.value, 'hello\t');
	t.equal(textarea.selectionStart, 6);
	t.equal(textarea.selectionEnd, 6);
	t.end();
});

test('insert tab and replace selection', t => {
	const textarea = getField('hello', 0, 4);
	indent(textarea);
	t.equal(textarea.value, '\to');
	t.equal(textarea.selectionStart, 1);
	t.equal(textarea.selectionEnd, 1);
	t.end();
});

test('insert tab on every selected line', t => {
	let textarea = getField('a\nb\nc', 0, 3);
	indent(textarea);
	t.equal(textarea.value, '\ta\n\tb\nc');
	t.equal(textarea.selectionStart, 1); // Before 'a'
	t.equal(textarea.selectionEnd, 5); // After 'b'

	indent(textarea);
	t.equal(textarea.value, '\t\ta\n\t\tb\nc');
	t.equal(textarea.selectionStart, 2); // Before 'a'
	t.equal(textarea.selectionEnd, 7); // After 'b'

	indent.unindent(textarea);
	t.equal(textarea.value, '\ta\n\tb\nc');
	t.equal(textarea.selectionStart, 1); // Before 'a'
	t.equal(textarea.selectionEnd, 5); // After 'b'
	
	
	textarea = getField('a\nb\nc', 3, 5);
	indent(textarea);
	t.equal(textarea.value, 'a\n\tb\n\tc');
	t.deepEqual(getSelection(textarea), [1, '\b\n\\tc']); 
	
	textarea = getField('a\n\tb', 0, 3);
	indent.unindent(textarea);
	t.equal(textarea.value, 'a\n\b');
	t.deepEqual(getSelection(textarea), [0, '\n']); 
	
	indent.unindent(textarea);
	t.equal(textarea.value, 'a\n\b');
	t.deepEqual(getSelection(textarea), [0, '\n']); 

	t.end();
});

test('insert indented line break', t => {
	let textarea = getField('');
	insertLineBreak(textarea);
	t.equal(textarea.value, '\n');
	t.deepEqual(getSelection(textarea), [1, '']);
	
	insertLineBreak(textarea);
	t.equal(textarea.value, '\n\n');
	t.deepEqual(getSelection(textarea), [2, '']); 
	
	insertLineBreak(textarea, false);
	t.equal(textarea.value, '\n\n');
	t.deepEqual(getSelection(textarea), [2, '']); 

	textarea = getField('a\n\tb');
	insertLineBreak(textarea);
	t.equal(textarea.value, 'a\n\tb\n\t');
	t.deepEqual(getSelection(textarea), [6, '']);
	
	insertLineBreak(textarea);
	t.equal(textarea.value, 'a\n\tb\n\t\n\t');
	t.deepEqual(getSelection(textarea), [8, '']); 
	
	insertLineBreak(textarea, false);
	t.equal(textarea.value, 'a\n\tb\n\t\n\t\n\t');
	t.deepEqual(getSelection(textarea), [10, '']); 
	

	t.end();
});
