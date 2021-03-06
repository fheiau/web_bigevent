$(function() {
    var form = layui.form;
    form.verify({
            pwd: [
                /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
            ],
            // value可以拿到的是新密码框输入的值
            samePwd: function(value) {
                if (value === $('[name=oldPwd]').val()) {
                    return '新旧密码不能相同'
                }
            },
            // value可以拿到的是确认密码框输入的值
            rePwd: function(value) {
                if (value !== $('[name=newPwd]').val()) {
                    return '两次密码不一致'
                }
            }
        })
        // 监听表单提交
    $('.layui-form').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),

            success: function(res) {
                console.log(res);
                if (res.status !== 0) {
                    return layui.layer.msg('更新密码失败! ');
                } else {
                    layui.layer.msg('更新密码成功! 请你重新登录');

                }
                // 调用reset()原生的才能调用， $('.layui-form')得到的是jquery,加上[0]

                $('.layui-form')[0].reset();
            }
        })
    })





})