import 'antd/dist/antd.min.css';
import { useState } from 'react';
import Chat from './components/Chat/Chat';
import Login from './components/Login/Login';
import './main.css';

const App = () => {
    const [authorized, setAuthorized] = useState(false)
    const [username, setUsername] = useState()

    return (
        <>
            {authorized ? <Chat username={username}/> : <Login setAuthorized={setAuthorized} setUsername={setUsername}/>}
        </>
    );
};

export default App;
