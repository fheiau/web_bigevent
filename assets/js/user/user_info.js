$(function() {
    // 导出一个form
    var form = layui.form;
    var layer = layui.layer;
    form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                return '昵称长度必须在1~6个字符之间!';
            }
        }
    })
    initUserInfo()

    function initUserInfo() {
        $.ajax({
            method: 'get',
            url: '/my/userinfo',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败!');
                }
                console.log(res);
                // 调用   form.val()快速为表单赋值
                form.val('formUserInfo', res.data);
            }
        })
    }
    // 监听表单的提交事件
    $('.layui-form').on('submit', function(e) {
            // 阻止表单的默认提交行为
            e.preventDefault();
            $.ajax({
                method: 'post',
                url: '/my/userinfo',
                // data发送过去的数据   $(this).serialize()快速拿到需要提交的数据
                data: $(this).serialize(),
                // res返回的数据
                success: function(res) {
                    console.log(res);
                    if (res.status !== 0) {
                        return layer.msg('更新用户信息失败')
                    }
                    layer.msg('更新用户信息成功')
                        // 调用父页面中的方法，重新渲染用户的头像和用户的信息
                        // 在iframe的页面中调用index.html中的方法
                    window.parent.getUserInfo();
                }

            })
        })
        // 重置表单数据
        // 监听重置按钮的点击e
    $('#btnReset').on('click', function(e) {
        // 阻止表单的默认重置行为(不然会全部清空信息)
        e.preventDefault()
        initUserInfo()
    })
})