(function(Vue) { //表示依赖全局的Vue


    const items = [{
            id: 1, //键值序号
            content: "学习Vue.js", //任务名
            completed: false //完成状态
        },
        {
            id: 2,
            content: "学习ES6",
            completed: false
        },
        {
            id: 3,
            content: "学习typescript",
            completed: true
        }
    ]

    const STORAGE_KEY = 'items-vuejs'
    const itemStorage = {
        //获取数据
        fetch: function() {
            return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
        },
        //保存数据
        save: function(items) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
        }
    }


    //注册全局自定义属性，注意定义指令名时不要加“v-”
    Vue.directive('app-focus', { //自动获取焦点
        inserted(el, binding) {
            el.focus()
        }
    })


    var vm = new Vue({
        el: "#todoapp", //被Vue纳入管理的入口
        data: {
            items: itemStorage.fetch(),
            currentItem: null, //将迭代出来的item赋值给currentItem，那对应的任务项就会进入编辑状态
            filterStatus: 'all' //定义该变量，获取hash变化的值，默认为all
        },
        watch: { //定义监听器
            items: {
                deep: true, //深度监听，对象中的属性发生变化也会坚挺到
                handler: function(newItems, oldItems) {
                    itemStorage.save(newItems)
                }

            }
        },
        directives: { //自动获取焦点
            "todo-focus": {
                update(el, binding) {
                    if (binding.value) {
                        el.focus()
                    }
                }
            }
        },
        computed: { //定义计算属性
            filterItems() {
                switch (this.filterStatus) {
                    case 'completed':
                        return this.items.filter(n => n.completed)
                        break;
                    case 'active':
                        return this.items.filter(n => !n.completed)
                        break;
                    default:
                        return this.items
                }
            },
            toggleAll: { //复选框的状态变化
                get() { //当任务项被勾上获取复选框的状态变化，这里当未完成任务项为0时触发
                    return this.remaining === 0
                },
                set(newStatus) { //当点击复选框后，所有任务项的状态都要发生改变
                    this.items.forEach(function(n) {
                        n.completed = newStatus
                    })
                }
            },
            remaining() { //未完成任务项的数量
                return this.items.filter(n => !n.completed).length //用filter过滤出items中未完成的任务项
            }
        },
        methods: { //事件绑定函数
            finishEdit(item, index, event) { //完成编辑
                //console.log(event.target.value)
                const content = event.target.value.trim()
                if (!content) { //判断数据是否为空，为空就删除该任务项
                    this.removeItem(index)
                    return
                }
                item.content = content
                this.currentItem = null
            },
            cancelEdit() { //按esc取消编辑状态
                this.currentItem = null //这里cancelEdit 值为null ，那么editing:item === currentItem就不会成立，这个样式也不会套用
            },
            toEdit(item) { //双击label标签进入编辑状态
                this.currentItem = item
            },
            clearCompleted() { //点击“Clear completed”按钮，清除所有已完成的任务项
                this.items = this.items.filter(n => !n.completed) //过滤出所有未完成的任务项，赋值给items
            },
            removeItem(index) { //点击“×”删除任务项
                this.items.splice(index, 1) //通过数组spice方法移除items中索引为index的值，这里index就是所点击的任务项
            },
            addItem(event) { //输入框输入内容按回车添加任务项
                //1.获取文本框的内容,用trim去除文本前后空格 通过event可以获取事件对象相关信息
                //console.log(event.target.value)
                const content = event.target.value.trim()

                //2.判断输入框是否为空，为空则直接返回
                if (!content.length) {
                    return
                }
                //3.如果不为空，则添加任务项
                const id = this.items.length + 1
                this.items.push({
                    id, //等价于 id: id,
                    content, //等价于 content: content,
                    completed: false //默认为未完成
                })

                //4.将文本框的内容删除
                event.target.value = ''

            }
        },
    })


    window.onhashchange = function() { //用来监听hash变化的函数，要写在vue实力外边
        // console.log('hash值已改变')
        //console.log(window.location.hash)
        const hash = window.location.hash.substr(2) || 'all'
        vm.filterStatus = hash
    }

    window.onhashchange()
})(Vue);