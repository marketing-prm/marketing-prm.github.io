var hi = 'hideInvalid';
var si = 'showInvalid';

const reqestDayId = 'CASECF83'; // CASECF83 問い合わせ日ID
const emailId = 'Email'; // email ID
const nameId = 'CASECF18'; // 名前
const companyId = 'CASECF20'; // CASECF20 企業団体名
const postCodeId = 'CASECF5'; // CASECF20 郵便番号
const addressId = 'CASECF8'; // CASECF8 ご住所
const telephoneId = 'Phone'; // Phone 電話番号
const inquiryId = 'CASECF3'; // CASECF3 問い合わせ内容
const lastCheckId = 'privacyTool16871000002775576'; // privacyTool16871000002775576 当社プライバシーポリシー
const formId = 'webform16871000002775576'; // フォームそのもののID


function setValidateResult(name, isShow) {
    var inv = $('#' + name + 'Invalid');
    var obj = $('#' + name);
    isShow ? inv.removeClass(hi).addClass(si) : inv.removeClass(si).addClass(hi);
    isShow ? obj.addClass('invalid') : obj.removeClass('invalid');
}
function checkEmpty(name) {
    var val = $('#' + name).val();
    setValidateResult(name, val == '');
}
$(document).ready(function () {
    // 問い合わせ日
    var td = new Date();
    $('#' + reqestDayId).val(td.getFullYear() + '/' + (td.getMonth() + 1).toString().padStart(2, '0') + '/' + td.getDate().toString().padStart(2, '0'));

    // 空白チェックの追加
    var emptyCheckArray = [nameId, reqestDayId, inquiryId];
    // お客様（漢字）
    // お名前（フリガナ）
    emptyCheckArray.forEach(
        emp => {
            $('#' + emp).on('change blur', function () { checkEmpty(emp); });
        }
    );
    // メールアドレス
    $('#' + emailId).on('change blur', function () {
        var email = $('#' + emailId).val();
        setValidateResult(emailId, (email == '' || !email.match(/.+@.+\..+/)));
    });

    // 企業団体名
    $('#' + companyId).on('change blur', function (event) {
        checkEmpty(companyId);
    });

    // COBJ1CF12 電話番号チェック削除

    // lastCheckId 当社プライバシーポリシー
    $('#' + lastCheckId).on('change blur', function (event) {
        setValidateResult(lastCheckId, !$('#' + lastCheckId).is(':checked'));
    });

    // バリデーション確認処理
    $('input').on('change blur', function (event) {
        setTimeout(function () {
            var inv = $('.' + si);
            $('#formsubmit').prop('disabled', (inv.length != 0));
        }, 500);
    });


    $('#' + formId).on('submit', function(event) {
        emptyCheckArray.forEach(
            emp => {
                $('#' + emp).triggerHandler('blur');
            }
        );
        $('#' + emailId).triggerHandler('blur');
        $('#' + companyId).triggerHandler('blur');
        $('#' + lastCheckId).triggerHandler('blur');

        if ($('.' + si).length != 0) {
            event.preventDefault();

            var $target = $('.' + si).first(); // 最初の要素を取得
            $('html, body').animate({
                scrollTop: $target.offset().top // 要素の位置にスクロール
            }, 500); // 500msでスムーズにスクロール
        }
    });
});
function toHalfWidth(str) {
    // 全角英数字を半角に変換
    str = str.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function(s) {
        return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
    });
    return str.replace(/[ー－―]/g, '-');
}

function validateEmail16871000002775576() {
    var form = document.forms['WebToCases16871000002775576'];
    var emailFld = form.querySelectorAll('[ftype=email]');
    var i;
    for (i = 0; i < emailFld.length; i++) {
        var emailVal = emailFld[i].value;
        if ((emailVal.replace(/^\s+|\s+$/g, '')).length != 0) {
            var atpos = emailVal.indexOf('@');
            var dotpos = emailVal.lastIndexOf('.');
            if (atpos < 1 || dotpos < atpos + 2 || dotpos + 2 >= emailVal.length) {
                alert('Please enter a valid email address. ');
                emailFld[i].focus();
                return false;
            }
        }
    }
    return true;
}
function validateDateFormat16871000002775576() {
    var form = document.forms['WebToCases16871000002775576'];
    var dateFlds = form.querySelectorAll('[ftype=date]');
    var i;
    for (i = 0; i < dateFlds.length; i++) {
        var dateFld = dateFlds[i];
        var usrPtrn = dateFld.placeholder;
        var dateVal = dateFld.value;
        if (dateVal.trim() != '') {
            var vald = dateFormatConvert.validate(dateVal, usrPtrn);
            if (!vald) {
                alert('Please enter a valid date. ');
                dateFld.focus();
                return false;
            }
        }
    }
    return true;
}

function checkMandatory16871000002775576() {
    var mndFileds = new Array('Subject', 'Email', 'CASECF3', 'CASECF18', 'CASECF20');
    var fldLangVal = new Array('Subject', 'Email\x20Address', 'Your\x20Inquiry', 'Name', 'Campany\x20Name');
    for (i = 0; i < mndFileds.length; i++) {
        var fieldObj = document.forms['WebToCases16871000002775576'][mndFileds[i]];
        if (fieldObj) {
            if (((fieldObj.value).replace(/^\s+|\s+$/g, '')).length == 0) {
                if (fieldObj.type == 'file') {
                    alert('アップロードするファイルを選択してください。');
                    fieldObj.focus();
                    return false;
                }
                alert(fldLangVal[i] + 'indicates a required field.');
                fieldObj.focus();
                return false;
            } else if (fieldObj.nodeName == 'SELECT') {
                if (fieldObj.options[fieldObj.selectedIndex].value == '-None-') {
                    alert(fldLangVal[i] + ' indicates a required field.');
                    fieldObj.focus();
                    return false;
                }
            } else if (fieldObj.type == 'checkbox') {
                if (fieldObj.checked == false) {
                    alert('Please accept  ' + fldLangVal[i]);
                    fieldObj.focus();
                    return false;
                }
            }
            try {
                if (fieldObj.name == 'Last Name') {
                    name = fieldObj.value;
                }
            } catch (e) { }
        }
    }
    if (!validateEmail16871000002775576()) { return false; }

    if (!validateDateFormat16871000002775576()) { return false; }

    var urlparams = new URLSearchParams(window.location.search);
    if (urlparams.has('service') && (urlparams.get('service') === 'smarturl')) {
        var webform = document.getElementById('webform16871000002775576');
        var service = urlparams.get('service');
        var smarturlfield = document.createElement('input');
        smarturlfield.setAttribute('type', 'hidden');
        smarturlfield.setAttribute('value', service);
        smarturlfield.setAttribute('name', 'service');
        webform.appendChild(smarturlfield);
    }

    document.querySelector('.crmWebToEntityForm .formsubmit').setAttribute('disabled', true);
}

function tooltipShow16871000002775576(el) {
    var tooltip = el.nextElementSibling;
    var tooltipDisplay = tooltip.style.display;
    if (tooltipDisplay == 'none') {
        var allTooltip = document.getElementsByClassName('zcwf_tooltip_over');
        for (i = 0; i < allTooltip.length; i++) {
            allTooltip[i].style.display = 'none';
        }
        tooltip.style.display = 'block';
    } else {
        tooltip.style.display = 'none';
    }
}
