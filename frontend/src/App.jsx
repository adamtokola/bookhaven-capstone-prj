import { useEffect, useState } from 'react';

function App() {
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetch('http://localhost:5001')
            .then((response) => response.text())
            .then((data) => setMessage(data))
            .catch((error) => console.error('Error:', error));
    }, []);

    return (
        <div>
            <h1>Book Haven</h1>
            <p>{message}</p>
        </div>
    );
}

export default App;
