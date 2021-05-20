let theEditor;

ClassicEditor
    .create(document.querySelector('#editor'), {
        toolbar: {
            items: [
                'heading', '|',
                'bold', 'italic', '|',
                'link', '|',
                'outdent', 'indent', '|',
                'bulletedList', 'numberedList', '|',
                'insertTable', '|',
                'uploadImage', 'blockQuote', '|',
                'undo', 'redo'
            ],
            shouldNotGroupWhenFull: true
        }
    })
    .then(editor => {
        theEditor = editor;
    })
    .catch(error => {
        console.error(error);
    });

function getDataFromTheEditor() {
    return theEditor.getData();
}

function getData() {
    // const data = editor.data;
    console.log(getDataFromTheEditor());
}