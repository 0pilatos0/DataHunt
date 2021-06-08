var container = document.getElementById('editor');
var toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],
    ['code-block'],

    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'script': 'sub'}, { 'script': 'super' }],
    [{ 'header': [1, 2, 3, 4, false] }],

    [{ 'color': [] }, { 'background': [] }],

    ['link', 'image'],

    ['clean']
];

var quill = new Quill('#editor', {
    modules: {
        toolbar: toolbarOptions
    },
    theme: 'snow'
});

var editor = new Quill('#editor', options);

function getData() {
    let element = document.getElementById('form');
    let input = document.createElement("input");
    input.value = document.getElementsByClassName('ql-editor')[0].innerHTML;
    input.name = 'data';
    element.method = 'POST';
    element.appendChild(input);
    document.body.appendChild(element);
    element.submit();
}

function putData(title, data) {
    document.getElementById('inputTitle').value = title;
    document.getElementsByClassName('ql-editor')[0].innerHTML = data;
}