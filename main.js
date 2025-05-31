
var uiMode = "pc";
console.log(navigator.userAgent);
if ((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
    uiMode = "mobile";
    //document.head.innerHTML = '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"></meta>' + "\n" + document.head.innerHTML;
}
setStyleSheet_mode(uiMode);

fetchFileNames();

let fileUrl = 'http://202.107.226.70:667/fmsPath/HJUpgrade/UpgradeList.ini'
// let fileUrl = 'http://192.168.2.249:667' + '/fmsPath/HJUpgrade/UpgradeList.ini'
if (fileUrl) {
    fetchFileContent(fileUrl)
        .then(rlt => {
            let latestUrlTDS = getFilePath(rlt, 'TDSLatestVersion')
            // E:\FTP\JHD20\SAP-10132_WEB-1903_20250224
            // console.log(releaseUrlJHD)
            if (latestUrlTDS) {
                let latestPathTDS = convertRelativePath(latestUrlTDS)
                callRPC("fs.exploreFolder", { path: latestPathTDS }, (err, rlt) => {
                    if (rlt) {
                        let TDSLatestVersion = document.querySelector(".TDSLatestVersion").innerHTML
                        let modifiedTimeTDS = findFolderModifyTime(rlt, TDSLatestVersion)
                        document.querySelector(".generateTime").innerHTML = '   打包时间： ' + modifiedTimeTDS
                    }
                })
            }

        })
        .catch(error => {
            console.error('Error fetching file content:', error);
        });
}

function setStyleSheet_mode(mode) {
    if (mode == null)
        return;
    // 首先找到DOM中所有的link标签
    var link_list = document.getElementsByTagName("link");
    if (link_list) {
        for (var i = 0; i < link_list.length; i++) {
            // 要找到所有link中rel属性值包括style的，也就是包括stylesheet和alternate stylesheet;
            if (link_list[i].getAttribute("rel").indexOf("style") != -1) {
                if (link_list[i].getAttribute("mode") != null) {
                    link_list[i].disabled = true;
                    if (link_list[i].getAttribute("mode") == mode) {
                        link_list[i].disabled = false;
                    }
                }
            }
        }
    }

    var style_list = document.getElementsByTagName("style");
    if (style_list) {
        for (var i = 0; i < style_list.length; i++) {
            // 要找到所有link中rel属性值包括style的，也就是包括stylesheet和alternate stylesheet;
            if (style_list[i].getAttribute("mode") != null) {
                style_list[i].disabled = true;
                if (style_list[i].getAttribute("mode") == theme) {
                    style_list[i].disabled = false;
                }
            }
        }
    }
};


var host = window.location.host;
(function ($) {
    'use strict';
    //==========preloder===========
    $(window).on('load', function () {
        var preLoder = $(".preloader");
        preLoder.fadeOut(1000);
    });
    //==========fixed header & scroll to top button===========
    $(window).on('scroll', function () {
        if ($(window).scrollTop() > 300) {
            $('.bottom-header').addClass('animated fadeInDown fixed-header');
            // scroll to top button show
            $('.scroll-to-top').fadeIn();
            $('.scroll-to-top').addClass('active');
            if ($(window).width() < 992) {
                $('.bottom-header').removeClass('animated fadeInDown fixed-header');
            }
        } else {
            $('.bottom-header').removeClass('animated fadeInDown fixed-header');
            // scroll to top button show
            $('.scroll-to-top').fadeOut();
            $('.scroll-to-top').removeClass('active');
        }
    });
    $(document).ready(function () {
        //==========navi bar===========
        //var externURL = "http://47.99.199.4"; //阿里云
        //var externURL = "http://www.eecc.cc:4000"; //兰溪服务器
        var externURL = "";
        function hideAllPage() {
            $("#page_tds").css("display", "none");
            $("#page_service").css("display", "none");
            $("#page_solution").css("display", "none");
            $("#page_doc").css("display", "none");
            $("#page_download").css("display", "none");
            $("#page_contact").css("display", "none");
            $(".footer").css("display", "none");
        }
        $('#nav_tds').on("click", function () {
            hideAllPage();
            $("#page_tds").css("display", "block");
        });
        $('#nav_service').on("click", function () {
            hideAllPage();
            $("#page_service").css("display", "block");
        });
        $('#nav_solution').on("click", function () {
            hideAllPage();
            $("#page_solution").css("display", "block");
        });
        $('#nav_download').on("click", function () {
            hideAllPage();
            $("#page_download").css("display", "block");
        });
        $('#nav_docs').on("click", function () {
            hideAllPage();
            $("#page_doc").css("display", "block");
        });
        $('#nav_contact').on("click", function () {
            hideAllPage();
            $("#page_contact").css("display", "block");
        });
    });
}(jQuery));


function onClickLinkGitee() {
    window.open('https://gitee.com/liangtuSoft/tds');
}

function onClickDownload() {

}

function onClickICPBeian() {
    window.open('https://beian.miit.gov.cn/');
}

function onClickTryTds() {
    var dom = document.getElementById("customer_info_wnd");
    dom.style.left = "-6000px"
    let fileUrl = 'http://202.107.226.70:667/fmsPath/HJUpgrade/UpgradeList.ini'
    fetchFileContent(fileUrl)
        .then(rlt => {
            // console.log(rlt.data);
            let latestUrlTDS = getFilePath(rlt, 'TDSLatestVersion')
            // console.log(latestUrlTDS)
            if (latestUrlTDS) {
                latestUrlTDS = convertPathToUrl(latestUrlTDS)
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = latestUrlTDS;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            }
        })
        .catch(error => {
            console.error('Error fetching file content:', error);
        });
}

async function fetchFileContent(fileUrl) {
    try {
        const response = await fetch(fileUrl);
        if (!response.ok) {
            throw new Error(`HTTP 错误! 状态: ${response.status}, 错误信息: ${response.statusText}`);
        }
        const fileContent = await response.text();
        return fileContent;
    } catch (error) {
        throw error;
    }
}

function getFilePath(rltData, key) {
    if (!rltData || !key) {
        return '无效输入: 请提供rltData和key.';
    }
    const regex = new RegExp(`${key}=(.*?)(?=\r\n|\n|$)`, 'i');
    const match = rltData.match(regex);

    if (match) {
        return match[1].trim();
    } else {
        return null;
    }
}
function fetchFileNames() {
    const fileUrl = 'http://202.107.226.70:667/fmsPath/HJUpgrade/UpgradeList.ini';
    // const fileUrl = 'http://192.168.2.249:667' + '/fmsPath/HJUpgrade/UpgradeList.ini';)
    fetchFileContent(fileUrl)
        .then(rlt => {
            const extractAndConvertPath = (key) => {
                const path = getFilePath(rlt, key);
                return convertPathToUrl(path) ? convertPathToUrl(path).substring(convertPathToUrl(path).lastIndexOf('/') + 1) : null;
            };


            let TDSLatestVersion = extractAndConvertPath('TDSLatestVersion');
            // let generateTime = extractAndConvertPath('generateTime');
            document.querySelector(".TDSLatestVersion").innerHTML = TDSLatestVersion
        })
        .catch(error => {
            console.error('Error fetching file content:', error);
        });
}

function convertPathToUrl(localPath) {
    if (localPath) {
        // 服务器地址
        const baseUrl = 'http://202.107.226.70:667/';
        let relativePath;
        // 检查是否为绝对路径
        if (localPath.startsWith('E:\\FTP\\')) {
            // 替换根路径
            relativePath = localPath.replace('E:\\FTP\\', 'fmsPath/');
        } else {
            // 处理相对路径
            relativePath = localPath.replace(/^\\/, '');
            relativePath = relativePath.replace(/\\/g, '/');
            relativePath = 'fmsPath/' + relativePath;
        }
        const fullUrl = baseUrl + relativePath;
        return fullUrl;
    } else {
        return null;
    }
}

function convertRelativePath(releaseUrlJHD) {
    let replacedString = releaseUrlJHD.replace(/\\/g, '/');
    let lastIndex = replacedString.lastIndexOf('/');
    let directoryPath = replacedString.substring(0, lastIndex);
    if (replacedString[replacedString.length - 1] !== '/') {
        directoryPath += '/';
    }

    console.log(directoryPath);
    return directoryPath
}

function findFolderModifyTime(filesArray, folderName) {
    const foundItem = filesArray.find(item => item.name === folderName);
    if (foundItem) {
        return foundItem.modifyTime;
    } else {
        return undefined;
    }
}

function callRPC(method, params, onReturn) {
    var req = {
        method: method,
        params: params,
        id: 1,
    };

    fetch('http://202.107.226.70:667/rpc', {
        method: "POST",
        headers: {
            //  'Content-Type': 'application/json',
            "Content-Type": "text/plain",
        },
        body: JSON.stringify(req),
    })
        .then((response) => response.json())
        .then((data) => {
            onReturn(data.error, data.result);
        })
        .catch((error) => {
            // Handle any errors here
            console.log(error);

        });
}

function checkTelephone(telephone) {
    var reg = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (!reg.test(telephone)) {
        return false;
    } else {
        return true;
    }
}


function onClickGetValidationCode() {
    var dom = document.getElementById("phoneNum");
    var phoneNum = dom.value;

    if (!checkTelephone(phoneNum)) {
        showMsgBox("手机号码格式错误", "error");
        return;
    }

    var req = {
        method: "getVerifyCode",
        params: {
            phoneNum: phoneNum
        },
        id: 1
    }
    var sReq = JSON.stringify(req);
    httpReq(sReq, (txt) => {
        var resp = JSON.parse(txt);
        if (resp.result != null) {
            showMsgBox("短信发送成功", "ok");
        }
        else {
            showMsgBox("短信发送失败", "error");
        }
    })
}

function logCustomerInfo(info) {
    var req = {
        method: "db.insert",
        params: {
            tag: "试用用户信息",
            val: info
        },
        id: 1
    };
    var sReq = JSON.stringify(req);
    httpReq(sReq, (txt) => {

    });


    //	姓名:$$，公司:$$，职务:$$，行业:$$，手机:$$
    var content = info.name + "||" + info.company + "||" + info.role + "||" + info.area + "||" + info.phoneNum;
    req = {
        method: "sendShortMsg",
        params: {
            phoneNum: "18668216925",
            content: content,
            templateId: "137881"  //官网试用用户信息
        },
        id: 1
    };
    sReq = JSON.stringify(req);
    httpReq(sReq, (txt) => {

    });
}

function onClickOkCustomerInfo() {
    var dom = document.getElementById("name");
    var name = dom.value;
    dom = document.getElementById("company");
    var company = dom.value;
    dom = document.getElementById("role");
    var role = dom.value;
    dom = document.getElementById("area");
    var area = dom.value;
    dom = document.getElementById("phoneNum");
    var phoneNum = dom.value;
    dom = document.getElementById("verifyCode");
    var verifyCode = dom.value;

    var info = {
        name: name,
        company: company,
        role: role,
        area: area,
        phoneNum: phoneNum,
        verifyCode: verifyCode
    }

    if (name == "" || company == "" || role == "" || area == "" || phoneNum == "" || verifyCode == "") {
        showMsgBox("请完善您的信息", "error");
        return;
    }


    var req = {
        method: "checkVerifyCode",
        params: {
            phoneNum: phoneNum,
            verifyCode: verifyCode
        },
        id: 1
    }
    var sReq = JSON.stringify(req);
    httpReq(sReq, (txt) => {
        var resp = JSON.parse(txt);

        if (resp.result != null) {
            logCustomerInfo(info);
            showMsgBox("验证码验证成功", "ok");
            var dh = document.getElementById("downloadHelper");
            dh.href = "/release";
            dh.click();
            var dom = document.getElementById("customer_info_wnd");
            dom.style.left = "-6000px";
        }
        else {

        }
    })
}

function onClickCancelCustomerInfo() {
    var dom = document.getElementById("customer_info_wnd");
    dom.style.left = "-6000px";
}

function httpReq(reqData, callback) {
    var sReq = reqData;
    fetch("/rpc", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: sReq
    })
        .then(resp => {
            if (resp.status == 404) {
                console.log(resp.statusText);
            }
            else {
                return resp.text();
            }
        })
        .then(text => {
            callback(text);
        })
}

var msgBox = {
    fadeTime: 2000,
    timerFade: null,
    curOpacity: 100,
    stopFade: false,//鼠标移上去之后，停止fade，方便查看错误信息
    showMsgBox: function (str, type) {
        var dom = document.getElementById("msgBox");
        if (dom == null) {
            dom = document.createElement("div");
            dom.id = "msgBox";
            document.body.append(dom);
        }
        dom.onmouseover = () => {
            this.stopFade = true;
            this.curOpacity = 100;
        };
        dom.onmouseout = () => {
            this.stopFade = false;
        };
        dom.innerHTML = str;
        dom.style.display = "block";
        dom.style.opacity = "100%";
        if (type == "error")
            dom.style.backgroundColor = "rgb(200,100,100)"
        else if (type == "info")
            dom.style.backgroundColor = "rgb(100,100,200)"
        else if (type == "ok")
            dom.style.backgroundColor = "rgb(100,200,100)"

        this.curOpacity = 100;
        if (this.timerFade)
            clearInterval(this.timerFade);
        this.timerFade = setInterval(() => {
            if (this.stopFade)
                return;
            var dom = document.getElementById("msgBox");
            this.curOpacity -= 2;
            dom.style.opacity = this.curOpacity / 100.0;
            if (this.curOpacity == 0) {
                dom.style.display = "none";
                clearInterval(this.timerFade);
            }
        }, this.fadeTime / 50);
    }
}

function showMsgBox(str, type) {
    msgBox.showMsgBox(str, type);
}