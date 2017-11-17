$(function() {
    //数字加减
    $('.mui-number .decrease').on('click', function() {
        var old_val = parseFloat($('.mui-number .num').val());
        if (old_val > 1) {
            $('.mui-number .num').val(--old_val)
        }
    });
    $('.mui-number .increase').on('click', function() {
        var old_val = parseFloat($('.mui-number .num').val());
        $('.mui-number .num').val(++old_val);
    });

    $('.back').on('click', function() {
        history.go(-1);
    });

});