$(function() {
    // 获取文章分类的列表
    initArtCateList();
    var layer = layui.layer;
    var form = layui.form;

    function initArtCateList() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function(res) {
                // 接收两个参数， 第一个参数 'tpl-table'  <script type="text/html" id="tpl-table">
                console.log(res);
                // 调用该方法返回的是一个字符串用htmlStr接收
                // tpl-table提供模板的id,不需要加上#
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
            }
        })
    }
    var indexAdd = null;
    // 为添加类别按钮绑定点击事件
    $('#btnAdd').on('click', function() {
            // 调用layer.open的方法  添加类别的功能  
            // layer.open有返回值可以为后面的close方法指定参数，表明关闭的是哪一个弹出层
            indexAdd = layer.open({
                type: 1,
                area: ['500px', '250px'],
                title: '添加文章分类',
                // $('#dialog-add').html()可以拿到结构，然后复制给content
                content: $('#dialog-add').html()
            })
        })
        // 通过代理的方式为form-add绑定点击事件，不能直接绑定事件，因为只有点击了
        // 添加类别按钮才会有form-add这个dom元素
        // 为body绑定submit事件，代理到form-add身上
    $('body').on('submit', '#form-add', function(e) {
            // 阻止表单的默认提交行为
            e.preventDefault();
            $.ajax({
                method: 'post',
                url: '/my/article/addcates',
                // 快速获取表单中的数据
                data: $(this).serialize(),
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('新增分类失败');
                    }
                    initArtCateList();
                    layer.msg('新增文章成功');
                    console.log(res);
                    // 根据索引关闭对应的弹出层
                    layer.close(indexAdd);
                }
            })
        })
        // 通过代理的方式为btn-edit绑定事件
        //  点击编辑那妞的时候显示该行的信息:点击按钮的时候拿到该行数据的id值(通过自定义属性的形式) 
        //   在编辑按钮里面加自定义属性:data-id=""
        // 然后根据id值获取相应的信息,将获取到的信息填好从到表单里面去
    var indexEdit = null;
    $('body').on('click', '.btn-edit', function() {
        // 弹出一个修改文章分类信息的层
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],

            title: '修改文章分类',
            // $('#dialog-add').html()可以拿到结构，然后复制给content
            content: $('#dialog-edit').html()
        })

        var id = $(this).attr('data-id');
        // 发起请求获取对应分类的数据
        $.ajax({
            method: 'get',
            url: '/my/article/cates/' + id,
            success: function(res) {
                console.log(res);
                form.val('form-edit', res.data)
            }
        })
    })
    $('body').on('submit', '#form-edit', function(e) {
        // 阻止表单的默认提交行为
        e.preventDefault();
        $.ajax({
            method: 'post',
            url: '/my/article/updatecate',
            // 快速获取表单中的数据,要将Id数据隐藏不要放过去，不然会报错
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('修改文章分类失败');
                }
                initArtCateList();
                layer.msg('修改文章分类成功');
                console.log(res);
                // 根据索引关闭对应的弹出层
                layer.close(indexEdit);
            }
        })
    })

    $('body').on('click', '.btn-delete', function() {
        var id = $(this).attr('data-id');
        // 提示用户是否删除 ,当用户点击确认按钮会执行fuction函数
        layer.confirm('确定删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'get',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败');
                    }
                    layer.msg('删除分类成功');
                    console.log(res);
                    initArtCateList();
                    layer.close(index);
                }
            })

        });
    })
})