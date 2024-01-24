const app = require('./app');
const mongoose = require('mongoose');

const startServer = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/textifyImage');
        console.log('Connected to MongoDB');
    
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Could not connect to MongoDB: ', error);
        process.exit(1);
    }
}

startServer();
