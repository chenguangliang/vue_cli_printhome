/**
 * Created by User on 2017/12/8.
 */
$(function () {
    // 全部提现
    $('.full_cash').click(function () {
        var num = $('.balance').html();
        $('.money_input').val(num);
    })
});
// 验证码
function countTime() {
    var count = 60;
    window.countInterval = setInterval(function () {
        if (count >= 0) {
            $(".send_captcha").attr("disabled", true).val(count + '秒后重新发送');
            count--;
        } else {
            $(".send_captcha").attr("disabled", false).val('获取验证码');
            window.clearInterval(countInterval);
        }
    }, 1000);
}
