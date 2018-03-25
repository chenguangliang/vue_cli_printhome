/**
 * Created by User on 2017/2/16.
 */
//地址三级联动
    AreaSelector().init();
    function getValue(id) {
        var sel = document.getElementById(id);
        if (sel && sel.options) {
            printAlert(sel.options[sel.selectedIndex].value);
        }
    }
    function getText(id) {
        var sel = document.getElementById(id);
        if (sel && sel.options) {
            printAlert(sel.options[sel.selectedIndex].text);
        }
    }