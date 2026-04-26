const fs = require('fs');

async function upload() {
    const formData = new FormData();
    const blob = new Blob(['helloworld'], { type: 'text/plain' });
    formData.append('file', blob, 'test.txt');
    formData.append('uploaderId', 'admin-user');

    const res = await fetch('http://localhost:3000/api/upload', {
        method: 'POST',
        body: formData
    });

    const text = await res.text();
    console.log(res.status, text);
}

upload().catch(console.error);
