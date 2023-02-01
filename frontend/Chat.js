import { render, h, Fragment } from 'https://cdn.skypack.dev/preact';
import { useState, useEffect } from 'https://cdn.skypack.dev/preact/hooks';

const socket = io();

function UsernameInput({ setUsername }) {

    const [text, setText] = useState('');

    function trySubmit() {
        if (text.length == 0) {
            alert('you need to have a name!');
            return;
        }

        setUsername(text);
    }

    return (
        <div class="d-flex justify-content-center align-items-center h-100">
            <div class="p-2 d-flex flex-column border rounded">
                <h6>Enter your username:</h6>
                <input type="text" class="form-control" id="inputUsername" placeholder="user123" value={text} onChange={e => setText(e.target.value)} />
                <button type="submit" class="btn btn-primary my-3" onClick={trySubmit}>Join Chat!</button>
            </div>
        </div>
    )
}

function Chat() {

    const [username, setUsername] = useState(null);
    const [messages, setChatMessages] = useState([]);

    const [text, setText] = useState('');

    useEffect(() => {

        socket.on('usernameTaken', () => alert('username is already taken'));
        socket.on('usernameOK', name => setUsername(name));
        socket.on('chatMessage', message => setChatMessages(prev => [...prev, message]));

    }, []);

    if (!username) return <UsernameInput setUsername={username => socket.emit('checkUsername', username)} />

    function sendMessage() {
        socket.emit('chatMessage', text);
        setText('');
    }

    return (
        <div className="d-flex flex-column">
            {messages.map(v => <span>{v.sender}: {v.message}</span>)}
            <div></div>
            <input value={text} onChange={e => setText(e.target.value)} onKeyUp={e => e.key === "Enter" && sendMessage()}></input>
        </div>
    )
}

render(<Chat />, document.getElementById('app'))
