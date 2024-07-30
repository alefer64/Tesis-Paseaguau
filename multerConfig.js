const multer = require('multer');
const fs = require('fs'); // Módulo File System de Node.js

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Obtén el ID de usuario desde la solicitud (asegúrate de tener esta información disponible)
    const userId = req.user.id;

    // Define la carpeta de destino basada en el ID del usuario
    const userFolderPath = `uploads/${userId}/`;

    // Verifica si la carpeta de destino existe, y créala si no
    if (!fs.existsSync(userFolderPath)) {
      fs.mkdirSync(userFolderPath, { recursive: true });
    }

    // Luego, configura la carpeta de destino
    cb(null, userFolderPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
  },
});

const upload = multer({ storage });

module.exports = upload;
