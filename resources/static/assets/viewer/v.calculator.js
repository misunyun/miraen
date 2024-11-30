var cc_expression = '';
var cc_expressionArray = [];
var cc_screenArray = [];
var cc_parentheses = 0;
var cc_ansOnScreen = false;
var cc_ans = null;
var cc_error = false;
var cc_inverted = false;
var cc_calculator_text_length = 0;

var calculator = {
  defaults: function () {
    cc_expression = '';
    cc_expressionArray = [];
    cc_screenArray = [];
    cc_parentheses = 0;
    cc_ansOnScreen = false;
    cc_ans = null;
    cc_error = false;
    cc_inverted = false;
    cc_calculator_text_length = 0;
    $('.result').html('');
    $('.screentext').html('');
    $('.hints').html('');
  },
  toggleInverted: function () {
    $('.cbfun .inv').toggle();
    cc_inverted = cc_inverted ? false : true;
  },
  adjustParentheses: function (num) {
    $('.hints').html(')'.repeat(num));
  },
  writeToScreen: function (mode, text) {
    if (mode == 'append') {
      if (cc_error) {
        cc_screenArray = [];
      }
      cc_error = false;
      cc_screenArray.push(text);
    } else if (mode == 'write') {
      cc_screenArray = [text];
    } else if (mode == 'delete') {
      var popped = cc_screenArray.pop();
      if (/[(]$/g.test(popped)) {
        cc_parentheses > 0 ? cc_parentheses-- : cc_parentheses = 0;
        adjustParentheses(cc_parentheses);
      }
    }

    $('.screentext').html(cc_screenArray.join(''));

    if (cc_inverted) {
      toggleInverted();
    }
  },
  addToExpression: function (text) {
    cc_expressionArray.push(text);
    cc_expression += text;
  },
  removeFromExpression: function () {
    var count = cc_expressionArray.pop().length;
    cc_expression = cc_expression.slice(0, -count);
  },
  addResult: function (result, screen) {
    var result_wrap_target = $('#calculator_wrap .result_wrap ul');
    var _html = '<li><div>' + result + '</div><div>' + screen + '</div></li>';
    result_wrap_target.prepend(_html);
  },
  calc_click_enter: function () {
    if (cc_ansOnScreen) {
      cc_expressionArray = [cc_ans];
    }

    calculator.addToExpression(')'.repeat(cc_parentheses));

    try {
      math.eval(cc_expressionArray.join('')).toPrecision(8);
      console.log(math)
    } catch (e) {
      cc_error = true;
    }

    if (cc_error) {
      calculator.defaults();
      cc_error = true;
      show_alert("맞지 않는 수식입니다.");
      // writeToScreen('write', '맞지 않는 수식입니다.');
      // writeToScreen('write', 'Syntax Error');

    } else {
      $('.result').html($('.screentext').html().replace(/Ans/, cc_ans) + ')'.repeat(cc_parentheses) + ' =');
      // ans = math.eval(cc_expressionArray.join(''));
      cc_ans = math.eval(cc_expressionArray.join('')).toPrecision(8);
      calculator.writeToScreen('write', cc_ans.toString().replace(/(\.0+$)|(0+$)/g, ''));

      $('.hints').html('');

      var el = $('#screentext');
      var newone = el.clone(true);
      el.before(newone);

      $(".animated:last").remove();

      cc_ansOnScreen = true;

      // result list 추가
      var _result_html = $('.result').html();
      var _screen_html = $('#screentext').html();

      calculator.addResult(_result_html, _screen_html);
    }
    cc_parentheses = 0;
    cc_expression = '';
    cc_expressionArray = [];
  },
  calc_click_cbnum: function (key) {
    // 길이가 너무 길면 fasle
    if (cc_calculator_text_length == 0) {
      if ($('.screentext').text().length >= 10) {
        return false;
      }
    } else {
      if ($('.screentext').text().length >= 21) {
        return false;
      }
    }

    // var key = $(this).attr('key');

    if (cc_inverted) {
      calculator.toggleInverted();
    }

    if (cc_ansOnScreen) {
      $('.result').html('');
      // $('.result').html($('.screentext').html());
      // $('.result').html('Ans = ' + $('.screentext').html());
      calculator.writeToScreen('write', '');
      cc_ansOnScreen = false;
    }

    calculator.addToExpression(key);

    calculator.writeToScreen('append', key);
  },
  calc_click_cbop: function (key, char) {
    cc_calculator_text_length = 1;

    if (cc_inverted) {
      calculator.toggleInverted();
    }

    if (cc_ansOnScreen) {
      $('.result').html($('.screentext').html());
      // $('.result').html('Ans = ' + $('.screentext').html());
      // writeToScreen('write', 'Ans');
      calculator.writeToScreen('write', $('.screentext').html());
      cc_expression = cc_ans;
      cc_expressionArray = [cc_ans];
      cc_parentheses = 0;
      $('.hints').html('');
      cc_ansOnScreen = false;
    }

    if ((/[/]$|[*]$/g.test(cc_expression) && (key == '/' || key == '*'))) {
      calculator.writeToScreen('write', $('.screentext').html().replace(/[÷]$|[×]$/g, char));
      calculator.removeFromExpression();
      calculator.addToExpression(key);
    } else if (/[+]$|[-]$/g.test(cc_expression) && (key == '+' || key == '-')) {
      calculator.writeToScreen('write', $('.screentext').html().replace(/[+]$|[-]$/g, char));
      calculator.removeFromExpression();
      calculator.addToExpression(key);
    } else {
      calculator.writeToScreen('append', char);
      calculator.addToExpression(key);
    }

    cc_ansOnScreen = false;
  },
  calc_click_cbpar: function (key) {
    if (cc_inverted) {
      calculator.toggleInverted();
    }

    if (cc_ansOnScreen) {
      calculator.writeToScreen('write', '');
      cc_ansOnScreen = false;
    }

    calculator.addToExpression(key);
    calculator.writeToScreen('append', key);

    if (key == '(') {
      cc_parentheses++;
      calculator.adjustParentheses(cc_parentheses);
    } else if (key == ')') {
      cc_parentheses > 0 ? cc_parentheses-- : cc_parentheses = 0;
      calculator.adjustParentheses(cc_parentheses);
    }
  },
  calc_click_cbfun: function (key1, key2) {
    if (cc_ansOnScreen) {
      calculator.writeToScreen('write', '');
      cc_ansOnScreen = false;
    }

    if (!cc_inverted) {
      calculator.addToExpression(key1);
    } else {
      calculator.addToExpression(key2);
    }

    calculator.writeToScreen('append', $(this).html() + '(');

    cc_parentheses++;
    calculator.adjustParentheses(cc_parentheses);

    if (cc_inverted) {
      calculator.toggleInverted();
    }
  },
  calc_click_cbce: function () {
    console.log(cc_inverted)
    console.log(cc_ansOnScreen)
    console.log(cc_expressionArray.length)

    if (cc_inverted) {
      calculator.toggleInverted();
    }

    if (cc_ansOnScreen) {
      $('.result').html('');
      // writeToScreen('write', '');
      // ansOnScreen = false;
    }

    if (cc_expressionArray.length) {
      calculator.removeFromExpression();
      calculator.writeToScreen('delete', '');
    }
  },
  reset_calculator: function () {
    calculator.defaults();
    var _result_html = $('.result').html();
    var _screen_html = $('#screentext').html();

    calculator.addResult(_result_html, _screen_html);

    $("#the-calculator .result_wrap ul").html('');
    viewer.calc_history_hide();
  }
};

/**
 * DOM event
 *  */

$(document).on('click', '#calculator_wrap .enter', function () {
  mirroring.api_sync_obj({
    target: "calculator",
    script: 'calculator.calc_click_enter();'
  });

  calculator.calc_click_enter();
});


// clear the screen ----------------------------------------------------------
$(document).on('click', '#calculator_wrap .cbac', function () {
  calculator.defaults();

  mirroring.api_sync_obj({
    target: "calculator",
    script: 'calculator.defaults();'
  });
});

// add a number to the screen ------------------------------------------------
$(document).on('click', '#calculator_wrap .cbnum', function () {
  var key = $(this).attr('key');
  calculator.calc_click_cbnum(key);

  mirroring.api_sync_obj({
    target: "calculator",
    script: 'calculator.calc_click_cbnum("' + key + '");'
  });
});

// add an operator to the screen if there's no other operator ----------------
$(document).on('click', '#calculator_wrap .cbop', function () {
  var key = $(this).attr('key');
  var char = $(this).attr('char');

  calculator.calc_click_cbop(key, char);

  mirroring.api_sync_obj({
    target: "calculator",
    script: 'calculator.calc_click_cbop("' + key + '", "' + char + '");'
  });
});

// add a parentheses both to screen and to a global var ----------------------
$(document).on('click', '.cbpar', function () {
  var key = $(this).attr('key');

  calculator.calc_click_cbpar(key);

  mirroring.api_sync_obj({
    target: "calculator",
    script: 'calculator.calc_click_cbpar("' + key + '");'
  });
});

// backspace -----------------------------------------------------------------------
$(document).on('click', '.cbce', function () {
  calculator.calc_click_cbce();

  mirroring.api_sync_obj({
    target: "calculator",
    script: 'calculator.calc_click_cbce();'
  });
});

