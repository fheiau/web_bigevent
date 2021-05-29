$(function() {
    // 定义一个查询的参数对象,将来请求数据的时候，需要将请求参数对象提交到服务器
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage;
    // 定义美化事件的过滤器
    template.defaults.imports.dataFormat = function(date) {
            const dt = new Date(date);
            var y = dt.getFullYear();

            var m = padZero(dt.getMonth() + 1);
            var d = padZero(dt.getDate());

            var hh = padZero(dt.getHours());
            var mm = padZero(dt.getHours());
            var ss = padZero(dt.getSeconds());
            return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ':' + ss
        }
        // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }


    var q = {
        pagenum: 1, //页码值，默认请求第一页的数据
        pagesize: 2, //每页显示几条数据，默认每页显示2条
        cate_id: '', //文章分类的Id
        state: '' //文章的发布状态
    }
    initTable();
    // 获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'get',
            url: '/my/article/list',
            // data:q  需要提交到服务器上的参数
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取数据失败')
                }
                // 通过模板引擎来渲染页面数据  
                // htmlStr ：返回渲染好的结构
                var htmlStr = template('tpl-table', res)
                    // $('tbody').html(htmlStr);  将结构填充到页面中
                $('tbody').html(htmlStr);
                console.log(res);
                // 数据被渲染完成以后调用渲染分页的方法
                renderPage(res.total);
            }
        })
    }

    initCate();
    // 动态获取（已经提交和草稿）文章分类，填充下拉菜单里面的内容
    // 初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败!');
                }
                // 调用模板引擎渲染分类的可选项
                console.log(res);
                var htmlStr = template('tpl-cate', res)

                // $('tbody').html(htmlStr);  将结构填充到页面中
                // 通过jquery的选择期选择到 <select name="cate_id"></select>这个内容节点，往里面填充数据
                $('[name=cate_id]').html(htmlStr);
                // 通过layui重新渲染表单区域的UI结构
                form.render();
            }
        })
    }
    $('#form-search').on('submit', function(e) {
        // 阻止表单的默认提交行为
        e.preventDefault()
            // 拿到两个下拉菜单中的值 
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
            // 为查询参数对象q中对应的属性赋值
        q.cate_id = cate_id;
        q.state = state;
        // 根据最新的筛选条件，重新渲染数据
        initTable();
    })


    // 定义渲染分页的方法
    function renderPage(total) {
        // 调用laypage.render()方法来渲染分页的结构
        laypage.render({
            elem: 'pageBox', //分页容器的id
            count: total, //总数据条数
            limit: q.pagesize, //每页显示几条数据
            curr: q.pagenum, //设置默认被选中的分类
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],

            // 分页发生切换的时候，触发jump回调
            // 触发jump回调的方法有两种
            // 点击页码的时候会触发jump回调
            // 只要调用了layPage.render()方法就会触发jump回调(如果是第二种方法调用的会触发死循坏)
            jump: function(obj, first) {
                // 我们通过点击页码值触发jump回调的时候，first的值为undefined
                // 我们通过第二种触发jump回调的时候，first的值为true
                // console.log(obj.curr);
                // 把最新的页码值赋值到q这个查询对象中
                q.pagenum = obj.curr;
                // 把最新的条目数赋值到q这个查询对象中
                q.pagesize = obj.limit;
                // 根据最新的q获取对应的数据列表，并渲染表格 
                if (!first) {
                    initTable();
                }

            }

        })

    }

    // 通过代理的形式,为删除按钮绑定点击事件处理函数

    $('body').on('click', '.btn-delete', function() {
        // 获取删除按钮的个数
        var len = $('.btn-delete').length;
        console.log(len);
        var id = $(this).attr('data-id');
        // 询问用户是否要删除数据
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'get',
                // 动态获取id:在html文件中给按钮增添一个自定义属性
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败!')
                    }
                    layer.msg('删除文章成功');
                    // 当某一页删除完数据以后没有渲染出前一页的数据，原因:删除完以后页码值还是没变
                    //   判断当前页是否还有剩余数据
                    // 这是按下确认才会执行的代码  按下确认后才执行，其实按下后是已经删除掉文章的id值的，但是页面还没有更新(initTable(); )，还是有一个按钮， initTable();执行后页面就没有按钮了，自动转到第二页
                    // len  ：当前页面按钮的个数
                    if (len === 1) {
                        // 如果len的值等于1,证明删除完毕之后，页面上就没有任何数据
                        //   页码值最小必须是1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;

                    }

                    initTable(); // 重新渲染数据
                    // console.log(res);
                }
            })

            layer.close(index);
        });
    })

})