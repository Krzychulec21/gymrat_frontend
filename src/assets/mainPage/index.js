// src/assets/mainPage/index.js
const images = require.context('./', false, /\.(png|jpe?g|svg)$/);

const imagePaths = images.keys().reduce((acc, imagePath) => {
    const imageName = imagePath.replace('./', '').replace(/\.\w+$/, ''); // Usuń './' oraz rozszerzenie
    acc[imageName] = images(imagePath);
    return acc;
}, {});

export default imagePaths;
