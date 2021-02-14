function digitsToWords(digits) {
    var units = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
    var tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
    var teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
    var commas = ['', 'thousand', 'million', 'billion', 'trillion', 'quadrillion'];
    var original = digits;
    var result = '';
    
    for(var comma = 5; comma >= 0; --comma) {
        var commaValue = Math.trunc(digits / Math.pow(1000, comma));
        if(commaValue == 0)
            continue;
        if(parseInt(commaValue / 100) != 0) {
            result += ' ' + units[parseInt(commaValue / 100)] + ' hundred';
            if(commaValue % 100 != 0)
                result += ' and';
        }
        else if(comma == 0 && digits != original)
            result += ' and';
        commaValue %= 100;
        if(parseInt(commaValue / 10) > 1) {
            result += ' ' + tens[parseInt(commaValue / 10)];
            if(commaValue % 10 != 0)
                result += '-' + units[commaValue % 10];
        }
        else if(parseInt(commaValue / 10) == 1)
            result += ' ' + teens[commaValue % 10];
        else if(commaValue > 0)
            result += ' ' + units[commaValue % 10];
        result += ' ' + commas[comma];
        digits %= Math.pow(1000, comma);
        if(digits - digits % 1000 != 0 || parseInt(digits % 1000 / 100) != 0)
            result += ',';
    }
    return result.length == 0 && original.length != 0 ? "zero" : result.trim();
}
