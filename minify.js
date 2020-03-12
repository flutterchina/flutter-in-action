let fs = require('fs');
let path = require('path');
let minify = require('html-minifier').minify;
let distDir = path.join(__dirname, './dist'); //压缩后的目录
let sourceDir = path.join(__dirname, './_book'); //项目源代码
let showCompress = true;
let no="1"
let minifyJS = showCompress ? {
    compress: {
        warnings: false,
        drop_debugger: true,
        drop_console: true
    }
} : true;//配置压缩js,showCompress为true时压缩代码并去除console,debugger控制台提示，正式发布上线可开启，否则只压缩js
deleteFolder(distDir); //清楚打包后的目录
// 清除目录
function deleteFolder(paths) {
    var files = [];
    if (fs.existsSync(paths)) {
        files = fs.readdirSync(paths);
        files.forEach(function (file, index) {
            var curPath = paths + "/" + file;
            if (fs.statSync(curPath).isDirectory()) { // recurse
                deleteFolder(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(paths);
    }
}

var copyFile = function (srcPath, tarPath, cb) {
    var rs = fs.createReadStream(srcPath)
    rs.on('error', function (err) {
        if (err) {
            console.log('read error', srcPath)
        }
        cb && cb(err)
    })

    var ws = fs.createWriteStream(tarPath)
    ws.on('error', function (err) {
        if (err) {
            console.log('write error', tarPath)
        }
        cb && cb(err)
    })
    ws.on('close', function (ex) {
        cb && cb(ex)
    })

    rs.pipe(ws)
}
var copyFolder = function (srcDir, tarDir, cb) {

    fs.readdir(srcDir, function (err, files) {
        var count = 0
        var checkEnd = function () {
            ++count == files.length && cb && cb()
        }

        if (err) {
            checkEnd()
            return
        }

        files.forEach(function (file) {
            var srcPath = path.join(srcDir, file)
            var tarPath = path.join(tarDir, file)

            fs.stat(srcPath, function (err, stats) {
                if (stats.isDirectory()) {
                    console.log('mkdir', tarPath)
                    fs.mkdir(tarPath, function (err) {
                        if (err) {
                            console.log(err)
                            return
                        }

                        copyFolder(srcPath, tarPath, checkEnd)
                    })
                } else {
                    copyFile(srcPath, tarPath, checkEnd)
                }
            })
        })

        //为空时直接回调
        files.length === 0 && cb && cb()
    })
}
//创建dist目录
function creatDir(dir) {
    return new Promise((resolve, reject) => {
        fs.mkdir(dir, function (err) {
            if (err) {
                reject(err);
            } else {
                console.log("目录创建成功。");
                resolve()

            }
        });
    })
}
creatDir(distDir).then(() => {
    copyFolder(sourceDir, distDir, function (err) {
        if (err) {
            return
        }
        console.log('处理完了');
        fileDisplay(distDir);
    });
}).catch((err) => {

});

/**
 * 文件遍历方法
 * @param filePath 需要遍历的文件路径
 */
function fileDisplay(filePath) {
    //根据文件路径读取文件，返回文件列表
    fs.readdir(filePath, function (err, files) {
        if (err) {
            console.warn(err)
        } else {
            //遍历读取到的文件列表
            files.forEach(function (filename) {
                //获取当前文件的绝对路径
                var filedir = path.join(filePath, filename);
                //根据文件路径获取文件信息，返回一个fs.Stats对象
                fs.stat(filedir, function (eror, stats) {
                    if (eror) {
                        console.warn('获取文件stats失败');
                    } else {
                        var isFile = stats.isFile(); //是文件
                        var isDir = stats.isDirectory(); //是文件夹
                        if (isFile && /\.htm/.test(filedir)) { //压缩.htm或.html文件
                            console.log(filedir);
                            fs.readFile(filedir, 'utf8', function (err, data) {
                                if (err) {
                                    throw err;
                                }
                                fs.writeFile(filedir, minify(data, { //主要压缩配置
                                    processScripts: ['text/html'],
                                    collapseWhitespace: true,
                                    minifyJS: minifyJS,
                                    minifyCSS: true,
                                    removeComments: true, //删除注释
                                    removeCommentsFromCDATA: true, //从脚本和样式删除的注释
                                }), function () {
                                    console.log('success');
                                    copyFile(filedir,filedir.replace(".html",`.${no}`));
                                });
                            });

                        }
                        if (isDir) {
                            fileDisplay(filedir); //递归，如果是文件夹，就继续遍历该文件夹下面的文件
                        }
                    }
                })
            });
        }
    });
}

