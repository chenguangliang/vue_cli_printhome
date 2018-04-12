## 笔记
1. pullToRefresh_fixHead.js中引入iscroll，一直报错，看看怎么引入的    
    ```
    import {iScroll} from "iscroll"
    这么引就会找node_module文件夹下的iscroll，而不是你改编过的iscroll.js(其实就加了个export)。
    正确引入： import {iScroll} from "./iscroll" 这样才会引入你改编过的那个iscroll.js
    ```
