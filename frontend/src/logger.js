const logToServer = async (message) => {
    try {
        await fetch('http://localhost:5000/log', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message }),
        });
    } catch (error) {
        console.error('Erro ao enviar log para o servidor:', error);
    }
};

const formatDate = () => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0'); 
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
};

const formatMessages = (...messages) => {
    return messages.map(message => {
        if (typeof message === 'object') {
            return JSON.stringify(message);
        }
        return String(message);
    }).join(' ');
};

const logger = {
    log: (...messages) => {
        const formattedMessage = `[${formatDate()}] ${formatMessages(...messages)}`;
        console.log(formattedMessage);
        logToServer(formattedMessage);
    },
    warn: (...messages) => {
        const formattedMessage = `[${formatDate()}] WARN: ${formatMessages(...messages)}`;
        console.warn(formattedMessage);
        logToServer(formattedMessage);
    },
    error: (...messages) => {
        const formattedMessage = `[${formatDate()}] ERROR: ${formatMessages(...messages)}`;
        console.error(formattedMessage);
        logToServer(formattedMessage);
    },
};


export default logger;