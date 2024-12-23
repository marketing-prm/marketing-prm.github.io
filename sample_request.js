var hi = 'hideInvalid';
var si = 'showInvalid';

const requireDayId = 'COBJ1CF90'; // サンプル請求日ID
const emailId = 'Email'; // email ID
const nameId = 'NAME'; // お客様（漢字）
const furiganaId = 'COBJ1CF9'; // お名前（フリガナ）
const companyId = 'COBJ1CF10'; // COBJ1CF10 企業団体名
const sectionId = 'COBJ1CF11'; // COBJ1CF11 部署名
const positionId = 'COBJ1CF14'; // COBJ1CF14 役職名
const postCodeId = 'COBJ1CF2'; // COBJ1CF2 郵便番号
const addressId = 'COBJ1CF1'; // COBJ1CF1 ご住所
const telephoneId = 'COBJ1CF12'; // COBJ1CF12 電話番号
const wantSampleId = 'COBJ1CF16'; // COBJ1CF16 希望サンプル
const usePointId = 'COBJ1CF15'; // COBJ1CF15 使用箇所
const selectionPointId = 'COBJ1CF6'; // COBJ1CF6 採用ポイント
const finColorNumId = 'COBJ1CF51'; // COBJ1CF51 ファインカラーサンプル帳　数量（冊）
const noiesColorNumId = 'COBJ1CF52'; // COBJ1CF52 のイエスカラーサンプル帳　数量（冊）
const propertyName = 'COBJ1CF13'; // COBJ1CF13 物件名
const lastCheckId = 'privacyTool16871000002735104'; // privacyTool16871000002735104 当社プライバシーポリシー
const sampleCheckId = 'COBJ1CF101'; // COBJ1CF101 サンプル着払い同意
const formId = 'webform16871000002735104'; //フォームのID

function setValidateResult(name, isShow)
{
    var inv = $('#' + name + 'Invalid');
    var obj = $('#' + name);
    isShow ? inv.removeClass(hi).addClass(si) : inv.removeClass(si).addClass(hi);
    isShow ? obj.addClass('invalid') : obj.removeClass('invalid');
}
function checkEmpty(name) {
    var val = $('#' + name).val();
    setValidateResult(name, val == '');
}
$(document).ready(function(){
    // COBJ1CF90 サンプル請求日
    var td = new Date();
    $('#' + requireDayId).val(td.getFullYear() + '/' + (td.getMonth() + 1).toString().padStart(2, '0') + '/' + td.getDate().toString().padStart(2, '0'));

    // 空白チェックの追加
    var emptyCheckArray = [nameId, furiganaId, requireDayId, sectionId, positionId, propertyName];
    // NAME お客様（漢字）
    // COBJ1CF9 お名前（フリガナ）
    emptyCheckArray.forEach(
        emp => {
            $('#' + emp).on('change blur', function () {checkEmpty(emp);});
        }
    );
    // Email メールアドレス
    $('#' + emailId).on('change blur', function () {
        var email = $('#' + emailId).val();
        setValidateResult(emailId, (email == '' || !email.match(/.+@.+\..+/)));
    });
    
    // COBJ1CF10 企業団体名
    const regKabu = /(（株）|㈱|\(株\))/;
    const regYu = /(㈲|\(有\))/;
    $('#' + companyId).on('change blur', function (event) {
        var org = $('#' + companyId).val();
        var src = org;
        org = org.replace(regKabu, '株式会社').replace(regYu, '有限会社').replace(/株式$/, '株式会社').
        replace('　', ' ');
        org = toHalfWidth(kanaHalfToFull(org));
        if (src != org) {
            // event.preventDefault();
            $('#' + companyId).val(org);
        }
        checkEmpty(companyId);
    });

    // COBJ1CF2 郵便番号
    $('#' + postCodeId).on('change blur', function (event) {
        var org = $('#' + postCodeId).val();
        $('#' + postCodeId).val(toHalfWidthNumOnly(org));
        checkEmpty(postCodeId);
    });

    // COBJ1CF1 ご住所
    $('#' + addressId).on('change blur', function (event) {
        var org = $('#' + addressId).val();
        $('#' + addressId).val(toHalfWidth(org));
        checkEmpty(addressId);
    });

    // COBJ1CF12 電話番号
    $('#' + telephoneId).on('change blur', function (event) {
        var org = $('#' + telephoneId).val();
        $('#' + telephoneId).val(toHalfWidthNumOnly(org));
        // 書式チェック
        const regex = /^\d{2,4}-\d{2,4}-\d{4}$/;
        setValidateResult(telephoneId, (org == '' || !regex.test(org)));
    });

    // COBJ1CF16 希望サンプル
    selectToCheckBoxAtRequireSample(wantSampleId);
    // COBJ1CF15 使用箇所
    selectToCheckBox(usePointId);
    // COBJ1CF6 採用ポイント
    selectToCheckBox(selectionPointId);

    // lastCheckId 当社プライバシーポリシー
    $('#' + lastCheckId).on('change blur', function (event) {
        setValidateResult(lastCheckId, !$('#' + lastCheckId).is(':checked'));
    });

    // COBJ1CF101 サンプル着払い同意
    $('#' + sampleCheckId).on('change blur', function (event) {
        setValidateResult(sampleCheckId, !$('#' + sampleCheckId).is(':checked'));
    });

    // フリガナ処理
    $.fn.autoKana('#' + nameId, '#' + furiganaId, {katakana:true});

    // バリデーション確認処理
    $('input').on('change blur', function (event) {
        setTimeout(function() {
            var inv = $('.' + si);
            $('#formsubmit').prop('disabled', (inv.length != 0));
        }, 500);
    });

    $('#' + formId).on('submit', function(event) {
        setValidateResult(lastCheckId, !$('#' + lastCheckId).is(':checked'));
        emptyCheckArray.forEach(
            emp => {
                $('#' + emp).triggerHandler('blur');
            }
        );
        $('#' + selectionPointId + '_checkbox_0').triggerHandler('blur');
        $('#' + sampleCheckId + '_checkbox_0').triggerHandler('blur');
        $('#' + usePointId + '_checkbox_0').triggerHandler('blur');
        $('#' + emailId).triggerHandler('blur');
        $('#' + postCodeId).triggerHandler('blur');
        $('#' + addressId).triggerHandler('blur');
        $('#' + telephoneId).triggerHandler('blur');
        $('#' + companyId).triggerHandler('blur');

        if ($('.' + si).length != 0) {
            event.preventDefault();

            var $target = $('.' + si).first(); // 最初の要素を取得
            $('html, body').animate({
                scrollTop: $target.offset().top // 要素の位置にスクロール
            }, 500); // 500msでスムーズにスクロール
        }
    });

    // type=numberの数値制御
    $('input[type="number"]').focusout(function() {
        if(typeof $(this).attr('min') !== "undefined" && parseInt($(this).val()) < parseInt($(this).attr('min')))
            $(this).val($(this).attr('min'));
        else if(typeof $(this).attr('max') !== "undefined" && parseInt($(this).val()) > parseInt($(this).attr('max')))
            $(this).val($(this).attr('max'));
        else if(typeof $(this).attr('min') !== "undefined" && $(this).val() === '')
            $(this).val($(this).attr('min'));
    });    
});
function toHalfWidth(str) {
    // 全角英数字を半角に変換
    str = str.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function(s) {
        return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
    });
    return str.replace(/[－―]/g, '-');
}
function toHalfWidthNumOnly(str) {
    // 全角英数字を半角に変換
    str = str.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function(s) {
        return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
    });
    return str.replace(/[ー－―]/g, '-');
}
function kanaHalfToFull(str) {
    var kanaMap = {
        'ｶﾞ': 'ガ', 'ｷﾞ': 'ギ', 'ｸﾞ': 'グ', 'ｹﾞ': 'ゲ', 'ｺﾞ': 'ゴ',
        'ｻﾞ': 'ザ', 'ｼﾞ': 'ジ', 'ｽﾞ': 'ズ', 'ｾﾞ': 'ゼ', 'ｿﾞ': 'ゾ',
        'ﾀﾞ': 'ダ', 'ﾁﾞ': 'ヂ', 'ﾂﾞ': 'ヅ', 'ﾃﾞ': 'デ', 'ﾄﾞ': 'ド',
        'ﾊﾞ': 'バ', 'ﾋﾞ': 'ビ', 'ﾌﾞ': 'ブ', 'ﾍﾞ': 'ベ', 'ﾎﾞ': 'ボ',
        'ﾊﾟ': 'パ', 'ﾋﾟ': 'ピ', 'ﾌﾟ': 'プ', 'ﾍﾟ': 'ペ', 'ﾎﾟ': 'ポ',
        'ｳﾞ': 'ヴ', 'ﾜﾞ': '?', 'ｦﾞ': '?',
        'ｱ': 'ア', 'ｲ': 'イ', 'ｳ': 'ウ', 'ｴ': 'エ', 'ｵ': 'オ',
        'ｶ': 'カ', 'ｷ': 'キ', 'ｸ': 'ク', 'ｹ': 'ケ', 'ｺ': 'コ',
        'ｻ': 'サ', 'ｼ': 'シ', 'ｽ': 'ス', 'ｾ': 'セ', 'ｿ': 'ソ',
        'ﾀ': 'タ', 'ﾁ': 'チ', 'ﾂ': 'ツ', 'ﾃ': 'テ', 'ﾄ': 'ト',
        'ﾅ': 'ナ', 'ﾆ': 'ニ', 'ﾇ': 'ヌ', 'ﾈ': 'ネ', 'ﾉ': 'ノ',
        'ﾊ': 'ハ', 'ﾋ': 'ヒ', 'ﾌ': 'フ', 'ﾍ': 'ヘ', 'ﾎ': 'ホ',
        'ﾏ': 'マ', 'ﾐ': 'ミ', 'ﾑ': 'ム', 'ﾒ': 'メ', 'ﾓ': 'モ',
        'ﾔ': 'ヤ', 'ﾕ': 'ユ', 'ﾖ': 'ヨ',
        'ﾗ': 'ラ', 'ﾘ': 'リ', 'ﾙ': 'ル', 'ﾚ': 'レ', 'ﾛ': 'ロ',
        'ﾜ': 'ワ', 'ｦ': 'ヲ', 'ﾝ': 'ン',
        'ｧ': 'ァ', 'ｨ': 'ィ', 'ｩ': 'ゥ', 'ｪ': 'ェ', 'ｫ': 'ォ',
        'ｯ': 'ッ', 'ｬ': 'ャ', 'ｭ': 'ュ', 'ｮ': 'ョ',
        '｡': '。', '､': '、', 'ｰ': 'ー', '｢': '「', '｣': '」', '･': '・'
    };

    var reg = new RegExp('(' + Object.keys(kanaMap).join('|') + ')', 'g');
    return str.replace(reg, function (match) {
        return kanaMap[match];
    }).replace(/ﾞ/g, '゛').replace(/ﾟ/g, '゜');
};

function selectOption(id, value, flg)
{
    $("#" + id + " [value='" + value + "']").prop('selected', flg);
    setValidateResult(id, $('input[name="' + id + '_checkbox"]:checked').length == 0);
}

function selectOptionAtRequireSample(id, value, flg, index)
{
    selectOption(id, value, flg);
    if (index == 0) {
        $('#' + finColorNumId).val(0);
        $('#' + finColorNumId).prop('disabled', !flg);
    } else if (index == 1) {
        $('#' + noiesColorNumId).val(0);
        $('#' + noiesColorNumId).prop('disabled', !flg);
    } else if (index == 2) {
        $('.cutSampleNum').val(0);
        $('.cutSampleNum').prop('disabled', !flg);
    }
}

function selectToCheckBoxAtRequireSample(id){
    var select = $('#' + id);
    var div = $('<div>', {
        class: 'seltocheck'
    });
    var table = $('<table>', {
        class: 'layoutTalbeAtRequireSample'
    });
    var tr = null;

    $('#' + id + ' option').each(function(index, element) {
        tr = $('<tr>');
        table.append(tr);
        var td = $('<td>');
        var label = $('<label>', {
            id: id + '_label_' + index,
            for: id + '_checkbox_' + index
        });
        var radio = $('<input>', {
            type: 'checkbox',
            name: id + '_checkbox', // 全て同じname属性にすることでグループ化
            value: $(element).val(),
            id: id + '_checkbox_' + index,
            onChange: 'selectOptionAtRequireSample(\'' + id + '\', \'' + $(element).val() + '\', $(this).prop(\'checked\'), ' + index + ');'
        });
        var span = $('<span>');
        span.text($(element).val());
        label.append(radio);
        label.append(span);

        td.append(label);
        tr.append(td);

        // 入力項目
        var td2nd = $('<td>');
        if (index == 0) {
            //親要素の変更
            var fineColorSample = $('#fincolor');
            fineColorSample.appendTo(td2nd);
        } else if (index == 1) {
            //親要素の変更
            var noirssample = $('#noirssample');
            noirssample.appendTo(td2nd);
        }
        tr.append(td2nd);
    });
    div.append(table);
    select.after(div);    
    select.hide();
}
function selectToCheckBox(id){
    var select = $('#' + id);
    var div = $('<div>', {
        class: 'seltocheck'
    });
    var table = $('<table>', {
        class: 'layoutTalbe'
    });
    var tr = null;
    $('#' + id + ' option').each(function(index, element) {
        if (index % 3 == 0) {
            tr = $('<tr>');
            table.append(tr);
        }
        var td = $('<td>');
        var label = $('<label>', {
            id: id + '_label_' + index,
            for: id + '_checkbox_' + index
        });
        var radio = $('<input>', {
            type: 'checkbox',
            name: id + '_checkbox', // 全て同じname属性にすることでグループ化
            value: $(element).val(),
            id: id + '_checkbox_' + index,
            onChange: 'selectOption(\'' + id + '\', \'' + $(element).val() + '\', $(this).prop(\'checked\'));'
        });
        var span = $('<span>');
        span.text($(element).val());
        label.append(radio);
        label.append(span);
        //label.append('<br>');
        td.append(label);
        tr.append(td);
        //div.append(label);
    });
    div.append(table);
    select.after(div);
    select.hide();
}

