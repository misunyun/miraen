$(function () {

    var expression = '';
    var expressionArray = [];
    var screenArray = [];
    var parentheses = 0;
    var ansOnScreen = false;
    var ans = null;
    var error = false;
    var inverted = false;
    var calculator_text_length = 0;

    function defaults() {
        expression = '';
        expressionArray = [];
        screenArray = [];
        parentheses = 0;
        ansOnScreen = false;
        ans = null;
        error = false;
        inverted = false;
        calculator_text_length = 0;
        $('.result').html('');
        $('.screentext').html('');
        $('.hints').html('');
    }

    function toggleInverted() {
        $('.cbfun .inv').toggle();
        inverted = inverted ? false : true;
    }

    function adjustParentheses(num) {
        $('.hints').html(')'.repeat(num));
    }

    function writeToScreen(mode, text) {

        if (mode == 'append') {
            if (error) {
                screenArray = [];
            }
            error = false;
            screenArray.push(text);
        } else if (mode == 'write') {
            screenArray = [text];
        } else if (mode == 'delete') {
            var popped = screenArray.pop();
            if (/[(]$/g.test(popped)) {
                parentheses > 0 ? parentheses-- : parentheses = 0;
                adjustParentheses(parentheses);
            }
        }

        $('.screentext').html(screenArray.join(''));

        if (inverted) {
            toggleInverted();
        }
    }

    function addToExpression(text) {
        expressionArray.push(text);
        expression += text;
    }

    function removeFromExpression() {
        var count = expressionArray.pop().length;
        expression = expression.slice(0, -count);
    }

    // result 추가
    function addResult(result, screen) {
        var result_wrap_target = $('#calculator_wrap .result_wrap ul');
        var _html = '<li><div>' + result + '</div><div>' + screen + '</div></li>';
        result_wrap_target.prepend(_html);
    }

    // ask for a result ----------------------------------------------------------
    $('.enter').click(
        function () {

            if (ansOnScreen) {
                expressionArray = [ans];
            }

            addToExpression(')'.repeat(parentheses));

            try {
                math.eval(expressionArray.join('')).toPrecision(8);
            } catch (e) {
                error = true;
            }

            if (error) {
                defaults();
                error = true;
                show_alert("맞지 않는 수식입니다.");
                // writeToScreen('write', '맞지 않는 수식입니다.');
                // writeToScreen('write', 'Syntax Error');
            } else {
                $('.result').html($('.screentext').html().replace(/Ans/, ans) + ')'.repeat(parentheses) + ' =');
                // ans = math.eval(expressionArray.join(''));
                ans = math.eval(expressionArray.join('')).toPrecision(8);
                writeToScreen('write', ans.toString().replace(/(\.0+$)|(0+$)/g, ''));
                $('.hints').html('');

                var el = $('#screentext');
                var newone = el.clone(true);
                el.before(newone);
                $(".animated:last").remove();

                ansOnScreen = true;

                // result list 추가
                addResult($('.result').html(), $('#screentext').html());
            }
            parentheses = 0;
            expression = '';
            expressionArray = [];
        }
    );

    // clear the screen ----------------------------------------------------------
    $('.cbac').click(
        function () {
            defaults();
        }
    );

    // add a number to the screen ------------------------------------------------
    $('.cbnum').click(
        function () {
            // 길이가 너무 길면 fasle
            if (calculator_text_length == 0) {
                if ($('.screentext').text().length >= 10) {
                    return false;
                }
            } else {
                if ($('.screentext').text().length >= 21) {
                    return false;
                }
            }

            var key = $(this).attr('key');

            if (inverted) {
                toggleInverted();
            }

            if (ansOnScreen) {
                $('.result').html('');
                // $('.result').html($('.screentext').html());
                // $('.result').html('Ans = ' + $('.screentext').html());
                writeToScreen('write', '');
                ansOnScreen = false;
            }

            addToExpression(key);
            writeToScreen('append', $(this).html());
        }
    );

    // add an operator to the screen if there's no other operator ----------------
    $('.cbop').click(
        function () {
            calculator_text_length = 1;

            var key = $(this).attr('key');
            var char = $(this).attr('char');
            if (inverted) {
                toggleInverted();
            }

            if (ansOnScreen) {
                $('.result').html($('.screentext').html());
                // $('.result').html('Ans = ' + $('.screentext').html());
                // writeToScreen('write', 'Ans');
                writeToScreen('write', $('.screentext').html());
                expression = ans;
                expressionArray = [ans];
                parentheses = 0;
                $('.hints').html('');
                ansOnScreen = false;
            }

            if ((/[/]$|[*]$/g.test(expression) && (key == '/' || key == '*'))) {
                writeToScreen('write', $('.screentext').html().replace(/[÷]$|[×]$/g, char));
                removeFromExpression();
                addToExpression(key);
            } else if (/[+]$|[-]$/g.test(expression) && (key == '+' || key == '-')) {
                writeToScreen('write', $('.screentext').html().replace(/[+]$|[-]$/g, char));
                removeFromExpression();
                addToExpression(key);
            } else {
                writeToScreen('append', char);
                addToExpression(key);
            }

            ansOnScreen = false;
        }
    );

    // add a parentheses both to screen and to a global var ----------------------
    $('.cbpar').click(
        function () {
            var key = $(this).attr('key');
            if (inverted) {
                toggleInverted();
            }

            if (ansOnScreen) {
                writeToScreen('write', '');
                ansOnScreen = false;
            }

            addToExpression(key);
            writeToScreen('append', key);

            if (key == '(') {
                parentheses++;
                adjustParentheses(parentheses);
            } else if (key == ')') {
                parentheses > 0 ? parentheses-- : parentheses = 0;
                adjustParentheses(parentheses);
            }

        }

    );

    // add a function, change parentheses ----------------------------------------
    $('.cbfun').click(
        function () {
            var key1 = $(this).attr('key1');
            var key2 = $(this).attr('key2');

            if (ansOnScreen) {
                writeToScreen('write', '');
                ansOnScreen = false;
            }

            if (!inverted) {
                addToExpression(key1);
            } else {
                addToExpression(key2);
            }

            writeToScreen('append', $(this).html() + '(');

            parentheses++;
            adjustParentheses(parentheses);

            if (inverted) {
                toggleInverted();
            }

        }
    );

    // append the old result to the expression-----------------------------------------
    $('.cbans').click(
        function () {
            if (ansOnScreen) {
                writeToScreen('write', '');
                ansOnScreen = false;
            }
            if (!/[Ans]$|[0-9]$|[π]$|[e]$/g.test($('.screentext').html())) {
                addToExpression(ans.toString());
                writeToScreen('append', 'Ans');
            }

        }
    );

    // invert trig functions ----------------------------------------------------------
    $('.cbinv').click(
        function () {
            toggleInverted();
        }
    );

    // backspace -----------------------------------------------------------------------
    $('.cbce').click(
        function () {

            console.log(inverted)
            console.log(ansOnScreen)
            console.log(expressionArray.length)

            if (inverted) {
                toggleInverted();
            }

            if (ansOnScreen) {
                $('.result').html('');
                // writeToScreen('write', '');
                // ansOnScreen = false;
            }

            if (expressionArray.length) {
                removeFromExpression();
                writeToScreen('delete', '');
            }

        }
    );
});