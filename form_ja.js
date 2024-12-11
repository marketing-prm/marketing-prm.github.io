var hi = 'hideInvalid';
var si = 'showInvalid';

const reqestDayId = 'CASECF83'; // CASECF83 問い合わせ日ID
const emailId = 'Email'; // email ID
const nameId = 'CASECF18'; // お客様（漢字）
const furiganaId = 'CASECF11'; // お名前（フリガナ）
const companyId = 'CASECF20'; // CASECF20 企業団体名
const sectionId = 'COBJ1CF11'; // COBJ1CF11 部署名
const positionId = 'COBJ1CF14'; // COBJ1CF14 役職名
const postCodeId = 'CASECF5'; // CASECF20 郵便番号
const addressId = 'CASECF8'; // CASECF8 ご住所
const telephoneId = 'Phone'; // Phone 電話番号

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
    // 問い合わせ日
    var td = new Date();
    $('#' + reqestDayId).val(td.getFullYear() + '/' + (td.getMonth() + 1).toString().padStart(2, '0') + '/' + td.getDate().toString().padStart(2, '0'));

    // 空白チェックの追加
    var emptyCheckArray = [nameId, furiganaId, reqestDayId, sectionId, positionId];
    // お客様（漢字）
    // お名前（フリガナ）
    emptyCheckArray.forEach(
        emp => {
            $('#' + emp).on('change blur', function () {checkEmpty(emp);});
        }
    );
    // メールアドレス
    $('#' + emailId).on('change blur', function () {
        var email = $('#' + emailId).val();
        setValidateResult(emailId, (email == '' || !email.match(/.+@.+\..+/)));
        checkEmpty(emailId);
    });
    
    // 企業団体名
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
        $('#' + postCodeId).val(toHalfWidth(org).replace(/^(\d{3})(\d{4})$/, "$1-$2"));
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
        $('#' + telephoneId).val(toHalfWidth(org));
        // 書式チェック
        const regex = /^\d{2,4}-\d{2,4}-\d{4}$/;
        setValidateResult(telephoneId, (org == '' || !regex.test(org)));
        checkEmpty(telephoneId);
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

});
function toHalfWidth(str) {
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
}
