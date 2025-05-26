const express = require('express');
const cors = require('cors');
const authRouter = require('./src/routers/auth.router.js');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Máy chủ đang chạy ở cổng ${PORT}`));