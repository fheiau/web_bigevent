$(function() {
    // 点击去注册账号的链接
    $("#link_reg").on('click', function() {
            $(".reg-box").show();
            $(".login-box").hide();
        })
        // 点击去登录账号的链接
    $("#link_login").on('click', function() {
        $(".reg-box").hide();
        $(".login-box").show();
    })

    // 从layui中获取form对象
    var form = layui.form;
    var layer = layui.layer;
    // 通过form.verfy()函数自定义校验规则
    form.verify({
        // 自定义了一个叫做pass校验规则  [\S]非空格 密码必须6到12位，且不能出现空格(错误提示)
        // 数组的方式
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        // function的方式 
        // 校验两次密码是否一致的规则
        repwd: function(value) {
            // 通过形参拿到的是确认密码框中的内容(value)
            // 还需要拿到密码框中的内容
            // 然后进行一次等于的判断
            // 如果判断失败，则return一个提示信息
            var pwd = $('.reg-box [name=password]').val();
            if (pwd != value) {
                return '两次密码不一致!'
            }
        }
    })

    // 监听注册表单的提交事件
    $('#form_reg').on('submit', function(e) {
            // 阻止默认行为(不让他提交)
            e.preventDefault();
            var data = {
                username: $('#form_reg [name=username]').val(),
                password: $('#form_reg [name=password]').val()
            }

            $.post('/api/reguser', data,
                //  通过res拿到服务器响应回来的数据 
                function(res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message);
                    }
                    layer.msg('注册成功,请登录');
                    // 模拟人的点击行为
                    $("#link_login").click();
                })
        })
        // 监听登录表单的提交事件
    $('#form_login').on('submit', function(e) {
        // 阻止默认行为(不让他提交)
        e.preventDefault();
        $.ajax({
            url: '/api/login',
            method: 'post',
            // 快速获取表单中的数据
            data: $(this).serialize(),
            // 成功后的回调函数
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('登录失败!');
                }
                layer.msg('登陆成功!');
                console.log(res.token);
                // 将登录成功得到的token字符串 保存到localStorage中
                localStorage.setItem('token', res.token);
                // 跳转到后台主页
                location.href = '/index.html'
            }

        })
    })
})