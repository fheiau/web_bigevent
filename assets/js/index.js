$(function() {
        getUserInfo();
        var layer = layui.layer;
        // 点击按钮，实现退出功能
        $('#btnLogout').on('click', function() {
            // 提示用户是否退出
            layer.confirm('是否退出当前页面?', { icon: 3, title: '提示' }, function(close) {
                //  1.清空本地存储的token
                localStorage.removeItem('token');
                // 重新跳转到登录页面
                location.href = '/login.html';
                // 关闭指定的询问框
                layer.close(index);
            });

        })
    })
    // 获取用户的基本信息
function getUserInfo() {
    $.ajax({
        method: 'get',
        url: '/my/userinfo',
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function(res) {
                // 失败则轻提醒
                if (res.status != 0) {
                    return layui.layer.msg('获取用户信息失败!');
                }
                // 否则开始渲染用户头像
                renderAvatar(res.data);
            }
            // ,
            // complete: function(res) {
            //         // console.log('执行了complete回调');
            //         console.log(res);
            //         if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            //             // 强行清空token
            //             localStorage.removeItem('token');
            //             // 强制跳转到登录页面
            //             location.href = '/login.html';
            //         }
            //     }
            //success，error，complete
            // complete无论成功和失败都会调用complete回调函数
            // 在complete回调函数中，可以使用res.responseJSON拿到服务器响应回来的数据

    })


}
// 渲染用户头像
// res.data传数据过来
function renderAvatar(user) {
    // 如果有昵称优先渲染昵称，没有再渲染用户名
    // 获取用户名称
    var name = user.nickname || user.username;
    // 设置欢迎的文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name);
    $('.text-avatar').html(name);
    // 按需渲染用户的头像，如果有图片就放图片上去，没有再用第一个字
    if (user.user_pic != null) {
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text-avatar').hide();
    } else {
        // 渲染文本头像
        $('.layui-nav-img').hide();
        var frist = name[0].toUpperCase(); //获取到第一个字符(大写)
        $('.text-avatar').html(frist).show();
    }
}