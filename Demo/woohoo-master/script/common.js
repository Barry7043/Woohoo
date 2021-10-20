// 服务器地址
const baseUrl = `http://127.0.0.1:3005`;
var userInfo = sessionStorage.getItem("userInfo") && JSON.parse(sessionStorage.getItem("userInfo"))
$.ajaxSetup({
    headers: {
        token: sessionStorage.getItem("token")
    }
});

// 未登录时，跳转到登录页面
function checkLogin() {
    if (!sessionStorage.getItem("userInfo")) {
        location.href = '/user/login.html';
        return;
    }
}
function logout() {
    sessionStorage.clear();
    localStorage.clear();
    location.reload();
}