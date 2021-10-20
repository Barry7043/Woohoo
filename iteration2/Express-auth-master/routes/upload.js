const express = require('express');
const router = express.Router();
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const MD5 = require("md5");
const baseUrl = "http://127.0.0.1:3005"

const formidable = require('formidable');

// 上传文件的大小 file size
const condition = {
    logo: {
        path: "/logo",
        size: 1 * 1024 * 1024, // 1M
        type: [".jpeg", ".webp", ".png", ".gif", ".jpg"]
    },
    video: {
        path: "/video",
        size: 20 * 1024 * 1024, // 20M
        type: [".mp4", ".3gp", ".flv", ".avi", ".mov", ".rm"]
    },
    audio: {
        path: "/audio",
        size: 5 * 1024 * 1024, // 5M
        type: [".mp3", ".cda", ".wav", ".wma", ".ogg", ".flac"]
    },
    image: {
        path: "/images",
        size: 5 * 1024 * 1024, // 5M
        type: [".jpeg", ".webp", ".png", ".gif", ".jpg"]
    }
}


var uploadStatus = true; // 上传状态 true通过 false失败
var uploadMessage = ""; // 上传状态信息提示
var filePath = "";
var storage = multer.diskStorage({
    destination: (req, file, callback) => {
        var type = req.body.type;
        var distPath = condition[type].path;
        filePath = "http://" + req.headers.host + distPath;
        const tempPath = path.resolve(__dirname, "../workImgs" + distPath);
        const isExist = fs.existsSync(tempPath)
        console.log(isExist)
        if (!isExist) {
            fs.mkdirSync(tempPath, (err) => {
                if (err) {
                    console.log(err)
                    uploadStatus = false
                    uploadMessage = "路径解析失败，请联系管理员"
                    return callback(null)
                }
            })
        }
        callback(null, tempPath)
    },
    filename: (req, file, callback) => {
        var now = Date.now();
        var fileName = file.originalname.substr(0, file.originalname.lastIndexOf("."));
        var fileType = file.originalname.substr(file.originalname.lastIndexOf("."));
        var newName = MD5(now + fileName) + fileType
        filePath += "/" + newName;
        callback(null, newName)
    },
});

var fileFilter = (req, file, callback) => {
    var type = req.body.type;
    var fileTypeList = condition[type] && condition[type].type;
    if (!fileTypeList) {
        uploadStatus = false
        uploadMessage = "Upload Failed: wrong type"
        return callback(null);
    }
    var fileType = file.originalname.substr(file.originalname.lastIndexOf("."));
    // 判断是否格式出错
    if (fileTypeList.indexOf(fileType.toLowerCase()) == -1) {
        uploadStatus = false
        uploadMessage = "Upload Failed: wrong images format"
        return callback(null);
    }
    callback(null, file)
}

var upload = multer({
    storage: storage,
    fileFilter: fileFilter,
})

router.post("/uploadFile", upload.single("file"), (req, res, next) => {
    var type = req.body.type;
    var size = condition[type].size;
    var filePath = condition[type].path;
    if (!req.file) {
        return res.send({
            code: 201,
            message: "Upload Failed: wrong variable type",
            data: null
        })
    }
    if (req.file.size > size) {
        fs.unlinkSync(req.file.path)
        return res.send({
            code: 201,
            message: "Upload Failed: file size cannot larger than " + size / 1024 + "K",
            data: null
        })
    }
    res.send({
        code: 200,
        message: "Upload Successed",
        data: baseUrl + filePath + "/" + req.file.filename
    })
})

// wangEditor 的上传图片接口
router.post("/editor-upload", (req, res, next) => {
    // 使用第三方的 formidable 插件初始化一个 form 对象
    var form = new formidable.IncomingForm();
    // wangEditor_uploadImg_assist.html 页面的url地址
    var assitUrl = baseUrl;

    // 处理 request
    form.parse(req, function (err, fields, files) {
        var uploadfoldername = fields.userId || "";
        if (!uploadfoldername) {
            return res.send({ errno: 201, message: "Missing User Info." })
        }
        var uploadfolderpath = path.resolve(__dirname, "../workImgs/user-" + uploadfoldername);
        const isExist = fs.existsSync(uploadfolderpath)
        if (!isExist) {
            fs.mkdirSync(uploadfolderpath, (err) => {
                if (err) {
                    console.log(err)
                    return res.send({ errno: 201, message: "Wrong Path" })
                }
            })
        }

        if (err) {
            console.log('formidable, form.parse err');
            return res.send({ errno: 201, message: "Upload Failed" });
        }

        var file = files['file'];
        // formidable 会将上传的文件存储为一个临时文件，现在获取这个文件的目录
        var tempfilepath = file.path;
        // 获取文件类型
        var type = file.type;

        // 获取文件名，并根据文件名获取扩展名
        var filename = file.name;
        var extname = filename.lastIndexOf('.') >= 0 ?
            filename.slice(filename.lastIndexOf('.') - filename.length) :
            '';
        // 文件名没有扩展名时候，则从文件类型中取扩展名（如粘贴图片时）
        if (extname === '' && type.indexOf('/') >= 0) {
            extname = '.' + type.split('/')[1];
        }
        // 将文件名重新赋值为一个随机数（避免文件重名）
        filename = Math.random().toString().slice(2) + extname;

        // 构建将要存储的文件的路径
        var filenewpath = uploadfolderpath + '/' + filename;

        // 将临时文件保存为正式的文件
        // fs.rename(tempfilepath, filenewpath, function(err) {
        //     // 存储结果
        //     var imgUrl = '';

        //     if (err) {
        //             // 发生错误
        //         console.log('fs.rename err');
        //         console.log(err)
        //         res.send({ errno: 201, message: "Upload Failed: files transform error" })
        //     } else {
        //         // 保存成功
        //         console.log('fs.rename done');
        //         // 拼接图片url地址
        //         imgUrl = assitUrl + "/user-" + uploadfoldername + '/' + filename;
        //         res.send({ errno: 0, message: "Upload Successed", data: [imgUrl] })
        //     }
        // });
        var readStream = fs.createReadStream(tempfilepath);
        var writeStream = fs.createWriteStream(uploadfolderpath + '/' + filename);
        readStream.pipe(writeStream);
        readStream.on('end', function () {
            fs.unlinkSync(tempfilepath);
            imgUrl = assitUrl + "/user-" + uploadfoldername + '/' + filename;
            res.send({ errno: 0, message: "Upload Successed", data: [imgUrl] })
        });
        readStream.on('error', function () {
            fs.unlinkSync(tempfilepath);
            res.send({ errno: 201, message: "Upload Failed" })
        });
    });
})

module.exports = router
