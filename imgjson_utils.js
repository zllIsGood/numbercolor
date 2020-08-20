//imgjson_utils.js
var fs = require('fs');
var path = require('path');//
var filePaths = path.resolve('E:/zll/project/numbercolorgame/原图/imgjson');//需要遍历的文件夹
var outFilePath = path.resolve('E:/zll/project/numbercolorgame/resource/another/paintColor');//out文件夹
var files = []
String.prototype.replaceAll = function (s1, s2) {
    return this.replace(new RegExp(s1, "g"), s2);
}
let json_config = { xydata: {}, group: {} }

//调用文件遍历方法
fileDisplay(filePaths);
//文件遍历方法
function fileDisplay(filePath) {
    //根据文件路径读取文件，返回文件列表
    var ff = fs.readdirSync(filePath)
    //遍历读取到的文件列表
    ff.forEach(function (filename) {
        //获取当前文件的绝对路径
        var filedir = path.join(filePath, filename);
        //根据文件路径获取文件信息，返回一个fs.Stats对象
        var stats = fs.statSync(filedir)
        var isFile = stats.isFile();//是文件
        var isDir = stats.isDirectory();//是文件夹
        if (isFile) {
            // if (filename.lastIndexOf('.png') >= 0 || filename.lastIndexOf('.jpg') >= 0) {
            if (filename.lastIndexOf('.png') >= 0 || filename.lastIndexOf('.json') >= 0) {
                // if (filename.lastIndexOf('.json') >= 0) {
                files.push(filedir);//筛选文件类型 
            }
            // files.push(filedir)
            // console.log(filedir);
        }
        if (isDir) {
            var str1 = filedir.replace(filePaths, outFilePath)
            var str = str1.substring(0, str1.lastIndexOf('\\'))
            var ff2 = fs.readdirSync(str)
            var filedir2 = str1.substring(str1.lastIndexOf('\\') + 1)
            if (ff2.indexOf(filedir2) < 0) {
                var state = fs.mkdirSync(str1)
            }
            fileDisplay(filedir);//递归，如果是文件夹，就继续遍历该文件夹下面的文件
        }

    });
}
var len = files.length
files.forEach(function (filePathName, index) {
    console.log(index + 1, len, filePathName);
    if (filePathName.lastIndexOf('.png') >= 0) {
        /* 2 png*/
        var buff = fs.readFileSync(filePathName)
        var str = filePathName.replace(filePaths, outFilePath)
        var state = fs.writeFileSync(str, buff)
    }
    else if (filePathName.lastIndexOf('.json') >= 0) {
        /* 3 json*/
        var buff = fs.readFileSync(filePathName, { encoding: 'utf8' })
        var str = filePathName.replace(filePaths, outFilePath)
        let obj = JSON.parse(buff)
        if (obj.file && obj.file.indexOf('.png') >= 0 && obj.frames) {
            for (var i in obj.frames) {
                let item = obj.frames[i]
                save_json_config(item, i)
                item.sourceW = item.w
                item.sourceH = item.h
                item.offX = 0
                item.offY = 0
            }
            var state = fs.writeFileSync(str, JSON.stringify(obj))
        }
    }

    if (index + 1 >= len) {
        fs.writeFileSync('E:/zll/project/numbercolorgame/resource/config/config.json', JSON.stringify(json_config))
    }
})

function save_json_config(obj, name) {
    json_config.xydata[name] = {
        x: obj.offX,
        y: obj.offY,
    }
    let n = name.indexOf('_')
    if (n < 0) {
        return
    }
    let str = name.substring(0, n)
    if (json_config.group[str] == null) {
        json_config.group[str] = []
    }
    json_config.group[str].push(name)
}