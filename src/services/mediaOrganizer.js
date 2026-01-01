const fs = require("fs");
const path = require("path");

const PHOTO_EXTENTIONS = [".jpg", ".jpeg", ".png"];
const VIDEO_EXTENTIONS = [".mp4", ".mov"];

function organizeMedia(sourceDir, targetDir="organized"){
    if(!fs.existsSync(targetDir)){
        fs.mkdirSync(targetDir, {recursive: true});
    }

    function walk(currentPath){
        const items = fs.readdirSync(currentPath);

        for(const item of items){
            const fullPath = path.join(currentPath, item);
            const stat = fs.statSync(fullPath);
        

        if(stat.isDirectory()){
            walk(fullPath)
        }else{
            organizeFile(fullPath, stat);
        }
    }
}

function organizeFile(filePath, stat){
    const ext = path.extname(filepath).toLowerCase();

    let type = null;
    if(PHOTO_EXTENTIONS.includes(ext)) type="photos";
    if(VIDEO_EXTENTIONS.includes(ext)) type="videos";
    if(!type) return;
    
    const date = stat.birthtime || stat.mtime;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");

    const destDir = path.join(targetDir, type, `${year}`, month);
    fs.mkdirSync(destDir, {recursive: true});

    const destPath = path.join(destDir, path.basename(filePath));
    fs.renameSync(filePath, destPath);
}
walk(sourceDir);
}

module.exports = organizeMedia;