(function () {
  var code = '';
  var products = null;
  var loadError = null;

  var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  function createCode() {
    code = '';
    var checkCode = document.getElementById('code');
    for (var i = 0; i < 4; i++) {
      code += CHARS[Math.floor(Math.random() * 36)];
    }
    checkCode.value = code;
  }

  function showDialog(message, isHtml) {
    var $dialog = $('#iosDialog2');
    if (isHtml) {
      $('#reminder_text').html(message);
    } else {
      $('#reminder_text').text(message);
    }
    $dialog.fadeIn(200);
    $dialog.attr('aria-hidden', 'false');
    $dialog.attr('tabindex', '0');
    $dialog.trigger('focus');
  }

  function resetCaptcha() {
    $('#js_input2').val('');
    createCode();
  }

  function checkDate(date) {
    return new Date(date).getDate() == date.substring(date.length - 2);
  }

  function findRule(sn, rules) {
    for (var i = 0; i < rules.length; i++) {
      if (sn.startsWith(rules[i].prefix)) {
        return rules[i];
      }
    }
    return null;
  }

  function findException(sn, exceptions) {
    for (var i = 0; i < exceptions.length; i++) {
      if (sn === exceptions[i].sn) {
        return exceptions[i];
      }
    }
    return null;
  }

  function parseOldRule(sn, rule) {
    var remainingPart = sn.substring(rule.prefix.length);
    var regExpDate = /^[0-9]{6}$/;
    var year = remainingPart.substring(0, 2);
    var month = remainingPart.substring(2, 4);
    var day = remainingPart.substring(4, 6);
    var dateString = '20' + year + '-' + month + '-' + day;

    if (
      remainingPart.length >= 6 &&
      regExpDate.test(remainingPart.substring(0, 6)) &&
      checkDate(dateString)
    ) {
      return {
        model: rule.model,
        dateText: '20' + year + '-' + month + '-' + day,
      };
    }

    if (remainingPart.length >= 8) {
      var yearAndWeek = remainingPart.substring(4, 8);
      var weekYear = yearAndWeek.substring(0, 2);
      var week = yearAndWeek.substring(2, 4);
      var weekNum = parseInt(week, 10);

      if (weekNum < 1 || weekNum > 52) {
        return { error: '请输入正确的序列号格式！' };
      }

      return {
        model: rule.model,
        dateText: '20' + weekYear + '年第' + week + '周',
      };
    }

    return { error: '请输入正确的序列号格式！' };
  }

  function parseNewRule(sn, rule) {
    var remainingPart = sn.substring(rule.prefix.length);

    if (remainingPart.length < 8) {
      return { error: '请输入正确的序列号格式！' };
    }

    var yearAndWeek = remainingPart.substring(4, 8);
    var weekYear = yearAndWeek.substring(0, 2);
    var week = yearAndWeek.substring(2, 4);
    var weekNum = parseInt(week, 10);

    if (weekNum < 1 || weekNum > 52) {
      return { error: '请输入正确的序列号格式！' };
    }

    return {
      model: rule.model,
      dateText: '20' + weekYear + '年第' + week + '周',
    };
  }

  function formatResult(model, dateText) {
    return (
      '<p id="pmodel">产品型号：' +
      model +
      '</p>' +
      '<p id="pouttime">出厂日期：' +
      dateText +
      '</p>'
    );
  }

  function lookupSerialNumber(sn) {
    if (!products) {
      return { error: loadError || '产品数据加载中，请稍后再试' };
    }

    var exception = findException(sn, products.exceptions || []);
    if (exception) {
      return {
        html: formatResult(exception.model, exception.dateText),
      };
    }

    var oldRule = findRule(sn, products.oldRules || []);
    if (oldRule) {
      var oldResult = parseOldRule(sn, oldRule);
      if (oldResult.error) {
        return { error: oldResult.error };
      }
      return { html: formatResult(oldResult.model, oldResult.dateText) };
    }

    var newRule = findRule(sn, products.newRules || []);
    if (newRule) {
      var newResult = parseNewRule(sn, newRule);
      if (newResult.error) {
        return { error: newResult.error };
      }
      return { html: formatResult(newResult.model, newResult.dateText) };
    }

    return { error: '请输入正确的序列号！' };
  }

  function getProductsDataUrl() {
    var scripts = document.getElementsByTagName('script');
    for (var i = scripts.length - 1; i >= 0; i--) {
      var src = scripts[i].src;
      if (src && src.indexOf('sn-lookup.js') !== -1) {
        return src.replace(/js\/sn-lookup\.js(\?.*)?$/, 'data/products.json');
      }
    }
    return new URL('data/products.json', window.location.href).href;
  }

  function getLocalDevHint() {
  return (
      '本地不能直接双击打开 HTML 文件。\n' +
      '请在项目目录启动本地服务器，然后访问 http://localhost:8080\n' +
      '（可双击 serve.bat，或运行：python -m http.server 8080）'
    );
  }

  function loadProducts() {
    if (window.location.protocol === 'file:') {
      products = null;
      loadError = getLocalDevHint();
      return Promise.resolve();
    }

    return fetch(getProductsDataUrl())
      .then(function (response) {
        if (!response.ok) {
          throw new Error('无法加载产品数据');
        }
        return response.json();
      })
      .then(function (data) {
        products = data;
        loadError = null;
      })
      .catch(function (error) {
        products = null;
        loadError = error.message || '无法加载产品数据';
      });
  }

  function init() {
    createCode();

    $('.weui-dialog__btn').on('click', function () {
      $(this).parents('.js_dialog').fadeOut(200);
      $(this).parents('.js_dialog').attr('aria-hidden', 'true');
      $(this).parents('.js_dialog').removeAttr('tabindex');
    });

    loadProducts();

    $('#showTooltips').on('click', function () {
      var sn = $('#sn').val().trim();
      var inputCode = $('#js_input2').val().trim();

      if (sn.length <= 0) {
        showDialog('请输入序列号！');
        return;
      }

      if (inputCode.length <= 0) {
        showDialog('请输入验证码！');
        return;
      }

      if (inputCode.toLowerCase() !== code.toLowerCase()) {
        showDialog('验证码输入错误！@_@');
        createCode();
        return;
      }

      var result = lookupSerialNumber(sn);
      if (result.error) {
        showDialog(result.error);
        return;
      }

      showDialog(result.html, true);
      resetCaptcha();
    });
  }

  window.createCode = createCode;

  $(init);
})();
