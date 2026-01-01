const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null,"uploads/");
    },
    filename: (req,file,cb)=>{
        const uniqueName = Date.now() + "-" + Math.round(Math.random()*1e9);
        cb(null, uniqueName + path.extname(file.originalname));
    }
})

const fileFilter = (req,file,cb)=>{
    const ext = path.extname(file.originalname).toLowerCase();

    if(ext === ".zip"){
        cb(null, true);
    }else{
        cb(new Error("only ZIP files are allowed"));
    }
};

const upload = multer({
    storage,
    fileFilter,
})

module.exports = upload;